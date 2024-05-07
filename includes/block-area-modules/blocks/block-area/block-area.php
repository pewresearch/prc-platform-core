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

	public function hide_on_paged_for_all_non_menu_block_areas($block_area_name) {
		if ( ! preg_match('/menu/i', $block_area_name) && is_paged() ) {
			return true;
		}
		return false;
	}

	public function render_block_area($attributes, $content, $block) {
		if ( is_admin() ) {
			return $content;
		}
		$reference_id = array_key_exists('ref', $attributes) ? $attributes['ref'] : false;
		$block_area_slug = array_key_exists('blockAreaSlug', $attributes) ? $attributes['blockAreaSlug'] : null;
		$is_menu_block_area = preg_match('/menu/i', $block_area_slug);

		$taxonomy_name = array_key_exists('taxonomyName', $attributes) ? $attributes['taxonomyName'] : null;
		$taxonomy_term_slug = array_key_exists('taxonomyTermSlug', $attributes) ? $attributes['taxonomyTermSlug'] : null;
		$inherit_term_from_template = array_key_exists('inheritTermFromTemplate', $attributes) ? $attributes['inheritTermFromTemplate'] : false;

		do_action('qm/debug', print_r($attributes, true));

		$query_args = $this->get_query_args(
			$taxonomy_name,
			$taxonomy_term_slug,
			$block_area_slug,
			$inherit_term_from_template,
			$reference_id
		);

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

		$id = wp_unique_id('prc-platform-block-area-');

		$block_wrapper_attrs = get_block_wrapper_attributes([
			'data-wp-interactive' => wp_json_encode([
				'namespace' => 'prc-platform/block-area',
			]),
			'data-wp-context' => wp_json_encode([
				'blockAreaSlug' => $block_area_slug,
				'taxonomyName' => $taxonomy_name,
				'taxonomyTermSlug' => $taxonomy_term_slug,
				'inheritTermFromTemplate' => $inherit_term_from_template,
				'referenceId' => $reference_id,
				'isPaged' => is_paged(),
			]),
			'id' => $id,
			'data-wp-router-region' => $id,
			'data-is-paged' => is_paged() && !$is_menu_block_area ? 'true' : 'false',
		]);

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			$block_wrapper_attrs,
			$content,
		);
	}
}
