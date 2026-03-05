# Jetpack

Configures Jetpack for the PRC Platform by disabling irrelevant modules, extensions, and blocks.

## What it does

- **Disables modules**: `sso` (Single Sign-On), `seo-tools`
- **Disables extensions** (partial list): AI assistant, blogging prompt, donations, Google Calendar, Instagram gallery, Mailchimp, map, podcast player, payments, Pinterest, story, sharing buttons, etc.
- **Disables blocks** (partial list): donations, podcast player, payment buttons, opentable, calendly, rating star, premium content, send-a-message, etc.

## Key files

| File | Purpose |
|------|---------|
| `class-jetpack.php` | All Jetpack configuration |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `jetpack_set_available_extensions` | Action | Filters disallowed Jetpack extensions |
| `option_jetpack_active_modules` | Filter | Removes disallowed Jetpack modules |
| `jetpack_register_gutenberg_extensions` | Action | Marks disallowed blocks as unavailable |

## Adding/removing items from the disallow lists

Edit the static arrays in `class-jetpack.php`:

```php
public static $disallowed_modules    = [ ... ];
public static $disallowed_extensions = [ ... ];
public static $disallowed_blocks     = [ ... ];
```

## Notes

- The `button` block is intentionally commented out of the extensions disallow list — it is allowed
- `jetpack/revue` is included in the block disallow list (Revue was discontinued by Twitter/X)
