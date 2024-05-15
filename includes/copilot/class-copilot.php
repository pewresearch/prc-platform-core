<?php
namespace PRC\Platform;

class Copilot {
	public static $platform_version;

	public function __construct($version, $loader) {
		self::$platform_version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			add_filter( 'wp_parsely_enable_content_helper_excerpt_generator', '__return_false' );
		}
	}
}
