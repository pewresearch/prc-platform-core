# Gutenberg

Base-level Gutenberg configuration for the PRC Platform. Handles editor-wide settings that apply across all post types.

For post-editor-specific functionality see `block-editor/`. For site-editor-specific functionality, see the site editor class.

## What it does

- Forces Gutenberg on **all post types** — no classic editor fallback
- Enforces specific Gutenberg experiments always-on: `gutenberg-block-experiments`, `gutenberg-workflow-palette`
- Removes the **Block Directory** from the block inserter
- Disables **remote block patterns** — only local or DB-sourced patterns load
- Unregisters all core block patterns (removes `core-block-patterns` theme support)
- Reorders admin menus to group `block_module` and `wp_block` post types near Appearance
- Loads `Edit_Template_Toolbar` — toolbar enhancements for template editing

## Key files

| File | Purpose |
|------|---------|
| `class-gutenberg.php` | Core config hooks |
| `class-edit-template-toolbar.php` | Edit template toolbar additions |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `use_block_editor_for_post` | Filter | Forces Gutenberg for all posts |
| `option_gutenberg-experiments` | Filter | Enforces required experiments |
| `menu_order` | Action | Groups block-related admin menu items |
| `after_setup_theme` | Action | Unregisters core block patterns |
| `should_load_remote_block_patterns` | Filter | Returns `false` |

## Adding a new always-on experiment

Edit `enforce_gutenberg_experiments()` in `class-gutenberg.php`:

```php
$experiments['my-new-experiment'] = true;
```
