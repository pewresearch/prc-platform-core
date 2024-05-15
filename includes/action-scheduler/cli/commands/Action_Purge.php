<?php declare( strict_types=1 );

namespace AS_CLI\Commands\Action;
use AS_CLI\Commands\Command_Abstract;

class Purge extends Command_Abstract {

	const COMMAND = 'wp ascli action purge';

	protected $action_ids = array();
	protected $action_counts = array(
		'deleted' => 0,
		'total'   => 0,
	);

	function __construct( array $args, array $assoc_args ) {
		parent::__construct( $args, $assoc_args );
	}

	/**
	 * Execute.
	 *
	 * @return void
	 */
	function execute() : void {
		global $wpdb;
		$wpdb->query( "TRUNCATE TABLE $wpdb->actionscheduler_actions" );
		$wpdb->query( "TRUNCATE TABLE $wpdb->actionscheduler_claims" );
		$wpdb->query( "TRUNCATE TABLE $wpdb->actionscheduler_groups" );
		$wpdb->query( "TRUNCATE TABLE $wpdb->actionscheduler_logs" );

		\WP_CLI::success( 'Purged Action Scheduler' );
	}
}
