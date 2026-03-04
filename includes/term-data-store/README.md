# Term Data Store

Create a one-to-one relationships between posts and terms and keep them in sync.
Forked from 10up.
This version includes stricter binding between post type and taxonomy utilizing term id and post id binding.

## How to Use

### 1. Register a custom post type:

```php
$post_type_name    = 'show_pt';
$post_type_options = array();

register_post_type(
	$post_type_name, $post_type_options
);
```

### 2. Register a taxonomy:

```php
$taxonomy_name      = 'show_tax';
$taxonomy_options   = array();
$post_types         = array( 'post' );

register_taxonomy(
	$taxonomy_name, $post_types, $taxonomy_options
);
```

### 3. Create the relationship between the post type and taxonomy:

```php
\TDS\add_relationship( $post_type_name, $taxonomy_name );
```

By default, this will enable automatic permalink rewrites so that single post URLs redirect to their corresponding taxonomy term archive pages. This is useful when the post type serves as a data store for the taxonomy, and the term archive is the primary way to view content.

#### Optional: Disable Automatic Permalink Rewrites

If you want to handle permalinks yourself (e.g., the post type has its own permalink structure), you can disable automatic rewrites by passing `false` as the third parameter:

```php
\TDS\add_relationship( $post_type_name, $taxonomy_name, false );
```

**Example use case:** The `prc-collections` plugin uses this approach because collection posts have their own rewrite rules and don't need to redirect to term archives.

### 4. Create a post or term:

Creating a post named "The Tick" in the post type will create a corresponding term named "The Tick" in the taxonomy. The reverse will happen if you create a term in the taxonomy.

## Automatic Permalink Rewrites

When you create a relationship using `add_relationship()`, the term data store automatically handles permalink rewrites for single posts, redirecting them to their corresponding taxonomy term archives. This behavior is enabled by default but can be disabled if needed.

### How It Works

When a user visits a single post URL (e.g., `/staff/john-doe/`), the system:

1. Checks if the post type matches a term data store relationship
2. Retrieves the related taxonomy term
3. Redirects to the term archive page (e.g., `/staff/john-doe/` as a taxonomy archive)

This creates a seamless experience where the post type acts as a backend data store while the taxonomy archive serves as the frontend view.

### Configuration

**Default behavior (automatic rewrites enabled):**

```php
\TDS\add_relationship( 'staff', 'bylines' );
// Single staff posts will redirect to their byline term archive
```

**Opt-out (disable automatic rewrites):**

```php
\TDS\add_relationship( 'collections', 'collection', false );
// Collections will use their own permalink structure
```

### Implementation Examples

**Staff Bylines:** Single staff posts redirect to byline term archives where all posts by that staff member are displayed.

**Datasets:** Single dataset posts redirect to dataset term archives where the dataset details and associated content are shown.

**Collections:** Opt-out of rewrites to maintain custom collection post permalinks.

## Unit Tests

TDS has a full suite of unit tests to verify expected behavior. To run them, you'll first need to install the composer dependencies:

```sh
composer update
```

Once you have those installed, run phpunit:

```sh
vendor/bin/phpunit
```
