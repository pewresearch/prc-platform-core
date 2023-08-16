<?php
namespace PRC\Platform;
use WP_Error;

class Block_Area_Modules {
	public static $taxonomy = 'block_area';
	public static $post_type = 'block_module';

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

	public static $handle = 'prc-platform-block-area-modules';

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

	public function register_block_areas() {
		$labels = array(
			'name'                       => _x( 'Block Areas', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Block Area', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Block Areas', 'text_domain' ),
			'all_items'                  => __( 'All block areas', 'text_domain' ),
			'parent_item'                => __( 'Parent Block Area', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Block Area:', 'text_domain' ),
			'new_item_name'              => __( 'New Block Area Name', 'text_domain' ),
			'add_new_item'               => __( 'Add New Block Area', 'text_domain' ),
			'edit_item'                  => __( 'Edit Block Area', 'text_domain' ),
			'update_item'                => __( 'Update Block Area', 'text_domain' ),
			'view_item'                  => __( 'View Block Area', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate block areas with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove block areas', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular block areas', 'text_domain' ),
			'search_items'               => __( 'Search block areas', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No block areas', 'text_domain' ),
			'items_list'                 => __( 'Block areas list', 'text_domain' ),
			'items_list_navigation'      => __( 'Block areas list navigation', 'text_domain' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		register_taxonomy( self::$taxonomy, self::$post_type, $args );
	}

	public function register_block_modules() {
		$labels  = array(
			'name'                  => _x( 'Block Modules', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Module', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Block Modules', 'text_domain' ),
			'name_admin_bar'        => __( 'Module', 'text_domain' ),
			'archives'              => __( 'Modules Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Module:', 'text_domain' ),
			'all_items'             => __( 'All Modules', 'text_domain' ),
			'add_new_item'          => __( 'Add New Module', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Module', 'text_domain' ),
			'edit_item'             => __( 'Edit Module', 'text_domain' ),
			'update_item'           => __( 'Update Module', 'text_domain' ),
			'view_item'             => __( 'View Module', 'text_domain' ),
			'search_items'          => __( 'Search Modules', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Module', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Module', 'text_domain' ),
			'items_list'            => __( 'Modules list', 'text_domain' ),
			'items_list_navigation' => __( 'Modules list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Module list', 'text_domain' ),
		);

		$rewrite = array(
			'slug'       => 'block-module',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args    = array(
			'label'               => __( 'Block Module', 'text_domain' ),
			'description'         => __( 'A block module goes into a block area', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => array(
				'title',
				'editor',
				'excerpt',
				'author',
				'custom-fields',
				'revisions'
			),
			'taxonomies'          => array( 'category', 'block_area' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-screenoptions',
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
		array_push( $post_types, self::$post_type );
		return $post_types;
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
