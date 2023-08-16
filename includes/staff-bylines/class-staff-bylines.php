<?php
namespace PRC\Platform;

use WP_Query;
use WP_Error;

class Staff_Bylines {
	public static $post_object_name = 'staff';
	public static $taxonomy_object_name = 'bylines';

	public static $field_schema = array(
		'items' => array(
			'type'       => 'object',
			'properties' => array(
				'key'    => array(
					'type' => 'string',
				),
				'termId' => array(
					'type' => 'integer',
				),
			),
		),
	);

	protected static $enabled_post_types = array(
		'post',
		'short-read',
		'interactives',
		'interactive',
		'fact-sheet',
		'fact-sheets',
		'mini-course',
		'course',
		'quiz',
	);

	public static $staff_post_type_args = array(
		'labels'             => array(
			'name'               => 'Staff',
			'singular_name'      => 'Staff',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New Staff',
			'edit_item'          => 'Edit Staff',
			'new_item'           => 'New Staff',
			'all_items'          => 'All Staff',
			'view_item'          => 'View Staff',
			'search_items'       => 'Search staff',
			'not_found'          => 'No staff found',
			'not_found_in_trash' => 'No staff found in Trash',
			'parent_item_colon'  => '',
			'menu_name'          => 'Staff',
			'featured_image'     => 'Staff Photo',
			'set_featured_image' => 'Set Staff Photo',
		),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'menu_icon'          => 'dashicons-groups',
		'query_var'          => true,
		// 'rewrite'            => false,
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => 30,
		'taxonomies'         => array( 'areas-of-expertise', 'bylines', 'staff-type', 'research-teams' ),
		'supports'           => array( 'title', 'editor', 'thumbnail', 'revisions', 'author', 'custom-fields' ),
	);

	public static $staff_type_taxonomy_args = array(
		'hierarchical'      => true,
		'labels'            => array(
			'name'                       => 'Staff Type',
			'singular_name'              => 'Staff Type',
			'search_items'               => 'Search Staff Type',
			'popular_items'              => 'Popular Staff Type',
			'all_items'                  => 'All Staff Type',
			'parent_item'                => null,
			'parent_item_colon'          => null,
			'edit_item'                  => 'Edit Staff Type',
			'update_item'                => 'Update Staff Type',
			'add_new_item'               => 'Add New Staff Type',
			'new_item_name'              => 'New Staff Type Name',
			'separate_items_with_commas' => 'Separate staff type with commas',
			'add_or_remove_items'        => 'Add or remove staff type',
			'choose_from_most_used'      => 'Choose from the most used staff types',
		),
		'show_ui'           => true,
		'query_var'         => false,
		'show_admin_column' => true,
		'show_in_rest'      => true,
	);

	public static $expertise_taxonomy_args = array(
		'hierarchical'      => true,
		'labels'            => array(
			'name'                       => 'Expertise',
			'singular_name'              => 'Expertise',
			'search_items'               => 'Search Expertise',
			'popular_items'              => 'Popular Expertise',
			'all_items'                  => 'All Expertise',
			'parent_item'                => null,
			'parent_item_colon'          => null,
			'edit_item'                  => 'Edit Expertise',
			'update_item'                => 'Update Expertise',
			'add_new_item'               => 'Add New Expertise',
			'new_item_name'              => 'New Expertise Name',
			'separate_items_with_commas' => 'Separate expertise with commas',
			'add_or_remove_items'        => 'Add or remove expertise',
			'choose_from_most_used'      => 'Choose from the most used expertises',
		),
		'show_ui'           => true,
		'query_var'         => false,
		'show_in_rest'      => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
	);

	public static $byline_taxonomy_args = array(
		'hierarchical'      => false,
		'labels'            => array(
			'name'                       => 'Bylines',
			'singular_name'              => 'Byline',
			'search_items'               => 'Search Bylines',
			'popular_items'              => 'Popular Bylines',
			'all_items'                  => 'All Bylines',
			'parent_item'                => null,
			'parent_item_colon'          => null,
			'edit_item'                  => 'Edit Byline',
			'update_item'                => 'Update Byline',
			'add_new_item'               => 'Add New Byline',
			'new_item_name'              => 'New Byline Name',
			'separate_items_with_commas' => 'Separate bylines with commas',
			'add_or_remove_items'        => 'Add or remove bylines',
			'choose_from_most_used'      => 'Choose from the most used bylines',
		),
		'show_in_rest'      => true,
		'show_ui'           => true,
		'query_var'         => true,
		// @TODO: We'll re-add this rewrite rule when the time comes.
		// 'rewrite'           => array(
		// 	'slug'         => 'staff',
		// 	'with_front'   => false,
		// 	'hierarchical' => false,
		// ),
		'show_admin_column' => true,
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

	public static $handle = 'prc-platform-staff-bylines';

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

	public function register_term_data_store() {
		register_post_type( self::$post_object_name, self::$staff_post_type_args );
		register_taxonomy( self::$taxonomy_object_name, self::$enabled_post_types, self::$byline_taxonomy_args );
		register_taxonomy( 'areas-of-expertise', self::$post_object_name, self::$expertise_taxonomy_args );
		register_taxonomy( 'staff-type', self::$post_object_name, self::$staff_type_taxonomy_args );
		// Link the post object and taxonomy object into one entity.
		\TDS\add_relationship( self::$post_object_name, self::$taxonomy_object_name );
	}

	public function determine_bylines_display( $args ) {
		return get_post_meta( (int) $args['post_id'], 'displayBylines', true );
	}

	/**
	 * Order staff posts by last name
	 *
	 * @hook posts_orderby
	 * @param mixed $orderby
	 * @param WP_Query $q
	 * @return mixed
	 */
	public function orderby_last_name( $orderby, WP_Query $q ) {
		$order = $q->get( 'order' );
		global $wpdb;
		if ( 'last_name' === $q->get( 'orderby' ) && $order ) {
			if( in_array( strtoupper( $order ), ['ASC', 'DESC'] ) )
			{
				// order by last name
				$orderby = "RIGHT($wpdb->posts.post_title, LOCATE(' ', REVERSE($wpdb->posts.post_title)) - 1) " . $order;
			}
			// if post_title is "Michael Dimock", rank first.
			$orderby = "CASE WHEN $wpdb->posts.post_title = 'Michael Dimock' THEN 1 ELSE 2 END, $orderby";
		}
		return $orderby;
	}

	public function tie_staff_to_user() {
		// Link the staff taxonomy term to a user, when the user is created.
		// If the user is updated update the staff taxonomy term.
		// Eventually in this process we may vary well switch over from a staff post type to a user.
	}

	public function register_meta_fields() {
		foreach ( self::$enabled_post_types as $post_type ) {
			register_post_meta(
				$post_type,
				'bylines',
				array(
					'single'        => true,
					'type'          => 'array',
					'show_in_rest'  => array(
						'schema' => self::$field_schema,
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);

			register_post_meta(
				$post_type,
				'acknowledgements',
				array(
					'single'        => true,
					'type'          => 'array',
					'show_in_rest'  => array(
						'schema' => self::$field_schema,
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);

			register_post_meta(
				$post_type,
				'displayBylines',
				array(
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'boolean',
					'default'       => true,
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
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
}
