<?php
namespace PRC\Platform;
use WP_Error, Kreait\Firebase\Factory;

/**
 * This class is a central method to configuring and interacting with the Firebase SDK.
 * We use Firebase extensively as an interactives data store, and as a way to manage user authentication.
 * If your application is writing simutaneously outside user data to a database, you should use Firebase, not MySQL.
 * Keep MYSQL for PRC data, use Firebase for outside user data.
 */
class Firebase {
	/**
	 * The handle for the firebase js module.
	 */
	public static $handle = '@prc/firebase';
	/**
	 * The instance of the Firebase SDK.
	 */
	public $instance;
	/**
	 * The database instance.
	 */
	public $db;
	/**
	 * The auth instance.
	 */
	public $auth;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $loader ) {
		$this->instance = ( new Factory() )->withServiceAccount($this->localize_server_side_credentials());
		$this->db = $this->instance->createDatabase();
		$this->auth = $this->instance->createAuth();
		$this->init($loader);
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action('init', $this, 'register_assets');
			$loader->add_filter('script_module_data_' . self::$handle, $this, 'localize_client_side_credentials');
		}
	}

	public function localize_server_side_credentials() {
		$environment = wp_get_environment_type();
		if ( 'production' === $environment ) {
			return file_get_contents( \WPCOM_VIP_PRIVATE_DIR . '/firebase-service-account-prod.json' );
		} else {
			return file_get_contents( \WPCOM_VIP_PRIVATE_DIR . '/firebase-service-account-staging.json' );
		}
	}

	public function localize_client_side_credentials($data) {
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
