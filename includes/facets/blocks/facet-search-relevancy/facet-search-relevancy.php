<?php
namespace PRC\Platform;

/**
 * Block Name:        Facet Search Relevancy
 * Description:       Toggle search sorting by relevancy or by datetime
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Seth Rubenstein
 *
 * @package           prc-platform
 */

class Facet_Search_Relevancy {
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
