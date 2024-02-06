<?php
use BerlinDB\Database\Row as BerlinDB_Row;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dataset_Download_Shape extends BerlinDB_Row {
	public $id;
	public $total;
	public $breakdown;
	public $uuids;

	public function __construct( $item ) {
		parent::__construct( $item );

		$this->id            = (int) $this->id;
		$this->total         = (int) $this->total;
		$this->breakdown 	 = (string) $this->breakdown;
		$this->uuids         = (string) $this->uuids;
	}

	public function display() {
		$result = print_r( $this, true );
		return $result;
	}

	public function get_total() {
		return $this->total;
	}

	public function get_for_year($year) {
		$breakdown = $this->get_breakdown();
		if ( ! isset( $breakdown->$year ) ) {
			return 0;
		}
		return $breakdown->$year;
	}

	public function get_breakdown() {
		return json_decode( $this->breakdown );
	}

	public function get_uuids() {
		return json_decode( $this->uuids );
	}

}
