<?php
use BerlinDB\Database\Table as BerlinDB_Table;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Dataset_Downloads_Log extends BerlinDB_Table {

	/**
	 * Table name, without the global table prefix.
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	public $name = 'prc_dataset_downloads_log';

	/**
	 * Database version key (saved in _options or _sitemeta)
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	protected $db_version_key = 'dataset_downloads_log_version';

	/**
	 * Optional description.
	 *
	 * @since 1.0.0
	 * @var   string
	 */
	public $description = 'Downloads log for datasets.';

	/**
	 * Database version.
	 *
	 * @since 1.0.0
	 * @var   mixed
	 */
	protected $version = '1.0.0';

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
		$this->schema = '
			id				int			NOT NULL AUTO_INCREMENT,
			dataset_id		int			NOT NULL,
			total			int			NOT NULL,
			breakdown		longtext	NOT NULL,
			uids			longtext	NOT NULL,
			PRIMARY KEY (id)
			';
	}
}
