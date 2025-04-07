<?php
/**
 * Collections class.
 *
 * @package PRC\Platform
 */
namespace PRC\Platform;

use WP_Error;

/**
 * Collections class.
 *
 * @package PRC\Platform
 */
class Collections {
	/**
	 * Editor UI handle for the plugin panel.
	 *
	 * @var string
	 */
	public static $handle = 'prc-collections-panel';

	/**
	 * Post types that should be associated with collections.
	 *
	 * @var array
	 */
	protected static $post_types = array( 'post', 'page', 'fact-sheet', 'short-read', 'feature', 'decoded', 'block_module', 'collections' );

	/**
	 * Post object name for collections.
	 *
	 * @var string
	 */
	public static $post_object_name = 'collections';

	/**
	 * Taxonomy object name for collections.
	 *
	 * @var string
	 */
	public static $taxonomy_object_name = 'collection';

	/**
	 * Meta key for the kicker bug.
	 *
	 * @var string
	 */
	public static $kicker_bug_meta_key = 'collection_kicker_bug';

	/**
	 * Settings for the collection post type.
	 *
	 * @var array
	 */
	public static $post_object_args = array(
		'labels'             => array(
			'name'                       => 'Collections',
			'singular_name'              => 'Collection',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Collection',
			'edit_item'                  => 'Edit Collection',
			'new_item'                   => 'New Collection',
			'all_items'                  => 'Collection',
			'view_item'                  => 'View collection',
			'search_items'               => 'Search collections',
			'not_found'                  => 'No collection found',
			'not_found_in_trash'         => 'No collection found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Collection',
			'new_item_name'              => 'New Collection Name',
			'separate_items_with_commas' => 'Separate collections with commas',
			'add_or_remove_items'        => 'Add or remove collections',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Collections',
			'items_list'                 => 'Collections list',
			'items_list_navigation'      => 'Collections list navigation',
			'menu_name'                  => 'Collections',
		),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'menu_icon'          => 'dashicons-tagcloud',
		'query_var'          => true,
		'rewrite'            => array(
			'slug' => 'collections', // We're giving the post type a rewrite but not the taxonomy. I dont expect this will receive anything but internal traffic for right now.
		),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => true,
		'menu_position'      => 60,
		'supports'           => array( 'title', 'editor', 'excerpt', 'revisions', 'custom-fields', 'page-attributes', 'thumbnail' ),
		'template'           => array(
			array( 'prc-block/grid-controller', array() ),
		),
	);

	/**
	 * Settings for the collection taxonomy.
	 *
	 * @var array
	 */
	public static $taxonomy_object_args = array(
		'labels'            => array(
			'name'                       => 'Collections',
			'singular_name'              => 'Collection',
			'menu_name'                  => 'Collections',
			'all_items'                  => 'All Collections',
			'parent_item'                => 'Parent Collection',
			'parent_item_colon'          => 'Parent Collection:',
			'new_item_name'              => 'New Collection Name',
			'add_new_item'               => 'Add New Collection',
			'edit_item'                  => 'Edit Collection',
			'update_item'                => 'Update Collection',
			'view_item'                  => 'View Collection',
			'separate_items_with_commas' => 'Separate collections with commas',
			'add_or_remove_items'        => 'Add or remove collections',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular collections',
			'search_items'               => 'Search collections',
			'not_found'                  => 'Not Found',
			'no_terms'                   => 'No Collections',
			'items_list'                 => 'Collections list',
			'items_list_navigation'      => 'Collections list navigation',
		),
		'hierarchical'      => true,
		'public'            => true,
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_nav_menus' => true,
		'show_tagcloud'     => false,
		'show_in_rest'      => true,
		'rewrite'           => false,
	);

	/**
	 * Constructor.
	 *
	 * @param string $plugin_version The version of the plugin.
	 * @param object $loader The loader object.
	 */
	public function __construct( $plugin_version, $loader ) {
		$loader->add_action( 'init', $this, 'register_term_data_store' );
		$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
		$loader->add_filter( 'default_wp_template_part_areas', $this, 'kicker_template_areas', 11, 1 );
		$loader->add_action( 'pre_get_posts', $this, 'filter_posts_on_collection_pages' );
	}

	/**
	 * Register the collections post type and taxonomy and establish a relationship between them.
	 * Additionally, register the kicker meta.
	 */
	public function register_term_data_store() {
		register_post_type( self::$post_object_name, self::$post_object_args );
		register_taxonomy( self::$taxonomy_object_name, self::$post_types, self::$taxonomy_object_args );
		\TDS\add_relationship( self::$post_object_name, self::$taxonomy_object_name );
		$this->register_kicker_meta();
	}

	/**
	 * Adds custom "kicker" template part area to the default template part areas.
	 *
	 * @see https://developer.wordpress.org/reference/hooks/default_wp_template_part_areas/
	 *
	 * @param array $areas Existing array of template part areas.
	 * @return array Modified array of template part areas including the new kicker area.
	 */
	public function kicker_template_areas( array $areas ) {
		$areas[] = array(
			'area'        => 'kicker',
			'label'       => 'Kicker',
			'description' => 'A "kicker" is a small label and/or icon that denotes a post is part of a collection.',
			'icon'        => 'layout',
			'area_tag'    => 'div',
		);
		return $areas;
	}

	/**
	 * Register the kicker meta.
	 */
	public function register_kicker_meta() {
		register_post_meta(
			self::$post_object_name,
			'kicker_pattern_slug',
			array(
				'single'        => true,
				'type'          => 'string',
				'show_in_rest'  => true,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Helper function to get the current post type in the WordPress admin.
	 *
	 * @return string|null The current post type.
	 */
	public function get_wp_admin_current_post_type() {
		if ( ! is_admin() ) {
			return false;
		}
		global $post, $typenow, $current_screen;
		if ( $post && $post->post_type ) {
			return $post->post_type;
		} elseif ( $typenow ) {
			return $typenow;

		} elseif ( $current_screen && $current_screen->post_type ) {
			return $current_screen->post_type;

		} elseif ( isset( $_REQUEST['post_type'] ) ) {
			return sanitize_key( $_REQUEST['post_type'] );
		}
		return null;
	}

	/**
	 * Register the plugin panel assets.
	 *
	 * @return bool|WP_Error True if the assets are registered, false if not.
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$asset_slug = self::$handle;
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * Enqueue the plugin panel assets.
	 *
	 * @hook enqueue_block_editor_assets
	 */
	public function enqueue_assets() {
		$this->register_assets();
		$registered = wp_script_is( self::$handle, 'registered' );
		if ( $registered && $this->get_wp_admin_current_post_type() === 'collections' ) {
			wp_enqueue_script( self::$handle );
		}
	}

	/**
	 * Hide the collection post type from the main query on collection pages.
	 * Additionally, set a tax_query for queries on this page to look at the referenced
	 * collection term.
	 *
	 * @hook pre_get_posts
	 *
	 * @param WP_Query $query The query object.
	 */
	public function filter_posts_on_collection_pages( $query ) {
		if ( is_admin() ) {
			return;
		}
		// if isPubListingQuery is false then return the block query as is.
		if ( true !== $query->get( 'isPubListingQuery' ) ) {
			return;
		}
		// Basically, on collection pages we want to get the term id and assign a tax_query to the block query so that we're filtering by only the posts in that collection.
		$queried_object = get_queried_object();
		if ( ! is_a( $queried_object, 'WP_Post' ) || $queried_object->post_type !== self::$post_object_name ) {
			return;
		}
		$collection_term = \TDS\get_related_term( $queried_object );
		if ( ! $collection_term ) {
			return;
		}
		$query->set( 'post__not_in', array( $queried_object->ID ) );
		$query->set(
			'tax_query',
			array(
				'relation' => 'AND',
				array(
					'taxonomy' => self::$taxonomy_object_name,
					'field'    => 'term_id',
					'terms'    => $collection_term->term_id,
				),
			)
		);
	}
}
