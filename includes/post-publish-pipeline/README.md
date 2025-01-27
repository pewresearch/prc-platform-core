# Post Publish Pipeline

A PHP and Javascript implementation of a post-publish pipeline for the Pew Research Center platform. This provides convenient, stable, and extensible hooks that follow a post object through it's entire lifecycle; from init into the db, to subsequent incremental saves, to publish, to updates after publish, to unpublishing, to trashing, and lastly to untrashing. All hooks are designed with sanity checks so you don't have to worry about things like ajax, autosaving, revisions, etc. These hooks work, exactly when you expect them to and only when you expect them to.

## Client Side Hooks

All client side hooks received `{edits, postId, postStatus, postType}` properties:

- `prc-platform.onSiteEdit` Occurs every time an update is applied in the site editor.
- `prc-platform.onPostInit` Occurs once, when a post transition from non existent to `draft` state.
- `prc-platform.onIncrementalSave` Occurs often, whenever a post in a `draft` state is updated.
- `prc-platform.onPublish` Occurs when a post transitions from `draft` to `publish` state.
- `prc-platform.onUpdate` Occurs when a post is either in `draft` or `publish` state and is updated.
- `prc-platform.onUnpublish` Occurs when a post transitions from `publish` to `draft` state.

### Client Side Example

```js
import { addAction } from '@wordpress/hooks';

addAction('prc-platform.onPublish', 'my-plugin', ({postId, postStatus, postType}) => {
  console.log(`A post of type ${postType} with ID ${postId} was published with status ${postStatus}`);
});
```

## Server Side Hooks

All server side hooks receive `($ref_post, $has_blocks)` properties.

All server side hooks have matching hooks for their post type to target specific post types. For example, `prc_platform_on_publish` has `prc_platform_on_{post_type}_publish` e.g. `prc_platform_on_fact-sheet_publish`.

- `prc_platform_on_post_init` Occurs once, when a post transition from non existent to `draft` state.
- `prc_platform_on_incremental_save` Occurs often, whenever a post in either `draft` or `publish` state is updated.
- `prc_platform_on_publish`  Occurs once, when a post transitions from `draft` to `publish` state.
- `prc_platform_on_update` Occurs often, whenever a post in `publish` state is updated.
- `prc_platform_on_unpublish` Occurs once, when a post transitions from `publish` to `draft` state.
- `prc_platform_on_trash` Occurs once, when a post transitions from `publish` to `trash` state.
- `prc_platform_on_untrash` Occurs once, when a post transitions from `trash` to `publish` state.

### Server Side Example

```php
add_action('prc_platform_on_publish', function($ref_post, $has_blocks) {
  error_log('A post of type ' . $ref_post->post_type . ' with ID ' . $ref_post->ID . ' was published. It does ' . ($has_blocks ? '' : 'not ') . 'have blocks.');
}, 10, 2);
```

---

#### Additional Properties

Additionally, the follow properties are added to all post objects either server side in PHP classes or directly on objects in the REST API.

- `label` Is either the Format taxonomy label associated with the post or the Category taxonomy label associated with the post.
- `post_parent` If this post is a child it'll contain the parent's id. This is normally found in PHP WP_Post class but is missing in the REST API, this adds it back.
- `word_count` Is a simple word count of the `post_content` stripped of HTML tags.
- `canonical_url` Is the canonical URL of the post.
- `visibility` Is our custom post visibility implementation and returns either `null`, 'public', 'hidden_from_search', 'hidden_from_index`.

