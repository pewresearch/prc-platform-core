<?php
/**
 * Block Utils
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Block Utils
 *
 * @package PRC\Platform
 */
class Block_Utils {
	/**
	 * Constructor
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-js-utils-loader.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-pagination.php';
		require_once plugin_dir_path( __FILE__ ) . 'utils.php';

		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			new Block_Utils\JS_Utils_Loader( $loader );
		}
	}
}
