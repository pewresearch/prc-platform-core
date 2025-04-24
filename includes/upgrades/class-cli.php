<?php
namespace PRC\Platform\Upgrades;

use WPCOM_VIP_CLI_Command;
use WP_CLI;
use WP_Error;
use wpcom_vip_get_page_by_title;

if ( defined( 'WP_CLI' ) && WP_CLI && class_exists( 'WPCOM_VIP_CLI_Command' ) ) {
	/**
	 * Manage the migration of posts from one site to the new pewresearch-org.
	 */
	class CLI extends WPCOM_VIP_CLI_Command {
		/**
		 * Constructor
		 */
		public function __construct() {
			require_once __DIR__ . '/1.2.0/class-upgrade-to-1-2-0.php';
		}

		/**
		 * Run an upgrade manually. Dangerous.
		 *
		 * @subcommand run
		 * @synopsis --version=<version> [--dry-run]
		 */
		public function run_upgrade( $args, $assoc_args ) {
			$version = $assoc_args['version'];
			if ( ! $version ) {
				WP_CLI::error( '👤 🔴  Version is required.' );
			}

			if ( isset( $assoc_args['dry-run'] ) ) {
				// Passing `--dry-run=false` to the command leads to the `false` value being set to string `'false'`, but casting `'false'` to bool produces `true`. Thus the special handling.
				if ( 'false' === $assoc_args['dry-run'] ) {
					$dry_run = false;
				} else {
					$dry_run = (bool) $assoc_args['dry-run'];
				}
			} else {
				$dry_run = true;
			}

			if ( $dry_run ) {
				WP_CLI::line( '👤 🛟  Running in dry-run mode, callback is disarmed.' );
			} else {
				WP_CLI::line( '👤 🔴  Callback armed and ready. This is an extremely dangerous operation.' );
				// Do a wp cli confirmation prompt here...
				WP_CLI::confirm( 'Confirm you would like to proceed with the upgrade. There is no going back.', $assoc_args );

				// Disable term counting, Elasticsearch indexing, and PushPress.
				$this->start_bulk_operation();

				// Do Upgrades...
				$new_upgrades = new Upgrade_To_1_2_0();
				// Free up memory.
				$this->vip_inmemory_cleanup();

				// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
				$this->end_bulk_operation();
			}
		}
	}

	WP_CLI::add_command( 'prc upgrades', '\PRC\Platform\Upgrades\CLI' );
}
