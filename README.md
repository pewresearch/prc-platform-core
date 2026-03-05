# PRC Platform Core

The required foundation plugin for the PRC Platform. It boots all shared infrastructure — utilities, taxonomies, REST API extensions, post-lifecycle hooks, and integrations — that every other platform plugin depends on. Nothing else works without it.

## What It Provides

| Module | Description |
|---|---|
| **AI** | MCP adapter and content-guidelines AI sidebar for the block editor |
| **Action Scheduler** | Async background job infrastructure with an AI experiment ability |
| **Block Editor** | Block category enforcement and shared editor sidebar utilities |
| **Block Utils** | Paired PHP/JS primitives: `find_block`/`findBlock`, `classNames`, Interactivity API data extractors |
| **Firebase** | Firebase integration layer |
| **Gutenberg** | Core Gutenberg compatibility and hook overrides |
| **Icon Loader** | Shared SVG icon loading |
| **Mailchimp** | Mailchimp integration |
| **Media** | Attachment downloader, media size definitions |
| **Post Publish Pipeline** | Normalized lifecycle hooks for every post state transition (see below) |
| **REST API** | Platform-wide REST API extensions and additional post properties |
| **Rewrites** | Permalink structure and custom query variable management |
| **Script Modules** | ES module registration and enqueueing |
| **Scripts** | Classic script registration and enqueueing |
| **Taxonomies** | Shared taxonomy helpers: term description filtering, comma replacement, activity trail |
| **Templates** | Template loading utilities |
| **Term Data Store** | Enforces 1:1 term↔CPT relationships (forked from 10up) |
| **URL Helper** | Resolves a post ID from any URL type (preview, edit, canonical) |
| **User Permissions** | Role and capability management via versioned JSON config |
| **WP Admin** | Admin UI utilities |
| **WP HTML Sub-processors** | HTML tag processors: element getter, heading processor, table processor |
| **Feeds** | RSS/Atom/JSON feed customizations |
| **Housekeeping** | Automated scheduled cleanup tasks |
| **Jetpack** | Jetpack configuration |

## Post Publish Pipeline

The most-used module for other platform plugins. Provides sanity-checked lifecycle hooks that fire at the right time and skip REST, autosave, revisions, and WP-CLI contexts automatically.

### Server-side PHP hooks

All hooks receive `($ref_post, $has_blocks)`. Each hook also has a post-type-specific variant: `prc_platform_on_{post_type}_publish`, etc.

| Hook | When it fires |
|---|---|
| `prc_platform_on_post_init` | Post transitions from non-existent → draft (once) |
| `prc_platform_on_incremental_save` | Any draft or publish update |
| `prc_platform_on_publish` | Draft → publish (once) |
| `prc_platform_on_update` | Any update while published |
| `prc_platform_on_unpublish` | Publish → draft (once) |
| `prc_platform_on_trash` | Any state → trash (once) |
| `prc_platform_on_untrash` | Trash → publish (once) |

```php
add_action( 'prc_platform_on_publish', function( $ref_post, $has_blocks ) {
    // fires once when the post goes live
}, 10, 2 );
```

### Client-side JS hooks

All hooks receive `{ edits, postId, postStatus, postType }`.

| Hook | When it fires |
|---|---|
| `prc-platform.onSiteEdit` | Any site editor update |
| `prc-platform.onPostInit` | Draft created for the first time |
| `prc-platform.onIncrementalSave` | Draft updated |
| `prc-platform.onPublish` | Draft → publish |
| `prc-platform.onUpdate` | Any update while draft or published |
| `prc-platform.onUnpublish` | Publish → draft |

```js
import { addAction } from '@wordpress/hooks';

addAction( 'prc-platform.onPublish', 'my-plugin', ( { postId, postType } ) => {
    console.log( `${ postType } #${ postId } went live` );
} );
```

## Block Utils

PHP and JS utils are always paired. For every PHP util there is an equivalent JS export and vice versa.

| PHP | JS | Purpose |
|---|---|---|
| `find_block()` | `findBlock()` | Find a block by name in a parsed block tree |
| `get_block_gap_support_value()` | `getBlockGapSupportValue()` | Read the block-gap support value |
| `classNames()` | `classNames()` | Conditional class name builder |
| `get_wp_interactive_context()` | — | Extract Interactivity API context from inner block attributes |
| `get_wp_interactive_classname()` | — | Extract `data-wp-class` value from inner blocks |

## REST API: Additional Post Properties

These properties are added to all post objects via REST:

| Property | Description |
|---|---|
| `label` | Format taxonomy label, falling back to Category label |
| `post_parent` | Parent post ID (restored from PHP to REST) |
| `word_count` | Word count of `post_content` stripped of HTML |
| `canonical_url` | The canonical URL of the post |
| `visibility` | `null`, `public`, `hidden_from_search`, or `hidden_from_index` |

## Constants

| Constant | Default | Purpose |
|---|---|---|
| `PRC_PRIMARY_SITE_ID` | `1` | Network primary site ID |
| `DEFAULT_TECHNICAL_CONTACT` | `webdev@pewresearch.org` | Default contact email |
| `TAXONOMY_TECHNICAL_CONTACT` | `webdev@pewresearch.org` | Taxonomy contact email |
| `PRC_PLATFORM_CORE_DIR` | _(auto)_ | Absolute path to plugin root |

## Development

```bash
# Build the AI module JS
npm run build:ai -w @prc/platform-core

# Dev mode for AI module
npm run start:ai -w @prc/platform-core

# Generate docs
npm run docs:build -w @prc/platform-core
```

> Modules marked with a `WIP.md` file in their folder are not yet complete and not in active use.
