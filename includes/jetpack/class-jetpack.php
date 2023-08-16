<?php
namespace PRC\Platform;
use WP_Error;

class Jetpack {
	public static $disallowed_modules = array(
		'sso',
	);
	public static $disallowed_extensions = array(
		'ai-assistant',
		'ai-assistant-support',
		'blogging-prompt',
		'calendly',
		'business-hours',
		'google-calendar',
		'instagram-gallery',
		'opentable',
		'payments',
		'pinterest',
		'premium-content',
		'rating-star',
		'recurring-payments',
		'simple-payments',
		'tock',
		'wordads',
		'payments-intro',
		'payment-buttons',
	);
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-jetpack';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
     * Filter Jetpack extensions.
	 *
	 * For now we're just disabling ai-assistant and ai-assistant-support.
     *
     * @param array $extensions Jetpack extensions array.
     * @return array updated extensions array.
     */
	public function set_available_jetpack_extensions( $extensions ){
        return array_filter(
            $extensions,
            function($extension) {
				return ! in_array(
					$extension,
					self::$disallowed_extensions
				);
			}
        );
    }

	/**
	 * Disable Jetpack modules
	 * @hook option_jetpack_active_modules
	 */
	public function set_available_jetpack_modules( $modules ) {
		return array_filter(
			$modules,
			function($module) {
				return ! in_array(
					$module,
					self::$disallowed_modules
				);
			}
		);
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}
}
