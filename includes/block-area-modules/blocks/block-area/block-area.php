<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;
use WP_Term;
use WP_Post;

class Block_Area extends Block_Area_Modules {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct() {}

	public function block_init() {
		register_block_type( __DIR__ . '/build', array(
			'render_callback' => array( $this, 'render_block_area' ),
		) );
	}

	public function render_block_area($attributes, $content, $block) {
		if ( is_paged() ) {
			return;
		}
		$reference_id = array_key_exists('ref', $attributes) ? $attributes['ref'] : false;
		$block_area_slug = array_key_exists('blockAreaSlug', $attributes) ? $attributes['blockAreaSlug'] : null;
		$category_slug = array_key_exists('categorySlug', $attributes) ? $attributes['categorySlug'] : null;
		$inherit_category = array_key_exists('inheritCategory', $attributes) ? $attributes['inheritCategory'] : false;

		$query_args = $this->get_query_args($category_slug, $block_area_slug, $inherit_category, $reference_id);

		$block_modules = new WP_Query($query_args);
		if ( $block_modules->have_posts() ) {
			$block_module_id = $block_modules->posts[0];
			$block_module = get_post($block_module_id);
			$content = $block_module instanceof WP_Post ? apply_filters(
				'the_content',
				$block_module->post_content,
			) : $content;
		}

		wp_reset_postdata();

		return $content;
	}
}
