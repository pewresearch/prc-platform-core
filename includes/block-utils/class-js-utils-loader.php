<?php
/**
 * JS Utils Loader
 *
 * @package PRC\Platform
 */

namespace PRC\Platform\Block_Utils;

/**
 * FOR EVERY PHP UTIL THERE MUST BE AN ACCOMPANYING JS UTIL
 *
 * @return void
 */
class JS_Utils_Loader {
	/**
	 * The handle for the JS utils.
	 *
	 * @var string
	 */
	public static $handle = 'prc-block-utils';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader    The loader.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader    The loader.
	 */
	public function init( $loader ) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'register_assets_for_use', 10, 1 );
		}
	}

	/**
	 * Register the assets for use.
	 *
	 * @return void
	 */
	public function register_assets_for_use() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

		wp_register_script(
			self::$handle,
			plugins_url( 'build/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
		);
	}
}
