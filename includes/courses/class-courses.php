<?php
namespace PRC\Platform;
use WP_Error;

class Courses {
	protected static $post_type = 'mini-course';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-courses';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );
		}
	}

	/**
	 * Register the course post type.
	 * @hook init
	 */
	public function register_type() {
		$labels  = array(
			'name'                  => _x( 'Courses', 'Post Type General Name', 'prc-core' ),
			'singular_name'         => _x( 'Course', 'Post Type Singular Name', 'prc-core' ),
			'menu_name'             => __( 'Courses', 'prc-core' ),
			'name_admin_bar'        => __( 'Course', 'prc-core' ),
			'archives'              => __( 'Course Archives', 'prc-core' ),
			'parent_item_colon'     => __( 'Parent Course:', 'prc-core' ),
			'all_items'             => __( 'All Courses', 'prc-core' ),
			'add_new_item'          => __( 'Add New Course', 'prc-core' ),
			'add_new'               => __( 'Add New', 'prc-core' ),
			'new_item'              => __( 'New Course', 'prc-core' ),
			'edit_item'             => __( 'Edit Course', 'prc-core' ),
			'update_item'           => __( 'Update Course', 'prc-core' ),
			'view_item'             => __( 'View Course', 'prc-core' ),
			'search_items'          => __( 'Search Courses', 'prc-core' ),
			'not_found'             => __( 'Not found', 'prc-core' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'prc-core' ),
			'featured_image'        => __( 'Featured Image', 'prc-core' ),
			'set_featured_image'    => __( 'Set featured image', 'prc-core' ),
			'remove_featured_image' => __( 'Remove featured image', 'prc-core' ),
			'use_featured_image'    => __( 'Use as featured image', 'prc-core' ),
			'insert_into_item'      => __( 'Insert into Course', 'prc-core' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Course', 'prc-core' ),
			'items_list'            => __( 'Courses list', 'prc-core' ),
			'items_list_navigation' => __( 'Courses list navigation', 'prc-core' ),
			'filter_items_list'     => __( 'Filter Course list', 'prc-core' ),
		);

		$rewrite = array(
			'slug'       => 'course',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args    = array(
			'label'               => __( 'Course', 'prc-core' ),
			'description'         => __( 'A post type for newsletter driven mini courses.', 'prc-core' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions', 'custom-fields' ),
			'taxonomies'          => array( 'topic' ),
			'hierarchical'        => true,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-welcome-learn-more',
			'menu_position'       => 5,
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'show_in_rest'        => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);

		register_post_type( self::$post_type, $args );
	}

	/**
	 * Enable Gutenberg for courses.
	 * @hook prc_load_gutenberg
	 * @param  array $post_types [description]
	 * @return array Post types that should have Gutenberg enabled.
	 */
	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}
}
