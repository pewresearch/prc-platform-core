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
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action('enqueue_block_editor_assets', $this, 'enqueue_assets');
		}
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';

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
			wp_enqueue_script( self::$handle );
		}
	}
}
