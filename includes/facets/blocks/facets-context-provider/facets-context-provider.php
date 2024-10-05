<?php
namespace PRC\Platform;

/**
 * This class is responsible for providing both a server level and client level context for facets data. This supplies facet data to innerblocks within. The server level context is used to pre-fetch data and the client level context is used to manage the state of the facets.
 */
class Facets_Context_Provider {
	public static $handle = 'prc-platform-facets-context-provider';
	public $facets = false;
	public $pagination = false;
	public $selected = [];

	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
			$loader->add_filter( 'pre_render_block', $this, 'hoist_facet_data_to_pre_render_stage', 10, 3 );
			$loader->add_filter( 'render_block_context', $this, 'add_facet_data_to_context', 10, 2 );
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
	 * Fetch the facets data ONCE and store on server memory. Later, we'll make this data accessible via block context in the add_facet_data_to_context method.
	 * @hook pre_render_block
	 * @param mixed $pre_render
	 * @param mixed $parsed_block
	 * @param mixed $parent_block_instance
	 * @return null
	 */
	public function hoist_facet_data_to_pre_render_stage($pre_render, $parsed_block, $parent_block_instance) {
		if ( 'prc-platform/facets-context-provider' === $parsed_block['blockName'] ) {
			global $wp_query;
			if ( Facets::use_ep_facets() ) {
				$facets_api = new ElasticPress_Facets_API($wp_query->query);
				$this->facets = $facets_api->get_facets();
				$this->pagination = $facets_api->get_pagination();
				$this->selected = $facets_api->selected;
			} else {
				$facetwp_api = new FacetWP_API($wp_query->query);
				$this->facets = $facetwp_api->get_facets();
				$this->pagination = $facetwp_api->get_pagination();
				$this->selected = $facetwp_api->selected;
			}
		}
		return null;
	}

	/**
	 * Get the facet data from server memory and apply it to the block context for the context provider, facet template, and selected tokens blocks.
	 * @hook render_block_context
	 * @param mixed $context
	 * @return mixed
	 */
	public function add_facet_data_to_context($context, $parsed_block) {
		if ( !in_array($parsed_block['blockName'], [
			'prc-platform/facets-context-provider',
			'prc-platform/facet-template',
		]) ) {
			return $context;
		}

		$context['prc-platform/facets-context-provider'] = [
			'selected' => (object) $this->selected,
			'facets' => $this->facets,
			'pagination' => $this->pagination,
			'prefetched' => [],
			'isProcessing' => false,
			'isDisabled' => false,
			'urlKey' => Facets::use_ep_facets() ? 'ep_filter_' : '_', // This is the key that is used to store the facet data in the url.
		];

		return $context;
	}

	public function render_block_callback($attributes, $content, $block) {
		wp_enqueue_script('wp-url');
		wp_enqueue_script('wp-api-fetch');

		// Add facet data into client memory.
		wp_interactivity_state(
			'prc-platform/facets-context-provider',
			$block->context['prc-platform/facets-context-provider']
		);

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			get_block_wrapper_attributes([
				'data-wp-interactive' => wp_json_encode([
					'namespace' => 'prc-platform/facets-context-provider'
				]),
				'data-wp-init' => 'callbacks.onInit',
				'data-wp-watch--on-selection' => 'callbacks.onSelection',
				'data-wp-watch--on-ep-sort-by-update' => 'callbacks.onEpSortByUpdate',
				'data-wp-class--is-processing' => 'state.isProcessing',
			]),
			$content,
		);
	}
}
