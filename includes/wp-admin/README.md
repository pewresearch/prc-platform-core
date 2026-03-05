# WP Admin

Customizes the WordPress admin experience for the PRC Platform: branding, UI cleanup, admin bar management, dashboard configuration, and quality-of-life improvements for editors.

## What it does

- **Login branding** — replaces the default WordPress login logo with the PRC logo
- **Admin color scheme** — sets a default admin color scheme for all users
- **Admin bar** — removes or reorganizes admin bar items (`manage_admin_bar`, `manage_tools_menu`, `manage_edit_menu`)
- **Dashboard cleanup** — removes unnecessary dashboard widgets; shows all post types in "Recent Posts" and "Recent Drafts" widgets
- **Emoji disabling** — removes WordPress emoji scripts and styles
- **Cookie banner** — conditionally disables the CookiePro banner (e.g., in the WP admin)
- **Public post preview** — sets preview link lifetime to 14 days; removes preview state label from post list
- **Password form** — customizes the post password prompt form
- **Plugin updates** — re-enables plugin update checks in local development environments
- **Multisite label** — customizes the site label in the Multisite Enhancements plugin
- **Platform version** — outputs the platform version string in the WP admin footer
- **Excerpts** — strips the "Overview" label from post excerpts
- **Admin Columns** — loads `Admin_Columns` class for custom list table columns

## Key files

| File | Purpose |
|------|---------|
| `class-wp-admin.php` | Main class; all admin hook registration |
| `admin-columns/class-admin-columns.php` | Custom admin list table column definitions |
| `src/` | Admin JS/CSS source |
| `build/` | Compiled admin assets |

## Hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `admin_enqueue_scripts` | Action | Enqueues admin styles/scripts |
| `login_enqueue_scripts` | Action | Enqueues login page branding |
| `wp_before_admin_bar_render` | Action | Modifies admin bar items (priority 100–102) |
| `admin_print_footer_scripts` | Action | Outputs admin footer customizations |
| `admin_menu` | Action | Removes links menu |
| `wp_dashboard_setup` | Action | Removes dashboard widgets |
| `init` | Action | Disables emojis |
| `get_user_option_admin_color` | Filter | Sets default color scheme |
| `disable_cookiepro` | Filter | Conditionally disables cookie banner |
| `ppp_nonce_life` | Filter | Sets preview link lifetime to 14 days |
| `the_excerpt` | Filter | Strips "Overview" from excerpts |
| `update_footer` | Filter | Outputs platform version |
| `dashboard_recent_posts_query_args` | Filter | Includes all post types in dashboard |
| `dashboard_recent_drafts_query_args` | Filter | Includes all post types in dashboard |
| `the_password_form` | Filter | Customizes password prompt form |
