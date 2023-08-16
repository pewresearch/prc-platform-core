<?php
/**
 * Forked from crstauf: https://github.com/crstauf/action-scheduler-cli
 * @author crstauf
 */

declare( strict_types=1 );

namespace AS_CLI;
use AS_CLI\Commands\Action\Action;
use AS_CLI\Commands\System\System;

class Plugin {

	const RUNNER_OPTION = 'ascli_disable_runner';

	static function instance() : self {
		static $instance = null;

		if ( is_null( $instance ) )
			$instance = new self;

		return $instance;
	}

	static function init( string $file ) : void {
		static $once = false;

		if ( true === $once )
			return;

		$once = true;
		$instance = static::instance();

		$instance->file = $file;
		$instance->directory = dirname( $file );
	}

	protected function __construct() {

		add_action( 'init', array( $this, 'action__init' ) );

		if ( !defined( 'WP_CLI' ) || !WP_CLI )
			return;

		require_once 'commands/Action.php';
		require_once 'commands/Command_Abstract.php';
		require_once 'commands/System.php';

		\WP_CLI::add_command( Action::COMMAND, Action::class );
		\WP_CLI::add_command( System::COMMAND, System::class );

	}

	/**
	 * Action: init
	 *
	 * Disable runner.
	 *
	 * @uses \ActionScheduler::runner()
	 * @return void
	 */
	function action__init() : void {
		if ( !get_option( self::RUNNER_OPTION ) )
			return;

		remove_action( 'action_scheduler_run_queue', array( \ActionScheduler::runner(), 'run' ) );
	}

}
