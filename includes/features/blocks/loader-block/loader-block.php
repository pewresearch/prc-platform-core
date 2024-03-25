<?php
namespace PRC\Platform;

/**
 * Block Name:        Feature Loader Block
 * Description:       A block that loads a feature on the front end.
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Seth Rubenstein
 *
 * @package           prc-platform
 */

class Loader_Block extends Features {
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
		}
	}

	/**
	 * Loads the necessary script and attachment markup for an feature to load on the front end.
	 * @param mixed $attributes
	 * @param mixed $content
	 * @param mixed $block
	 * @return string
	 */
	public function render_feature_loader_callback($attributes, $content, $block) {
		if ( is_admin() ) {
			return;
		}

		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'id' => "js-{$attributes['slug']}"
		));
		$is_legacy_wpackio = array_key_exists('legacyWpackIo', $attributes) && $attributes['legacyWpackIo'];
		$is_legacy_s3 = array_key_exists('legacyS3', $attributes) && $attributes['legacyS3'];

		$enqueued_handles = array();

		if ( $is_legacy_wpackio ) {
			wp_enqueue_script('firebase');
			// try to load the legacy wpackio, and if it fails, then log the error and return.
			try {
				$enqueued_handles = $this->load_legacy_wpackIO($attributes['legacyWpackIo']);
			} catch ( \Exception $e ) {
				if ( function_exists( 'wp_sentry_safe' ) ) {
					wp_sentry_safe( function ( \Sentry\State\HubInterface $client ) use ( $e ) {
						$client->withScope(function (\Sentry\State\Scope $scope) use ($client, $e) {
							$scope->setTag('interactive_type', 'wpackio');
							$client->captureException($e);
						});
					} );
				}
				return;
			}
		} elseif( $is_legacy_s3 ) {
			$enqueued_handles = $this->load_legacy_S3($attributes['legacyS3']);
		} else {
			$enqueued_handles = $this->load($attributes['slug']);
		}

		// we need to remove the wpackio stuff when we're loading on the main frontend, that should only load on an iframe...

		do_action('prc_platform_feature_loader_enqueue', $enqueued_handles, array(
			'is_legacy' => $is_legacy_wpackio || $is_legacy_s3,
		));

		$url_rewrites = $this->get_rewrites_params();

		if ( $url_rewrites ) {
			$script_handle =
			'prc-platform-feature-' . $attributes['slug'];
			if ( $is_legacy_wpackio || $is_legacy_s3 ) {
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

		// Allow for filtering of the feature content by other plugins.
		return apply_filters(
			'prc_platform_feature_loader_content',
			$content,
			$attributes,
			$is_legacy_wpackio
		);
	}

	public function block_init() {
		register_block_type(
			__DIR__ . '/build',
			array(
				'render_callback' => array( $this, 'render_feature_loader_callback' ),
			)
		);
	}
}
