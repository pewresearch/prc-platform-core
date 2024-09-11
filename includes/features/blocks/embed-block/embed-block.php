<?php
namespace PRC\Platform;

/**
 * Block Name:        Feature Embed Block
 * Description:       A block that embeds a feature elsewhere on the site.
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Ben Wormald
 *
 * @package           prc-platform
 */

class Embed_Block extends Features {
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
		}
	}

	// TODO: This exact function is being used at least in 3 places (feature, chart, data table). Maybe let's centralize?.
	public function render_synced_feature( $attributes, $content ) {
		if ( is_admin() ) {
			return;
		}
		static $seen_refs = array();
		if ( empty( $attributes['ref'] ) ) {
			return '';
		}
		$synced_feature = get_post( $attributes['ref'] );
		// if there is no post, or the post is not a feature, return an empty string
		if ( ! $synced_feature || self::$post_type !== $synced_feature->post_type ) {
			return '';
		}

		if ( isset( $seen_refs[ $attributes['ref'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]' ) :
				'';
		}
		// if the post is not published or is password protected, return an empty string
		if ( 'publish' !== $synced_feature->post_status || ! empty( $synced_feature->post_password ) ) {
			return '';
		}

		$seen_refs[ $attributes['ref'] ] = true;

		// Handle embeds
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $synced_feature->post_content );
		$content = $wp_embed->autoembed( $content );

		$content = do_blocks( $content );
		// remove the reference from the seen_refs array
		unset( $seen_refs[ $attributes['ref'] ] );
		return $content;
	}

	public function block_init() {
		register_block_type(
			__DIR__ . '/build',
			array(
				'render_callback' => array( $this, 'render_synced_feature' ),
			)
		);
	}
}
