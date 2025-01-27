<?php
namespace PRC\Platform;

use WP_Error;

class Block_Editor {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-block-editor';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init( $loader );
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_filter( 'block_categories_all', $this, 'enforce_block_categories', 100, 2 );
		}
	}

	/**
	 * @hook block_categories_all
	 * @param array $categories
	 * @return array
	 */
	public function enforce_block_categories( $block_categories, $block_editor_context ) {
		$post_type = get_post_type( $block_editor_context->post );
		// Newsletter Glue is spilling over into other post types. We need to filter it out.
		if ( $post_type !== 'newsletterglue' ) {
			$updated = array_filter(
				$block_categories,
				function ( $category ) {
					return $category['slug'] !== 'newsletterglue-blocks' && $category['slug'] !== 'newsletterglue-legacy';
				}
			);
			return $updated;
		}
		return $block_categories;
	}


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
	 * Rather than disabling variations one by one we're going to assume ALL should be disabled and instead these should be whitelisted.
	 *
	 * @return void
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
