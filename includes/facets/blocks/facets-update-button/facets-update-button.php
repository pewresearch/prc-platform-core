<?php
namespace PRC\Platform;

/**
 * Block Name:        Facets Update Button
 * Description:       Provides a selection aware button to update the page results and&#x2F;or clear all selections
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Pew Research Center
 *
 * @package           prc-platform
 */

class Facets_Update_Button {
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
		}
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function block_init() {
		register_block_type( __DIR__ . '/build' );
	}
}
