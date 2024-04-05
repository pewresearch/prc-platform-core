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

	public function add_admin_menu_quick_edit($block_module) {
		global $wp_admin_bar;
		$block_module_id = $block_module->ID;
		$block_module = get_post($block_module_id);
		$edit_link = get_edit_post_link($block_module_id);
		$title = ucfirst($block_module->post_name);
		// remove all characters EXCEPT "menu", "lede", "bottom" from $title
		$title = preg_replace('/\b(?!menu|lede|bottom)\w+\b/', '', $title);
		$title = preg_replace('/[^a-zA-Z0-9]/', '', $title);
		$title = ucfirst($title);

		$wp_admin_bar->add_node(array(
			'parent' => 'edit',
			'id' => $block_module->post_name,
			'title' => __("Edit {$title}"),
			'href' => $edit_link,
			'meta' => array(
				'title' => __("Edit {$title} of Taxonomy Block"),
			),
		));
	}

	public function render_block_area($attributes, $content, $block) {
		$reference_id = array_key_exists('ref', $attributes) ? $attributes['ref'] : false;
		$block_area_slug = array_key_exists('blockAreaSlug', $attributes) ? $attributes['blockAreaSlug'] : null;
		$category_slug = array_key_exists('categorySlug', $attributes) ? $attributes['categorySlug'] : null;
		$inherit_category = array_key_exists('inheritCategory', $attributes) ? $attributes['inheritCategory'] : false;

		$query_args = $this->get_query_args($category_slug, $block_area_slug, $inherit_category, $reference_id);

		$block_modules = new WP_Query($query_args);
		if ( $block_modules->have_posts() ) {
			$block_module_id = $block_modules->posts[0];
			$block_module = get_post($block_module_id);
			$this->add_admin_menu_quick_edit($block_module);
			$content = $block_module instanceof WP_Post ? apply_filters(
				'the_content',
				$block_module->post_content,
			) : $content;
		}

		wp_reset_postdata();

		return $content;
	}
}
