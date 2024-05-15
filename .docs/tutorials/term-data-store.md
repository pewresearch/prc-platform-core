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

### 4. Create a post or term:

Creating a post named "The Tick" in the post type will create a corresponding term named "The Tick" in the taxonomy. The reverse will happen if you create a term in the taxonomy.

## Unit Tests

TDS has a full suite of unit tests to verify expected behavior. To run them, you'll first need to install the composer dependencies:

```sh
composer update
```

Once you have those installed, run phpunit:

```sh
vendor/bin/phpunit
```
