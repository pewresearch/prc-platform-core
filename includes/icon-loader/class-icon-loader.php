<?php
/**
 * Icon Loader
 * This class is responsible for loading the icon library and making it available to the block editor.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Icon Loader
 */
class Icon_Loader {

	/**
	 * The handle for this plugin's assets.
	 *
	 * @access public
	 * @var string
	 */
	public $handle = 'prc-icons';

	/**
	 * Constructor
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'icon-render.php';
		$this->init( $loader );
	}

	/**
	 * Initialize the icon loader class.
	 *
	 * @param object $loader The loader object.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_assets', $this, 'enqueue_icon_loader', 10 );
		}
	}

	/**
	 * Register the icon loader's assets. This includes a React component <Icon/> available via @prc/icons package.
	 */
	public function register_icon_loader_assets() {
		$asset_file   = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$dependencies = $asset_file['dependencies'];

		$script = wp_register_script(
			$this->handle,
			plugins_url( 'build/index.js', __FILE__ ),
			$dependencies,
			$asset_file['version'],
			array(
				'in_footer' => true,
				'strategy'  => 'defer',
			),
		);

		$style = wp_register_style(
			$this->handle,
			plugins_url( 'build/style-index.css', __FILE__ ),
			array(),
			$asset_file['version'],
		);

		return array(
			'script' => $script,
			'style'  => $style,
		);
	}

	/**
	 * Enqueue the icon loader assets.
	 *
	 * @hook enqueue_block_assets
	 * @param bool $register_prc_icons Whether to register the PRC icons library.
	 * @return void
	 */
	public function enqueue_icon_loader( $register_prc_icons = true ) {
		if ( ! wp_script_is( $this->handle, 'enqueued' ) || ! wp_style_is( $this->handle, 'enqueued' ) ) {
			$this->register_icon_loader_assets( $register_prc_icons );
		}
		wp_enqueue_script( $this->handle );
		wp_enqueue_style( $this->handle );
	}
}
