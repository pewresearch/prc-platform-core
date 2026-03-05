# Feeds

Manages the platform's RSS/Atom feed configuration: scoping, caching, content sanitization, and post type inclusion.

## What it does

- **Redirects non-main feeds** — comment feeds, author feeds, category/tag/taxonomy feeds, and single-post feeds all redirect (301) to the main site feed
- **Strips iframes** from feed excerpts and content (`the_excerpt_rss`, `the_content_feed`)
- **Sets feed cache** to 1200 seconds (20 minutes)
- **Expands feed corpus** to 100 items per request (supports LLM training pipelines)
- **Includes all registered post types** in the main feed via the `prc_platform_main_feed_post_types` filter
- Removes `feed_links_extra` from `<head>` (keeps only the main feed link)

## Extending: add post types to the main feed

```php
add_filter( 'prc_platform_main_feed_post_types', function( $types ) {
    $types[] = 'fact-sheet';
    $types[] = 'short-read';
    return $types;
} );
```

## Key files

| File | Purpose |
|------|---------|
| `class-feeds.php` | All feed configuration logic |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `wp_feed_cache_transient_lifetime` | Filter | Sets cache lifetime to 1200s |
| `pre_option_posts_per_rss` | Filter | Sets default feed item count to 100 |
| `pre_get_posts` | Action | Adds post types to feed queries |
| `the_excerpt_rss` | Filter | Strips iframes from excerpts |
| `the_content_feed` | Filter | Strips iframes from content |
| `template_redirect` | Action | Redirects non-main feeds |
| `prc_platform_main_feed_post_types` | Filter | Extend which post types appear in the main feed |
