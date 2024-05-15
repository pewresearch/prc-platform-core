<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class FacetCache_Table extends \BerlinDB\Database\Table {

	/**
	 * Table name, without the global table prefix.
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	public $name = 'prc_facet_cache';

	/**
	 * Database version key (saved in _options or _sitemeta)
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	protected $db_version_key = 'facet_cache_db_version';

	/**
	 * Optional description.
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	public $description = 'Cache for PRC Facets';

	/**
	 * Database version.
	 *
	 * @since 1.0.0
	 * @var   mixed
	 */
	protected $version = '1.0.3';

	/**
	 * Key => value array of versions => methods.
	 *
	 * @since 1.0.0
	 * @var   array
	 */
	protected $upgrades = array();

	/**
	 * Setup this database table.
	 *
	 * @since 1.0.0
	 */
	protected function set_schema() {
		$this->schema = "
			id  bigint(20) NOT NULL AUTO_INCREMENT,
			cache_key    tinytext   NOT NULL,
			cache_group  tinytext   NOT NULL,
			data         mediumtext NOT NULL,
			PRIMARY KEY (id)
			";
	}
}
