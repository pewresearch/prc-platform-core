<?php
namespace PRC\Platform;
use WP_Error;

class Post_Report_Package {
	public $post_id = null;
	public $report_package_key = 'report_package';
	public $report_materials_meta_key = 'reportMaterials'; // @TODO: change these to snake case?
	public $back_chapters_meta_key = 'multiSectionReport'; // @TODO: change these to snake case?

	public $report_materials_schema_properties = array(
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

	public $back_chapters_schema_properties = array(
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

	public static $handle = 'prc-platform-post-report-package';

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

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';


		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	/**
	 * @hook pre_get_posts
	 * @param mixed $query
	 * @return mixed
	 */
	public function hide_back_chapter_posts($query) {
		if ( ! is_admin() && $query->is_main_query() && is_index() ) {
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
		if ( 0 !== wp_get_post_parent_id( $post_id ) ) {
			$title = '&mdash; ' . $title;
			// add a [Back Chapter] tag to the title...
			$title .= ' [Back Chapter]';
		}

		return $title;
	}

	/**
	 * When this post changes the children should also change to match for specific items (namely taxonomy, post_date, post_status)
	 * @return void
	 */
	public function update_child_state($child_post_id, $parent_post_id) {
		$child_post = get_post( $child_post_id );
		$parent_post = get_post( $parent_post_id );

		// Do a quick sanity check to make sure we're dealing with the correct parent post and the child is a post.
		if ( $parent_post_id !== $parent_post->ID ) {
			return new WP_Error( '412', 'Parent post ID does not match parent post object ID.' );
		}
		if ( 'post' !== $child_post->post_type ) {
			return new WP_Error( '412', 'Child post is not a post type.' );
		}
		$available_taxonomies = get_object_taxonomies( $child_post->post_type );
		$parent_post_taxonomy_terms = wp_get_post_terms( $parent_post->ID, $available_taxonomies );
		$parent_post_status = $parent_post->post_status;
		$parent_post_date = $parent_post->post_date;

		// Update the child post to match the parent post.
		$child_updated = wp_update_post( array(
			'ID' => $child_post_id,
			'post_status' => $parent_post_status,
			'post_date' => $parent_post_date,
		), true );

		if ( is_wp_error( $child_updated ) ) {
			return new WP_Error( '412', 'Failed to update child post state.', $child_updated );
		}

		$terms_updated = wp_set_post_terms( $child_post_id, $parent_post_taxonomy_terms, $available_taxonomies );

		return array(
			'child_updated' => $child_updated,
			'terms_updated' => $terms_updated,
		);

	}

	public function assign_child_to_parent($child_post_id, $parent_post_id) {
		// We should assign the parent to the child.
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
	 * @param mixed $post
	 * @return void
	 */
	public function set_child_posts( $post ) {
		if ( 'post' !== $post->post_type ) {
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
				'get_callback' => array($this, 'get_report_package'),
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
	 * Will recrusively build the table of contents through navigating all blocks and grabbing core/heading and prc-block/chapter
	 * @param mixed $array
	 * @return array
	 */
	public function prepare_chapter_blocks( $array ) {
		$results = array();

		if ( is_array( $array ) ) {
			// We get the first level of the array first, then sub levels...
			if ( isset( $array[ 'blockName' ] ) && in_array($array[ 'blockName' ], array('core/heading')) ) {
				if ( array_key_exists('isChapter', $array['attrs']) && true === $array['attrs']['isChapter'] ) {
					$attrs = $this->extract_html_attributes($array['innerHTML']);
					$results[] = array(
						'id' => $attrs['attributes']['id'],
						'content' => wp_strip_all_tags( !empty($array['attrs']['altTocText']) ? $array['attrs']['altTocText'] : $array['innerHTML'] ),
					);
				}
			}

			foreach ( $array as $subarray ) {
				$results = array_merge( $results, $this->prepare_chapter_blocks( $subarray ) );
			}
		}

		return $results;
	}

	public function get_back_chapters( $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( false !== $parent_id && 0 !== $parent_id) {
			$post_id = $parent_id;
		}

		$back_chapters = get_post_meta( $post_id, self::$back_chapters_meta_key, true );

		// Get the chapters of the current $post_id.
		$blocks = parse_blocks( get_the_content( null, false, $post_id ) );
		$chapters = $this->prepare_chapter_blocks( $blocks );

		// We need to build a complete array of chapters, including those from multi-section reports.
		if ( ! empty( $back_chapters ) ) {
			foreach ( $back_chapters as $back_chapter ) {
				$back_chapter_blocks = parse_blocks( get_the_content( null, false, $back_chapter['postId'] ) );

				$section_chapters = $this->prepare_chapter_blocks( $back_chapter_blocks );

				$chapters = array_merge( $chapters, $section_chapters );
			}
		}
	}

	public function get_report_package( $object ) {
		$post_id = $object['id'];

		$cache = wp_cache_get( $post_id, self::$report_package_key );
		// If we have a cache and we're not in preview mode or the user is not logged in then return the cache.
		if ( false !== $cache && ( !is_preview() || !is_user_logged_in() )) {
			return $cache;
		}

		// Check if $post_id is a child post and if so then fetch the report_materials and back_chapters from the parent.
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( false !== $parent_id && 0 !== $parent_id) {
			$post_id = $parent_id;
		}

		$package = array(
			'report_materials' => $this->get_report_materials( $post_id ),
			'back_chapters'  => $this->get_back_chapters( $post_id ),
		);

		if ( !is_preview() || !is_user_logged_in() ) {
			wp_cache_set( $post_id, $package, self::$report_package_key );
		}

		return $package;
	}
}
