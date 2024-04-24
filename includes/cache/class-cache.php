<?php
namespace PRC\Platform;

class Cache_Manager {
	public $version;
	/**
	 * @var Cache_Manager
	 */
	private static $instance;

	/**
	 * @var Cache_Utils
	 */
	private $utils;

	/**
	 * @var Cache_Keys
	 */
	private $keys;

	/**
	 * @var Cache_Groups
	 */
	private $groups;

	/**
	 * @var Cache
	 */
	private $cache;

	/**
	 * @var Cache_Invalidator
	 */

	private $invalidator;

	public function __construct($version, $loader) {
		$this->version = $version;
		$this->init($loader);
		$this->invalidator = md5('testing cache manager...');
	}

	public function init($loader = null) {
		if (null !== $loader) {
			// Load all our cache hooks here...
		}
	}


}
