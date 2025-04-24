<?php
/**
 * Upgrade to 1.2.0.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform\Upgrades;

/**
 * Upgrade to 1.2.0.
 *
 * @package PRC\Platform
 */
class Upgrade_To_1_2_0 {
	/**
	 * A report of the actions taken.
	 *
	 * @var array
	 */
	protected $report = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->run();
	}

	/**
	 * Run the upgrade.
	 */
	public function before() {
		error_log( 'Starting PRC Platform 1.2.0 upgrade' );
	}

	/**
	 * Run the upgrade.
	 */
	public function during() {
	}

	/**
	 * Run the upgrade.
	 */
	public function after() {
		update_option( 'prc_platform_version', '1.2.0' );
		$this->after_action_report();
	}

	/**
	 * A helper function to store reports of the actions taken. This will be used to generate a report at the end of the upgrade.
	 *
	 * @param string $report_key The key of the report.
	 * @param string $report_value The value of the report.
	 */
	public function log_report( $report_key, $report_value ) {
		$this->report[ $report_key ] = $report_value;
	}

	/**
	 * Sends an email after everything is completed to the DEFAULT_TECHINCAL_CONTACT.
	 */
	public function after_action_report() {
		$subject = 'PRC Platform 1.2.0 Upgrade Post-Action-Report';
		$message = 'The 1.2.0 upgrade has been completed. Here are the action items that need to be completed:\n\n';
		foreach ( $this->report as $report_key => $report_value ) {
			if ( 'mini-course' === $report_key ) {
				$message .= 'Mini Course Post Type Updated to Course:\n';
				$message .= $report_value;
			}
		}
		$to   = 'srubenstein@pewresearch.org';
		$sent = wp_mail( $to, $subject, $message );
	}

	/**
	 * Run the upgrade.
	 */
	public function run() {
		$this->before();
		$this->during();
		$this->after();
	}
}
