<?php
namespace PRC\Platform;

use WP_HTML_Tag_Processor;
use WP_Error;

class Icon_Loader {
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

	public $handle = 'prc-platform-icons-loader';

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

	public function register_icon_loader_script($register_prc_icons = true) {
		$asset_file = include(  plugin_dir_path( __FILE__ )  . 'build/loader/index.asset.php' );
		$dependencies = $asset_file['dependencies'];
		if ( false === $register_prc_icons ) {
			$dependencies = array_filter($dependencies, function($handle) {
				return $handle !== 'prc-icons';
			});
		}

		$registered = wp_register_script(
			$this->handle,
			plugins_url( 'build/loader/index.js', __FILE__ ),
			$dependencies,
			$asset_file['version'],
			array(
				'in_footer' => true,
				'strategy' => 'defer',
			),
		);

		return $registered;
	}

	public function register_icon_library_fallback_script() {
		$asset_file = include(  plugin_dir_path( __FILE__ )  . 'build/library-fallback/index.asset.php' );

		$registered = wp_register_script(
			'prc-icons',
			plugins_url( 'build/library-fallback/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
			array(
				'in_footer' => true,
				'strategy' => 'defer',
			),
		);

		return $registered;
	}

	/**
	 * @hook enqueue_block_assets
	 * @return void
	 */
	public function enqueue_icon_loader($register_prc_icons = true) {
		if ( !wp_script_is( $this->handle, 'enqueued' ) ) {
			$this->register_icon_loader_script($register_prc_icons);
		}
		wp_enqueue_script( $this->handle );
	}

	/**
	 * Quick fallback check, if the icon library is not registered then we should change the handle of the loader to match. This will allow other platform plugins that are dependent on prc-icons to load but use the fallback (empty) icon set.
	 * @hook enqueue_block_assets
	 * @return void
	 */
	public function enqueue_icon_library_fallback() {
		if ( !wp_script_is( 'prc-icons', 'enqueued' ) ) {
			$this->register_icon_library_fallback_script();
			wp_enqueue_script( 'prc-icons' );
		}
	}
}
