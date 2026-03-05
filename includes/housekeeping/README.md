# Housekeeping

Automated platform cleanup tasks that run on scheduled Action Scheduler hooks.

## What it does

**Monthly draft cleanup** (`prc_run_monthly`): Queries all drafts and auto-drafts not modified in the last 30 days, trashes them in batches of 50, and sends a Slack notification with the results.

- Trashes (does not permanently delete) posts — WordPress handles the trash TTL
- Processes in paginated batches to avoid memory issues
- Sends a Slack summary via `\PRC\Platform\Slack\send_notification()` if available
- Reports which posts were trashed and which failed

## Key files

| File | Purpose |
|------|---------|
| `class-housekeeping.php` | All cleanup logic |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `prc_run_monthly` | Action | Triggers monthly draft cleanup |

## Configuration

| Property | Default | Description |
|----------|---------|-------------|
| `$drafts_cleanup_count` | `50` | Posts processed per batch |
| `$email_contact` | `DEFAULT_TECHNICAL_CONTACT` | Contact for notifications |

## Adding new housekeeping tasks

Hook into the appropriate Action Scheduler schedule:

```php
add_action( 'prc_run_weekly', function() {
    // Your weekly cleanup task.
} );
```

See `action-scheduler/` for the full list of available schedule hooks.

## Notes

- Intentionally skips WP-CLI context (cleanup should be deliberate when run manually)
- The Slack notification is a best-effort call — housekeeping runs regardless of whether Slack is configured
