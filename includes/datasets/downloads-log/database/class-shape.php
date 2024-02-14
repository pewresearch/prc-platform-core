<?php
use BerlinDB\Database\Row as BerlinDB_Row;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dataset_Download_Shape extends BerlinDB_Row {
	public $id;
	public $total;
	public $breakdown;
	public $uids;

	public function __construct( $item ) {
		parent::__construct( $item );

		$this->id            = (int) $this->id;
		$this->dataset_id    = (int) $this->dataset_id;
		$this->total         = (int) $this->total;
		$this->breakdown 	 = (string) $this->breakdown;
		$this->uids         = (string) $this->uids;
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

	public function get_uids() {
		return json_decode( $this->uids );
	}

}
