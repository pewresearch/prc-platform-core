# Mailchimp

Handles all Mailchimp integrations for the platform: newsletter subscriptions via the Mailchimp API and transactional email via Mandrill.

## What it does

- **Newsletter subscriptions** — manages list/audience subscriptions via `class-mailchimp-api.php`; monthly segment list updates via `prc_run_monthly`
- **Transactional email (Mandrill)** — overrides `wp_mail` from name and address; applies Mandrill-specific message formatting via `mandrill_payload` filter
- **REST endpoints** — registers subscription-related endpoints via `prc_api_endpoints` filter (available at `/prc-api/v3/`)
- Default list ID: `3e953b9b70`

## Key files

| File | Purpose |
|------|---------|
| `class-mailchimp.php` | Main class; hook registration, endpoint registration |
| `class-mailchimp-api.php` | Mailchimp API client wrapper |

## Required constants / credentials

Mailchimp and Mandrill API keys are expected to be defined as WordPress constants (managed via VIP environment config). Check `class-mailchimp.php` for the specific constant names.

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `prc_run_monthly` | Action | Updates Mailchimp segment lists |
| `wp_mail_from_name` | Filter | Overrides default sender name |
| `wp_mail_from` | Filter | Overrides default sender address |
| `prc_api_endpoints` | Filter | Registers subscription REST endpoints |
| `mandrill_payload` | Filter | Formats outgoing Mandrill message payload |

## Related

- `rest-api/` — the REST API registration system that processes `prc_api_endpoints`
- `action-scheduler/` — provides the `prc_run_monthly` hook
