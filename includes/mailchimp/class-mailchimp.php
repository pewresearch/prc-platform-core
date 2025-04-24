<?php
/**
 * Mailchimp class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_Error;
use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Psr7\HttpFactory;
use Turnstile\Client\Client;
use Turnstile\Turnstile;

/**
 * We send all mail through Mailchimp's Mandrill service and we use Mailchimp to register newsletter subscriptions. This class handles both.
 *
 * @package PRC\Platform
 */
class Mailchimp {

	/**
	 * The default list ID.
	 *
	 * @var string
	 */
	protected $default_list_id = '3e953b9b70';

	/**
	 * The API keys.
	 *
	 * @var array
	 */
	protected $api_keys;

	/**
	 * The handle.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-mailchimp';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader    The loader object.
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-mailchimp-api.php';
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader    The loader object.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'prc_run_monthly', $this, 'update_segments_list_monthly' );
			$loader->add_filter( 'wp_mail_from_name', $this, 'change_default_from_name' );
			$loader->add_filter( 'wp_mail_from', $this, 'change_default_mail_from_address' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
			$loader->add_filter( 'mandrill_payload', $this, 'mandrill_format_message' );
		}
	}

	/**
	 * Register the assets.
	 *
	 * @return bool|\WP_Error
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$asset_slug = self::$handle;
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';


		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * Enqueue the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	/**
	 * Modify the default from name.
	 *
	 * @hook wp_mail_from_name
	 * @param mixed $name The name.
	 * @return string
	 */
	public function change_default_from_name( $name ) {
		return defined( 'DEFAULT_EMAIL_SENDER' ) ? DEFAULT_EMAIL_SENDER : 'PRC Platform';
	}

	/**
	 * Change the default mail from address.
	 *
	 * @hook wp_mail_from
	 * @param mixed $email The email.
	 * @return string
	 */
	public function change_default_mail_from_address( $email ) {
		return defined( 'DEFAULT_EMAIL_ADDRESS' ) ? DEFAULT_EMAIL_ADDRESS : 'no-reply@local.local';
	}

	/**
	 * Verify the nonce.
	 *
	 * @param mixed $nonce The nonce.
	 * @return bool
	 */
	protected function verify_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, 'wp_rest' );
	}

	/**
	 * Get the nonce.
	 *
	 * @return string The nonce.
	 */
	public function get_nonce() {
		return wp_create_nonce( 'wp_rest' );
	}

	/**
	 * Register endpoints for Mailchimp API
	 *
	 * - /mailchimp/subscribe
	 * - /mailchimp/unsubscribe
	 * - /mailchimp/update
	 * - /mailchimp/get-member
	 * - /mailchimp/get-segments
	 *
	 * @hook prc_api_endpoints
	 *
	 * @param array $endpoints The endpoints.
	 * @return array $endpoints with new endpoints
	 */
	public function register_endpoints( $endpoints ) {
		$subscribe = array(
			'route'               => 'mailchimp/subscribe',
			'methods'             => 'POST',
			'callback'            => array( $this, 'subscribe_to_list_restfully' ),
			'args'                => array(
				'email'         => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_email( $param );
					},
				),
				'fname'         => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'lname'         => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'interests'     => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'captcha_token' => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'api_key'       => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'origin_url'    => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function ( $request ) {
				$nonce = $request->get_header( 'X-WP-Nonce' );
				if ( empty( $nonce ) ) {
					return false; // Nonce missing, permission denied.
				}
				return true;
			},

		);

		$unsubscribe = array(
			'route'               => 'mailchimp/unsubscribe',
			'methods'             => 'POST',
			'callback'            => array( $this, 'remove_member_from_list_restfully' ),
			'args'                => array(
				'email'      => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_email( $param );
					},
				),
				'api_key'    => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'origin_url' => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function ( $request ) {
				$nonce = $request->get_header( 'X-WP-Nonce' );
				if ( empty( $nonce ) ) {
					return false; // Nonce missing, permission denied.
				}
				return true;
			},
		);

		$update = array(
			'route'               => 'mailchimp/update',
			'methods'             => 'POST',
			'callback'            => array( $this, 'update_member_interests_restfully' ),
			'args'                => array(
				'email'      => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_email( $param );
					},
				),
				'interests'  => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_array( $param );
					},
				),
				'api_key'    => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'origin_url' => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function ( $request ) {
				$nonce = $request->get_header( 'X-WP-Nonce' );
				if ( empty( $nonce ) ) {
					return false; // Nonce missing, permission denied.
				}
				return true;
			},
		);

		$get_member = array(
			'route'               => 'mailchimp/get-member',
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_member_restfully' ),
			'args'                => array(
				'email'   => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_email( $param );
					},
				),
				'api_key' => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function ( $request ) {
				$nonce = $request->get_header( 'X-WP-Nonce' );
				if ( empty( $nonce ) ) {
					return false; // Nonce missing, permission denied.
				}
				return true;
			},
		);

		$get_segments = array(
			'route'               => 'mailchimp/get-segments',
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_segments_restfully' ),
			'args'                => array(
				'api_key' => array(
					'validate_callback' => function ( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function ( $request ) {
				return current_user_can( 'edit_posts' );
			},
		);

		array_push( $endpoints, $subscribe, $unsubscribe, $update, $get_member, $get_segments );

		return $endpoints;
	}

	/**
	 * Verify the given captcha token with Cloudflare.
	 *
	 * @param mixed $response_token The response token.
	 * @return bool
	 */
	private function verify_captcha( $response_token ) {
		// Sanity checks to ensure that the constants are defined.
		if ( ! defined( 'PRC_PLATFORM_TURNSTILE_SECRET_KEY' ) ) {
			return;
		}
		$secret_key = PRC_PLATFORM_TURNSTILE_SECRET_KEY;
		if ( empty( $secret_key ) ) {
			if ( 'local' === wp_get_environment_type() ) {
				// Dev key, always returns true.
				return '1x0000000000000000000000000000000AA';
			}
		}
		$client    = new Client(
			new GuzzleHttpClient(),
			new HttpFactory(),
		);
		$turnstile = new Turnstile(
			client: $client,
			secretKey: $secret_key,
		);
		$response  = $turnstile->verify(
			token: $response_token,
		);
		if ( $response->success ) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Update the member interests.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function update_member_interests_restfully( \WP_REST_Request $request ) {
		$email         = $request->get_param( 'email' );
		$interests     = $request->get_param( 'interests' );
		$api_key       = $request->get_param( 'api_key' );
		$mailchimp_api = new Mailchimp_API(
			$email,
			array(
				'api_key' => $api_key,
				'list_id' => $this->default_list_id,
			)
		);
		return $mailchimp_api->update_interests( $interests );
	}

	/**
	 * Subscribe to the list.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function subscribe_to_list_restfully( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $this->verify_nonce( $nonce ) ) {
			return new WP_Error( 401, 'Nonce could not be verified', array( 'nonce' => $nonce ) );
		}
		$email = $request->get_param( 'email' );
		$fname = $request->get_param( 'fname' );
		$lname = $request->get_param( 'lname' );

		$captcha_token = $request->get_param( 'captcha_token' );
		$api_key       = $request->get_param( 'api_key' );

		$origin_url = $request->get_param( 'origin_url' );

		$verified = $this->verify_captcha( $captcha_token );

		if ( false === $verified ) {
			return new WP_Error( 401, 'Captcha could not be verified', array( 'token' => $captcha_token ) );
		}

		if ( ! $fname || ! $lname ) {
			$name = null;
		} else {
			$name = array( $fname, $lname );
		}

		$interests = $request->get_param( 'interests' );
		if ( ! empty( $interests ) ) {
			$interests = explode( ',', $interests );
		} else {
			$interests = null;
		}

		$mailchimp_api = new Mailchimp_API(
			$email,
			array(
				'api_key' => $api_key,
				'list_id' => $this->default_list_id,
			)
		);

		return $mailchimp_api->subscribe_to_list( $name, $interests, $origin_url );
	}

	/**
	 * Remove the member from the list.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function remove_member_from_list_restfully( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $this->verify_nonce( $nonce ) ) {
			return new WP_Error( 401, 'Nonce could not be verified', array( 'nonce' => $nonce ) );
		}
		$email         = $request->get_param( 'email' );
		$api_key       = $request->get_param( 'api_key' );
		$mailchimp_api = new Mailchimp_API(
			$email,
			array(
				'api_key' => $api_key,
				'list_id' => $this->default_list_id,
			)
		);
		return $mailchimp_api->unsubscribe_from_list();
	}

	/**
	 * Get the member.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_member_restfully( \WP_REST_Request $request ) {
		$nonce = $request->get_header( 'X-WP-Nonce' );
		if ( ! $this->verify_nonce( $nonce ) ) {
			return new WP_Error( 401, 'Nonce could not be verified', array( 'nonce' => $nonce ) );
		}
		$email         = $request->get_param( 'email' );
		$api_key       = $request->get_param( 'api_key' );
		$mailchimp_api = new Mailchimp_API(
			$email,
			array(
				'api_key' => $api_key,
				'list_id' => $this->default_list_id,
			)
		);
		return $mailchimp_api->get_member();
	}

	/**
	 * Get the segments.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_segments_restfully( \WP_REST_Request $request ) {
		$api_key       = $request->get_param( 'api_key' );
		$mailchimp_api = new Mailchimp_API(
			null,
			array(
				'api_key' => $api_key,
				'list_id' => $this->default_list_id,
			)
		);
		return $mailchimp_api->get_segment_ids();
	}

	/**
	 * This should run monthly in the action scheduler system.
	 *
	 * @hook prc_run_monthly
	 * @return void
	 */
	public function update_segments_list_monthly() {
		$mailchimp_api = new Mailchimp_API(
			null,
			array(
				'api_key' => null, // Use the default API key.
				'list_id' => $this->default_list_id,
			)
		);
		$interests     = $mailchimp_api->get_segment_ids();
		update_option( 'prc_mailchimp_segment_ids', $interests );
	}

	/**
	 * Format the message for Mandrill.
	 *
	 * @hook mandrill_payload
	 * @param mixed $message The message.
	 * @return void
	 */
	public function mandrill_format_message( $message ) {
		$titles = array(
			'wp_PRC\Platform\User_Accounts\User_Registration->mail_new_user' => 'Account created',
			'wp_wpmu_signup_user_notification'   => 'Activate your account',
			'wp_retrieve_password'               => 'Reset your password',
			'wp_wp_update_user'                  => 'Password updated',
			'wp_wp_password_change_notification' => 'Password updated',
			'wp_wpmu_welcome_user_notification'  => 'Welcome to Pew Research Center Publishing Platform',
			'wp_newuser_notify_siteadmin'        => 'New account notification',
			'wp_Two_Factor_Email->generate_and_email_token' => 'Login confirmation code',
		);

		$content = ( isset( $titles[ $message['tags']['automatic'][0] ] ) ) ?
		$titles[ $message['tags']['automatic'][0] ] : 'Pew Research Center notification';

		// Set lede.
		$message['template']['content'][] = array(
			'name'    => 'lede',
			'content' => $content,
		);

		// Set preheader.
		$message['template']['content'][] = array(
			'name'    => 'preheader',
			'content' => $content,
		);

		// Make links clickable.
		$message['template']['content'][0]['content'] = make_clickable( $message['template']['content'][0]['content'] );

		return $message;
	}
}
