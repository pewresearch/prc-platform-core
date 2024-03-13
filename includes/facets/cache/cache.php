<?php
namespace PRC\Platform;

class Cache extends Facets {
	public static $memached_enabled = false;
	public static $memcached_ttl = 30 * MINUTE_IN_SECONDS;
	public static $cron_name = 'prc_facet_cache_cron';
	public $cache_db_table = false;

	public function __construct( $init = false ) {
		require_once plugin_dir_path( __FILE__ ) . '/class-query.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-schema.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-shape.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-table.php';

		if ( true === $init ) {
			// Instantiate the Facet Cache Table class.
			$this->cache_db_table = new FacetCache_Table();

			// Uninstall the database. Uncomment this code to force the database to rebuild.
			// if($this->cache_db_table->exists()){
			// $this->cache_db_table->uninstall();
			// }

			// If the table does not exist, then create the table.
			if ( ! $this->cache_db_table->exists() ) {
				$this->cache_db_table->install();
			}

			add_action( 'init', array($this, 'schedule_cron_job') );

			add_action( 'wpcom_vip_cache_pre_execute_purges', array( $this, 'purge_with_vip_cache_flush' ), 10, 1 );
		}
	}

	public function query($key, $group) {
		return new FacetCache_Query(
			array(
				'cache_key'   => $key,
				'cache_group'  => $group,
				'orderby' => 'id',
				'order'   => 'asc',
				'number'  => 1, // Only retrieve a single record.
				'fields' => array( 'data' ),
			)
		);
	}

	public function get($key, $group) {
		if ( self::$memached_enabled ) {
			$memcached = wp_cache_get( $key, $group );
			if ( false !== $memcached ) {
				return $memcached;
			}
		}
		$query = $this->query($key, $group);
		if ( ! $query->items ) {
			return false;
		}
		$items = array_pop( $query->items );
		return json_decode($items->data, true);
	}

	public function store($key, $group, $data) {
		$query = $this->query($key, $group);
		$success = false;
		// Store the result if nothing found. Otherwise update it.
		if ( ! $query->items ) {
			$success = $query->add_item(
				array(
					'cache_key'   => $key,
					'cache_group' => $group,
					'data'        => wp_json_encode( $data ),
				)
			);
		} else {
			foreach ( $query->items as $record ) {
				$success = $query->update_item(
					$record->id,
					array(
						'cache_key'   => $key,
						'cache_group' => $group,
						'data'        => wp_json_encode( $data ),
					)
				);
			}
		}
		if ( $success && self::$memached_enabled ) {
			wp_cache_set( $key, $data, $group, self::$memcached_ttl );
		}
		return array('success' => $success, 'data' => $data);
	}

	public function schedule_cron_job() {
		$args = array(
			'recurrence' => 'twicedaily',
			'schedule' => 'schedule',
			'name' => self::$cron_name,
			'cb' => array($this, 'clear_cache'),
			'multisite'=> false,
			'plugin_root_file'=> '',
			'run_on_creation'=> true,
			'args' => array()
		);
//@TODO use action scheduler.
	}

	public function clear_cache() {
		//wp_cache_flush_group will soon be available https://github.com/WordPress/wordpress-develop/pull/2368
		return $this->cache_db_table->truncate();
	}

	/**
	 * Clear the facet cache on purge
	 * Only works on pages that contain /publications or /topic
	 * Resets the facet cache key to the current time
	 *
	 * @param array $purge_urls
	 */
	public function purge_with_vip_cache_flush( $urls ) {
		$should_run = array_filter($urls, function($url) {
			return strpos( $url, '/publications' ) !== false || strpos( $url, '/topic' ) !== false || strpos( $url, '/search' ) !== false;
		});

		if ( $should_run ) {
			return $this->clear_cache();
		}
	}
}
