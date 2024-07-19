<?php
namespace PRC\Platform;
use WP_Error;

class Firebase {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;
	public static $instance;
	public static $handle = '@prc/firebase';

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

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action('init', $this, 'register_assets');
			$loader->add_filter('script_module_data_' . self::$handle, $this, 'localize_firebase');
		}
	}

	public function localize_firebase($data) {
		$api_key       = \PRC_PLATFORM_FIREBASE_KEY;
		$auth_domain   = \PRC_PLATFORM_FIREBASE_AUTH_DOMAIN;
		$auth_db       = \PRC_PLATFORM_FIREBASE_AUTH_DB;
		$project_id    = \PRC_PLATFORM_FIREBASE_PROJECT_ID;
		$data['apiKey'] = $api_key;
		$data['authDomain'] = $auth_domain;
		$data['databaseURL'] = $auth_db;
		$data['projectId'] = $project_id;
		return $data;
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/module.min.asset.php' );
		$asset_slug = self::$handle;
		$module_src  = plugin_dir_url( __FILE__ ) . 'build/module.min.js';

		$module = wp_register_script_module(
			$asset_slug,
			$module_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $module ) {
			return new WP_Error( self::$handle, 'Failed to register all assets for Firebase module' );
		}

		return true;
	}
}
