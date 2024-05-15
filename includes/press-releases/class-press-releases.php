<?php
namespace PRC\Platform;
use WP_Error;

class Press_Releases {
	/**
	 * Post type name.
	 *
	 * @var string
	 */
	protected static $post_type = 'press-release';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-press-release-post-type';

	/**
	 * Initialize the class and set its properties.
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );
			$loader->add_filter( 'post_type_link', $this, 'get_press_release_permalink', 10, 3);
		}
	}

	public function register_type() {
		$labels  = array(
			'name'                  => _x( 'Press Releases', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Press Release', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Press Releases', 'text_domain' ),
			'name_admin_bar'        => __( 'Press Release', 'text_domain' ),
			'archives'              => __( 'Press Releases Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Press Release:', 'text_domain' ),
			'all_items'             => __( 'All Press Releases', 'text_domain' ),
			'add_new_item'          => __( 'Add New Press Release', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Press Release', 'text_domain' ),
			'edit_item'             => __( 'Edit Press Release', 'text_domain' ),
			'update_item'           => __( 'Update Press Release', 'text_domain' ),
			'view_item'             => __( 'View Press Release', 'text_domain' ),
			'search_items'          => __( 'Search Press Releases', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Press Release', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Press Release', 'text_domain' ),
			'items_list'            => __( 'Press Releases list', 'text_domain' ),
			'items_list_navigation' => __( 'Press Releases list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Press Release list', 'text_domain' ),
		);

		$rewrite = array(
			'slug'       => 'press-release/%year%/%monthnum%',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args    = array(
			'label'               => __( 'Press Release', 'text_domain' ),
			'description'         => __( 'A post type for press releases.', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions' ),
			'taxonomies'          => array( 'formats' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-megaphone',
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

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	// Convert the %year% and %monthnum% placeholders in the post type's rewrite slug to the actual year and month.
	public function get_press_release_permalink($url, $post) {
		if ( self::$post_type == get_post_type($post) ) {
			$url = str_replace( "%year%", get_the_date('Y'), $url );
			$url = str_replace( "%monthnum%", get_the_date('m'), $url );
		}
		return $url;
	}
}
