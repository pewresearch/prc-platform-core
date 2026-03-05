# URL Helper

Resolves any PRC Platform URL — including preview links, edit links, and canonical post URLs — to a WordPress post ID.

## What it does

Given a URL string, `URL_Helper` determines the corresponding post ID by trying multiple resolution strategies:
- Preview link (`?preview=true&...`)
- WP Admin edit link (`/wp-admin/post.php?post=...`)
- Canonical post URL (via `url_to_postid()`)

Validates that the URL belongs to an allowed PRC domain before resolving.

## Allowed domains

```
platform.pewresearch.org
pewresearch.org
www.pewresearch.org
alpha.pewresearch.org
beta.pewresearch.org
prc-platform.vipdev.lndo.site
app.github.dev (partial match)
```

Legacy go-vip.net / go-vip.co domains are included for backward compatibility.

## Usage

```php
use PRC\Platform\URL_Helper;

$helper = new URL_Helper( 'https://www.pewresearch.org/internet/2024/01/some-report/' );

if ( ! is_wp_error( $helper->post_id ) ) {
    $post_id = $helper->post_id;
}
```

Returns `WP_Error` with code `404` if:
- The value is not a string
- The value is not a valid URL
- The domain is not in the allowlist
- No matching post is found

## Key files

| File | Purpose |
|------|---------|
| `class-url-helper.php` | URL resolution logic |

## Notes

- GitHub Codespaces URLs (`app.github.dev`) are allowed via substring match for local dev
- To add a domain, edit `$allowed_domains` in `class-url-helper.php`
