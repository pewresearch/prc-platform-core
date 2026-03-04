<?php
/**
 * Templates module.
 *
 * Provides WP-CLI commands for bulk template operations.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Templates module. Loads CLI commands for bulk template updates.
 */
class Templates {

	/**
	 * Constructor.
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		require_once plugin_dir_path( __FILE__ ) . 'class-cli.php';
	}
}
