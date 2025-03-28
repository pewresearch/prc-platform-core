<?php
namespace PRC\Platform;

class Scripts {
	// Note: These are public static properties so that they can be accessed from other classes and iterated over.
	public static $rest_endpoints = array();

	public function __construct( $loader = null ) {
		if ( null !== $loader ) {
			// Initialize component rest endpoints.
			$loader->add_action( 'init', $this, 'init_component_rest_endpoints' );
			// Enqueue scripts in the frontend.
			$loader->add_action( 'wp_enqueue_scripts', $this, 'init_first_party_scripts', 0 );
			$loader->add_action( 'wp_enqueue_scripts', $this, 'init_third_party_scripts', 0 );
			// Enqueue styles in the frontend.
			$loader->add_action( 'wp_enqueue_scripts', $this, 'init_third_party_styles', 0 );
			// Enqueue scripts in the admin area.
			$loader->add_action( 'admin_enqueue_scripts', $this, 'init_first_party_scripts', 0 );
			$loader->add_action( 'admin_enqueue_scripts', $this, 'init_third_party_scripts', 0 );
		}
	}

	/**
	 * Localize the firebase script, include apiKey, authDomain, etc..
	 */
	public function localize_firebase( $script_slug ) {
		$api_key         = \PRC_PLATFORM_FIREBASE_KEY;
		$auth_domain     = \PRC_PLATFORM_FIREBASE_AUTH_DOMAIN;
		$auth_db         = \PRC_PLATFORM_FIREBASE_AUTH_DB;
		$interactives_db = \PRC_PLATFORM_FIREBASE_INTERACTIVES_DB;
		$project_id      = \PRC_PLATFORM_FIREBASE_PROJECT_ID;
		wp_localize_script(
			$script_slug,
			'prcFirebaseConfig',
			array(
				'apiKey'      => $api_key,
				'authDomain'  => $auth_domain,
				'databaseURL' => $auth_db,
				'projectId'   => $project_id,
			)
		);
		wp_localize_script(
			$script_slug,
			'prcFirebaseInteractivesConfig',
			array(
				'apiKey'      => $api_key,
				'databaseURL' => $interactives_db,
				'projectId'   => $project_id,
			)
		);
	}

	/**
	 * Register first party scripts.
	 * Fires early, on wp_enqueue_scripts.
	 *
	 * @return void
	 */
	public function init_first_party_scripts() {
		// Get all folders in the blocks directory as an array.
		$directories = glob( plugin_dir_path( __FILE__ ) . 'build/@prc/*', GLOB_ONLYDIR );
		foreach ( $directories as $dir ) {
			$asset_file  = include $dir . '/index.asset.php';
			$script_name = basename( $dir );
			$script_slug = 'prc-' . $script_name;
			$script_src  = plugin_dir_url( __FILE__ ) . 'build/@prc/' . $script_name . '/index.js';

			wp_register_script(
				$script_slug,
				$script_src,
				$asset_file['dependencies'],
				$asset_file['version'],
				true
			);
		}
	}

	/**
	 * Register third party scripts.
	 * Fires early, on wp_enqueue_scripts.
	 *
	 * @return void
	 */
	public function init_third_party_scripts() {
		$directories = glob( plugin_dir_path( __FILE__ ) . 'build/third-party/*', GLOB_ONLYDIR );
		foreach ( $directories as $dir ) {
			$asset_file  = include $dir . '/index.asset.php';
			$script_name = basename( $dir );
			$script_slug = $script_name;
			$script_src  = plugin_dir_url( __FILE__ ) . 'build/third-party/' . $script_name . '/index.js';

			// Check if index.js file exists and register it if it does.
			if ( file_exists( $dir . '/index.js' ) ) {
				$script = wp_register_script(
					$script_slug,
					$script_src,
					$asset_file['dependencies'],
					$asset_file['version'],
					true
				);
				if ( ! is_wp_error( $script ) && 'firebase' === $script_slug ) {
					$this->localize_firebase( $script_slug );
				}
			}
		}
	}

	/**
	 * Register third party styles.
	 * Fires early, on wp_enqueue_scripts.
	 *
	 * @return void
	 */
	public function init_third_party_styles() {
		$directories = glob( plugin_dir_path( __FILE__ ) . 'build/third-party/*', GLOB_ONLYDIR );
		foreach ( $directories as $dir ) {
			$asset_file = include $dir . '/index.asset.php';
			$style_name = basename( $dir );
			$style_slug = $style_name;
			$style_src  = plugin_dir_url( __FILE__ ) . 'build/third-party/' . $style_name . '/style-index.css';

			// Check if style-index.css file exists and register it if it does.
			if ( file_exists( $dir . '/style-index.css' ) ) {
				$style = wp_register_style(
					$style_slug,
					$style_src,
					array(),
					$asset_file['version'],
					'screen'
				);
			}
		}
	}

	/**
	 * If a component has a class-wp-rest-api.php file, require it and add the endpoint to the rest_endpoints array.
	 */
	public function init_component_rest_endpoints() {
		$directories = glob( plugin_dir_path( __FILE__ ) . 'src/@prc/components/*', GLOB_ONLYDIR );
		foreach ( $directories as $dir ) {
			if ( file_exists( $dir . '/class-wp-rest-api.php' ) ) {
				require_once $dir . '/class-wp-rest-api.php';
				$namespace              = str_replace( '-', '_', basename( $dir ) );
				$class_name             = 'Rest_API_Endpoint';
				$full_class_name        = 'PRC\Platform\Scripts\\' . $namespace . '\\' . $class_name;
				$endpoint               = new $full_class_name();
				self::$rest_endpoints[] = $endpoint->get_endpoint();
			}
		}
	}
}
