# User Permissions

Manages WordPress user roles, capabilities, two-factor authentication enforcement, and common user meta for the PRC Platform.

## What it does

- **Autoloads roles from JSON** — reads `user-roles.json` on `admin_init`; when the JSON version exceeds the stored DB version, applies role changes using `wpcom_vip_add_role()` and `wpcom_vip_duplicate_role()`. This is the source of truth for platform roles.
- **Two-factor authentication** — enforces 2FA on production (`VIP_GO_APP_ENVIRONMENT === 'production'`) via `wpcom_vip_enable_two_factor`
- **Bot user** — creates/maintains a `prc-wp-bot` WordPress user for automated platform operations
- **Common user meta** — registers shared meta keys (e.g., `prc_nexus_settings`) with the REST API and schema on `init`
- **New user defaults** — sets default meta values when a new user registers

## Key files

| File | Purpose |
|------|---------|
| `class-user-permissions.php` | All role/capability/meta logic |
| `user-roles.json` | Source of truth for platform roles and capabilities |

## Adding or modifying roles

Edit `user-roles.json`. Bump the `version` field — this triggers the autoloader to re-apply roles on next `admin_init`.

```json
{
  "version": 5,
  "roles": {
    "prc-editor": {
      "name": "PRC Editor",
      "inherits": "editor",
      "capabilities": {
        "publish_posts": true
      }
    }
  }
}
```

Use `inherits` to clone an existing role and layer on additional capabilities.

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Creates bot user, registers user meta |
| `admin_init` | Action | Autoloads roles from JSON |
| `wpcom_vip_enable_two_factor` | Filter | Enforces 2FA on production |
| `register_new_user` | Action | Sets default meta on new user creation |

## Notes

- Role management uses VIP-specific functions (`wpcom_vip_add_role`, `wpcom_vip_duplicate_role`) — these are no-ops outside VIP environments
- The version check prevents redundant role re-registration on every page load
