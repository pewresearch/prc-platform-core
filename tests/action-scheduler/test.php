<?php
if ( function_exists('as_has_scheduled_action') ) {
	$action_name = 'prc-platform-action-scheduler-test';
	$group = 'prc-platform-action-scheduler-test-group';
	$args = array(
		'foo' => 'bar',
	);
	$is_scheduled = as_has_scheduled_action(
		$action_name,
		$args,
		$group
	);
	if ( $is_scheduled ) {
		as_unschedule_action(
			$action_name, $args,
			$group
		);
	}
	$timestamp = time() + 60;
	as_schedule_single_action(
		$timestamp,
		$action_name,
		$args,
		$group,
	);
}
