# Scripts

Registers and enqueues first-party and third-party scripts and styles for the PRC Platform frontend and WP Admin.

## What it does

- **First-party scripts** — auto-discovers and registers all `@prc/*` packages built into `build/@prc/*/` as WordPress scripts
- **Third-party scripts** — registers external libraries (e.g., analytics, tracking)
- **Third-party styles** — registers external stylesheets
- **Firebase localization** — injects Firebase config (`prcFirebaseConfig`, `prcFirebaseInteractivesConfig`) into registered scripts that need it
- **Component REST endpoints** — initializes REST endpoint definitions for script-associated components

All registrations fire at priority `0` on `wp_enqueue_scripts` and `admin_enqueue_scripts` to ensure availability before other enqueues.

## Key files

| File | Purpose |
|------|---------|
| `class-scripts.php` | Auto-discovery, registration, Firebase localization |
| `src/` | Any script source managed here |
| `build/@prc/` | Compiled first-party packages |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `init` | Action | Initializes component REST endpoints |
| `wp_enqueue_scripts` (priority 0) | Action | Registers first/third-party scripts and styles (frontend) |
| `admin_enqueue_scripts` (priority 0) | Action | Registers first/third-party scripts (admin) |

## Notes

- Firebase constants (`PRC_PLATFORM_FIREBASE_KEY`, etc.) must be defined for `localize_firebase()` to inject credentials — it returns silently if any are missing
- This class registers but does not necessarily enqueue everything — individual blocks and plugins are responsible for their own `wp_enqueue_script()` calls
