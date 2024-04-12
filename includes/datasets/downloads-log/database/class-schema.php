<?php
use BerlinDB\Database\Schema as BerlinDB_Schema;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dataset_Download_Schema extends BerlinDB_Schema {

	public $columns = array(
		// entry id
		'id' => array(
			'name'       => 'id',
			'type'       => 'int',
			'unsigned'   => true,
			'searchable' => true,
			'primary'  	 => true,
			'sortable'   => true,
		),

		// the user id, sometimes referred to as the uid
		'user_id' => array(
			'name'       => 'user_id',
			'type'       => 'mediumtext',
			'unsigned'   => true,
			'searchable' => true,
			'sortable'   => true,
		),

		// serialized store of dataset_ids
		'dataset_ids' => array(
			'name'       => 'uids',
			'type'       => 'longtext',
			'unsigned'   => true,
			'searchable' => false,
			'sortable'   => false,
		),

	);

}
