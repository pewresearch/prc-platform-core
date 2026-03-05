# Post Publish Pipeline

Provides standardized, lifecycle-aware WordPress hooks for tracking posts through creation, saving, publishing, updating, unpublishing, and trashing.

## What it does

The pipeline normalizes the chaotic WordPress post status transition hooks into a clean, predictable set of actions. It guards against WP-CLI execution (intentionally — pipeline hooks are for web/REST contexts only).

## Available hooks

| Hook | Fires when |
|------|-----------|
| `prc_platform_on_post_init` | A new post is first created |
| `prc_platform_on_incremental_save` | A post is saved (any status) |
| `prc_platform_on_publish` | A post transitions to `publish` |
| `prc_platform_on_update` | An already-published post is updated |
| `prc_platform_on_unpublish` | A post transitions away from `publish` |
| `prc_platform_on_trash` | A post is trashed |
| `prc_platform_on_untrash` | A post is restored from trash |

All hooks pass `WP_Post` as the first argument.

## Allowed post types

By default the pipeline tracks: `post`, `feature`, `quiz`, `fact-sheet`, `short-read`, `events`, `mini-course`, `press-release`, `block_module`, `collections`.

Extend via filter:

```php
add_filter( 'prc_platform_post_publish_pipeline_post_types', function( $types ) {
    $types[] = 'my-cpt';
    return $types;
} );
```

## WP Post object extension

Other platform components can attach additional data to the WP post object via the `prc_platform_wp_post_object` filter (priority 1). Use this to scaffold fields early and populate them lazily for performance.

## Key files

| File | Purpose |
|------|---------|
| `class-post-publish-pipeline.php` | Pipeline hooks and post type gating |
| `src/` | Block editor JS pipeline integration |
| `build/` | Compiled editor assets |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `enqueue_block_editor_assets` | Action | Enqueues JS pipeline integration |
| `prc_platform_post_publish_pipeline_post_types` | Filter | Extend tracked post types |
| `prc_platform_wp_post_object` | Filter | Extend the WP post object shape |

## Notes

- Pipeline hooks do **not** fire in WP-CLI context — this is intentional
- REST API requests are tracked (`is_rest` is set but does not block execution)
