# Media

Manages media uploads, image sizes, CDN integration, and attachment behavior for the PRC Platform.

## What it does

- **Image sizes** — registers all platform image sizes defined in `media-sizes.json`; filters the media library size dropdown to show only platform-defined sizes
- **Upload limits** — enforces a 15 MB maximum file size
- **Admin defaults** — sets sensible image insertion defaults in the WordPress admin
- **CDN cache busting** — clears the VIP CDN when media is replaced via Enable Media Replace (`enable-media-replace-upload-done`)
- **Legacy WebP handling** — rewrites stale `-jpg.webp` / `-png.webp` URLs back to `.jpg` / `.png`
- **Multisite files rewrites** — disables legacy multisite file rewriting
- **oEmbed** — strips `rel=0` (related videos) from YouTube oEmbed output
- **JSON uploads** — adds `application/json` to the allowed MIME types
- **Attachment downloader** — provides `/{attachment}/download` URL schema via `class-attachment-downloader.php`
- **srcset** — enables VIP Go srcset support

## Key files

| File | Purpose |
|------|---------|
| `class-media.php` | Main class; all media hook registration |
| `class-attachment-downloader.php` | Handles `/download` URL endpoint for attachments |
| `media-sizes.json` | Defines all registered image sizes |

## Adding image sizes

Edit `media-sizes.json`. The format is an array of size definitions that are passed to `add_image_size()`. After changing, existing images will need to be regenerated.

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `upload_size_limit` | Filter | Enforces 15 MB max |
| `admin_init` | Action | Sets image insertion defaults |
| `init` | Action | Registers image sizes |
| `enable-media-replace-upload-done` | Action | Clears CDN after media replace |
| `image_size_names_choose` | Filter | Filters size dropdown to platform sizes |
| `vip_go_srcset_enabled` | Filter | Enables srcset |
| `oembed_dataparse` | Filter | Strips YouTube related videos |
| `upload_mimes` | Filter | Allows JSON file uploads |
| `wp_get_attachment_image_src` | Filter | Rewrites legacy WebP URLs |
