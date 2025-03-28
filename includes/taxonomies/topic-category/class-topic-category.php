<?php
namespace PRC\Platform;

use WP_Error;

/**
 * The "Category" core taxonomy as our "Topic" taxonomy.
 *
 * @package PRC\Platform
 */
class Topic_Category extends Taxonomies {
	/**
	 * The taxonomy slug.
	 *
	 * @var string
	 */
	protected static $taxonomy = 'category';

	/**
	 * The handle for the category taxonomy.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-category-taxonomy';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'init', $this, 'enforce_category_permalink_structure' );
		$loader->add_filter( 'register_taxonomy_args', $this, 'change_category_labels_to_topic', 10, 2 );
		$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_category_name_change_script' );
	}

	/**
	 * @TODO: add this to the plugin activation hook, when we get around to building that.
	 * @return void
	 */
	public function enforce_category_permalink_structure() {
		update_option( 'category_base', 'topic' );
	}

	/**
	 * On the primary site we want to change the vernacular of "Categories" to "Topics".
	 *
	 * @param mixed $args
	 * @param mixed $taxonomy
	 * @return mixed
	 */
	public function change_category_labels_to_topic( $args, $taxonomy ) {
		if ( 1 === get_current_blog_id() ) {
			return $args;
		}
		if ( $taxonomy === self::$taxonomy ) {
			$args['labels']                               = array();
			$args['labels']['name']                       = 'Topics';
			$args['labels']['singular_name']              = 'Topic';
			$args['labels']['menu_name']                  = 'Topics';
			$args['labels']['all_items']                  = 'All Topics';
			$args['labels']['edit_item']                  = 'Edit Topic';
			$args['labels']['view_item']                  = 'View Topic';
			$args['labels']['update_item']                = 'Update Topic';
			$args['labels']['add_new_item']               = 'Add New Topic';
			$args['labels']['new_item_name']              = 'New Topic Name';
			$args['labels']['parent_item']                = 'Parent Topic';
			$args['labels']['search_items']               = 'Search Topics';
			$args['labels']['popular_items']              = 'Popular Topics';
			$args['labels']['separate_items_with_commas'] = 'Separate topics with commas';
			$args['labels']['add_or_remove_items']        = 'Add or remove topics';
			$args['labels']['choose_from_most_used']      = 'Choose from the most used topics';
			$args['labels']['not_found']                  = 'No topics found';
			$args['labels']['no_terms']                   = 'No topics';
		}
		return $args;
	}

	public function register_category_name_change_filters() {
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
			return new WP_Error( self::$handle, 'Failed to register all category name change assets' );
		}

		return true;
	}

	public function enqueue_category_name_change_script() {
		if ( 1 === get_current_blog_id() ) {
			return null;
		}
		$registered = $this->register_category_name_change_filters();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}
}
