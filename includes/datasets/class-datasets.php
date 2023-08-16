<?php
namespace PRC\Platform;
use WP_Error;

class Datasets {
	public static $post_object_name = 'dataset';
	public static $taxonomy_object_name = 'datasets';
	public static $enabled_post_types = array(
		'post',
		'interactives',
		'fact-sheets',
		'fact-sheet',
		'interactive',
		'short-read',
		'quiz',
		'chart',
	);

	public static $post_object_args = array(
		'labels'             => array(
			'name'                       => 'Datasets',
			'singular_name'              => 'Dataset',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Dataset',
			'edit_item'                  => 'Edit Dataset',
			'new_item'                   => 'New Dataset',
			'all_items'                  => 'Datasets',
			'view_item'                  => 'View Dataset',
			'search_items'               => 'Search datasets',
			'not_found'                  => 'No dataset found',
			'not_found_in_trash'         => 'No dataset found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Item',
			'new_item_name'              => 'New Item Name',
			'add_new_item'               => 'Add New Item',
			'separate_items_with_commas' => 'Separate items with commas',
			'add_or_remove_items'        => 'Add or remove items',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Items',
			'items_list'                 => 'Items list',
			'items_list_navigation'      => 'Items list navigation',
			'menu_name'                  => 'Datasets',
		),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'query_var'          => true,
		'rewrite'            => false,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 30,
		'menu_icon'          => 'dashicons-download',
		'supports'           => array( 'title', 'editor', 'excerpt', 'revisions', 'custom-fields' ),
	);

	public static $taxonomy_object_args = array(
		'labels'            => array(
			'name'                       => 'Datasets',
			'singular_name'              => 'Dataset',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Dataset',
			'edit_item'                  => 'Edit Dataset',
			'new_item'                   => 'New Dataset',
			'all_items'                  => 'Datasets',
			'view_item'                  => 'View Dataset',
			'search_items'               => 'Search datasets',
			'not_found'                  => 'No dataset found',
			'not_found_in_trash'         => 'No dataset found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Item',
			'new_item_name'              => 'New Item Name',
			'add_new_item'               => 'Add New Item',
			'separate_items_with_commas' => 'Separate items with commas',
			'add_or_remove_items'        => 'Add or remove items',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Items',
			'items_list'                 => 'Items list',
			'items_list_navigation'      => 'Items list navigation',
			'menu_name'                  => 'Datasets',
		),
		'hierarchical'      => false,
		'public'            => true,
		'rewrite'           => array(
			'slug'         => 'dataset',
			'with_front'   => false,
			'hierarchical' => false,
		),
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
		'show_in_menu'      => true,
		'show_in_nav_menus' => false,
		'show_tagcloud'     => false,
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

	public static $handle = 'prc-platform-datasets';

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
		register_post_type( self::$post_object_name, self::$post_object_args );
		register_taxonomy( self::$taxonomy_object_name, self::$enabled_post_types, self::$taxonomy_object_args );
		\TDS\add_relationship( self::$post_object_name, self::$taxonomy_object_name );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_object_name);
		return $post_types;
	}

	public function archive_rewrites() {
		add_rewrite_rule(
			'datasets/(\d\d\d\d)/page/?([0-9]{1,})/?$',
			'index.php?post_type=dataset&year=$matches[1]&paged=$matches[2]',
			'top'
		);
		add_rewrite_rule(
			'datasets/(\d\d\d\d)/?$',
			'index.php?post_type=dataset&year=$matches[1]',
			'top'
		);
		add_rewrite_rule(
			'datasets/page/?([0-9]{1,})/?$',
			'index.php?post_type=dataset&paged=$matches[1]',
			'top'
		);
		add_rewrite_rule(
			'datasets/?$',
			'index.php?post_type=dataset',
			'top'
		);
	}

}
