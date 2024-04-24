<?php
namespace PRC\Platform;

use FacetCache_Table, FacetCache_Query;

/**
 * A cache system for Facet WP
 * Consists of a persistent cache and an ephemeral cache.
 * The persistent cache is stored in the database up to
 */
class Facets_Cache {
	public static $memached_enabled = true;
	public static $memcached_ttl = 30 * MINUTE_IN_SECONDS;
	public static $cron_name = 'prc_facet_cache_cron';

	public function __construct($loader = null) {
		require_once plugin_dir_path( __FILE__ ) . '/class-query.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-schema.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-shape.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-table.php';

		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_table' );
			$loader->add_action( 'wpcom_vip_cache_pre_execute_purges', $this, 'purge_with_vip_cache_flush', 10, 1 );
		}
	}

	public function register_table() {
		// Register the persistent cache table, where we'll store results for up to a week.
		$cache_table = new FacetCache_Table();
		if ( ! $cache_table->exists() ) {
			$cache_table->install();
		}
	}

	/**
	 * Queries the persistent cache for a record.
	 */
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
			$memcached = wp_cache_get( $key, 'facets/'. $group );
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
		// Store in persistent cache
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
		// Store in ephemeral cache
		if ( $success && self::$memached_enabled ) {
			wp_cache_set( $key, $data, 'facets/'. $group, self::$memcached_ttl );
		}
		return array('success' => $success, 'data' => $data);
	}

	public function schedule_saturday_midnight_cache_purge() {

	}

	public function clear_cache() {
		$table = new FacetCache_Table();
		\wp_cache_flush_group('facets/publications/');
		return $table->truncate();
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
