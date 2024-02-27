<?php
namespace PRC\Platform;

/**
 * Block Name:        Facet Selected Tokens
 * Description:       Display a list of selected, active facets as tokens
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Seth Rubenstein
 *
 * @package           prc-platform
 */

class Loader_Block extends Interactives {
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
		}
	}

	/**
	 * Loads the necessary script and attachment markup for an interactive to load on the front end.
	 * @param mixed $attributes
	 * @param mixed $content
	 * @param mixed $block
	 * @return string
	 */
	public function render_interactive_loader_callback($attributes, $content, $block) {
		if ( is_admin() ) {
			return;
		}

		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'id' => "js-{$attributes['slug']}"
		));

		$is_legacy_wpackio = array_key_exists('legacyWpackIo', $attributes) && $attributes['legacyWpackIo'];
		$is_legacy_s3 = array_key_exists('legacyAssetsS3', $attributes) && $attributes['legacyAssetsS3'];

		$enqueued_handles = array();
		if ( $is_legacy_wpackio ) {
			wp_enqueue_script('firebase');
			$enqueued_handles = $this->load_legacy_wpackIO($attributes['legacyWpackIo']);
		} else if ( $is_legacy_s3 ) {
			// Do nothing for now...
			// @TODO: Build out the legacy assets S3 loader.
		} else {
			$enqueued_handles = $this->load($attributes['slug']);
		}

		// we need to remove the wpackio stuff when we're loading on the main frontend, that should only load on an iframe...

		do_action('prc_platform_interactive_loader_enqueue', $enqueued_handles, $is_legacy_wpackio);

		$url_rewrites = $this->get_rewrites_params();

		if ( $url_rewrites ) {
			do_action('qm/debug', 'URL REWRITES:'.print_r($url_rewrites, true));

			// We want to localize whatever script the loader returns.
			// $enqueued_handles['script'];
			$script_handle =
			'prc-platform-interactive-' . $attributes['slug'];
			if ( $is_legacy_wpackio ) {
				$script_handle = $enqueued_handles['script'];
			}
			// Use wp_add_inline_script to localize the script instead of wp_localize_script because we want to add the data before the script is enqueued and we want to support multiple localizations for the same script.
			wp_add_inline_script(
				$script_handle,
				'if ( typeof prcURLVars === "undefined" ) { var prcURLVars = {}; } prcURLVars = ' . wp_json_encode($url_rewrites) . ';',
				'before'
			);
		}

		$content = wp_sprintf(
			'<div %1$s>%2$s</div>',
			$block_wrapper_attrs,
			wp_json_encode($attributes),
		);

		// Allow for filtering of the interactive content by other plugins.
		return apply_filters(
			'prc_platform_interactive_loader_content',
			$content,
			$attributes,
			$is_legacy_wpackio
		);
	}

	public function block_init() {
		register_block_type(
			__DIR__ . '/build',
			array(
				'render_callback' => array( $this, 'render_interactive_loader_callback' ),
			)
		);
	}
}
