# Taxonomies

Provides shared taxonomy configuration and utilities that apply platform-wide.

## What it does

- **Disables term description filtering** — removes WordPress' default `wp_filter_kses` on term descriptions, allowing rich HTML content in term description fields
- **Comma replacement** — WordPress strips commas from term names; this module stores commas as underscores and converts them back on `get_terms`
- **Disables global terms** — turns off multisite global term sharing, which caused long-standing slug conflicts across PRC sites
- **Hides `post_tag`** — sets `show_ui => false` on the built-in post tag taxonomy
- **Activity trail** — registers term meta and hooks into `create_term` / `edit_term` to log a trail of term changes

## Key files

| File | Purpose |
|------|---------|
| `class-taxonomies.php` | All taxonomy configuration |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Removes kses filters from term descriptions |
| `get_terms` | Filter | Replaces `_` with `,` in term names |
| `global_terms_enabled` | Filter | Returns `false` to disable global terms |
| `register_taxonomy_args` | Filter | Hides `post_tag` from admin UI |
| `init` | Action | Registers activity trail term meta |
| `create_term` | Action | Logs term creation to activity trail |
| `edit_term` | Action | Logs term edits to activity trail |

## Storing commas in term names

WordPress strips commas from term names during save. The convention on this platform is to **save underscores** in term names where a comma is intended. This class automatically converts them back to commas on read.

Example: save the term as `United States_Canada` — it will display as `United States,Canada`.
