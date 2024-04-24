<?php
namespace PRC\Platform\Cache;

// An abstract class to define the structure of a cache model.
abstract class Cache_Model {
	/**
	 * The cache key.
	 *
	 * @var string
	 */
	protected $key;

	/**
	 * The cache group.
	 *
	 * @var string
	 */
	protected $group;

	/**
	 * The cache data.
	 *
	 * @var mixed
	 */
	protected $data;

	/**
	 * The cache expiration time.
	 *
	 * @var int
	 */
	protected $expiration;

	/**
	 * The cache version.
	 *
	 * @var string
	 */
	protected $version;

	/**
	 * The cache type, ephemeral or persistent.
	 */
	protected $type;

	public function __construct($key, $group, $type, $expiration, $version) {
		$this->key = $key;
		$this->group = $group;
		$this->type = $type; // check that this is either 'ephemeral' or 'persistent'
		$this->expiration = $expiration;
		$this->version = $version;
	}

	public function clear_cache_on_update() {
		// A hook that will run delete_cache() when the cache is updated.
	}

	public function update_value($data) {
		// Update the cache value.
	}

	public function get_value() {
		// Get the cache value.
	}

	public function is_expired() {
		// Check if the cache is expired.
	}

	public function delete_cache() {
		// Delete the cache.
	}
}
