<?php
namespace PRC\Platform;
use WP_Error;

class Homepages {
	public static $post_type = 'homepage';

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

	public static $handle = 'prc-platform-homepages';

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
		$labels     = array(
			'name'                  => _x( 'Homepages', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Homepage', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Homepages', 'text_domain' ),
			'name_admin_bar'        => __( 'Homepage', 'text_domain' ),
			'archives'              => __( 'Homepages Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Homepage:', 'text_domain' ),
			'all_items'             => __( 'All Homepages', 'text_domain' ),
			'add_new_item'          => __( 'Add New Homepage', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Homepage', 'text_domain' ),
			'edit_item'             => __( 'Edit Homepage', 'text_domain' ),
			'update_item'           => __( 'Update Homepage', 'text_domain' ),
			'view_item'             => __( 'View Homepage', 'text_domain' ),
			'search_items'          => __( 'Search Homepages', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Homepage', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Homepage', 'text_domain' ),
			'items_list'            => __( 'Homepages list', 'text_domain' ),
			'items_list_navigation' => __( 'Homepages list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Homepage list', 'text_domain' ),
		);
		$rewrite    = array(
			'slug'       => 'homepage',
			'with_front' => true,
			'pages'      => false,
			'feeds'      => false,
		);
		$supports   = array( 'title', 'editor', 'revisions', 'custom-fields' );
		$args       = array(
			'label'               => __( 'Homepage', 'text_domain' ),
			'description'         => __( 'Homepages', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => $supports,
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 4,
			'menu_icon'           => 'dashicons-layout',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => false,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'show_in_rest'        => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	/**
	 * @hook admin_bar_menu
	 * @param mixed $admin_bar
	 * @return string|void
	 */
	public function add_front_page_quick_edit( $admin_bar ) {
		if ( ! is_front_page() ) {
			return ''; // Bail early if not the frontpage.
		}
		$homepage = false;
		$args          = array(
			'posts_per_page'   => 1,
			'orderby'          => 'date',
			'order'            => 'DESC',
			'post_type'        => self::$post_type,
			'post_status'      => 'publish',
			'fields'           => 'ids',
		);
		$homepage = get_posts( $args );
		if ( ! empty( $homepage ) ) {
			$homepage = array_pop( $homepage );
		}
		if ( ! $homepage ) {
			return ''; // Bail early if no homepage.
		}
		$link = get_edit_post_link( $homepage );
		if ( null !== $link ) {
			// Remove the "edit page" link for the page that the homepage is occupying.
			$admin_bar->remove_menu( 'edit' );
			$admin_bar->add_menu(
				array(
					'id'    => 'edit-homepage',
					'title' => '<span class="ab-icon dashicons dashicons-admin-home"></span>' . _( 'Edit Homepage' ),
					'href'  => $link,
					'meta'  => array(
						'title' => __( 'Edit Homepage' ),
					),
				)
			);
		}
	}

	/**
	 * @hook menu_order
	 * @param mixed $menu_order
	 * @return array
	 */
	public function admin_menu_order( $menu_order ) {
		$homepage_menu_order = array();

		// Build menu order without homepage.
		foreach ( $menu_order as $index => $item ) {
			if ( 'edit.php?post_type=homepage' !== $item ) {
				$homepage_menu_order[] = $item;
			}
		}

		// Splice homepage above posts.
		array_splice( $homepage_menu_order, 3, 0, array( 'edit.php?post_type=homepage' ) );
		return $homepage_menu_order;
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
	 * Modifies the staff permalink to point to the bylines term archive permalink.
	 *
	 * @hook post_link
	 * @param string $url
	 * @param WP_Post $post
	 * @return string
	 */
	public function modify_homepage_permalink( $url, $post ) {
		if ( 'publish' !== $post->post_status ) {
			return $url;
		}
		if ( self::$post_type === $post->post_type ) {
			return home_url();
		}
		return $url;
	}
}
