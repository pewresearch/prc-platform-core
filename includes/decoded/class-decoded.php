<?php
namespace PRC\Platform;
use WP_Error;

class Decoded {
	/**
	 * Post type name.
	 *
	 * @var string
	 */
	protected static $post_type = 'decoded';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-decoded-post-type';

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
			$loader->add_filter( 'post_type_link', $this, 'get_decoded_permalink', 10, 3);
			$loader->add_action('prc_platform_on_incremental_save', $this, 'enforce_decoded_format', 10, 1);
		}
	}

	public function register_type() {
		$labels  = array(
			'name'                  => _x( 'Decoded Posts', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Decoded Post', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Decoded', 'text_domain' ),
			'name_admin_bar'        => __( 'Decoded', 'text_domain' ),
			'archives'              => __( 'Decoded Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Decoded Post:', 'text_domain' ),
			'all_items'             => __( 'All Decoded Posts', 'text_domain' ),
			'add_new_item'          => __( 'Add New Decoded Post', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Decoded Post', 'text_domain' ),
			'edit_item'             => __( 'Edit Decoded Post', 'text_domain' ),
			'update_item'           => __( 'Update Decoded Post', 'text_domain' ),
			'view_item'             => __( 'View Decoded Post', 'text_domain' ),
			'search_items'          => __( 'Search Decoded Posts', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Decoded Post', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Decoded Post', 'text_domain' ),
			'items_list'            => __( 'Decoded Posts List', 'text_domain' ),
			'items_list_navigation' => __( 'Decoded Posts List Navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Decoded Posts List', 'text_domain' ),
		);

		$rewrite = array(
			'slug'       => 'decoded/%year%/%monthnum%',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args    = array(
			'label'               => __( 'Decoded', 'text_domain' ),
			'description'         => __( 'A post type for Decoded blog posts.', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'excerpt', 'author', 'thumbnail', 'revisions', 'custom-fields' ),
			'taxonomies'          => array( 'decoded-category', 'research-teams', 'collection', 'languages', 'formats' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
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
	public function get_decoded_permalink($url, $post) {
		if ( self::$post_type == get_post_type($post) ) {
			$url = str_replace( "%year%", get_the_date('Y', $post->ID), $url );
			$url = str_replace( "%monthnum%", get_the_date('m', $post->ID), $url );
		}
		return $url;
	}

	/**
	 * Whenever a decoded post is updated it should have the decoded format enforced. This function will enforce that.
	 * @hook prc_platform_on_incremental_save
	 * @return void
	 */
	public function enforce_decoded_format($post) {
		if ( $post->post_type === self::$post_type ) {
			error_log('enforce_decoded_format'. print_r($post, true));
			// Check if the post already has the decoded format, if not, append it.
			$format = wp_get_object_terms($post->ID, 'formats');
			$has_decoded_format = array_filter($format, function($term) {
				return $term->slug === 'decoded';
			});
			$has_decoded_format = !empty($has_decoded_format);
			if ( !$has_decoded_format ) {
				wp_set_object_terms($post->ID, 'decoded', 'formats', true);
			}
		}
	}
}
