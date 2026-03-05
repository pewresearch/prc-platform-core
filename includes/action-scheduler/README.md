# Action Scheduler

Configures and manages recurring scheduled actions for the PRC Platform using the [Action Scheduler](https://actionscheduler.org/) library.

## What it does

Registers six named recurring action hooks at defined times (America/New_York), provides WP-CLI integration via `as-cli`, and sets a 14-day retention window for completed/cancelled action records.

## Schedules

| Hook | Time | Interval | Intended use |
|------|------|----------|--------------|
| `prc_run_at_start_of_day` | 10:00 AM | Daily | Medium-cost operations needed at start of business day |
| `prc_run_at_noon` | 12:00 PM | Daily | Lightweight operations needed mid-day |
| `prc_run_at_end_of_day` | 6:01 PM | Daily | Medium-cost operations at end of business day |
| `prc_run_at_midnight` | 12:00 AM | Daily | Expensive operations that can run overnight |
| `prc_run_weekly` | 12:01 AM | Weekly | Long-running cleanup tasks |
| `prc_run_monthly` | 12:02 AM | Monthly | Infrequent, heavy operations |

To schedule work, hook into one of the above actions from any plugin:

```php
add_action( 'prc_run_at_midnight', function() {
    // Your nightly task here.
} );
```

## Key files

| File | Purpose |
|------|---------|
| `class-action-scheduler.php` | Schedule registration, retention config, WP-CLI init |
| `class-action-scheduler-ai-experiment.php` | AI experiment for Action Scheduler (requires WP AI Experiments plugin) |
| `class-action-scheduler-ai-ability.php` | Ability class for the AI experiment |
| `cli/class-cli.php` | WP-CLI command integration via `as-cli` |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Registers recurring scheduled actions |
| `action_scheduler_pre_init` | Action | Initializes WP-CLI commands |
| `action_scheduler_retention_period` | Filter | Sets retention to 14 days |
| `ai_experiments_register_experiments` | Action | Registers AI experiment (if plugin active) |

## Notes

- Schedules are registered idempotently — existing scheduled actions are not re-registered
- All times are Eastern (America/New_York)
- The AI experiment requires the `WordPress\AI\Abstracts\Abstract_Experiment` class to be available
