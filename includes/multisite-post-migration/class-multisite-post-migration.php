<?php
namespace PRC\Platform;
use WP_Error;

/**
 * Tools to aid in post-migration cleanup from the old site to the new site.
 */
class Multisite_Post_Migration {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-multisite-post-migration';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		require_once( __DIR__ . '/class-multisite-migration.php' );
		require_once( __DIR__ . '/class-cli-commands.php' );
		$this->version = $version;
		$this->init($loader);
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$this->register_action_scheduler_hooks($loader);
			$loader->add_action('enqueue_block_editor_assets', $this, 'enqueue_assets');
			$loader->add_action('enqueue_block_assets', $this, 'enqueue_legacy_fixers_on_legacy_posts');
			$loader->add_action('init', $this, 'register_fallback_meta');
			$loader->add_action('rest_api_init', $this, 'register_endpoint');
			$loader->add_action('init', $this, 'register_primary_term_metas');
			$loader->add_filter('body_class', $this, 'legacy_fixes_post_classname', 10, 2);
		}
	}

	public function register_panel_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/migration-panel/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/migration-panel/index.js';
		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}
		return true;
	}

	public function register_legacy_fixes_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/legacy-frontend-fixes/index.asset.php' );
		$asset_slug = 'prc-platform-multisite-post-migration__image-fixes';

		$script_src  = plugin_dir_url( __FILE__ ) . 'build/legacy-frontend-fixes/index.js';
		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style_src  = plugin_dir_url( __FILE__ ) . 'build/legacy-frontend-fixes/style-index.css';
		$style = wp_register_style(
			$asset_slug,
			$style_src,
			[],
			$asset_file['version'],
		);

		if ( ! $script && ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * @hook post_class
	 */
	public function legacy_fixes_post_classname($classes, $css_classes) {
		if ( !is_singular(['post', 'short-read']) ) {
			return $classes;
		}
		$post_id = get_the_ID();
		$post_date = get_the_date('Y-m-d', $post_id);
		if ( strtotime($post_date) < strtotime('2021-01-01') ) {
			$classes[] = 'prc-legacy-post';
		}
		return $classes;
	}

	public function enqueue_assets() {
		global $current_screen;
		if ( $current_screen->base === 'site-editor' ) {
			return;
		}
		$registered = $this->register_panel_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			if ( get_post_meta(get_the_ID(), '_stub_post', true) ) {
				wp_enqueue_script( self::$handle );
				wp_enqueue_style( self::$handle );
			}
		}
	}


	public function enqueue_legacy_fixers_on_legacy_posts() {
		// get the date of this post
		// if the date is before the first block post date of jan 1 2020 then we need to enqueue the fixers
		if ( ! is_singular() ) {
			return;
		}
		$post_id= get_the_ID();
		$post_date = get_the_date('Y-m-d', $post_id);
		if ( strtotime($post_date) < strtotime('2021-01-01') ) {
			$registered = $this->register_legacy_fixes_assets();
			if ( !is_wp_error($registered) ) {
				wp_enqueue_script('prc-platform-multisite-post-migration__image-fixes');
				wp_enqueue_style('prc-platform-multisite-post-migration__image-fixes');
			}
		}
	}

	/**
	 * Get the original blog id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_blog_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_blog_id', true);
		// make the value into an integer if it can be.
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	/**
	 * Get the original post id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_post_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_post_id', true);
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	public function register_fallback_meta() {
		$post_types = array(
			'post',
			'events',
			'interactives',
			'fact-sheets',
			'quiz',
			'short-read',
			'mini-course',
			'press-release',
		);
		foreach ($post_types as $post_type) {
			register_post_meta(
				$post_type,
				'_stub_post',
				array(
					'description'   => 'ID of stub post.',
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'integer',
					'auth_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
		// Register fallback Distributor meta
		register_post_meta(
			'',
			'dt_original_blog_id',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'dt_original_post_id',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function register_action_scheduler_hooks($loader) {
		if ( null === $loader ) {
			return;
		}
		$multisite_migration = new Multisite_Migration();
		$loader->add_action(
			'prc_distributor_queue_attachment_migration',
			$multisite_migration,
			'scheduled_distributor_attachments_push',
			10, 2
		);
		$loader->add_action(
			'prc_distributor_queue_attachment_meta_migration',
			$multisite_migration,
			'scheduled_distributor_attachments_meta_mapping',
			10, 3
		);
		$loader->add_action(
			'prc_distributor_queue_multisection_migration',
			$multisite_migration,
			'scheduled_distributor_multisection_report_meta_mapping',
			10, 2
		);
		$loader->add_action(
			'prc_distributor_queue_related_posts_migration',
			$multisite_migration,
			'scheduled_distributor_related_posts_meta_mapping',
			10, 2
		);
		$loader->add_action(
			'prc_distributor_queue_bylines_migration',
			$multisite_migration,
			'scheduled_distributor_bylines_mapping',
			10, 2
		);
		$loader->add_action(
			'prc_distributor_queue_block_entity_patching',
			$multisite_migration,
			'scheduled_distributor_block_entity_mapping',
			10, 1
		);
		$loader->add_action(
			'prc_distributor_queue_classic_editor_patching',
			$multisite_migration,
			'scheduled_distributor_classic_editor_mapping',
			10, 1
		);
		$loader->add_action(
			'prc_distributor_queue_block_media_patching',
			$multisite_migration,
			'scheduled_distributor_block_media_mapping',
			10, 2
		);
		$loader->add_action(
			'prc_distributor_queue_page_migration',
			$multisite_migration,
			'scheduled_distributor_page_mapping',
			10, 1
		);
		$loader->add_action(
			'prc_distributor_queue_primary_category_migration',
			$multisite_migration,
			'scheduled_distributor_primary_category_mapping',
			10, 2
		);
	}

	// Register this primitively so it works across codebases.
	public function register_endpoint() {
		register_rest_route( 'prc-api/v3', '/migration-tools/query-new-term', array(
			'methods'  => 'GET',
			'callback' => array( $this, 'restfully_query_for_new_term' ),
			'args'                => array(
				'taxonomy' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'oldTermId' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
				'oldSiteId' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		));

		register_rest_route( 'prc-api/v3', '/migration-tools/migrate-attachments', array(
			'methods'  => 'POST',
			'callback' => array( $this, 'restfully_migrate_attachments' ),
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		));

		// migration/info to get the original post and original site id
		// migration/verify/{tool} to run a tool to verify for example: migration/verify/topics
		register_rest_route(
			'prc-api/v3',
			'/migration-tools/info',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'restfully_get_migration_info' ),
				'args'     => array(
					'postId' => array(
						'required' => true,
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function() {
					return current_user_can( 'edit_posts' );
				}
			),
		);
	}

	public function register_primary_term_metas() {
		register_post_meta(
			'',
			'_yoast_wpseo_primary_category',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'_yoast_wpseo_primary_collection',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'_yoast_wpseo_primary_regions-countries',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'_yoast_wpseo_primary_research-teams',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function restfully_get_migration_info(\WP_REST_Request $request) {
		$post_id = $request->get_param('postId');
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$original_post_link = null;
		$original_stub_id = get_post_meta($post_id, '_stub_post', true);
		if (!$original_site_id || !$original_post_id || !$original_stub_id) {
			// This post does not have migration info because it did not come from the old site.
			return rest_ensure_response([
				'status' => 'success',
				'message' => 'This post does not have migration info because it did not come from the old site.',
			]);
		}

		$rest_endpoint = 'https://legacy.pewresearch.org/wp-json/wp/v2/stub/' . $original_stub_id;
		$rest_endpoint = add_query_arg(array(
			'_fields' => array(
				'id',
				'title',
				'_legacy_info'
			)
		), $rest_endpoint);
		// now we need to do a remote rest get to the $rest_endpoint and use the username and application password to get the post.
		$response = \vip_safe_wp_remote_get($rest_endpoint);
		if (is_wp_error($response)) {
			return rest_ensure_response([
				'status' => 'error',
				'message' => 'Failed to get the original post from the old site.',
			]);
		}
		$body = wp_remote_retrieve_body($response);
		$migration_info = json_decode($body, true);
		$taxonomies = $migration_info['_legacy_info']['taxonomies'];

		$parsed_taxonomies = [];
		foreach ($taxonomies as $taxonomy => $tax_info) {
			$terms = array_map(function($term) use ($taxonomy) {
				$taxonomy = 'topic' === $taxonomy ? 'category' : $taxonomy; // 'topic' is 'category' on the new site
				return get_term_by('slug', $term['slug'], $taxonomy);
			}, $tax_info['terms']);
			$primary_term_name = null;
			$primary_term = get_term_by('slug', $tax_info['primary_term'], 'topic' === $taxonomy ? 'category' : $taxonomy);
			if ( $primary_term ) {
				$primary_term_name = $primary_term->name;
			}
			$parsed_taxonomies[$taxonomy] = [
				'terms' => $terms,
				'primary_term_name' => $primary_term_name,
			];
		}

		$to_return = [
			'originalPostLink' => $migration_info['_legacy_info']['permalink'],
			'originalPostId' => $original_post_id,
			'originalSiteId' => $original_site_id,
			'taxonomies' => $parsed_taxonomies,
		];
		return rest_ensure_response($to_return);
	}

	/**
	 * Query for a new term by the old term id.
	 */
	public function query_new_term_by_old_term_id($taxonomy, $old_term_id, $old_site_id = 1) {
		// do a wp_term_query for the old term id
		$new_term = null;
		$new_term_id = false;

		$term = get_term_by( 'term_id', $old_term_id, $taxonomy );
		$new_term_id = get_term_meta( $term->term_id, '_prc_migrated_term', true );
		restore_current_blog();
		if ( false === $new_term_id ) {
			return false;
		}
		switch_to_blog( 20 );
		$taxonomy = 'topic' === $taxonomy ? 'category' : $taxonomy; // 'topic' is 'category' on the new site
		$new_term = get_term_by( 'id', $new_term_id, $taxonomy );
		restore_current_blog();
		return $new_term;
	}

	public function restfully_query_for_new_term(\WP_REST_Request $request) {
		$taxonomy = $request->get_param('taxonomy');
		$old_term_id = $request->get_param('oldTermId');
		$old_site_id = $request->get_param('oldSiteId');
		$new_term = $this->query_new_term_by_old_term_id($taxonomy, $old_term_id, $old_site_id);
		if ( false === $new_term ) {
			return new WP_Error( 'term_not_found', 'Term not found', array( 'status' => 404 ) );
		}
		return $new_term;
	}

	public function restfully_copy_taxonomy_terms(\WP_REST_Request $request) {
		// get the old terms...
		// $this->restfully_query_for_new_term();
	}

	public function restfully_migrate_attachments(\WP_REST_Request $request) {
		$body = json_decode($request->get_body(), true);
		$post_id = $body['postId'];
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$group = $original_site_id . '_' . $original_post_id . '_' . $post_id;

		$failed_actions = as_get_scheduled_actions(array(
			'hook' => 'prc_distributor_queue_attachment_migration',
			'group' => $group,
		));

		if (count($failed_actions) > 0) {
			foreach ( $failed_actions as $action_id => $action ) {
				error_log("failed actions found: " . print_r($action_id, true));
				$hook = $action->get_hook();
				$args = $action->get_args();
				// 30 seconds into the future...
				$timestamp = time() + 30;
				$scheduled = as_schedule_single_action($timestamp, $hook, $args, $group, false);
				if ( 0 !== $scheduled ) {
					return rest_ensure_response(array(
						'success' => true,
					));
				}
			}
		} else {
			error_log("no failed actions found, we should check for images again...");
		}

		return rest_ensure_response(array(
			'group' => $group,
			'failed_actions' => $failed_actions,
		));
	}
}
