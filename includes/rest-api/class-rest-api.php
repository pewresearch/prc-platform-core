<?php
namespace PRC\Platform;
use WP_Error;

class Rest_API {
	public static $namespace = 'prc-api/v3';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-rest-api';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			// A centralized filter to validate and register /prc-api/v3/ endpoints.
			$loader->add_action( 'rest_api_init', $this, 'register_endpoints' );
		}
	}

	/**
	 * Registers the prc-api endpoints with WordPress.
	 * @hook rest_api_init
	 * @uses prc_api_endpoints
	 */
	public function register_endpoints() {
		$endpoints = apply_filters( 'prc_api_endpoints', array() );
		foreach ( $endpoints as $endpoint ) {
			$this->register_endpoint( $endpoint );
		}
	}

	public function validate_endpoint($opts = array()) {
		$defaults = array(
			'route' => '',
			'methods' => 'GET',
			'callback' => '',
			'args' => array(),
			'permission_callback' => function() {
				return true;
			},
		);
		return wp_parse_args( $opts, $defaults );
	}

	/**
	 * Register a singular endpoint
	 * @param array $opts
	 * @return void
	 */
	public function register_endpoint($opts = array()) {
		$opts = $this->validate_endpoint($opts);

		register_rest_route( self::$namespace, $opts['route'], array(
			'methods' => $opts['methods'],
			'callback' => $opts['callback'],
			'permission_callback' => $opts['permission_callback'],
			'args' => $opts['args'],
		) );
	}


	public function define_nonce() {

	}

	public function verify_nonce() {

	}
}

// for the /prc-api/v3/ rest api and some helper functions around nonces,validation,sanitization, etc...
// apply_filters( 'prc_api_v3_endpoints', array() );

// Rest_API->define_nonce();
// Rest_API->verify_nonce();
