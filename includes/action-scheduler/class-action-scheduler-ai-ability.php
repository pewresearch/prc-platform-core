<?php
/**
 * Action Scheduler AI Ability
 *
 * Data retrieval ability that returns Action Scheduler queue state grouped by status
 * (pending, in-progress, failed, complete). Exposed via REST and MCP.
 *
 * @package PRC\Platform
 */

declare( strict_types=1 );

namespace PRC\Platform;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Action Scheduler Status Ability class.
 */
class Action_Scheduler_AI_Ability {

	/**
	 * Ability name.
	 *
	 * @var string
	 */
	public static $ability_name = 'prc-platform-core/action-scheduler-status';

	/**
	 * Register the ability with WP Abilities API.
	 *
	 * @hook wp_abilities_api_init
	 */
	public function register_ability(): void {
		wp_register_ability(
			self::$ability_name,
			array(
				'label'               => __( 'Action Scheduler Status', 'prc-platform-core' ),
				'description'         => __( 'Returns Action Scheduler queue state grouped by status: pending, in-progress, failed, and complete. Optionally filter by group.', 'prc-platform-core' ),
				'category'            => 'data-retrieval',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'group'    => array(
							'type'        => 'string',
							'description' => 'Optional. Filter actions to a single Action Scheduler group (e.g. prc_run_at_noon).',
						),
						'per_page' => array(
							'type'        => 'integer',
							'description' => 'Max number of actions to return per status. Default 20, max 100.',
							'default'     => 20,
							'minimum'     => 1,
							'maximum'     => 100,
						),
					),
					'additionalProperties' => false,
				),
				'output_schema'       => array(
					'type'       => 'object',
					'properties' => array(
						'error' => array(
							'type'        => 'string',
							'description' => 'Error message if Action Scheduler is unavailable.',
						),
						'pending' => array(
							'type'       => 'object',
							'properties' => array(
								'count'   => array( 'type' => 'integer' ),
								'actions' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'id'             => array( 'type' => 'integer' ),
											'hook'           => array( 'type' => 'string' ),
											'group'          => array( 'type' => 'string' ),
											'scheduled_date' => array( 'type' => 'string' ),
											'args'           => array( 'type' => 'object' ),
											'attempts'       => array( 'type' => 'integer' ),
										),
									),
								),
							),
						),
						'in-progress' => array(
							'type'       => 'object',
							'properties' => array(
								'count'   => array( 'type' => 'integer' ),
								'actions' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'id'             => array( 'type' => 'integer' ),
											'hook'           => array( 'type' => 'string' ),
											'group'          => array( 'type' => 'string' ),
											'scheduled_date' => array( 'type' => 'string' ),
											'args'           => array( 'type' => 'object' ),
											'attempts'       => array( 'type' => 'integer' ),
										),
									),
								),
							),
						),
						'failed' => array(
							'type'       => 'object',
							'properties' => array(
								'count'   => array( 'type' => 'integer' ),
								'actions' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'id'             => array( 'type' => 'integer' ),
											'hook'           => array( 'type' => 'string' ),
											'group'          => array( 'type' => 'string' ),
											'scheduled_date' => array( 'type' => 'string' ),
											'args'           => array( 'type' => 'object' ),
											'attempts'       => array( 'type' => 'integer' ),
										),
									),
								),
							),
						),
						'complete' => array(
							'type'       => 'object',
							'properties' => array(
								'count'   => array( 'type' => 'integer' ),
								'actions' => array(
									'type'  => 'array',
									'items' => array(
										'type'       => 'object',
										'properties' => array(
											'id'             => array( 'type' => 'integer' ),
											'hook'           => array( 'type' => 'string' ),
											'group'          => array( 'type' => 'string' ),
											'scheduled_date' => array( 'type' => 'string' ),
											'args'           => array( 'type' => 'object' ),
											'attempts'       => array( 'type' => 'integer' ),
										),
									),
								),
							),
						),
					),
				),
				'execute_callback'    => array( $this, 'execute' ),
				'permission_callback' => function (): bool {
					return current_user_can( 'manage_options' );
				},
				'meta'                => array(
					'annotations'  => array(
						'instructions' => 'Use this ability to inspect the Action Scheduler queue: pending, in-progress, failed, and complete actions. Optionally pass a group filter (e.g. prc_run_at_noon) to limit results to that group.',
						'readonly'     => true,
						'destructive'  => false,
						'idempotent'   => true,
					),
					'show_in_rest' => true,
					'mcp'          => array(
						'public' => true,
						'type'   => 'tool',
					),
				),
			)
		);
	}

	/**
	 * Execute the ability: query Action Scheduler and return status grouped by pending, in-progress, failed, complete.
	 *
	 * @param array $input Input parameters (group, per_page).
	 * @return array Result keyed by status with count and actions per status.
	 */
	public function execute( array $input ): array {
		if ( ! class_exists( 'ActionScheduler_Store' ) || ! class_exists( 'ActionScheduler' ) ) {
			return array(
				'error'    => 'Action Scheduler is not available.',
				'pending'  => array( 'count' => 0, 'actions' => array() ),
				'in-progress' => array( 'count' => 0, 'actions' => array() ),
				'failed'   => array( 'count' => 0, 'actions' => array() ),
				'complete' => array( 'count' => 0, 'actions' => array() ),
			);
		}

		$group    = isset( $input['group'] ) && is_string( $input['group'] ) ? trim( $input['group'] ) : '';
		$per_page = 20;
		if ( isset( $input['per_page'] ) && is_numeric( $input['per_page'] ) ) {
			$per_page = min( 100, max( 1, (int) $input['per_page'] ) );
		}

		$store   = \ActionScheduler::store();
		$logger  = \ActionScheduler::logger();
		$statuses = array(
			\ActionScheduler_Store::STATUS_PENDING,
			\ActionScheduler_Store::STATUS_RUNNING,
			\ActionScheduler_Store::STATUS_FAILED,
			\ActionScheduler_Store::STATUS_COMPLETE,
		);

		$result = array();

		foreach ( $statuses as $status ) {
			$count_query = array(
				'status' => $status,
			);
			if ( $group !== '' ) {
				$count_query['group'] = $group;
			}
			$count = (int) $store->query_actions( $count_query, 'count' );

			$list_query = array(
				'status'   => $status,
				'per_page' => $per_page,
				'orderby'  => 'date',
				'order'    => 'ASC',
			);
			if ( $group !== '' ) {
				$list_query['group'] = $group;
			}

			$actions_raw = function_exists( 'as_get_scheduled_actions' ) ? as_get_scheduled_actions( $list_query ) : array();
			$actions     = array();

			foreach ( $actions_raw as $action_id => $action ) {
				$schedule = $action->get_schedule();
				$next     = $schedule->get_next();
				$date_str = $next ? $next->format( 'Y-m-d H:i:s' ) : '';

				$attempts = 0;
				if ( $logger && method_exists( $logger, 'get_logs' ) ) {
					$logs = $logger->get_logs( (int) $action_id );
					$attempts = is_array( $logs ) ? count( $logs ) : 0;
				}

				$actions[] = array(
					'id'             => (int) $action_id,
					'hook'           => $action->get_hook(),
					'group'          => $action->get_group(),
					'scheduled_date' => $date_str,
					'args'           => $action->get_args(),
					'attempts'       => $attempts,
				);
			}

			$result[ $status ] = array(
				'count'   => $count,
				'actions' => $actions,
			);
		}

		return array(
			'error'       => '',
			'pending'     => $result[ \ActionScheduler_Store::STATUS_PENDING ],
			'in-progress' => $result[ \ActionScheduler_Store::STATUS_RUNNING ],
			'failed'      => $result[ \ActionScheduler_Store::STATUS_FAILED ],
			'complete'    => $result[ \ActionScheduler_Store::STATUS_COMPLETE ],
		);
	}
}
