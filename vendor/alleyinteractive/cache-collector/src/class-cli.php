<?php
/**
 * CLI class file
 *
 * @package cache-collector
 */

namespace Cache_Collector;

use Throwable;

/**
 * CLI Command for the plugin.
 */
class CLI {
	/**
	 * Purge a cache for a specific collection.
	 *
	 * ## OPTIONS
	 *
	 * <collection>
	 * : The name of the collection to purge.
	 *
	 * @param array $args Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function purge( $args, $assoc_args ) {
		[ $collection ] = $args;

		$instance = new Cache_Collector( $collection, function_exists( 'ai_logger' ) ? ai_logger() : null );

		$instance->purge();
	}

	/**
	 * Purge a cache for a specific post.
	 *
	 * ## OPTIONS
	 *
	 * <post>
	 * : The ID of the post to purge.
	 *
	 * @param array $args Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function purge_post( $args, $assoc_args ) {
		[ $post ] = $args;

		try {
			Cache_Collector::for_post( $post )->purge();
		} catch ( Throwable $e ) {
			\WP_CLI::error( 'Error purging: ' . $e->getMessage() );
		}
	}

	/**
	 * Purge a cache for a specific term.
	 *
	 * ## OPTIONS
	 *
	 * <term>
	 * : The ID of the term to purge.
	 *
	 * @param array $args Positional arguments.
	 * @param array $assoc_args Associative arguments.
	 */
	public function purge_term( $args, $assoc_args ) {
		[ $term ] = $args;

		try {
			Cache_Collector::for_term( $term )->purge();
		} catch ( Throwable $e ) {
			\WP_CLI::error( 'Error purging: ' . $e->getMessage() );
		}
	}
}
