# Block Utils

PHP utilities shared across PRC blocks: a JS utilities loader, a sliding-window pagination component, and a `classNames` helper.

## What it does

- Loads `Block_Utils\JS_Utils_Loader` — registers shared JavaScript utilities as a WordPress script available to all blocks
- Provides `Block_Utils\Pagination` — a PHP class for generating accessible, sliding-window pagination markup
- `utils.php` — PHP `classNames()` helper (mirrors the JS `classnames` package behavior)
- `Block_Utils\List` — stub class for centralizing list rendering (table of contents, attachment list, report materials); not yet fully implemented

## Key files

| File | Purpose |
|------|---------|
| `class-block-utils.php` | Entry point; instantiates JS_Utils_Loader |
| `class-js-utils-loader.php` | Registers shared JS utilities as a WordPress script |
| `class-pagination.php` | PHP pagination renderer |
| `class-list.php` | Stub for centralized list rendering |
| `utils.php` | `classNames()` PHP helper |
| `src/` | JS utility source |
| `build/` | Compiled assets |

## Pagination usage

```php
use PRC\Platform\Block_Utils\Pagination;

$items = [
    [ 'title' => 'Page 1', 'id' => 'page-1', 'link' => '/page-1', 'is_active' => true ],
    [ 'title' => 'Page 2', 'id' => 'page-2', 'link' => '/page-2', 'is_active' => false ],
];

$pagination = new Pagination( $items );
echo $pagination->get_markup( [
    'display_next_prev_buttons' => true,
    'next_button_label'         => 'Next &rarr;',
] );
```

The class handles sliding-window logic (up to 7 visible page links by default), prev/next buttons, and active state — but does **not** determine which item is active. Pass `is_active => true` on the correct item.

## `classNames()` helper

```php
use function PRC\Platform\Block_Utils\classNames;

$class = classNames( 'base-class', [
    'is-active'   => $is_active,
    'is-disabled' => ! $has_link,
] );
// Returns: "base-class is-active" (conditionally)
```

## CSS dependency

`Pagination::get_markup()` enqueues `prc-block-library--pagination` when items are present. Ensure that style is registered by the block library.
