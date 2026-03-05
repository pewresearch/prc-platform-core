# Templates

Provides WP-CLI commands for bulk template operations on the PRC Platform.

## What it does

Loads `class-cli.php` which registers WP-CLI commands for managing WordPress block templates at scale — useful for bulk-assigning templates to posts or auditing template usage across the network.

## Key files

| File | Purpose |
|------|---------|
| `class-templates.php` | Entry point; loads CLI class |
| `class-cli.php` | WP-CLI command definitions |

## Usage

Commands are available via WP-CLI in the Playground environment:

```bash
wp prc templates <subcommand>
```

Run `wp prc templates --help` for available subcommands.

## Notes

- This module is CLI-only — it has no frontend or admin UI
- For at-scale CLI patterns on VIP, see the [`wp-vip-cli-at-scale` skill](../../../../.claude/skills/wp-vip-cli-at-scale/SKILL.md)
