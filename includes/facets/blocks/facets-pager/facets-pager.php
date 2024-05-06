<?php
namespace PRC\Platform;

/**
 * Block Name:        Facet Pager
 * Description:       Display page info for Facets
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Seth Rubenstein
 *
 * @package           prc-platform
 */

class Facets_Pager {
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
