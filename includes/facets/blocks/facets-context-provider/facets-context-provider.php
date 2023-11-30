<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;
use WP_Term;
use WP_Post;

// Provides a block and php filter to wrap query blocks and block area modules to collect all story item id's from the content therein and then inject them into the query block post_not_in arg so that they dont repeat. This is a special block really only intended for dev use.
class Facets_Context_Provider {
	public static $handle = 'prc-platform-facets-context-provider';
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

	public $data = false;
	public $selected = array();

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
	 * Fetch the facets data once and store it in memory in the class.
	 * @hook pre_render_block
	 * @param mixed $pre_render
	 * @param mixed $parsed_block
	 * @param mixed $parent_block_instance
	 * @return null
	 */
	public function hoist_facet_data_to_pre_render_stage($pre_render, $parsed_block, $parent_block_instance) {
		if ( 'prc-platform/facets-context-provider' === $parsed_block['blockName'] ) {
			global $wp_query;
			$facets_api = new Facets_API(null);

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
		if ( !in_array($parsed_block['blockName'], array(
			'prc-platform/facets-context-provider',
			'prc-platform/facet-template',
			'prc-platform/selected-tokens',
		)) ) {
			return $context;
		}

		$context['facetsContextProvider'] = array(
			'selected' => (object) $this->selected,
			'data' => $this->data,
			'isProcessing' => false,
		);

		return $context;
	}

	public function render_block_callback($attributes, $content, $block) {
		// Store the facets data in global app state.
		// Hmmm this function may not concatenate correctly on VIP filesystem. We may need to use a different method.
		\wp_store(array(
			'state' => array(
				'facetsContextProvider' => $block->context['facetsContextProvider'],
			)
		));

		$initial_context = array(
			'isError' => false,
			'isProcessing' => false,
			'isDisabled' => false,
		);

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			get_block_wrapper_attributes(array(
				'data-wp-interactive' => true,
				'data-wp-context' => wp_json_encode(array('facetsContextProvider' => $initial_context)),
				'data-wp-init' => 'effects.facetsContextProvider.onInit',
				'data-wp-effect--on-selection' => 'effects.facetsContextProvider.onSelection'
			)),
			$content,
		);
	}
}
