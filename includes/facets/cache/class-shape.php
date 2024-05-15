<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FacetCache_Shape extends BerlinDB\Database\Row {

	/**
	 * Facet Cache constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param $item
	 */
	public function __construct( $item ) {
		parent::__construct( $item );
		$this->id          = (int) $this->id;
		$this->cache_key   = (string) $this->cache_key;
		$this->cache_group = (string) $this->cache_group;
		$this->data        = (string) $this->data;
	}

	public function cron_schedule() {}

	/**
	 * Retrieves the HTML to display the information about this facet cache.
	 *
	 * @since 1.0.0
	 *
	 * @return string HTML output to display this record's data.
	 */
	public function display() {
		$result = print_r( $this, true );
		return $result;
	}

}
