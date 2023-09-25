<?php
namespace PRC\Platform;
use WP_Error;

class Post_Report_Package {
	public $post_id = null;
	public static $handle = 'prc-platform-post-report-package';
	public static $enabled_post_types = array( 'post' );
	public static $report_package_key = 'report_package';
	public static $report_materials_meta_key = 'reportMaterials'; // @TODO: change these to snake case
	public static $back_chapters_meta_key = 'multiSectionReport'; // @TODO: change these to snake case

	public static $report_materials_schema_properties = array(
		'key'          => array(
			'type' => 'string',
		),
		'type'         => array(
			'type' => 'string',
		),
		'url'          => array(
			'type' => 'string',
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
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

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
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
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

	public function is_report_package($post_id) {
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
	 * Hide "back chapter" posts from our "publications" queries:
	 * Can be overridden by setting ?showBackChapters query var to truthy value.
	 * - archive
	 * - taxonomy
	 * - homepage/frontpage
	 * @hook pre_get_posts
	 * @param mixed $query
	 * @return mixed
	 */
	public function hide_back_chapter_posts($query) {
		$show_back_chapters = rest_sanitize_boolean(get_query_var('showBackChapters', false));
		if ( ! is_admin() && $query->is_main_query() && is_index() && false === $show_back_chapters ) {
			$query->set( 'post_parent', 0 );
		}
	}

	/**
	 * Modify the post title if it's a child post in the admin view.
	 * @hook the_title
	 * @param title
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
			// add a [Back Chapter] tag to the title...
			// $title .= ' [Back Chapter]';
		}

		return $title;
	}

	/**
	 * When this post changes the children should also change to match for specific items (namely taxonomy, post_date, post_status)
	 * @hook prc_platform_on_update
	 * @return void
	 */
	public function update_child_state( $post ) {
		if ( 'post' !== $post->post_type ) {
			return;
		}
		$parent_post_id = wp_get_post_parent_id( $post->ID );
		if ( 0 !== $parent_post_id ) {
			return;
		}
		$parent_post = get_post( $parent_post_id );
		// Do a quick sanity check to make sure we're dealing with the correct parent post.
		if ( $parent_post_id !== $parent_post->ID ) {
			return new WP_Error( '412', 'Parent post ID does not match parent post object ID.' );
		}
		$available_taxonomies = get_object_taxonomies( $post->post_type );
		$parent_post_taxonomy_terms = wp_get_post_terms( $parent_post->ID, $available_taxonomies );
		$parent_post_status = $parent_post->post_status;
		$parent_post_date = $parent_post->post_date;

		$new_updates = array(
			'ID' => $post->ID,
			'post_status' => $parent_post_status,
			'post_date' => $parent_post_date,
		);

		// Update the child post to match the parent post.
		$child_updated = wp_update_post( $new_updates, true );

		if ( is_wp_error( $child_updated ) ) {
			return new WP_Error( '412', 'Failed to update child post state.', $child_updated );
		}

		$terms_updated = wp_set_post_terms( $child_updated, $parent_post_taxonomy_terms, $available_taxonomies );

		return array(
			'child_updated' => $new_updates,
			'terms_updated' => $terms_updated,
		);

	}

	public function assign_child_to_parent($child_post_id, $parent_post_id) {
		$updated = wp_update_post( array(
			'ID' => $child_post_id,
			'post_parent' => $parent_post_id,
		), true );
		if ( is_wp_error( $updated ) ) {
			return new WP_Error( '412', 'Failed to assign child post to parent.', $updated );
		}
	}

	/**
	 * On incremental saves assigns the child posts to the parent.
	 * @hook prc_platform_on_incremental_save
	 * @param mixed $post
	 * @return void
	 */
	public function set_child_posts( $post ) {
		error_log("SETTING CHILD POSTS");
		if ( 'post' !== $post->post_type && 0 !== wp_get_post_parent_id( $post->ID ) ) {
			return;
		}
		$errors = array();
		$success = array();
		$current_chapters = get_post_meta( $post->ID, self::$back_chapters_meta_key, true );
		if ( empty( $current_chapters ) ) {
			return;
		}
		foreach( $current_chapters as $chapter ) {
			$assigned = $this->assign_child_to_parent( $chapter['postId'], $post->ID );
			if ( is_wp_error( $assigned ) ) {
				$errors[] = $assigned;
			} else {
				$success[] = $assigned;
			}
		}
		return array(
			'success' => $success,
			'errors' => $errors,
		);
	}

	public function register_rest_fields() {
		register_rest_field(
			'post',
			self::$report_package_key,
			array(
				'get_callback' => array($this, 'get_report_package_field'),
				'description'  => 'The full report package; materials and back chapters.',
			)
		);
	}

	public function register_meta_fields() {
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
							'additionalProperties' => true
						),
					),
				),
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

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
			)
		);
	}

	public function get_report_materials( $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( false !== $parent_id && 0 !== $parent_id) {
			$post_id = $parent_id;
		}

		return get_post_meta( $post_id, self::$report_materials_meta_key, true );
	}

	// Cribbed from https://codepad.co/snippet/extract-html-attributes-with-regex-in-php
	public function extract_html_attributes($input) {
		if( ! preg_match('#^(<)([a-z0-9\-._:]+)((\s)+(.*?))?((>)([\s\S]*?)((<)\/\2(>))|(\s)*\/?(>))$#im', $input, $matches)) return false;
		$matches[5] = preg_replace('#(^|(\s)+)([a-z0-9\-]+)(=)(")(")#i', '$1$2$3$4$5<attr:value>$6', $matches[5]);
		$results = array(
			'element' => $matches[2],
			'attributes' => null,
			'content' => isset($matches[8]) && $matches[9] == '</' . $matches[2] . '>' ? $matches[8] : null
		);
		if(preg_match_all('#([a-z0-9\-]+)((=)(")(.*?)("))?(?:(\s)|$)#i', $matches[5], $attrs)) {
			$results['attributes'] = array();
			foreach($attrs[1] as $i => $attr) {
				$results['attributes'][$attr] = isset($attrs[5][$i]) && ! empty($attrs[5][$i]) ? ($attrs[5][$i] != '<attr:value>' ? $attrs[5][$i] : "") : $attr;
			}
		}
		return $results;
	}

	/**
	 * Will recrusively build the table of contents through navigating all blocks and grabbing core/heading with isChapter set to true.
	 * @param mixed $array
	 * @return array
	 */
	public function prepare_chapter_blocks( $array, $post_id ) {
		$permalink = get_permalink( $post_id );
		$results = array();

		if ( is_array( $array ) ) {
			// We get the first level of the array first, then sub levels...
			if ( isset( $array[ 'blockName' ] ) && in_array($array[ 'blockName' ], array('core/heading')) ) {
				if ( array_key_exists('isChapter', $array['attrs']) && true === $array['attrs']['isChapter'] ) {
					$attrs = $this->extract_html_attributes($array['innerHTML']);
					$results[] = array(
						'id' => $attrs['attributes']['id'],
						'title' => wp_strip_all_tags( !empty($array['attrs']['altTocText']) ? $array['attrs']['altTocText'] : $array['innerHTML'] ),
						'link' => $permalink . '#' . $attrs['attributes']['id'],
					);
				}
			}

			foreach ( $array as $subarray ) {
				$results = array_merge( $results, $this->prepare_chapter_blocks( $subarray, $post_id ) );
			}
		}

		return $results;
	}

	/**
	 * Get the back chapters for a given post.
	 * @param mixed $post_id
	 * @return void
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
			$blocks = parse_blocks( get_the_content( null, false, $chapter_id ) );
			$chapters = $this->prepare_chapter_blocks( $blocks, $chapter_id );

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

	public function get_constructed_toc( $post_id ) {
		$cache_key = self::$report_package_key . '_toc';
		$cached_toc = wp_cache_get( $post_id, $cache_key );
		// If we have a cache and we're not in preview mode or the user is not logged in then return the cache.
		if ( false !== $cached_toc && ( !is_preview() || !is_user_logged_in() )) {
			// return $cached_toc;
		}
		$parent_id = $this->get_report_parent_id( $post_id );

		$constructed_toc = array_merge( array(
			array(
				'id' => $parent_id,
				'title' => get_the_title( $parent_id ),
				'slug' => get_post_field( 'post_name', $parent_id ),
				'link' => get_permalink( $parent_id ),
				'internal_chapters' => $this->prepare_chapter_blocks(
					parse_blocks( get_the_content( null, false, $parent_id ) ), $parent_id
				),
			),
		), $this->get_back_chapters( $parent_id ) );

		if ( !is_preview() || !is_user_logged_in() ) {
			// wp_cache_set( $post_id, $constructed_toc, $cache_key, 1 * HOUR_IN_SECONDS );
		}

		return $constructed_toc;
	}

	public function get_report_package($post_id) {
		$parent_id = $this->get_report_parent_id( $post_id );
		return array(
			'parent_title' => get_the_title( $parent_id ),
			'parent_id' => $parent_id,
			'report_materials' => $this->get_report_materials( $post_id ),
			'table_of_contents'  => $this->get_constructed_toc( $post_id ),
		);
	}

	/**
	 * Get the report package for a given post object.
	 * This is intended for use with the REST API and will return the
	 * report_materials and table_of_contents on the post object.
	 * @param mixed $object
	 * @return mixed
	 */
	public function get_report_package_field( $object ) {
		$post_id = $object['id'];
		return $this->get_report_package( $post_id );
	}
}
