# Icon Loader

Registers the PRC icon library as a WordPress script (`prc-icons`) and exposes a `<Icon />` React component available as `@prc/icons` in the block editor.

## What it does

- Registers and enqueues `build/index.js` + `build/style-index.css` on both `enqueue_block_assets` and `admin_enqueue_scripts`
- Exposes `icon-render.php` for server-side icon rendering
- Provides the `@prc/icons` package available as a webpack external via the build toolchain

## Key files

| File | Purpose |
|------|---------|
| `class-icon-loader.php` | Asset registration and enqueue |
| `icon-render.php` | Server-side icon rendering helper |
| `src/` | Icon library source (React component + icon set) |
| `build/` | Compiled assets |
| `bin/` | Build utilities |

## Using icons in a block

In JavaScript (block editor):

```js
import { Icon } from '@prc/icons';

<Icon icon="arrow-right" />
```

In PHP (server-side render):

```php
// icon-render.php provides a helper function
echo prc_render_icon( 'arrow-right' );
```

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `enqueue_block_assets` | Action | Enqueues icons for blocks (editor + frontend) |
| `admin_enqueue_scripts` | Action | Enqueues icons in WP Admin |

## Build

```bash
npm run build -w @prc/platform-core
```
