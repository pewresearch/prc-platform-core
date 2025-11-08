<?php
/**
 * Script Modules class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_REST_Request, WP_Error, WP_Query, WP_User_Query, WP_Term_Query;

define( 'PRC_MODULES_DIR_PATH', __DIR__ );

/**
 * Script Modules class.
 *
 * @package PRC\Platform
 */
class Script_Modules {
	/**
	 * Array of module slugs.
	 *
	 * @var array
	 */
	public static $module_slugs = array();

	/**
	 * Constructor.
	 *
	 * @param WP_Scripts $loader The loader object.
	 */
	public function __construct( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'wp_enqueue_scripts', $this, 'init_modules', 0 );
		}
	}

	/**
	 * Register modules.
	 * Fires early, on wp_enqueue_scripts.
	 *
	 * @return void
	 */
	public function init_modules() {
		$directories = glob( plugin_dir_path( __FILE__ ) . 'modules/*', GLOB_ONLYDIR );
		foreach ( $directories as $dir ) {
			$module_name = basename( $dir );

			$dir = $dir . '/build';
			// get contents of index.asset.php file from $dir
			$asset_file = include $dir . '/module.min.asset.php';

			$module_slug = '@prc/' . $module_name;
			$module_src  = plugin_dir_url( __FILE__ ) . 'modules/' . $module_name . '/build/module.min.js';

			// Check if index.js file exists and register it if it does.
			if ( file_exists( $dir . '/module.js' ) ) {
				$module = wp_register_script_module(
					$module_slug,
					$module_src,
					$asset_file['dependencies'],
					$asset_file['version'],
				);
				if ( ! is_wp_error( $module ) ) {
					self::$module_slugs[] = $module_slug;
				}
			}
		}
	}
}
