<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FacetCache_Schema extends \BerlinDB\Database\Schema {
	public $columns = array(
		'id' => array(
			'name'     => 'id',
			'type'     => 'bigint',
			'length'   => '20',
			'unsigned' => true,
			'extra'    => 'auto_increment',
			'primary'  => true,
			'sortable' => true,
		),
		'cache_key' => array(
			'name'       => 'cache_key',
			'type'       => 'tinytext',
			'unsigned'   => true,
			'sortable'   => true,
			'searchable' => true,
		),
		'cache_group' => array(
			'name'       => 'cache_group',
			'type'       => 'tinytext',
			'unsigned'   => true,
			'sortable'   => true,
			'searchable' => true,
		),
		'data' => array(
			'name'       => 'data',
			'type'       => 'mediumtext',
			'unsigned'   => true,
			'searchable' => false,
			'sortable'   => false,
		),

	);
}
