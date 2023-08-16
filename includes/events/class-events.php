<?php
namespace PRC\Platform;
use WP_Error;

class Events {
	protected static $post_type = 'events';
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

	public static $handle = 'prc-platform-events';

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

	public function register_type() {
		$labels  = array(
			'name'                  => _x( 'Events', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Event', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Events', 'text_domain' ),
			'name_admin_bar'        => __( 'Event', 'text_domain' ),
			'archives'              => __( 'Events Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Event:', 'text_domain' ),
			'all_items'             => __( 'All Events', 'text_domain' ),
			'add_new_item'          => __( 'Add New Event', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Event', 'text_domain' ),
			'edit_item'             => __( 'Edit Event', 'text_domain' ),
			'update_item'           => __( 'Update Event', 'text_domain' ),
			'view_item'             => __( 'View Event', 'text_domain' ),
			'search_items'          => __( 'Search Events', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Event', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Event', 'text_domain' ),
			'items_list'            => __( 'Events list', 'text_domain' ),
			'items_list_navigation' => __( 'Events list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Event list', 'text_domain' ),
		);
		$rewrite = array(
			'slug'       => 'event',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);
		$args    = array(
			'label'               => __( 'Event', 'text_domain' ),
			'description'         => __( 'A post type for live events.', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions' ),
			'taxonomies'          => array( 'category' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-calendar-alt',
			'menu_position'       => 5,
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'show_in_rest'        => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);

		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			$args['taxonomies'] = array( 'topic' );
		}

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}
}
