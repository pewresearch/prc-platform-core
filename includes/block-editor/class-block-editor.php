<?php
/**
 * The block editor class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_Error;

/**
 * The block editor class.
 */
class Block_Editor {

	/**
	 * The handle for the block editor.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-block-editor';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader       The loader object.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param object $loader The loader object.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_filter( 'block_categories_all', $this, 'enforce_block_categories', 100, 2 );
		}
	}

	/**
	 * Enforce the block categories.
	 *
	 * @hook block_categories_all
	 * @param array                   $block_categories The block categories.
	 * @param WP_Block_Editor_Context $block_editor_context The block editor context.
	 * @return array
	 */
	public function enforce_block_categories( $block_categories, $block_editor_context ) {
		$post_type = get_post_type( $block_editor_context->post );

		// Newsletter Glue is spilling over into other post types. We need to filter it out.
		if ( 'newsletterglue' !== $post_type ) {
			return array_filter(
				$block_categories,
				function ( $category_slug ) {
					return ! in_array(
						$category_slug,
						array(
							'newsletterglue-blocks',
							'newsletterglue-legacy',
						)
					);
				}
			);
		}

		return $block_categories;
	}


	/**
	 * Register the assets.
	 *
	 * @return bool|WP_Error
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			self::$handle,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * Rather than disabling variations one by one we're going to assume ALL should be disabled and instead these should be enabled.
	 *
	 * @return array
	 */
	public function allowed_embed_variations() {
		$allowed_embed_variations = array(
			'youtube',
			'vimeo',
			'twitter',
			'facebook',
			'instagram',
			'wordpress',
			'soundcloud',
			'flickr',
			'crowdsignal',
			'reddit',
			'imgur',
			'issuu',
			'screencast',
			'scribd',
			'slideshare',
			'speaker-deck',
			'tiktok',
			'ted',
			'tumblr',
			'videopress',
			'wordpress-tv',
			'wolfram-cloud',
		);

		return apply_filters( 'prc_platform_block_editor_allowed_embed_variations', $allowed_embed_variations );
	}

	/**
	 * Enqueue the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_localize_script(
				self::$handle,
				'prcPlatform',
				array(
					'siteUrl' => get_site_url(),
				)
			);
			wp_enqueue_script( self::$handle );
		}
	}
}
