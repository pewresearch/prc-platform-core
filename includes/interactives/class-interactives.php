<?php
namespace PRC\Platform;
use WP_Error;

class Interactives {
	public static $post_type = 'interactive';

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

	public static $handle = 'prc-platform-interactive-post-type';

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
		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			self::$post_type = 'interactives';
		}
	}

	public function register_type() {
		$labels = array(
			'name'               => 'Interactive Products',
			'singular_name'      => 'Interactive',
			'menu_name'          => 'Interactives',
			'parent_item_colon'  => 'Parent Interactive:',
			'all_items'          => 'Interactives',
			'view_item'          => 'View Interactive',
			'add_new_item'       => 'Add New Interactive',
			'add_new'            => 'Add New',
			'edit_item'          => 'Edit Interactive',
			'update_item'        => 'Update Interactive',
			'search_items'       => 'Search Interactives',
			'not_found'          => 'Not found',
			'not_found_in_trash' => 'Not found in Trash',
		);

		$rewrite = array(
			'slug'       => 'interactive',
			'with_front' => true,
			'pages'      => false,
			'feeds'      => true,
		);

		$args = array(
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'thumbnail', 'revisions', 'excerpt', 'custom-fields' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_rest'        => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 42,
			'menu_icon'           => 'dashicons-analytics',
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'rewrite'             => $rewrite,
			'taxonomies' 		  => array( 'category', 'research-teams' ),
		);

		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			$args['rewrite']['slug'] = 'interactives';
			$args['taxonomies'] = array( 'topic', 'research-teams' );
		}

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}
}
