<?php
/**
 * Action Scheduler
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Handles scheduling recurring actions.
 *
 * @package PRC\Platform
 */
class Action_Scheduler {
	/**
	 * The time to keep records.
	 *
	 * @var int
	 */
	public static $time_to_keep_records = 14 * DAY_IN_SECONDS;

	/**
	 * The schedules.
	 *
	 * @var array
	 */
	public static $schedules = array(
		// Medium sized operations: need to start of the business day, 10am can use prc_run_at_start_of_day.
		'prc_run_at_start_of_day' => array(
			'start_time' => '10:00:00',
			'interval'   => DAY_IN_SECONDS,
			'args'       => array(),
		),
		// Least expensive operations: needed during the day can use prc_run_at_noon.
		'prc_run_at_noon'         => array(
			'start_time' => '12:00:00',
			'interval'   => DAY_IN_SECONDS,
			'args'       => array(),
		),
		// Medium sized operations: need to run at the end of the businss day.
		'prc_run_at_end_of_day'   => array(
			'start_time' => '18:01:00',
			'interval'   => DAY_IN_SECONDS,
			'args'       => array(),
		),
		// Most expensive operations should use prc_run_at_midnight.
		'prc_run_at_midnight'     => array(
			'start_time' => '00:00:00',
			'interval'   => DAY_IN_SECONDS,
			'args'       => array(),
		),
		// Even more expensive operations should be run once, weekly, and allowed time to run. We run a few smaller cleanup actions every week like clearing old untouched drafts.
		'prc_run_weekly'          => array(
			'start_time' => '00:01:00',
			'interval'   => WEEK_IN_SECONDS,
			'args'       => array(),
		),
		// Operations to run once a month.
		'prc_run_monthly'         => array(
			'start_time' => '00:02:00',
			'interval'   => MONTH_IN_SECONDS,
			'args'       => array(),
		),
	);

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader ) {
		require_once __DIR__ . '/cli/class-cli.php';

		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param object $loader The loader object.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// Register our default schedules.
			// $loader->add_action('init', $this, 'register_schedules');
			// Registers WP CLI commands for Action Scheduler.
			$loader->add_action( 'action_scheduler_pre_init', $this, 'pre_init' );
			// Change the retention period for Action Scheduler to X days. After that time completed and cancelled actions will be deleted.
			$loader->add_filter( 'action_scheduler_retention_period', $this, 'modify_retention_period' );
		}
	}

	/**
	 * Action: action_scheduler_pre_init
	 *
	 * Only load if Action Scheduler is active.
	 *
	 * @hook action_scheduler_pre_init
	 * @return void
	 */
	public function pre_init() {
		\AS_CLI\Plugin::init( __FILE__ );
	}

	/**
	 * Registers the various scheduled action hooks.
	 *
	 * @hook init
	 * @return void
	 */
	public function register_schedules() {
		foreach ( self::$schedules as $hook => $opts ) {
			/**
			 * Schedule an action with the hook 'prc_run_at_midnight' to run at midnight each day
			 * so that our callback is run then.
			 */
			if ( false === as_has_scheduled_action( $hook ) ) {
				$start_time = strtotime( $opts['start_time'] . ' America/New_York' );
				as_schedule_recurring_action( $start_time, $opts['interval'], $hook, $opts['args'], '', true );
			}
		}
	}

	/**
	 * Changes the retention period for Action Scheduler to X days. After that time completed and cancelled actions will be deleted.
	 *
	 * @hook action_scheduler_retention_period
	 * @return int|float
	 */
	public function modify_retention_period() {
		// Set the retention period to 14 days.
		return self::$time_to_keep_records;
	}
}
