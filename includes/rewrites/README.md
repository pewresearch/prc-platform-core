# Rewrites

Manages WordPress permalink structure, query variables, URL-based redirects, and speculative loading configuration for the PRC Platform.

## What it does

- **Permalink rewrites** — registers custom rewrite rules and tags via `init`
- **Query vars** — registers custom query variables
- **Year archive redirect** — redirects year-based archive URLs to an appropriate destination
- **Speculative loading** — configures the WordPress Speculation Rules API:
  - Mode: `prefetch`, Eagerness: `moderate` (prefetch on hover, not on page load)
  - Eagerly prefetches `/publications/`, `/topics/`, `/topics-categorized/`, `/topics-condensed/`, `/tools-and-resources/`
- **REST endpoint** — registers a rewrites-related endpoint via `prc_api_endpoints`

## Key files

| File | Purpose |
|------|---------|
| `class-rewrites.php` | All rewrite, redirect, and speculation rules logic |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Registers rewrite rules and tags |
| `query_vars` | Filter | Registers custom query variables |
| `template_redirect` | Action | Redirects year archive URLs |
| `wp_speculation_rules_configuration` | Filter | Sets prefetch/moderate speculation mode |
| `wp_load_speculation_rules` | Action | Adds eager prefetch rules for key URLs |
| `prc_api_endpoints` | Filter | Registers rewrite-related REST endpoint |

## Speculation rules

The platform uses **prefetch with moderate eagerness** — assets are fetched when a user hovers a link, reducing perceived load time without the memory overhead of prerender. Key navigation URLs are prefetched eagerly (on page load) since they are high-traffic destinations.

To modify eagerness or mode, edit `manage_speculative_loading()` in `class-rewrites.php`.
