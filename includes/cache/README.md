# PRC Cache Manager

PRC Cache Manager utilizes Cache Collector from Alley Interactive to manage cache keys and transients in WordPress. The plugin provides a simple interface to register cache keys and transients to a collection and purge the collection when needed.

This class registers all cache keys and groups, and provides a centralized method to store data into either our various persistent caches including Varnish, and our ephemeral cache Memcached. It also provides a method to purge the cache keys and groups and schedules and hooks to do so dynamically as needed by functions. 








Usage
Activate the plugin in WordPress and use the below methods to interface with the cache collector.

Registering Keys
One important note when registering cache keys: registering a key should only be done when the cache/transient is stored. When the key is stored the system will set an expiration date for the key to be eventually purged from the collection if unused. To prevent continually updating the keys in the collection and degrading site performance, the key should only be registered when the cache/transient is stored. The cache collector will eventually remove the key from the collection when it expires.

TL;DR: Register the key only when the cache/transient is stored. Don't register it on every page load.

Register a Key in a Cache Collection
cache_collector_register_key( string $collection, string $key, string $group = '', int $ttl = 0, string $type = 'cache' );

// Example using named arguments.
cache_collector_register_key(
	collection: 'related_posts',
	key: $related_posts_cache_key,
	group: 'related_posts',
	ttl: 3600,
	type: 'cache',
);
The plugin also provides cache_collector_register_transient_key() and cache_collector_register_cache_key() to make it easier to register keys for a transient/cache without having to specify the $type argument.

cache_collector_register_transient_key( string $collection, string $transient, int $ttl = 0 );
cache_collector_register_cache_key( string $collection, string $key, string $group = '', int $ttl = 0 );
Purging a Cache Collection
Purge all the cache entries in a collection.

cache_collector_purge( string $collection );
Registering a Key Related to a Post
A post cache collection is a collection of cache keys related to a post. When a post is updated, the post's cache collection is automatically purged. This allows you to purge all of the cache keys related to a post at once.

cache_collector_register_post_key( \WP_Post|int $post, string $key, string $group = '', string $type = 'cache' );

// Example using named arguments.
cache_collector_register_post_key(
	post: $post,
	key: $related_posts_cache_key,
	group: 'related_posts',
	type: 'cache',
);
Purging a Post's Cache Collection
Purge a cache collection related to a post.

cache_collector_purge_post( \WP_Post|int $post_id );
Registering a Key Related to a Term
cache_collector_register_term_key( \WP_Term|int $term, string $key, string $group = '', string $type = 'cache' );

// Example using named arguments.
cache_collector_register_term_key(
	term: $term,
	key: $related_posts_cache_key,
	group: 'related_posts',
	type: 'cache',
);
Purging a Term's Cache Collection
cache_collector_purge_term( \WP_Term|int $term );
Full Example
The following example shows how to use the cache collector to register a cache key for future purging.

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
Now we can purge the cache collection whenever we need to:

cache_collector_purge( 'my_collection' );
We can also purge this with the WP-CLI command included with the plugin:

wp cache-collector purge my_collection
