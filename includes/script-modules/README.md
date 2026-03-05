# Script Modules

Auto-discovers and registers ES modules from the `modules/` subdirectory as WordPress script modules (`wp_register_script_module`), making them available platform-wide as `@prc/<name>` imports.

## What it does

- On `wp_enqueue_scripts` (priority 0), scans `modules/*/build/` for compiled `module.min.js` files
- Registers each found module as `@prc/<directory-name>` via the WordPress Script Modules API
- Modules are registered (not auto-enqueued) — individual blocks/scripts import them as dependencies

## Currently registered modules

| Module slug | Source |
|-------------|--------|
| `@prc/d3` | `modules/d3/` |
| `@prc/topojson` | `modules/topojson/` |

## Key files

| File | Purpose |
|------|---------|
| `class-script-modules.php` | Module discovery and registration |
| `modules/d3/` | D3.js compiled as an ES module |
| `modules/topojson/` | TopoJSON compiled as an ES module |

## Adding a new module

1. Create a directory under `modules/<name>/`
2. Add a `package.json` and `src/` with your module entry point
3. Build to `build/module.min.js` (the class looks for this path)
4. The module will auto-register as `@prc/<name>` on next page load

## Using a module in a block

In `block.json`:

```json
{
  "viewScriptModule": "file:./view.js",
  "script": []
}
```

In `view.js`:

```js
import * as d3 from '@prc/d3';
```

Or declare the dependency in the module's `asset.php` dependencies array.
