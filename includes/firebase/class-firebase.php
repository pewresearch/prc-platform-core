<?php
/**
 * Firebase SDK integration class for PRC Platform.
 *
 * This file contains the Firebase class which provides a central method for
 * configuring and interacting with the Firebase SDK.
 *
 * @package PRC\Platform
 * @since   1.0.0
 */

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
	 *
	 * @var string
	 */
	public static $handle = '@prc/firebase';

	/**
	 * The instance of the Firebase SDK.
	 *
	 * @var \Kreait\Firebase\Factory|null
	 */
	public $instance;

	/**
	 * The database instance.
	 *
	 * @var \Kreait\Firebase\Database|null
	 */
	public $db;

	/**
	 * The auth instance.
	 *
	 * @var \Kreait\Firebase\Auth|null
	 */
	public $auth;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param mixed $loader The loader instance for registering hooks.
	 */
	public function __construct( $loader = null ) {
		// Check if the Kreait Firebase library exists.
		if ( ! class_exists( 'Kreait\Firebase\Factory' ) ) {
			do_action( 'qm/critical', 'Kreait Firebase library not found. Firebase functionality will be disabled.' );
			return;
		}

		$credentials = $this->localize_server_side_credentials();
		if ( ! is_wp_error( $credentials ) ) {
			$this->instance = ( new Factory() )->withServiceAccount( $credentials );
			$this->db       = $this->instance->createDatabase();
			$this->auth     = $this->instance->createAuth();
			$this->init( $loader );
		} else {
			do_action( 'qm/critical', 'Firebase API can not initialize without service account credentialsl. Some platform features will not work.' );
		}
	}

	/**
	 * Initialize Firebase hooks and filters.
	 *
	 * @since 1.0.0
	 * @param mixed $loader The loader instance for registering hooks.
	 * @return void
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_assets' );
			$loader->add_filter( 'script_module_data_' . self::$handle, $this, 'localize_client_side_credentials' );
		}
	}

	/**
	 * Provide the Firebase service account credentials to the server side SDK.
	 *
	 * @since 1.0.0
	 * @return string|WP_Error The service account credentials or an error if the file does not exist.
	 */
	public function localize_server_side_credentials() {
		if ( ! defined( 'WPCOM_VIP_PRIVATE_DIR' ) ) {
			return new WP_Error( 'firebase_service_account', 'WPCOM_VIP_PRIVATE_DIR is not defined.' );
		}
		$environment = wp_get_environment_type();
		// $environment          = 'production';
		$service_account_file = ( 'production' === $environment )
			? \WPCOM_VIP_PRIVATE_DIR . '/firebase-service-account-prod.json'
			: \WPCOM_VIP_PRIVATE_DIR . '/firebase-service-account-staging.json';

		if ( ! file_exists( $service_account_file ) ) {
			return new WP_Error( 'firebase_service_account', 'Service account file does not exist.' );
		}

		$credentials = file_get_contents( $service_account_file );

		if ( false === $credentials ) {
			return new WP_Error( 'firebase_service_account', 'Failed to read service account file.' );
		}

		return $credentials;
	}

	/**
	 * Adds the server side credentials to the client side SDK.
	 *
	 * @since 1.0.0
	 * @param array $data The data to localize.
	 * @return array The data with the server side credentials added.
	 */
	public function localize_client_side_credentials( $data ) {
		// Sanity checks to ensure that the constants are defined.
		if ( ! defined( 'PRC_PLATFORM_FIREBASE_KEY' ) && ! defined( 'PRC_PLATFORM_FIREBASE_KEY__DEV' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_FIREBASE_AUTH_DOMAIN' ) && ! defined( 'PRC_PLATFORM_FIREBASE_AUTH_DOMAIN__DEV' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_FIREBASE_AUTH_DB' ) && ! defined( 'PRC_PLATFORM_FIREBASE_AUTH_DB__DEV' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_FIREBASE_INTERACTIVES_DB' ) && ! defined( 'PRC_PLATFORM_FIREBASE_INTERACTIVES_DB__DEV' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_FIREBASE_PROJECT_ID' ) && ! defined( 'PRC_PLATFORM_FIREBASE_PROJECT_ID__DEV' ) ) {
			return;
		}
		$environment = wp_get_environment_type();
		// $environment = 'production';

		$api_key     = 'production' === $environment ? \PRC_PLATFORM_FIREBASE_KEY : \PRC_PLATFORM_FIREBASE_KEY__DEV;
		$auth_domain = 'production' === $environment ? \PRC_PLATFORM_FIREBASE_AUTH_DOMAIN : \PRC_PLATFORM_FIREBASE_AUTH_DOMAIN__DEV;
		$auth_db     = 'production' === $environment ? \PRC_PLATFORM_FIREBASE_AUTH_DB : \PRC_PLATFORM_FIREBASE_AUTH_DB__DEV;
		$project_id  = 'production' === $environment ? \PRC_PLATFORM_FIREBASE_PROJECT_ID : \PRC_PLATFORM_FIREBASE_PROJECT_ID__DEV;

		$data['apiKey']      = $api_key;
		$data['authDomain']  = $auth_domain;
		$data['databaseURL'] = $auth_db;
		$data['projectId']   = $project_id;

		return $data;
	}

	/**
	 * Register Firebase JavaScript module assets.
	 *
	 * @since 1.0.0
	 * @return bool|WP_Error True on success, WP_Error on failure.
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/module.min.asset.php';
		// If no asset file found, return early.
		if ( ! $asset_file ) {
			return new WP_Error( self::$handle, 'Failed to load asset file for Firebase module' );
		}

		$asset_slug = self::$handle;
		$module_src = plugin_dir_url( __FILE__ ) . 'build/module.min.js';

		$module = wp_register_script_module(
			$asset_slug,
			$module_src,
			$asset_file['dependencies'],
			$asset_file['version'],
		);

		if ( ! $module ) {
			return new WP_Error( self::$handle, 'Failed to register all assets for Firebase module' );
		}

		return true;
	}
}
