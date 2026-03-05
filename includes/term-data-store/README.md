# Term Data Store

Establishes 1:1 synced relationships between taxonomy terms and custom post type posts. Forked from 10up (original author: John P. Bloch), modified to enforce stronger ID-based relationships via post and term meta.

## What it does

When a relationship is registered between a post type and a taxonomy:
- Creating a **term** automatically creates a matching **post** of the related post type
- Creating a **post** automatically creates a matching **term** in the related taxonomy
- Each entity stores the other's ID in meta, ensuring a persistent, queryable link

Optionally rewrites post permalinks to point to the related term archive.

## Core functions

```php
// Register a relationship
TDS\add_relationship( 'my-post-type', 'my-taxonomy' );

// Given a term, get its related post
$post = TDS\get_related_post( $term_id, 'my-taxonomy' );

// Given a post (on a single post page), get its related term
$term = TDS\get_related_term( $post_id, 'my-post-type' );
```

## Usage example

```php
// In your plugin's init hook (after post types and taxonomies are registered):
add_action( 'init', function() {
    TDS\add_relationship( 'research-team', 'researcher' );
}, 20 );
```

Each `researcher` term will have a corresponding `research-team` post, and vice versa. Deleting one does not automatically delete the other — you handle that in your own hooks.

## Key files

| File | Purpose |
|------|---------|
| `term-data-store.php` | All TDS functions (`add_relationship`, `get_related_post`, `get_related_term`, hooks) |
| `LICENSE` | Original 10up license |

## Notes

- `add_relationship()` must be called **after** both the post type and taxonomy are registered
- Throws `Invalid_Input_Exception` if either the post type or taxonomy does not exist at call time
- Permalink rewriting is enabled by default; pass `false` as the third argument to `add_relationship()` to disable it
- The namespace is `TDS\` (not `PRC\Platform\`) — this is a vendor-forked library
