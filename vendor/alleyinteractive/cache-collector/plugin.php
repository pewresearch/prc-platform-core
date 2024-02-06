<?php
/**
 * Plugin Name: cache-collector
 * Plugin URI: https://github.com/alleyinteractive/cache-collector
 * Description: Dynamic cache key collector for easy purging.
 * Version: 0.1.0
 * Author: Sean Fisher
 * Author URI: https://github.com/alleyinteractive/cache-collector
 * Requires at least: 5.9
 * Tested up to: 5.9
 *
 * @package cache-collector
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Cache_Collector\Cache_Collector;

require_once __DIR__ . '/src/class-cache-collector.php';

/**
 * Instantiate the plugin.
 */
function cache_collector_setup() {
	add_action( 'init', [ Cache_Collector::class, 'register_post_type' ] );

	// Register the post/term purge actions.
	add_action( 'clean_post_cache', [ Cache_Collector::class, 'on_post_update' ] );
	add_action( 'clean_term_cache', [ Cache_Collector::class, 'on_term_update' ] );

	// Set up a cleanup task that runs once a day to clean up any expired keys and
	// delete any unused options.
	if ( ! wp_next_scheduled( 'cache_collector_cleanup' ) ) {
		wp_schedule_event( time() + DAY_IN_SECONDS, 'daily', 'cache_collector_cleanup' );
	}

	add_action( 'cache_collector_cleanup', [ Cache_Collector::class, 'cleanup' ] );

	// Register the WP-CLI command.
	if ( defined( 'WP_CLI' ) && WP_CLI ) {
		require_once __DIR__ . '/src/class-cli.php';

		\WP_CLI::add_command( 'cache-collector', \Cache_Collector\CLI::class );
	}
}
cache_collector_setup();

/**
 * Register a cache key for a collection.
 *
 * @param string $collection Collection name.
 * @param string $key        Cache key to register.
 * @param string $group      Cache group, optional.
 * @param int    $ttl        Expiration time in seconds, optional. Defaults to 0 (no expiration).
 * @param string $type       Type of cache (cache/transient), optional. Defaults to cache.
 * @return Cache_Collector
 */
function cache_collector_register_key( string $collection, string $key, string $group = '', int $ttl = 0, string $type = Cache_Collector::CACHE_OBJECT_CACHE ): Cache_Collector {
	return ( new Cache_Collector( $collection ) )->register( $key, $group, $ttl, $type );
}

/**
 * Register a transient key for a collection.
 *
 * @param string $collection Collection name.
 * @param string $transient  Transient key to register.
 * @param int    $ttl        Expiration time in seconds, optional. Defaults to 0 (no expiration).
 * @return Cache_Collector
 */
function cache_collector_register_transient_key( string $collection, string $transient, int $ttl = 0 ): Cache_Collector {
	return cache_collector_register_key( $collection, $transient, '', $ttl, Cache_Collector::CACHE_TRANSIENT );
}

/**
 * Register a cache key for a collection.
 *
 * @param string $collection Collection name.
 * @param string $key        Cache key to register.
 * @param string $group      Cache group, optional.
 * @param int    $ttl        Expiration time in seconds, optional. Defaults to 0 (no expiration).
 * @return Cache_Collector
 */
function cache_collector_register_cache_key( string $collection, string $key, string $group = '', int $ttl = 0 ): Cache_Collector {
	return cache_collector_register_key( $collection, $key, $group, $ttl, Cache_Collector::CACHE_OBJECT_CACHE );
}

/**
 * Register a cache key for a post.
 *
 * @param int|\WP_Post $post  Post ID or object.
 * @param string       $key   Cache key.
 * @param string       $group Cache group, optional.
 * @param int          $ttl   Expiration time in seconds, optional. Defaults to 0 (no expiration).
 * @param string       $type  Type of cache (cache/transient), optional. Defaults to cache.
 * @return Cache_Collector
 */
function cache_collector_register_post_key( \WP_Post|int $post, string $key, string $group = '', int $ttl = 0, string $type = Cache_Collector::CACHE_OBJECT_CACHE ): Cache_Collector {
	return Cache_Collector::for_post( $post )->register( $key, $group, $ttl, $type );
}

/**
 * Register a cache key for a term.
 *
 * @param int|\WP_Term $term  Term ID or object.
 * @param string       $key   Cache key.
 * @param string       $group Cache group, optional.
 * @param int          $ttl   Expiration time in seconds, optional. Defaults to 0 (no expiration).
 * @param string       $type  Cache type, optional.
 * @return Cache_Collector
 */
function cache_collector_register_term_key( \WP_Term|int $term, string $key, string $group = '', int $ttl = 0, string $type = Cache_Collector::CACHE_OBJECT_CACHE ): Cache_Collector {
	return Cache_Collector::for_term( $term )->register( $key, $group, $ttl, $type );
}

/**
 * Purge a collection.
 *
 * @param string $collection Collection name.
 * @return Cache_Collector
 */
function cache_collector_purge( string $collection ): Cache_Collector {
	return ( new Cache_Collector( $collection ) )->purge();
}

/**
 * Purge a post's collection.
 *
 * @param int|\WP_Post $post Post ID or object.
 * @return Cache_Collector
 */
function cache_collector_purge_post( \WP_Post|int $post ): Cache_Collector {
	return Cache_Collector::for_post( $post )->purge();
}

/**
 * Purge a term's collection.
 *
 * @param int|\WP_Term $term Term ID or object.
 * @return Cache_Collector
 */
function cache_collector_purge_term( \WP_Term|int $term ): Cache_Collector {
	return Cache_Collector::for_term( $term )->purge();
}
