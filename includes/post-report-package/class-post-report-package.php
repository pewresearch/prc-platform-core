<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Heading_Processor;
use WP_HTML_Tag_Processor;

/**
 * Post Report Package is an all encompasing class for accessing the constructed report materials, the constructed table of contents, and the combination the report_package object.
 *
 * To access the table of contents it's recommended to use \PRC\Platform\Post_Report_Package(null, null)->get_constructed_toc( $post_id );
 *
 * For the report materials it's recommended to use \PRC\Platform\Post_Report_Package(null, null)->get_constructed_report_materials( $post_id );
 * @package PRC\Platform
 */
class Post_Report_Package {
	public $post_id = null;
	public static $handle = 'prc-platform-post-report-package';
	public static $enabled_post_types = array( 'post' );
	public static $report_package_key = 'report_package';
	public static $report_materials_meta_key = 'reportMaterials'; // @TODO: change these to snake case
	public static $back_chapters_meta_key = 'multiSectionReport'; // @TODO: change these to snake case
	public static $constructed_toc_key = '_constructed_toc';
	protected $bypass_caching = false;

	public static $report_materials_schema_properties = array(
		'key'          => array(
			'type' => 'string',
			'required' => false,
		),
		'type'         => array(
			'type' => 'string',
			'required' => false,
		),
		'url'          => array(
			'type' => 'string',
			'required' => false,
		),
		'label' => array(
			'type' => 'string',
			'required' => false,
		),
		'attachmentId' => array(
			'type' => 'integer',
			'required' => false,
		),
		'icon' => array(
			'type' => 'string',
			'required' => false,
		),
	);

	public static $back_chapters_schema_properties = array(
		'key'    => array(
			'type' => 'string',
		),
		'postId' => array(
			'type' => 'integer',
		),
	);


	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		if ( !class_exists('WP_HTML_Heading_Processor') ) {
			require_once( plugin_dir_path( __FILE__ ) . 'class-wp-html-heading-processor.php' );
		}
		require_once( plugin_dir_path( __FILE__ ) . 'class-pagination.php' );
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_meta_fields' );
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_rest_endpoint' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_panel_assets' );
			$loader->add_action( 'prc_platform_on_incremental_save', $this, 'set_child_posts', 10, 1 );
			$loader->add_action( 'prc_platform_on_update', $this, 'update_children', 10, 1 );
			$loader->add_action( 'prc_platform_on_update', $this, 'clear_toc_cache_on_update', 100, 1 );
			$loader->add_filter( 'rest_post_query', $this, 'hide_back_chapter_posts_restfully', 10, 2 );
			$loader->add_filter( 'the_title', $this, 'indicate_back_chapter_post', 10, 2 );
			// $this->loader->add_filter( 'wpseo_disable_adjacent_rel_links', $post_report_package, 'disable_yoast_adjacent_rel_links_on_report_package' );
			$loader->add_filter( 'prc_platform_rewrite_query_vars', $this, 'register_query_var' );
			$loader->add_filter( 'get_next_post_where', $this,
			'filter_next_post', 10, 5 );
			$loader->add_filter( 'get_previous_post_where', $this,
			'filter_prev_post', 10, 5 );
			$loader->add_action( 'pre_get_posts', $this, 'filter_pre_get_posts', 10, 1 );
			$loader->add_filter( 'prc_platform_pub_listing_default_args', $this, 'hide_back_chapter_on_non_inherited_query_loops', 9, 1 );
			$loader->add_action( 'prc_report_package_construct_toc', $this, 'handle_scheduled_construction_of_toc', 10, 1 );
		}
	}

	/**
	 * @hook enqueue_block_editor_assets
	 * @return WP_Error|true
	 */
	public function register_panel_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';

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

	/**
	 * Enqueue the assets for this block editor plugin.
	 * @hook enqueue_block_editor_assets
	 * @return void
	 */
	public function enqueue_panel_assets() {
		$registered = $this->register_panel_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			$screen = get_current_screen();
			if ( in_array( $screen->post_type, self::$enabled_post_types ) ) {
				wp_enqueue_script( self::$handle );
			}
		}
	}

	public function get_report_parent_id( int $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( 0 !== $parent_id && is_int($parent_id) ) {
			$post_id = $parent_id;
		}
		return $post_id;
	}

	public function is_report_package( int $post_id) {
		$post_id = $this->get_report_parent_id( $post_id );
		if ( !empty(get_post_meta($post_id, self::$back_chapters_meta_key, true) ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Disable Yoast SEO relative link hijack when the post is part of a report package.
	 * @hook wpseo_disable_adjacent_rel_links
	 * @return bool|void
	 */
	public function disable_yoast_adjacent_rel_links_on_report_package() {
		if ( ! is_singular() ) {
			return false;
		}
		global $post;
		$post_id = $post->ID;
		return $this->is_report_package($post_id);
	}

	/**
	 * @hook query_vars
	 * @param mixed $qvars
	 * @return mixed
	 */
	public function register_query_var($qvars) {
		$qvars[] = 'showBackChapters';
		return $qvars;
	}

	/**
	 * Add appropriate post_status arguments to restful queries on the backend.
	 * @hook rest_post_query
	 * @param mixed $args
	 * @param mixed $request
	 * @return void
	 */
	public function hide_back_chapter_posts_restfully( $args, $request ) {
		$referer = $request->get_header('referer');
		// Break up the refere into its url params
		$referer = wp_parse_url( $referer );
		$referer_query = array_key_exists('query', $referer) ? $referer['query'] : '';
		$referer_query = wp_parse_args( $referer_query );
		$post_type = array_key_exists('postType', $referer_query) ? $referer_query['postType'] : '';
		$post_id = array_key_exists('postId', $referer_query) ? $referer_query['postId'] : '';

		$is_publication_listing = $request->get_param('isPubListingQuery');

		$allowed_ids = array(
			'prc-block-theme//index',
			'prc-block-theme//home',
			'prc-block-theme//category'
		);

		if ( ('wp_template' === $post_type && in_array($post_id, $allowed_ids)) || $is_publication_listing ) {
			$args['post_parent'] = 0;
		}

		return $args;
	}

	/**
	 * This is a filter that can be used to modify the default args for a publication listing query used throughout PRC Platform.
	 * @hook prc_platform_pub_listing_default_args
	 * @param mixed $query
	 * @return array
	 */
	public function hide_back_chapter_on_non_inherited_query_loops($query) {
		if ( empty($query['s']) ){
			$query['post_parent'] = 0;
		}
		return $query;
	}

	/**
	 * Hide back chapter posts from our "publications" queries. (set post_parent to 0)
	 * Can be overridden by setting ?showBackChapters query var to truthy value.
	 * Runs on these queries:
	 * - archive
	 * - taxonomy
	 * - homepage/frontpage
	 * @hook pre_get_posts
	 */
	public function filter_pre_get_posts($query) {
		$show_back_chapters = rest_sanitize_boolean(get_query_var('showBackChapters', false));
		if ( true === $query->get('isPubListingQuery') && false === $show_back_chapters ) {
			$query->set( 'post_parent', 0 );
		}
	}

	/**
	 * Modify tthe post title to include a dash before the title if it is a back chapter post.
	 *
	 * @hook the_title
	 * @param title
	 * @param post_id
	 * @return string
	 */
	public function indicate_back_chapter_post( $title, $post_id = null ) {
		if ( ! function_exists('get_current_screen') ) {
			return $title;
		}

		// If we're not in admin or if our post_id isn't set return title.
		if ( ! is_admin() || null === $post_id ) {
			return $title;
		}

		$screen = get_current_screen();
		if ( ! $screen || 'edit' !== $screen->parent_base ) {
			return $title;
		}

		if ( 'post' !== get_post_type( $post_id ) ) {
			return $title;
		}

		// Add a dash before the title...
		if ( 0 !== wp_get_post_parent_id( $post_id ) && true === $this->is_report_package( $post_id ) ) {
			$title = '&mdash; ' . $title;
		}

		return $title;
	}

	/**
	 * When this post changes the children should also change to match for specific items (namely taxonomy, post_date, post_status)
	 * @hook prc_platform_on_update
	 * @return void
	 */
	public function update_children( $post ) {
		if ( 'post' !== $post->post_type ) {
			return;
		}
		$parent_post_id = wp_get_post_parent_id( $post->ID );
		if ( 0 !== $parent_post_id ) {
			return;
		}
		$post_id = $post->ID;
		$children = $this->get_child_ids( $post_id );
		if ( empty( $children ) ) {
			return;
		}

		$available_taxonomies = get_object_taxonomies( $post->post_type );
		$parent_post_taxonomy_terms = [];
		foreach ($available_taxonomies as $taxonomy) {
			$parent_post_taxonomy_terms[$taxonomy] = wp_get_post_terms( $post_id, $taxonomy, array( 'fields' => 'ids' ) );
		}
		$parent_post_status = get_post_status( $post_id );
		$parent_post_date = get_post_field( 'post_date', $post_id );

		$errors = [];
		$success = [];

		foreach ($children as $child_id) {
			$new_updates = array(
				'ID' => $child_id,
				'post_status' => $parent_post_status,
				'post_date' => $parent_post_date,
			);

			// Update the child post to match the parent post.
			$child_updated = wp_update_post( $new_updates, true );

			$terms_updated = false;
			if ( !is_wp_error( $child_updated ) ) {
				foreach ( $parent_post_taxonomy_terms  as $taxonomy => $terms ) {
					$terms_updated = wp_set_post_terms( $child_updated, $terms, $taxonomy );
				}
			}

			if ( is_wp_error( $child_updated ) ) {
				$errors[] = new WP_Error( '409', 'Failed to update child post state.', $child_updated );
			} else {
				$success[] = $child_updated;
			}
			if ( is_wp_error( $terms_updated ) ) {
				$errors[] = new WP_Error( '409', 'Failed to update child post terms.', $terms_updated );
			}
		}

		$to_return = array(
			'success' => $success,
			'errors' => $errors,
		);

		return $to_return;
	}

	public function assign_child_to_parent($child_post_id, $parent_post_id) {
		$updated = wp_update_post( array(
			'ID' => $child_post_id,
			'post_parent' => $parent_post_id,
		), true );
		if ( is_wp_error( $updated ) ) {
			return new WP_Error( '412', 'Failed to assign child post to parent.', $updated );
		}
		return $updated;
	}

	/**
	 * On incremental saves assigns the child posts to the parent.
	 * @hook prc_platform_on_incremental_save
	 * @param mixed $post
	 * @return void
	 */
	public function set_child_posts( $post ) {
		if ( 'post' !== $post->post_type && 0 !== wp_get_post_parent_id( $post->ID ) ) {
			return;
		}
		$errors = array();
		$success = array();
		$current_back_chapters = get_post_meta( $post->ID, self::$back_chapters_meta_key, true );

		if ( empty( $current_back_chapters ) ) {
			return;
		}
		foreach( $current_back_chapters as $chapter ) {
			$assigned = $this->assign_child_to_parent( $chapter['postId'], $post->ID );
			if ( is_wp_error( $assigned ) ) {
				$errors[] = $assigned;
			} else {
				$success[] = $assigned;
			}
		}
		// we should run through successes and do the updates then...
		return array(
			'success' => $success,
			'errors' => $errors,
		);
	}

	public function get_child_ids( $post_id ) {
		$child_posts = get_post_meta( $post_id, self::$back_chapters_meta_key, true );
		if ( empty( $child_posts ) ) {
			return array();
		}
		return array_map( function( $child ) {
			return $child['postId'];
		}, $child_posts );
	}

	public function register_rest_fields() {
		// Register the quick Table of Contents field for all public posts types.
		$public_post_types = get_post_types( array(
			'public' => true,
		) );
		foreach ($public_post_types as $post_type) {
			register_rest_field(
				$post_type,
				'table_of_contents',
				array(
					'get_callback' => array($this, 'get_table_of_contents_field'),
					'description'  => 'The table of contents for this post.',
				)
			);
		}

		// Register the other constiuent fields for the report package.
		register_rest_field(
			'post',
			'report_materials',
			array(
				'get_callback' => array($this, 'get_report_materials_field'),
				'description'  => 'The full report package; materials and back chapters.',
			)
		);

		register_rest_field(
			'post',
			'report_pagination',
			array(
				'get_callback' => array($this, 'get_report_pagination_field'),
				'description'  => 'Pagination for report packages.',
			)
		);

		register_rest_field(
			'post',
			'parent_info',
			array(
				'get_callback' => array($this, 'get_parent_info_field'),
				'description'  => 'The full report package; materials and back chapters.',
			)
		);
	}

	public function register_meta_fields() {
		// Report Materials
		register_post_meta(
			'post',
			self::$report_materials_meta_key,
			array(
				'single'        => true,
				'type'          => 'array',
				'description'   => 'Array of report material objects.',
				'show_in_rest'  => array(
					'schema' => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$report_materials_schema_properties,
						),
					),
				),
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);

		// Back Chapters
		register_post_meta(
			'post',
			self::$back_chapters_meta_key,
			array(
				'single'        => true,
				'type'          => 'array',
				'description'   => 'Array of back chapter posts.',
				'show_in_rest'  => array(
					'schema' => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$back_chapters_schema_properties,
						),
					),
				),
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);
	}

	public function get_datasets_for_post( $post_id ) {
		// get the dataset terms for this post...
		$datasets = wp_get_post_terms( $post_id, 'datasets' );
		return array_map( function( $dataset ) {
			return array(
				'type' => 'dataset',
				'id' => $dataset->term_id,
				'label' => $dataset->name,
				'url' => get_term_link( $dataset ),
			);
		}, $datasets );
	}

	/**
	 * REPORT MATERIALS
	 */
	public function get_report_materials( $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( 0 != $parent_id) {
			$post_id = $parent_id;
		}

		$datasets = $this->get_datasets_for_post( $post_id );

		$materials = get_post_meta( $post_id, self::$report_materials_meta_key, true );

		if (!empty($datasets) && !empty($materials) && is_array($materials)) {
			$materials = array_merge($materials, $datasets);
		}

		return $materials;
	}

	public function get_constructed_report_materials( $post_id ) {
		return $this->get_report_materials( $post_id );
	}

	/**
	 * BACK CHAPTERS (TABLE OF CONTENTS)
	 */

	/**
	 * Convert a number to words.
	 * @param mixed $number
	 * @return string|WP_Error
	 */
	public function convert_number_to_words($num) {
		if (!is_int($num)) {
		  return new WP_Error('invalid_input', 'Input must be an integer.');
		}

		$ones = array(
		  0 => 'zero', 1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four',
		  5 => 'five', 6 => 'six', 7 => 'seven', 8 => 'eight', 9 => 'nine'
		);
		$tens = array(
		  0 => '', 1 => 'ten', 2 => 'twenty', 3 => 'thirty', 4 => 'forty',
		  5 => 'fifty', 6 => 'sixty', 7 => 'seventy', 8 => 'eighty', 9 => 'ninety'
		);
		$hundreds = array(
		  'hundred', 'thousand'
		);

		if ($num < 0 || $num >= 1000) {
		  return new WP_Error('out_of_range', 'Input must be between 0 and 999.');
		}

		if ($num == 0) {
		  return esc_html($ones[0]);
		}

		$result = '';
		$hundred = (int) ($num / 100);
		$ten = (int) ($num / 10) % 10;
		$one = $num % 10;

		if ($hundred > 0) {
		  $result .= $ones[$hundred] . ' ' . $hundreds[0];
		}

		if ($ten > 0 || $one > 0) {
		  if (!empty($result)) {
			$result .= ' ';
		  }

		  if ($ten < 2) {
			$result .= $ones[$ten * 10 + $one];
		  } else {
			$result .= $tens[$ten];
			if ($one > 0) {
			  $result .= '-' . $ones[$one];
			}
		  }
		}

		return esc_html($result);
	}

	/**
	 * This will only match h2 and h3 elements and assign them as chapters...
	 */
	public function prepare_legacy_headings($content, $post_id) {
		if ( has_blocks($content) || empty($content) ) {
			return false;
		}

		// strip $document_content of any <!-- comments -->, which can interfer with the parser below
		$chapters = preg_replace( '/<!--(.|\s)*?-->/', '', $content );
		$processor = new WP_HTML_Heading_Processor( $chapters );
		$chapters = $processor->process();

		if ( ! empty( $chapters ) ) {
			update_post_meta($post_id, '_migration_legacy_headings_detected', true);
		}

		return $chapters;
	}

	/**
	 * Core Heading Chapter
	 */
	protected function process_core_heading($array, $permalink) {
		$level = array_key_exists('level', $array['attrs']) ? $array['attrs']['level'] : 2;
		$tags = new WP_HTML_Tag_Processor($array['innerHTML']);
		$tags->next_tag('H'.$level);
		$id = $tags->get_attribute('id');

		if ( empty( $id ) ) {
			$id = sanitize_title( $array['innerHTML'] );
		}

		// Check if the heading has a number in it and if so then we'll convert it to words, also we're removing the default h- from heading blocks, looks awful for SEO.
		if ( preg_match( '/^h-(\d+)-/', $id, $matches ) ) {
			$number = $matches[1];
			$number = intval( $number );
			$number = $this->convert_number_to_words( $level );
			if ( is_wp_error( $number ) ) {
				$id = preg_replace( '/^h-(\d+)-/', '', $id );
			} else {
				$id = preg_replace( '/^h-(\d+)-/', $number . '-', $id );
			}
		} else {
			$id = preg_replace( '/^h-/', '', $id );
		}

		return array(
			'id' => $id,
			'title' => wp_strip_all_tags( !empty($array['attrs']['altTocText']) ? $array['attrs']['altTocText'] : $array['innerHTML'] ),
			'link' => $permalink . '#' . $id,
		);
	}

	protected function process_legacy_chapter_block($array, $permalink) {
		$needs_migration = true;
		$id = $array['attrs']['id'];
		// Ensure the ID is clean and none of the core/heading block id stuff gets added.
		if ( preg_match( '/^h-\d+/', $id ) ) {
			$id = preg_replace( '/^h-\d+-/', '', $id );
		} elseif ( preg_match( '/^h-/', $id ) ) {
			$id = preg_replace( '/^h-/', '', $id );
		}
		return array(
			'id' => $id,
			'title' => wp_strip_all_tags( $array['attrs']['value'] ),
			'link' => $permalink . '#' . $id,
		);
	}

	/**
	 * Will recrusively build the table of contents through navigating all blocks and grabbing core/heading and prc-block/chapter
	 * @param mixed $array
	 * @return array
	 */
	public function prepare_chapter_blocks( $array, $post_id = false, $depth = 0 ) {
		$results = array();

		if ( !in_array(get_post_type( $post_id ), [
			'post',
			'fact-sheet',
		]) ) {
			return $results;
		}

		$permalink = get_permalink( $post_id );

		if ( is_array( $array ) ) {
			// We get the first level of the array first...
			$block_name = array_key_exists('blockName', $array) ? $array['blockName'] : false;
			if ( in_array($block_name, array('core/heading', 'prc-block/chapter')) ) {
				// Check if this is a core/heading block...
				if ( array_key_exists('isChapter', $array['attrs']) && true === $array['attrs']['isChapter'] ) {
					$results[] = $this->process_core_heading($array, $permalink);
				// Or if it's a legacy prc-block/chapter block...
				} elseif ( 'prc-block/chapter' === $array['blockName'] ) {
					$results[] = $this->process_legacy_chapter_block($array, $permalink);
				}
			}
			// Then we get the rest of the array...
			if ($depth < 3) {
				foreach ( $array as $subarray ) {
					$results = array_merge( $results, $this->prepare_chapter_blocks( $subarray, $post_id, $depth + 1 ) );
				}
			}
		}

		return $results;
	}

	public function get_internal_chapters($post_id) {
		$the_content = get_post_field( 'post_content', $post_id, 'raw' );
		$legacy = $this->prepare_legacy_headings($the_content, $post_id);
		if ( false !== $legacy ) {
			$blocks = '';
		} else {
			$blocks = parse_blocks( $the_content );
		}
		$chapters = $this->prepare_chapter_blocks( $blocks, $post_id );
		return $chapters;
	}

	/**
	 * Get the back chapters for a given post.
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_back_chapters( $post_id ) {
		$post_id = $this->get_report_parent_id( $post_id );

		$back_chapters = get_post_meta( $post_id, self::$back_chapters_meta_key, true );

		if ( empty( $back_chapters ) ) {
			return array();
		}

		$formatted = array();
		foreach( $back_chapters as $chapter ) {
			$chapter_id = $chapter['postId'];
			$chapters = $this->get_internal_chapters( $chapter_id );
			$formatted[] = array(
				'id' => $chapter_id,
				'title' => get_the_title( $chapter_id ),
				'slug' => get_post_field( 'post_name', $chapter_id ),
				'link' => get_permalink( $chapter_id ),
				'internal_chapters' => $chapters,
			);
		}

		return $formatted;
	}

	private function get_toc_cache_key($cache_key) {
		$cache_invalidate = '050924';
		return md5(wp_json_encode(['key' => $cache_key, 'invalidate' => $cache_invalidate]));
	}

	private function get_toc_cache($cache_key, $sub_cache = false) {
		$cache_group = self::$report_package_key . '_toc';
		if ( $sub_cache ) {
			$cache_group .= '_' . $sub_cache;
		}
		$cache_key = $this->get_toc_cache_key( $cache_key );
		return wp_cache_get( $cache_key, $cache_group );
	}

	private function update_toc_cache($cache_key, $toc, $sub_cache = false) {
		$cache_group = self::$report_package_key . '_toc';
		if ( $sub_cache ) {
			$cache_group .= '_' . $sub_cache;
		}
		$cache_key = $this->get_toc_cache_key( $cache_key );
		return wp_cache_set( $cache_key, $toc, $cache_group, 7 * DAY_IN_SECONDS );
	}

	public function handle_scheduled_construction_of_toc($parent_id) {
		$this->construct_toc( $parent_id );
	}


	/**
	 * @hook prc_platform_on_update
	 */
	public function clear_toc_cache_on_update($post, $is_preview = false) {
		if ( 'post' !== $post->post_type ) {
			return;
		}
		$post_id = $post->ID;
		$parent_id = $this->get_report_parent_id( $post_id );
		if ( 0 !== $post->post_parent ) {
			// If this is not the parent then lets clear the cache for the parent and schedule a new construction of the toc.
			$post = get_post($parent_id);
			return $this->clear_toc_cache_on_update( $post, $is_preview );
		}
		// Schedule a new construction of the toc...
		$group = $parent_id;
		if ( $is_preview ) {
			$group = 'preview_' . $group;
		}
		return as_enqueue_async_action( 'prc_report_package_construct_toc', array( $parent_id ), $group );
	}

	protected function __construct_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );
		$internal_chapters = $this->get_internal_chapters( $parent_id );
		$back_chapters = $this->get_back_chapters( $parent_id );

		if ( empty( $internal_chapters ) && empty( $back_chapters ) ) {
			return false;
		}

		$constructed_toc = array_merge( array(
			array(
				'id' => $parent_id,
				'title' => get_the_title( $parent_id ),
				'slug' => get_post_field( 'post_name', $parent_id ),
				'link' => get_permalink( $parent_id ),
				'internal_chapters' => $internal_chapters
			),
		), $back_chapters );

		return $constructed_toc;
	}

	protected function construct_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );

		$constructed_toc = $this->__construct_toc( $post_id );

		update_post_meta( $parent_id, self::$constructed_toc_key, $constructed_toc );

		$this->update_toc_cache( $parent_id, $constructed_toc );

		return $constructed_toc;
	}

	/**
	 * This function will work with any post type, if the post is not a report package and does not have backchapter posts then it will just collapse the internal chapters into the main list.
	 * @param mixed $post_id
	 * @return mixed
	 */
	public function get_constructed_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );

		$cached_toc = $this->get_toc_cache( $parent_id );

		if ( false !== $cached_toc ) {
			return $cached_toc;
		}

		$stored_toc = get_post_meta( $parent_id, self::$constructed_toc_key, true );
		return $stored_toc;
	}

	/**
	 * @hook prc_api_endpoints
	 */
	public function register_rest_endpoint($endpoints) {
		$endpoint = array(
			'route' => '/report-package/regenerate-toc',
			'methods' => 'POST',
			'callback' => array($this, 'restfully_regenerate_toc'),
			'args' => array(
				'postId' => array(
					'required' => true,
					'type' => 'integer',
				),
			),
			'permission_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		);
		return array_merge($endpoints, array($endpoint));
	}

	public function restfully_regenerate_toc(\WP_REST_Request $request) {
		$post_id = $request->get_param('postId');
		if ( empty($post_id) ) {
			return new WP_Error('400', 'Missing post_id parameter.');
		}
		return $this->construct_toc( $post_id );
	}

	/**
	 * Converts the TOC Chapters Data into Pagination Data.
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_pagination_data($post_id) {
		$chapters = $this->get_constructed_toc( $post_id );
		if ( empty($chapters) ) {
			return [];
		}
		// we want to return this data but strip out internal_chapters, we also want to add an is_active key to each chapter. and check against the current post id.
		$paginated_items = array_map( function( $chapter ) use ($post_id) {
			$chapter['is_active'] = $chapter['id'] === $post_id;
			unset( $chapter['internal_chapters'] );
			return $chapter;
		}, $chapters );

		return $paginated_items;
	}

	// TOC Pagination gets constructed by the pagination class in the block library.
	public function get_pagination($post_id) {
		$items = $this->get_pagination_data( $post_id );
		// Construct the pagination data:
		$pagination = new \PRC\Platform\Blocks\Pagination( $items );
		// Return the pagination data.
		$to_return = array(
			'current_post' => $pagination->get_current_item(),
			'next_post' => $pagination->get_next_item(),
			'previous_post' => $pagination->get_previous_item(),
			'pagination_items' => $pagination->get_items(),
		);
		return $to_return;
	}

	/**
	 * REPORT PACKAGE
	 * Combined report materials and back chapter table of contents.
	 */
	public function get_report_package($post_id) {
		$parent_id = $this->get_report_parent_id( $post_id );
		$pagination = $this->get_pagination( $post_id );
		return array(
			'parent_title' => get_the_title( $parent_id ),
			'parent_id' => $parent_id,
			'report_materials' => $this->get_constructed_report_materials( $post_id ),
			'table_of_contents'  => $this->get_constructed_toc( $post_id ),
			'pagination' => $pagination,
		);
	}

	/**
	 * Get the report package for a given post object.
	 * This is intended for use with the REST API and will return the
	 * report_materials and table_of_contents on the post object.
	 * @param mixed $object
	 * @return mixed
	 */
	public function get_table_of_contents_field( $object ) {
		$post_id = $object['id'];
		return $this->get_constructed_toc( $post_id );
	}

	public function get_report_materials_field( $object ) {
		$post_id = $object['id'];
		return $this->get_constructed_report_materials( $post_id );
	}

	public function get_report_pagination_field( $object ) {
		$post_id = $object['id'];
		return $this->get_pagination( $post_id );
	}

	public function get_parent_info_field( $object ) {
		$post_id = $object['id'];
		$parent_id = $this->get_report_parent_id( $post_id );
		return array(
			'parent_title' => get_the_title( $parent_id ),
			'parent_id' => $parent_id,
		);
	}

	/**
	 * Helper function for getting the "adjacent" post in a report package.
	 * @param mixed $where
	 * @param mixed $post
	 * @param string $adjacent
	 * @return mixed
	 */
	private function filter_adjacent_post($where, $post, $adjacent = 'next_post') {
		$is_post_report_package = $this->is_report_package( $post->ID );
		if ( !$is_post_report_package ) {
			return $where;
		}

		$pagination = $this->get_pagination( $post->ID );
		$next_post = $pagination[$adjacent];

		if ( !$next_post ) {
			return $where;
		}
		global $wpdb;
		$where = $wpdb->prepare( "WHERE p.ID = %s AND p.post_type = %s", $next_post['id'], $post->post_type );
		return $where;
	}

	/**
	 * @hook get_next_post_where
	 * @param mixed $where
	 * @param mixed $in_same_term
	 * @param mixed $excluded_terms
	 * @param mixed $taxonomy
	 * @param mixed $post
	 * @return mixed
	 */
	public function filter_next_post($where, $in_same_term, $excluded_terms, $taxonomy, $post) {
		return $this->filter_adjacent_post($where, $post, 'next_post');
	}

	/**
	 * @hook get_previous_post_where
	 * @param mixed $where
	 * @param mixed $in_same_term
	 * @param mixed $excluded_terms
	 * @param mixed $taxonomy
	 * @param mixed $post
	 * @return mixed
	 */
	public function filter_prev_post($where, $in_same_term, $excluded_terms, $taxonomy, $post) {
		return $this->filter_adjacent_post($where, $post, 'previous_post');
	}
}
