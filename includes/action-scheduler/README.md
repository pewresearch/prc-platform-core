## Action Scheduler

Action Scheduler is a scalable, traceable job queue for background processing large queues of tasks in WordPress. It is designed for use cases where scheduling or offloading large numbers of tasks, actions, or processes is required.

### CLI:

PRC Platform ships with a fork of crstauf's action-scheduler-cli, to make it easier to manage scheduled actions from the command line. The CLI is a wrapper around the Action Scheduler API, and provides a number of commands to manage scheduled actions.

#### Commands:

|Command|Description|
|:--|:--|
|`ascli action cancel`|Cancels an existing scheduled action.|
|`ascli action create`|Creates a new scheduled action.|
|`ascli action delete`|Deletes scheduled action(s).|
|`ascli action generate`|Generates some scheduled actions.|
|`ascli action get`|Get details about a scheduled action.|
|`ascli action list`|Gets a list of scheduled actions.|
|`ascli action next`|Get the next scheduled action.|
|`ascli action run`|Run existing scheduled action.|
|`ascli system data-store`|Get current data store.|
|`ascli system runner`|Get current runner.|
|`ascli system runner disable`|Disable runner.|
|`ascli system runner enable`|Enable runner.|
|`ascli system status`|- List of actions according to status<br />- Active version<br />- Active data store class<br />- Active runner class|
|`ascli system version`|Lists active version(s).|

### Schedules:

PRC Platform comes with full support for Action Scheduler including some pre-built schedules for common tasks:

`prc_run_at_start_of_day` This is reserved for tasks that need to run at the start of the day. This is a good place to put tasks that need to run before the site is used for the day.
Runs at 10:00 AM EST

`prc_run_at_noon` This is reserved for tasks that need to run at noon. Good for mid-day cleanup. 
Runs at 12:00 PM EST

`prc_run_at_end_of_day` This is reserved for tasks the need to run at the end of the business day. Good for end of day cleanup or migration tasks.
Runs at 6:00 PM EST

`prc_run_at_midnight` This is reserved for tasks that need to run at midnight. Expensive operations should be run here.

`prc_run_weekly` This is reserved for tasks that need to run weekly.
Runs at 1:00 AM EST on Sunday

`prc_run_monthly` This is reserved for tasks that need to run monthly.
Runs at 2:00 AM EST on the first day of the month

---

### Adding A New Schedule
To add a new schedule, you can use the `prc_add_schedule` function. This function takes two arguments, the first is the name of the schedule, the second is the interval in seconds. For example, if you wanted to add a schedule that runs every 5 minutes, you would use the following code:


```php
$hook = 'my-new-scheduled-action-time';
if ( false === as_has_scheduled_action( $hook ) ) {
	$start_time = strtotime( '10am Sunday' . ' America/New_York' );
	as_schedule_recurring_action( $start_time, WEEK_IN_SECONDS, $hook, array(), '', true );
}
```

For more information on Action Scheduler, please see the [Action Scheduler Documentation](https://actionscheduler.org/).

---

### Retention Period
We modify the default Action Scheduler retention period to 14 days. After that time, logs of processed actions will be deleted from the database.
