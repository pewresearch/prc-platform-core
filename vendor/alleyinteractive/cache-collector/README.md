# Cache Collector

[![Coding Standards](https://github.com/alleyinteractive/cache-collector/actions/workflows/coding-standards.yml/badge.svg)](https://github.com/alleyinteractive/cache-collector/actions/workflows/coding-standards.yml)
[![Testing Suite](https://github.com/alleyinteractive/cache-collector/actions/workflows/unit-test.yml/badge.svg)](https://github.com/alleyinteractive/cache-collector/actions/workflows/unit-test.yml)

Dynamic cache key collector for easy purging.

## Background

One common problem with large WordPress sites that utilize Memcache is the
problems that arise when trying to purge cache keys that are dynamically
generated. For example, if a cache key is the hash of a remote request. You
would need to calculate the hashed cache key to properly purge it from the
cache. Another common problem would be trying to purge all the cache keys in a
specific group (Memcache doesn't support group purging).

Cache Collector solves this by storing cache/transient keys in collections.
These collections can then be purged in a single command. Here's a real-world
use case:

When viewing a post, the post's related posts are fetched from a remote source
and displayed to the user. This operation is expensive due to the remote request
and needs to be cached. When the post is updated, the related post cache needs
to be flushed as well.

Enter Cache Collector. When the post is updated, the related post cache key is
added to a collection. When the post is updated, the cache key that is connected
to the post will automatically be purged.

To flip this around, say the remote data source is having issues and you need to
flush all the related post cache keys. You can do this by purging the "related
posts" cache collection. This stores all the cache keys for all related posts.
In one command you can purge an entire cache group without having to calculate
the cache key for each.

## Installation

You can install the package via composer:

```bash
composer require alleyinteractive/cache-collector
```

## Usage

Activate the plugin in WordPress and use the below methods to interface with the
cache collector.

### Registering Keys

**One important note when registering cache keys:** registering a key should
only be done when the cache/transient is stored. When the key is stored the
system will set an expiration date for the key to be eventually purged from the
collection if unused. To prevent continually updating the keys in the collection
and degrading site performance, the key should only be registered when the
cache/transient is stored. The cache collector will eventually remove the key from
the collection when it expires.

TL;DR: Register the key only when the cache/transient is stored. Don't register
it on every page load.

### Register a Key in a Cache Collection

```php
cache_collector_register_key( string $collection, string $key, string $group = '', int $ttl = 0, string $type = 'cache' );

// Example using named arguments.
cache_collector_register_key(
	collection: 'related_posts',
	key: $related_posts_cache_key,
	group: 'related_posts',
	ttl: 3600,
	type: 'cache',
);
```

The plugin also provides `cache_collector_register_transient_key()` and
`cache_collector_register_cache_key()` to make it easier to register keys for a
transient/cache without having to specify the `$type` argument.

```php
cache_collector_register_transient_key( string $collection, string $transient, int $ttl = 0 );
cache_collector_register_cache_key( string $collection, string $key, string $group = '', int $ttl = 0 );
```

### Purging a Cache Collection

Purge all the cache entries in a collection.

```php
cache_collector_purge( string $collection );
```

### Registering a Key Related to a Post

A post cache collection is a collection of cache keys related to a post. When a
post is updated, the post's cache collection is automatically purged. This
allows you to purge all of the cache keys related to a post at once.

```php
cache_collector_register_post_key( \WP_Post|int $post, string $key, string $group = '', string $type = 'cache' );

// Example using named arguments.
cache_collector_register_post_key(
	post: $post,
	key: $related_posts_cache_key,
	group: 'related_posts',
	type: 'cache',
);
```

### Purging a Post's Cache Collection

Purge a cache collection related to a post.

```php
cache_collector_purge_post( \WP_Post|int $post_id );
```

### Registering a Key Related to a Term

```php
cache_collector_register_term_key( \WP_Term|int $term, string $key, string $group = '', string $type = 'cache' );

// Example using named arguments.
cache_collector_register_term_key(
	term: $term,
	key: $related_posts_cache_key,
	group: 'related_posts',
	type: 'cache',
);
```

### Purging a Term's Cache Collection

```php
cache_collector_purge_term( \WP_Term|int $term );
```

## Full Example

The following example shows how to use the cache collector to register a cache
key for future purging.

```php
$arguments = [
	'limit' => 100,
	'term' => '...',
	'fields' => [ ... ],
];

$data = wp_cache_get( md5( $arguments ), 'my_cache_group' );

if ( false === $data ) {
	$data = remote_data_fetch( $arguments );
	wp_cache_set( md5( $arguments ), $data, 'my_cache_group' );

	// Register the cache key for the collection.
	cache_collector_register_cache_key( 'my_collection', md5( $arguments ), 'my_cache_group' );
}
```

Now we can purge the cache collection whenever we need to:

```php
cache_collector_purge( 'my_collection' );
```

We can also purge this with the WP-CLI command included with the plugin:

```bash
wp cache-collector purge my_collection
```

## Testing

Run `composer test` to run tests against PHPUnit and the PHP code in the plugin.

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

This project is actively maintained by [Alley
Interactive](https://github.com/alleyinteractive). Like what you see? [Come work
with us](https://alley.co/careers/).

- [Sean Fisher](https://github.com/srtfisher)
- [All Contributors](../../contributors)

## License

The GNU General Public License (GPL) license. Please see [License File](LICENSE) for more information.
