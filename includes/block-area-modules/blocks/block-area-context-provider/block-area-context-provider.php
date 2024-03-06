<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;
use WP_Term;
use WP_Post;

// Provides a block and php filter to wrap query blocks and block area modules to collect all story item id's from the content therein and then inject them into the query block post_not_in arg so that they dont repeat. This is a special block really only intended for dev use.
class Block_Area_Context_Provider extends Block_Area_Modules {
	public $collected_story_item_ids = array();
	public static $handle = 'prc-platform-block-area-context-provider';
	public static $cache_key = 'prc_block_area_module_story_item_ids';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct() {}

	/**
	 * Register the Block Area Context Provider block.
	 * @hook init
	 */
	public function block_init() {
		register_block_type( __DIR__ . '/build', array(
			'render_callback' => array( $this, 'render_block_area' ),
		) );
	}

	/**
	 * Handles when Query blocks are used and they do not inherit WP_Query
	 * @hook render_block_context, 1
	 */
	public function construct_block_context( $context, $parsed_block, $parent_block_obj ) {
		if ( 'prc-platform/block-area-context-provider' !== $parsed_block['blockName'] ) {
			return $context;
		}
		$attrs = $this->recursive_block_search($parsed_block, 'prc-platform/block-area');
		if ( null === $attrs ) {
			return $context;
		}
		$block_area_slug = array_key_exists('blockAreaSlug', $attrs) ? $attrs['blockAreaSlug'] : null;
		$category_slug = array_key_exists('categorySlug', $attrs) ? $attrs['categorySlug'] : null;
		$this->query_block_module_for_story_items($block_area_slug, $category_slug);
		return $context;
	}

	/**
	 * Filter out story items that have already been used in the block area module from the main query.
	 * @hook pre_get_posts
	 * @param mixed $query
	 */
	public function execute_on_main_query($query) {
		if ( $query->is_archive() && $query->is_category() && $query->is_main_query() ) {
			// Wee neeed to standardized block-area-names
			// so on category page, it should be category-lede.
			$this->query_block_module_for_story_items('category-lede', $query->get_queried_object()->slug);

			$not_in = $query->get('post__not_in');

			$query->set('post__not_in', array_merge($not_in, $this->collected_story_item_ids));
		}
	}

	/**
	 * Handles when Query blocks are used and they do not inherit WP_Query
	 * @hook render_block_context, 100
	 * @param mixed $context
	 * @param mixed $parsed_block
	 * @param mixed $parent_block_obj
	 * @return mixed
	 */
	public function execute_block_context( $context, $parsed_block, $parent_block_obj ) {
		if ( 'core/post-template' === $parsed_block['blockName'] ) {
			$story_item_ids = $this->collected_story_item_ids;
			// Quit early if no story item ids.
			if ( ! is_array($story_item_ids) ) {
				return $context;
			}

			$query_args = $context['query'] ?? array();

			$default_pub_listing_args = apply_filters('prc_platform_pub_listing_default_args', null);

			// change the snake_case keys to camelCase
			$default_pub_listing_args = array_combine(array_map(function($key) {
				return lcfirst(str_replace('_', '', ucwords($key, '_')));
			}, array_keys($default_pub_listing_args)), array_values($default_pub_listing_args));

			// $query_args['inherit'] = false;

			$not_in = array_key_exists('post__not_in', $query_args) ? $query_args['post__not_in'] : array();

			$query_args['post__not_in'] = array_merge($not_in, $story_item_ids);

			$context['query'] = $query_args;
		}
		return $context;
	}

	public function render_block_area($attributes, $content, $block) {
		return $content;
	}

	public function recursive_block_search($block, $block_name) {
		if ( array_key_exists('blockName', $block) && $block['blockName'] === $block_name ) {
			return $block['attrs'];
		}
		if ( ! array_key_exists('innerBlocks', $block) ) {
			return null;
		}
		foreach ($block['innerBlocks'] as $inner_block) {
			$inner_block_attrs = $this->recursive_block_search($inner_block, $block_name);
			if ( null !== $inner_block_attrs ) {
				return $inner_block_attrs;
			}
		}
		return null;
	}

	public function get_cache_id($block_area_slug, $category_slug) {
		$to_return = md5( wp_json_encode( array($block_area_slug, $category_slug) ) );
		return $to_return;
	}

	public function query_block_module_for_story_items($block_area_slug = '', $category_slug = '') {
		$cache_id = $this->get_cache_id($block_area_slug, $category_slug);
		$cached = wp_cache_get($cache_id, self::$cache_key);

		if ( false !== $cached && !is_preview() ) {
			$this->collected_story_item_ids = $cached;
		} else {
			$query_args = $this->get_query_args($category_slug, $block_area_slug);

			$block_modules = new WP_Query($query_args);
			if ( $block_modules->have_posts() ) {
				$block_module_id = $block_modules->posts[0];

				$this->collected_story_item_ids = get_post_meta($block_module_id, '_story_item_ids', true);
			}
			wp_reset_postdata();

			wp_cache_set(
				$cache_id,
				$this->collected_story_item_ids,
				self::$cache_key,
				1 * HOUR_IN_SECONDS
			);
		}
	}

	/**
	 * Clear the cache when a block module is updated.
	 * @hook prc_platform_on_update
	 */
	public function clear_cache_on_block_module_saves($post) {
		if ( parent::$post_type !== $post->post_type ) {
			return;
		}

		$post_id = $post->ID;
		// get the category slugs for this post, quickly.
		$categories = wp_get_post_categories($post_id, array('fields' => 'slugs'));
		$category_slug = count($categories) > 0 ? $categories[0] : null;

		$block_areas = wp_get_post_terms($post_id, parent::$taxonomy, array('fields' => 'slugs'));
		$block_area_slug = count($block_areas) > 0 ? $block_areas[0] : null;

		$cache_id = $this->get_cache_id($block_area_slug, $category_slug);

		return wp_cache_delete($cache_id, self::$cache_key);
	}
}
