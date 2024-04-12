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
	}


}
