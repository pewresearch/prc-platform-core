<?php
/**
 * Action Scheduler AI Experiment
 *
 * Registers the Action Scheduler status ability for REST/MCP consumption.
 *
 * @package PRC\Platform
 */

declare( strict_types=1 );

namespace PRC\Platform;

use WordPress\AI\Abstracts\Abstract_Experiment;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers and bootstraps the AI experiment for Action Scheduler status.
 */
class Action_Scheduler_AI_Experiment extends Abstract_Experiment {

	/**
	 * Load the experiment metadata.
	 *
	 * @return array
	 */
	protected function load_experiment_metadata(): array {
		return array(
			'id'          => 'prc-platform-core/action-scheduler',
			'label'       => __( 'Action Scheduler Status', 'prc-platform-core' ),
			'description' => __( 'Retrieves Action Scheduler queue state grouped by status.', 'prc-platform-core' ),

		);
	}

	/**
	 * Register the experiment.
	 *
	 * @return void
	 */
	public function register(): void {
		$ability = new Action_Scheduler_AI_Ability();
		add_action( 'wp_abilities_api_init', array( $ability, 'register_ability' ) );
	}

	/**
	 * Localize the experiment data.
	 *
	 * @return null
	 */
	public function localize_experiment_data() {
		return null;
	}
}
