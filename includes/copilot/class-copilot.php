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
			$loader->add_filter( 'ai_services_chatbot_enabled', $this, 'enable_chatbot' );
		}
	}

	public function enable_chatbot( $enabled ) {
		return is_user_admin();
	}
}
