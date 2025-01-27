<?php
namespace PRC\Platform;

class Copilot {
	public static $platform_version;

	public function __construct( $version, $loader ) {
		self::$platform_version = $version;
		$this->init( $loader );
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// Nothing to see here, for now...
		}
	}
}
