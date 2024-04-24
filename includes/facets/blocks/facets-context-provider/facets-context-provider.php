<?php
namespace PRC\Platform;

// Provides a block and php filter to wrap query blocks and block area modules to collect all story item id's from the content therein and then inject them into the query block post_not_in arg so that they dont repeat. This is a special block really only intended for dev use.
class Facets_Context_Provider {
	public static $handle = 'prc-platform-facets-context-provider';
	public $data = false;
	public $selected = array();

	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
			$loader->add_filter( 'pre_render_block', $this, 'hoist_facet_data_to_pre_render_stage', 10, 3 );
			$loader->add_filter( 'render_block_context', $this, 'add_facet_data_to_context', 10, 3 );
		}
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function block_init() {
		register_block_type( __DIR__ . '/build', array(
			'render_callback' => array( $this, 'render_block_callback' ),
		) );
	}

	/**
	 * Fetch the facets data ONCE and store it in memory. Later, we'll make this data accessible via block context in the add_facet_data_to_context method.
	 * @hook pre_render_block
	 * @param mixed $pre_render
	 * @param mixed $parsed_block
	 * @param mixed $parent_block_instance
	 * @return null
	 */
	public function hoist_facet_data_to_pre_render_stage($pre_render, $parsed_block, $parent_block_instance) {
		if ( 'prc-platform/facets-context-provider' === $parsed_block['blockName'] ) {
			global $wp_query;
			$facets_api = new Facets_API($wp_query->query);
			$this->data = $facets_api->query();
			$this->selected = $facets_api->selected_choices;
		}
		return null;
	}

	/**
	 * Get the facet data from memory and apply it to the block context for the context provider, facet template, and selected tokens blocks.
	 * @hook render_block_context
	 * @param mixed $context
	 * @return mixed
	 */
	public function add_facet_data_to_context($context, $parsed_block, $parent_block_instance) {
		if ( !in_array($parsed_block['blockName'], [
			'prc-platform/facets-context-provider',
			'prc-platform/facet-template',
			'prc-platform/selected-tokens',
		]) ) {
			return $context;
		}

		$context['facetsContextProvider'] = [
			'selected' => (object) $this->selected,
			'data' => $this->data,
			'isProcessing' => false,
			'isDisabled' => false,
			'prefetched' => [],
		];

		return $context;
	}

	public function render_block_callback($attributes, $content, $block) {
		wp_enqueue_script('wp-url');
		wp_enqueue_script('wp-api-fetch');

		wp_interactivity_state(
			'prc-platform/facets-context-provider',
			$block->context['facetsContextProvider']
		);

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			get_block_wrapper_attributes(array(
				'data-wp-interactive' => wp_json_encode(array(
					'namespace' => 'prc-platform/facets-context-provider'
				)),
				'data-wp-init' => 'callbacks.onInit',
				'data-wp-watch--on-selection' => 'callbacks.onSelection',
			)),
			$content,
		);
	}
}
