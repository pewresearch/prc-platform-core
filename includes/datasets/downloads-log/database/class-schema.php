<?php
use BerlinDB\Database\Schema as BerlinDB_Schema;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dataset_Download_Schema extends BerlinDB_Schema {

	public $columns = array(
		// dataset id
		'id' => array(
			'name'       => 'id',
			'type'       => 'int',
			'unsigned'   => true,
			'searchable' => true,
			'primary'  	 => true,
			'sortable'   => true,
		),

		// total downloads
		'total' => array(
			'name'       => 'total',
			'type'       => 'int',
			'unsigned'   => true,
			'searchable' => true,
			'sortable'   => true,
		),

		// serialized breakdown by year / month
		'breakdown' => array(
			'name'       => 'breakdown',
			'type'       => 'longtext',
			'unsigned'   => true,
			'searchable' => false,
			'sortable'   => false,
		),

		// serialized store of uids
		'uids' => array(
			'name'       => 'uids',
			'type'       => 'longtext',
			'unsigned'   => true,
			'searchable' => false,
			'sortable'   => false,
		),

	);

}
