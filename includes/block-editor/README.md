# Block Editor

Provides base-level block editor customizations for the post editor (not the site editor — see `gutenberg/` for shared Gutenberg config).

## What it does

- Enqueues a global block editor script (`prc-platform-block-editor`) with the current site URL available at `window.prcPlatform.siteUrl`
- Enforces block categories: filters out `newsletterglue-blocks` and `newsletterglue-legacy` categories from all post types except `newsletterglue`
- Restricts embed block variations to a curated allowlist (YouTube, Vimeo, Twitter/X, Facebook, Instagram, and ~20 others) — extensible via `prc_platform_block_editor_allowed_embed_variations`
- Registers a **Dark Mode Preview** toggle in the editor's Preview menu

## Dark Mode Preview

`src/dark-mode-preview.js` registers a `PluginPreviewMenuItem` that lets editors preview how a post looks in dark mode without leaving the block editor.

**How it works:**

When toggled, it sets `color-scheme: only dark` on the editor canvas iframe's root element. This forces all `light-dark()` CSS values and `prefers-color-scheme: dark` media queries to resolve to their dark-mode variants — without actually changing the user's OS preference. It also injects a small `<style>` block to force color swatch indicators in the sidebar to reflect the dark scheme.

**Keyboard shortcut:** `Ctrl + Shift + D` (registered via `@wordpress/keyboard-shortcuts`)

**UI entry point:** Preview menu → "Dark Mode Preview" (checkmark appears when active)

When toggled off, the iframe's `color-scheme` is restored to `light dark` and the injected style is removed.

## Key files

| File | Purpose |
|------|---------|
| `class-block-editor.php` | Main class; asset registration, category enforcement |
| `src/index.js` | Editor script entry point |
| `src/dark-mode-preview.js` | Dark mode preview plugin (`prc-dark-mode-preview`) |
| `build/` | Compiled assets |

## Filters / hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `enqueue_block_editor_assets` | Action | Registers and enqueues the editor script |
| `block_categories_all` | Filter | Removes Newsletter Glue categories from non-newsletter post types |
| `prc_platform_block_editor_allowed_embed_variations` | Filter | Override the allowlist of embed variations |

## Adding embed variations

To allow additional embed types beyond the default list:

```php
add_filter( 'prc_platform_block_editor_allowed_embed_variations', function( $allowed ) {
    $allowed[] = 'my-custom-embed';
    return $allowed;
} );
```
