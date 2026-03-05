# Firebase

Integrates Google Firebase into the PRC Platform for interactive data storage and user authentication. Provides both server-side PHP (via Kreait) and client-side JavaScript (ES module) access.

## What it does

- Initializes the Kreait Firebase PHP SDK using environment-specific service account credentials from `WPCOM_VIP_PRIVATE_DIR`
- Exposes `$this->db` (Realtime Database) and `$this->auth` (Firebase Auth) for server-side use
- Registers a `@prc/firebase` ES module (via `wp_register_script_module`) with client-side credentials injected via `script_module_data_@prc/firebase`
- Credentials are environment-aware: staging vs. production are switched automatically via `wp_get_environment_type()`

## When to use Firebase vs MySQL

Use Firebase for **outside user data** — quiz state, interactive responses, anonymous session data — anything written simultaneously from multiple clients. Use MySQL for **PRC editorial data**.

## Architecture

```
PHP (server-side)                   JS (client-side)
─────────────────                   ──────────────────
Kreait\Firebase\Factory             @prc/firebase ES module
  └── $this->db  (Realtime DB)       └── Firebase JS SDK
  └── $this->auth (Auth)             Credentials injected via
                                     script_module_data filter
```

## Required constants

| Constant | Description |
|----------|-------------|
| `PRC_PLATFORM_FIREBASE_KEY` / `...__DEV` | API key |
| `PRC_PLATFORM_FIREBASE_AUTH_DOMAIN` / `...__DEV` | Auth domain |
| `PRC_PLATFORM_FIREBASE_AUTH_DB` / `...__DEV` | Auth database URL |
| `PRC_PLATFORM_FIREBASE_INTERACTIVES_DB` / `...__DEV` | Interactives database URL |
| `PRC_PLATFORM_FIREBASE_PROJECT_ID` / `...__DEV` | Project ID |
| `WPCOM_VIP_PRIVATE_DIR` | Path to VIP private directory |

These are defined in `vip-config/` and managed as VIP environment variables.

## Service account files (VIP private dir)

| File | Environment |
|------|-------------|
| `firebase-service-account-prod.json` | Production |
| `firebase-service-account-staging.json` | Staging / dev |

## Key files

| File | Purpose |
|------|---------|
| `class-firebase.php` | Main class; SDK init, credential localization |
| `class-db.php` | Database helpers |
| `class-auth.php` | Auth helpers |
| `class-messaging.php` | Firebase Cloud Messaging helpers |
| `src/` | Client-side ES module source |
| `build/module.min.js` | Compiled ES module |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Registers the `@prc/firebase` script module |
| `script_module_data_@prc/firebase` | Filter | Injects client-side credentials |

## Debugging production data locally

To point local dev at production Firebase, temporarily uncomment:
```php
// $environment = 'production';
```
in both `localize_server_side_credentials()` and `localize_client_side_credentials()`. Revert before committing.
