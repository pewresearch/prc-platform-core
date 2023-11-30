<?php
namespace PRC\Platform;

use WP_Error;
use Distributor\InternalConnections\NetworkSiteConnection as DistributorConnection;
use Exception;

/**
 * Handles distributing posts from one network site to another.
 * @package PRC\Platform
 */
class Distributor {
	public $target_site = null;
	public $original_post_id = null;
	public $disallowed_list = array(1);

	public function __construct( $original_post_id = null, $target_site_id = null ) {
		if ( null !== $target_site_id && null !== $original_post_id ) {
			$this->original_post_id = $original_post_id;
			$this->disallowed_list = apply_filters( 'prc_distributor_disallowed_list', $this->disallowed_list );
			if ( in_array( $target_site_id, $this->disallowed_list ) ) {
				return new WP_Error( 'prc_distributor_disallowed_site', __( 'This site cannot be pushed to.', 'prc' ) );
			}
			$this->target_site = get_site( $target_site_id );
		}
	}


	/**
	 * Disable Distributor taxonomy operations on the category/topic taxonomy.
	 * @hook dt_create_missing_terms, dt_update_term_hierarchy
	 * @return void
	 */
	public function disable_taxonomy_operations_on_category($return, $taxonomy) {
		if ( 'topic' === $taxonomy || 'category' === $taxonomy ) {
			return false;
		}
		return $return;
	}

	/**
	 * Exclude meta keys from being synced.
	 * @hook dt_excluded_meta
	 * @param mixed $excluded_meta
	 * @return mixed
	 */
	public function exclude_meta_list( $excluded_meta ) {
		// Look at all these old meta keys that have been left behind... BEGONE!
		$excluded_meta = array_merge( $excluded_meta, array(
			'pew-layout-options',
			'pew-redirect',
			'metabox',
			'part-of-series',
			'wp-gizmos',
			'multi_section_report',
			'_multi_section_report',
			'related_posts',
			'_related_posts',
			'pew_report_materials',
			'_pew_report_materials',
			'amazonS3_cache ',
			'layout_options',
			'_layout_options',
			'project',
			'_project',
			'data_source',
			'_data_source',
			'respondents',
			'_respondents',
			'series',
			'_series',
			'dataset',
			'_dataset',
			'hidden_status',
			'_hidden_status',
			'video_url',
			'_video_url',
			'iframe_video_url',
			'_iframe_video_url',
			'video_width',
			'_video_width',
			'video_height',
			'_video_height',
			'stub_title',
			'_stub_title',
			'stub_image',
			'_stub_image',
			'part_of_a_series',
			'_part_of_a_series',
			'_pew_redirect',
			'_aioseop_description',
			'byline',
			'_byline',
			'assign-bylines-to-posts_status',
			'__byline_upgrade_old_data',
			'update-posts-with-new-bylines-step-1_status',
			'assign-languages_status',
			// '_stub_post', Actually... we are going to bring over the stub_post id so we can use it for site 1 lookup operations vis-a-vis taxonomies in the future.
			'_stub_version',
			'_featured_posts',
		) );
		return $excluded_meta;
	}

	/**
	 * A programmatic way to disable syncing a meta key. We're inspecting old ACF meta keys that created an entry for each meta and excluding them.
	 *
	 * @hook dt_sync_meta
	 */
	public function exclude_meta_by_key($allowed, $meta_key){
		// ditch these keys in the migration
		$disallowed = array(

		);
		if ( in_array( $meta_key, $disallowed ) ) {
			return false;
		}
		$search_for = array(
			'pew_report_materials_',
			'_pew_report_materials_',
			'related_posts_',
			'related_posts_',
			'_related_posts_',
		);
		foreach ( $search_for as $search ) {
			if ( 0 === strpos( $meta_key, $search ) ) {
				return false;
			}
		}
		return $allowed;
	}

	public function determine_distributable_post_statuses($post_statuses) {
		array_push(
			$post_statuses,
			'hidden_from_search',
			'hidden_from_index'
		);
		return $post_statuses;
	}

	public function allowed_media_extensions($extensions) {
		$extensions[] = 'svg';
		$extensions[] = 'pdf';
		$extensions[] = 'webp';
		return $extensions;
	}

	public function allow_media_push($push_post_media, $new_post_id, $post_media, $post_id, $args, $distributor) {
		// @TODO: eventually we want to check if the post has already been linked and if the initial media migration has been run on this, if so then allow this, otherwise skip.
		$push_post_media = false;
		return $push_post_media;
	}

	public function allow_set_meta_on_pull($value, $new_post_id, $post_meta, $post_id, $post_array, $distributor) {
		return false;
	}

	/**
	 * Establishes a "subscription" between two posts. When the original post is updated, the new post will be updated as well.
	 * @param mixed $new_post_id
	 * @param mixed $original_post_id
	 * @return void
	 */
	private function create_connection($new_post_id, $original_post_id) {
		$connection_map = get_post_meta( $original_post_id, 'dt_connection_map', true );

		if ( empty( $connection_map ) ) {
			$connection_map = [
				'internal' => [],
				'external' => [],
			];
		}

		$connection_map['internal'][(int) $this->target_site->blog_id] = [
			'post_id' => (int) $new_post_id,
			'time'    => time(),
		];

		update_post_meta( $original_post_id, 'dt_connection_map', $connection_map );
	}

	private function get_bylines_term_id_to_slug_mapping($meta) {
		$current_bylines = array_key_exists('bylines', $meta) ? $meta['bylines'][0] : [];
		$current_acknowledgements = array_key_exists('acknowledgements', $meta) ? $meta['acknowledgements'][0] : [];

		$byline_term_id_to_slug_mapping = [];

		if ( !empty($current_bylines) ) {
			foreach ( $current_bylines as $byline ) {
				if ( !is_array($byline) || !array_key_exists( 'termId', $byline ) ) {
					continue;
				}
				if ( is_object($byline['termId']) && is_a($byline['termId'], 'WP_Term') ) {
					$byline['termId'] = $byline['termId']->term_id;
				}
				if ( is_wp_error($byline) ) {
					continue;
				}
				$slug = get_term_field( 'slug', $byline['termId'], 'bylines' );
				if ( is_wp_error($slug) ) {
					continue;
				}
				$slug = str_replace( 'bylines_', '', $slug );
				$byline_term_id_to_slug_mapping[$byline['termId']] = $slug;
			}
		}

		if ( !empty($current_acknowledgements) ) {
			foreach ( $current_acknowledgements as $byline ) {
				if ( !is_array($byline) || !array_key_exists( 'termId', $byline ) ) {
					continue;
				}
				if ( is_object($byline['termId']) && is_a($byline['termId'], 'WP_Term') ) {
					$byline['termId'] = $byline['termId']->term_id;
				}
				if ( is_wp_error($byline) ) {
					continue;
				}
				$slug = get_term_field( 'slug', $byline['termId'], 'bylines' );
				if ( is_wp_error($slug) ) {
					continue;
				}
				$slug = str_replace( 'bylines_', '', $slug );
				$byline_term_id_to_slug_mapping[$byline['termId']] = $slug;
			}
		}
		return $byline_term_id_to_slug_mapping;
	}

	/**
	 * Push a post to the target site.
	 *
	 * @param array $args
	 * @return array|WP_Error
	 */
	public function push( $args = array() ) {
		if ( null === $this->target_site || null === $this->original_post_id ) {
			return new WP_Error( 'prc_distributor_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		$distributor = new DistributorConnection( $this->target_site );
		$pushed_post = $distributor->push( $this->original_post_id, $args );

		// Create connection map for original post id to map to $pushed_post new post id so that subsequent updates can be pushed to the same post.
		$this->create_connection(
			$pushed_post['id'],
			$this->original_post_id,
		);

		return $pushed_post;
	}

	/**
	 * Runs after the push has completed ON the target site.
	 *
	 * @hook dt_push_network_post
	 * @param mixed $new_post_id
	 * @param mixed $post_id
	 * @return void
	 */
	public function after_push( $new_post_id, $post_id, $args, $distributor ) {
		$post_type = get_post_type( $new_post_id );

		if ( 'staff' === $post_type ) {
			$staff_post = get_post( $new_post_id );
			\TDS\establish_post_term_connection(
				'staff',
				'bylines',
				$staff_post,
				$new_post_id
			);
		}

		if ( 'dataset' === $post_type ) {
			$dataset_post = get_post( $new_post_id );
			\TDS\establish_post_term_connection(
				'dataset',
				'datasets',
				$dataset_post,
				$new_post_id
			);
		}
	}

	/**
	 * Prepare meta for distribution.
	 *
	 * @hook dt_before_set_meta
	 * @param mixed $meta
	 * @param mixed $post_id
	 * @return void
	 */
	public function prepare_meta( $meta, $post_id ) {
		$post_type = get_post_type( $post_id );

		$meta['_bylines_slug_mapping'] = array(
			$this->get_bylines_term_id_to_slug_mapping($meta),
		);

		// Remove reportMaterials meta key and store in temporary _reportMaterials key
		$report_materials = array_key_exists('reportMaterials', $meta) ? $meta['reportMaterials'][0] : false;
		if ( false !== $report_materials ) {
			if ( !empty($report_materials) ) {
				// Add report materials to a temporary meta key (denoted by _) so we can use it later.
				$meta['_reportMaterials'][0] = $report_materials;
			}
			// Remove the original reportMaterials meta key, we've stored it in a temporary key and will generate new data on the target site.
			if ( array_key_exists('reportMaterials', $meta) ) {
				unset($meta['reportMaterials']);
			}
		}

		$multisection_report = array_key_exists('multiSectionReport', $meta) ? $meta['multiSectionReport'][0] : false;
		if ( false !== $multisection_report ) {
			if ( !empty($multisection_report) ) {
				$meta['_multiSectionReport'][0] = $multisection_report;
			}
			if ( array_key_exists('multiSectionReport', $meta) ) {
				unset($meta['multiSectionReport']);
			}
		}

		$related_posts = array_key_exists('relatedPosts', $meta) ? $meta['relatedPosts'][0] : false;
		if ( false !== $related_posts ) {
			if ( !empty($related_posts) ) {
				$meta['_relatedPosts'][0] = $related_posts;
			}
			if ( array_key_exists('relatedPosts', $meta) ) {
				unset($meta['relatedPosts']);
			}
		}

		$bylines = array_key_exists('bylines', $meta) ? $meta['bylines'][0] : false;
		if ( false !== $bylines ) {
			if ( !empty($bylines) ) {
				$meta['_bylines'][0] = $bylines;
			}
			if ( array_key_exists('bylines', $meta) ) {
				unset($meta['bylines']);
			}
		}

		$acknowledgements = array_key_exists('acknowledgements', $meta) ? $meta['acknowledgements'][0] : false;
		if ( false !== $acknowledgements ) {
			if ( !empty($acknowledgements) ) {
				$meta['_acknowledgements'][0] = $acknowledgements;
			}
			if ( array_key_exists('acknowledgements', $meta) ) {
				unset($meta['acknowledgements']);
			}
		}

		// Remove the art direction meta key and store in temporary _artDirection key
		// Check for current art direction meta key, if it exists, use that, otherwise check for the old _art key.
		$art_direction = array_key_exists('artDirection', $meta) ? $meta['artDirection'][0] : false;
		$art_direction = false === $art_direction && array_key_exists('_art', $meta) ? json_decode($meta['_art'][0], true) : $art_direction;
		if ( false !== $art_direction ) {
			if ( !empty($art_direction) ) {
				$meta['_artDirection'][0] = $art_direction;
			}
			// Remove the old keys.
			if ( array_key_exists('_art', $meta) ) {
				unset($meta['_art']);
			}
			if ( array_key_exists('artDirection', $meta) ) {
				unset($meta['artDirection']);
			}
		}

		// Check for yoast primary topic
		$primary_topic = array_key_exists('_yoast_wpseo_primary_topic', $meta) ? $meta['_yoast_wpseo_primary_topic'][0] : false;
		if ( false !== $primary_topic ) {
			if ( !empty($primary_topic) ) {
				$primary_topic_slug = get_term_field( 'slug', $primary_topic, 'topic' );
				$meta['_primary_category_slug'][0] = $primary_topic_slug;
			}
			if ( array_key_exists('_yoast_wpseo_primary_topic', $meta) ) {
				unset($meta['_yoast_wpseo_primary_topic']);
			}
		}

		return $meta;
	}

	public function schedule_processing($action_name, $timestamp, $args = array(), $group = '') {
		$is_scheduled = as_has_scheduled_action(
			$action_name,
			$args,
			$group
		);
		if ( $is_scheduled ) {
			as_unschedule_action(
				$action_name, $args,
				$group
			);
		}
		as_schedule_single_action(
			$timestamp,
			$action_name,
			$args,
			$group,
		);
	}

	/**
	 * Handles scheduling the asyncronous processing of meta data on the target site.
	 * @param mixed $meta
	 * @param mixed $existing_meta
	 * @param mixed $post_id
	 * @return void
	 * @throws Exception
	 */
	public function process_meta_asyncronously($meta, $existing_meta, $post_id) {
		// Make sure this doesnt run twice.
		if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
			return;
		}
		$post_type = get_post_type( $post_id );

		if ( array_key_exists('_artDirection', $meta) ) {
			$art_direction = $meta['_artDirection'][0];
		} else {
			$art_direction = false;
		}

		if ( array_key_exists('_relatedPosts', $meta) ) {
			$related_posts = $meta['_relatedPosts'][0];
		} else {
			$related_posts = false;
		}

		if ( array_key_exists('_bylines_slug_mapping', $meta) ) {
			$bylines_slug_mapping = $meta['_bylines_slug_mapping'][0];
		} else {
			$bylines_slug_mapping = false;
		}

		if ( array_key_exists('_bylines', $meta) ) {
			$bylines = $meta['_bylines'][0];
		} else {
			$bylines = false;
		}

		if ( array_key_exists('_acknowledgements', $meta) ) {
			$acknowledgements = $meta['_acknowledgements'][0];
		} else {
			$acknowledgements = false;
		}

		// Reports
		if ( array_key_exists('_reportMaterials', $meta) ) {
			$report_materials = $meta['_reportMaterials'][0];
		} else {
			$report_materials = false;
		}

		if ( array_key_exists('_multiSectionReport', $meta) ) {
			$multisection_report = $meta['_multiSectionReport'][0];
		} else {
			$multisection_report = false;
		}

		if ( array_key_exists('dataset_download', $meta) ) {
			$dataset_download = $meta['dataset_download'][0];
		} else {
			$dataset_download = false;
		}

		$timestamp = time();
		$group = get_current_blog_id() . '_' . $post_id;

		// First we transfer the attachments and pass along report materials, art direction, and dataset download if necessary.
		$this->schedule_processing(
			'prc_distributor_queue_attachment_migration',
			$timestamp,
			array(
				'post_id' => $post_id,
				'meta' => array(
					'_reportMaterials' => $report_materials,
					'_artDirection' => $art_direction,
					'_dataset_download' => $dataset_download,
				)
				),
			$group,
		);

		if ( false !== $multisection_report ) {
			// This action will run and given the post_id and the origin_site_id it will go and set the multisection report data and reinforce child -> parent relationships.
			$this->schedule_processing(
				'prc_distributor_queue_multisection_migration',
				$timestamp + 1700, // Make a timestamp 30 minutes into the future
				array(
					'post_id' => $post_id,
					'meta' => array(
						'_multiSectionReport' => $multisection_report,
					)
				),
				$group,
			);
		}

		// This action will run and given the post_id and origin_site_id it will go find any pages that have a post_parent not equal to 0 and update the post_parent to the new parent id. But only for "page" post types.
		if ( 'page' === $post_type ) {
			$this->schedule_processing(
				'prc_distributor_queue_page_migration',
				$timestamp + 1800, // Make a timestamp 30 minutes into the future
				array(
					'post_id' => $post_id,
				),
				$group,
			);
		}

		if ( false !== $bylines || false !== $acknowledgements ) {
			// This action will run and given the post_id and the origin_site_id it will go and migrate the bylines and acknowledgements data.
			$this->schedule_processing(
				'prc_distributor_queue_bylines_migration',
				$timestamp + 2100, // Make a timestamp 35 minutes into the future
				array(
					'post_id' => $post_id,
					'meta' => array(
						'_legacy_mapping' => $bylines_slug_mapping,
						'_bylines' => $bylines,
						'_acknowledgements' => $acknowledgements,
					)
				),
				$group,
			);
		}

		if ( false !== $related_posts ) {
			// This action will run and given the post_id and the origin_site_id it will go and migrate the related posts data.
			$this->schedule_processing(
				'prc_distributor_queue_related_posts_migration',
				$timestamp + 2700, // Make a timestamp 45 minutes into the future
				array(
					'post_id' => $post_id,
					'meta' => array(
						'_relatedPosts' => $related_posts,
					)
				),
				$group,
			);
		}

		if ( !in_array($post_type, array('wp_block', 'chart')) ) {
			if (!has_blocks($post_id)) {
				// If this is a classic post then lets patch it for the classic editor.
				$this->schedule_processing(
					'prc_distributor_queue_classic_editor_patching',
					$timestamp + 2700, // Make a timestamp 45 minutes into the future
					array(
						'post_id' => $post_id,
					),
					$group,
				);
			} else {
				// This actil will run and given the post_id and the origin_site_id it will go and migrate any block references like Patterns (Reusable Blocks), or Chart blocks. Seek out the new reference id and update the block and update the post.
				$this->schedule_processing(
					'prc_distributor_queue_block_entity_patching',
					$timestamp + 2700, // Make a timestamp 45 minutes into the future
					array(
						'post_id' => $post_id,
					),
					$group,
				);
			}
		}

		if ( array_key_exists('_primary_category_slug', $meta) ) {
			$primary_category_slug = $meta['_primary_category_slug'][0];
			$this->schedule_processing(
				'prc_distributor_queue_primary_category_migration',
				$timestamp + 1000, // Make a timestamp 15 minutes into the future
				array(
					'post_id' => $post_id,
					'_primary_category_slug' => $primary_category_slug,
				),
				$group,
			);
		}
	}

	/**
	 * Prepares the post data for distribution. This is called before the post is pushed to the remote site.
	 *
	 * Here we are ensuring things like post author and date are true, we're also changing some post types from plural to singular and some name changes.
	 *
	 * @hook dt_push_post_args
	 *
	 * @param mixed $new_post_args
	 * @param mixed $post
	 * @param mixed $args
	 * @param mixed $distributor
	 * @return void
	 */
	public function prepare_pushed_post($new_post_args, $original_post, $args, $distributor) {
		// ensure the author is true.
		$new_post_args['post_author'] = $original_post->post_author;
		// ensure the post date is true.
		$new_post_args['post_date'] = $original_post->post_date;
		// ensure post types of "interactives" are set to "interactive" and do the same for fact-sheets
		if ( $original_post->post_type === 'interactives' ) {
			$new_post_args['post_type'] = 'interactive';
		}
		if ( $original_post->post_type === 'fact-sheets' ) {
			$new_post_args['post_type'] = 'fact-sheet';
		}
		if ( $original_post->post_type === 'topic-page' ) {
			$new_post_args['post_type'] = 'block_module';
		}
		return $new_post_args;
	}

	/**
	 * The mis-management of the topics index via the stub index via Admin Columns has resulted in an unforseen endlees loop situation and applies all topic tags to a post under certain conditions. This cleanses posts of that issue if present.
	 *
	 * @TODO: @sethrubenstein make it so that if there are NO terms and the post is not a child it'll also look to the stub index for resolution. We should also look into a solution for primary topic for this.
	 * @param mixed $taxonomy_terms
	 * @param mixed $original_post_id
	 * @return mixed
	 */
	public function watch_for_all_topics_bug($taxonomy_terms, $original_post_id) {
		$threshold = 20;
		// count the number of items in $taxonomy_terms['topic'] and if its in excess of 20 then it has the "all tags" bug and we should go to the stub on site 1 to get the terms from there...
		if ( array_key_exists('topic', $taxonomy_terms) ) {
			if ( count($taxonomy_terms['topic']) >= $threshold ) {
				// We'll get the correct topics from the stub post on site 1.
				$stub_post = get_post_meta( $original_post_id, '_stub_post', true );
				$temp_terms = false;
				if ( !empty($stub_post) ) {
					switch_to_blog(1);
					$stub_post = get_post( $stub_post );
					// Check if the stub post is a valid post object.
					if ( !empty($stub_post) && !is_wp_error($stub_post) ) {
						$temp_terms = wp_get_post_terms( $stub_post->ID, 'topic' );
					}
					restore_current_blog();
					// Now we need to correct the parent term ids for the terms we just got.
					if ( false !== $temp_terms && !is_wp_error($temp_terms) ) {
						$taxonomy_terms['topic'] = $temp_terms;
					} else {
						// If we can't get the terms from the stub post then we need to remove the topic terms from the post.
						// This will result in the post being assigned the default topic term which will signal to an editor to follow up manually.
						unset($taxonomy_terms['topic']);
					}
				}
			}
		}
		return $taxonomy_terms;
	}

	/**
	 * If a post has no region-country taxonomy terms then we need to add the USA term to it.
	 * @param mixed $taxonomy_terms
	 * @return mixed
	 */
	public function default_region_country_to_usa($taxonomy_terms) {
		// if there is nothing in $taxonomy_terms['regions-countries'] then we need to add the USA term to it.
		if ( !array_key_exists('regions-countries', $taxonomy_terms) ) {
			$taxonomy_terms['regions-countries'] = array();
		}
		if ( empty($taxonomy_terms['regions-countries']) ) {
			$usa_term = get_term_by( 'slug', 'united-states', 'regions-countries' );
			if ( false !== $usa_term ) {
				$taxonomy_terms['regions-countries'][] = $usa_term;
			}
		}
		return $taxonomy_terms;
	}

	public function get_research_slug_from_id( $site_id ) {
		switch ( $site_id ) {
			case 1:
				return 'prc';
				break;
			case 2:
				return 'global';
				break;
			case 3:
				return 'social-trends';
				break;
			case 4:
				return 'politics';
				break;
			case 5:
				return 'hispanic';
				break;
			case 7:
				return 'religion';
				break;
			case 8:
				return 'media-news';
				break;
			case 9:
				return 'internet-tech';
				break;
			case 10:
				return 'methods';
				break;
			case 16:
				return 'science';
				break;
			case 17:
				return 'dev-docs';
				break;
			case 18:
				return 'race-ethnicity';
				break;
			case 19:
				return 'decoded';
				break;
		}
	}

	public function prepare_research_team_terms($taxonomy_terms) {
		// Get the research team taxonomy term based on the current site id and add it to the taxonomy_terms array.
		$current_blog_id = get_current_blog_id();
		// Get the slug for the site. These corollate to the research team taxonomy terms.
		$research_term_slug = $this->get_research_slug_from_id( $current_blog_id );
		// if research term slug is hispanic then change it to race-ethnicity.
		$research_term_slug = 'hispanic' === $research_term_slug ? 'race-and-ethnicity' : $research_term_slug;
		// if not on the main site then prepend the slug with research-teams_ to ensure we get the right term.
		if ( 1 !== $current_blog_id ) {
			$research_term_slug = 'research-teams_' . $research_term_slug;
		}

		$research_term = get_term_by( 'slug', $research_term_slug, 'research-teams' );
		if ( false !== $research_term ) {
			// Check if $taxonomy_terms['research-teams'] array doesnt contain the $research_term->term_id and if not then add it.
			if ( !in_array( $research_term->term_id, array_map( function($term) { return $term->term_id; }, $taxonomy_terms['research-teams'] ) ) ) {
				$taxonomy_terms['research-teams'][] = $research_term;
			}
		}
		return $taxonomy_terms;
	}

	/**
	 * Preapres post taxonomy terms for distribution. Handles decoupling the {taxonomy_} prefix from term names on sub-sites. Ensures that the appropriate research team taxonomy term is added to all posts, even ones without specified research teams.
	 * @hook dt_prepare_terms
	 * @param mixed $taxonomy_terms
	 * @param mixed $original_post_id
	 * @return array $taxonomy_terms
	 */
	public function prepare_terms( $taxonomy_terms, $original_post_id ) {
		// Remove any "category" taxonomy terms from the array, we don't want to distribute these.
		unset( $taxonomy_terms['category'] );
		// Check for the "all topics" bug and correct for it.
		$taxonomy_terms = $this->watch_for_all_topics_bug($taxonomy_terms, $original_post_id);
		// Prepare the research team terms.
		$taxonomy_terms = $this->prepare_research_team_terms($taxonomy_terms);
		// Check for no region-country terms and add the USA term if necessary.
		$taxonomy_terms = $this->default_region_country_to_usa($taxonomy_terms);

		// Process term slug changes and handle some taxonomy changes per term.
		foreach ($taxonomy_terms as $taxonomy => $terms) {
			if (!empty($terms)) {
				foreach ($terms as $key => $term) {
					// Ensure any $taxonomy_$taxonomy-slug formatting is reverted to just $taxonomy_slug, strip the $taxonomy.
					$needle = $taxonomy . '_';
					$term->slug = str_replace($needle, '', $term->slug);

					$tax = $taxonomy;
					// if $taxonomy is topic then change $taxonomy to category.
					if ( $tax === 'topic' ) {
						$tax = 'category';
					}
					$taxonomy_terms[$tax][$key] = $term;
				}
			}
		}

		// Remove the original "topic" taxonomy from the array, now that we've migrated it to "category" it won't be making the journey to the new site.
		unset( $taxonomy_terms['topic'] );

		return $taxonomy_terms;
	}
}
