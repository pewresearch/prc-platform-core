<?php
/**
 * Rest API class.
 *
 * @package PRC\Platform
 */
namespace PRC\Platform;

use WP_Error;

/**
 * Rest API class.
 *
 * @package PRC\Platform
 */
class Rest_API {
	/**
	 * The PRC APInamespace.
	 *
	 * @since    1.0.0
	 * @access   public
	 * @var      string    $namespace    The namespace.
	 */
	public static $namespace = 'prc-api/v3';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader    The loader.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader    The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// A centralized filter to validate and register /prc-api/v3/ endpoints. `prc_api_endpoints` is the filter name.
			$loader->add_action( 'rest_api_init', $this, 'register_endpoints' );
		}
	}

	/**
	 * Registers the prc-api endpoints with WordPress.
	 *
	 * @hook rest_api_init
	 * @uses prc_api_endpoints
	 */
	public function register_endpoints() {
		$endpoints = apply_filters( 'prc_api_endpoints', array() );
		foreach ( $endpoints as $endpoint ) {
			$this->register_endpoint( $endpoint );
		}
	}

	/**
	 * Validate the endpoint.
	 *
	 * @param array $opts The options.
	 * @return array The validated options.
	 */
	public function validate_endpoint( $opts = array() ) {
		$defaults = array(
			'route'               => '',
			'methods'             => 'GET',
			'callback'            => '',
			'args'                => array(),
			'permission_callback' => function () {
				return true;
			},
		);
		return wp_parse_args( $opts, $defaults );
	}

	/**
	 * Register a singular endpoint
	 *
	 * @param array $opts The options.
	 */
	public function register_endpoint( $opts = array() ) {
		$opts = $this->validate_endpoint( $opts );

		register_rest_route(
			self::$namespace,
			$opts['route'],
			array(
				'methods'             => $opts['methods'],
				'callback'            => $opts['callback'],
				'permission_callback' => $opts['permission_callback'],
				'args'                => $opts['args'],
			)
		);
	}
}
