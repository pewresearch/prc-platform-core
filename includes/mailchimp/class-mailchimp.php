<?php
namespace PRC\Platform;
use WP_Error;

/**
 * We send all mail through Mailchimp's Mandrill service and we use Mailchimp to register newsletter subscriptions. This class handles both.
 * @package PRC\Platform
 */
class Mailchimp {
	protected $default_list_id = '3e953b9b70';
	protected $api_keys;
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-mailchimp';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
		require_once( plugin_dir_path( __FILE__ ) . 'class-mailchimp-api.php' );
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
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

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	/**
	 * @hook wp_mail_from_name
	 * @param mixed $name
	 * @return string
	 */
	public function change_default_from_name($name) {
		return defined('DEFAULT_EMAIL_SENDER') ? DEFAULT_EMAIL_SENDER : 'PRC Platform';
	}

	/**
	 * @hook wp_mail_from
	 * @param mixed $email
	 * @return string
	 */
	public function change_default_mail_from_address($email) {
		return defined('DEFAULT_EMAIL_ADDRESS') ? DEFAULT_EMAIL_ADDRESS : 'no-reply@local.local';
	}

	protected function generate_subscribe_nonce() {
		return wp_create_nonce( 'prc-mailchimp-subscribe' );
	}

	protected function generate_unsubscribe_nonce() {
		return wp_create_nonce( 'prc-mailchimp-unsubscribe' );
	}

	protected function generate_update_interests_nonce() {
		return wp_create_nonce( 'prc-mailchimp-update-interests' );
	}

	protected function generate_get_member_nonce() {
		return wp_create_nonce( 'prc-mailchimp-get-member' );
	}

	protected function verify_subscribe_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, 'prc-mailchimp-subscribe' );
	}

	protected function verify_unsubscribe_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, 'prc-mailchimp-unsubscribe' );
	}

	protected function verify_update_interests_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, 'prc-mailchimp-update-interests' );
	}

	protected function verify_get_member_nonce( $nonce ) {
		return wp_verify_nonce( $nonce, 'prc-mailchimp-get-member' );
	}

	public function get_nonce($nonce_type) {
		switch ($nonce_type) {
			case 'subscribe':
				return $this->generate_subscribe_nonce();
				break;
			case 'unsubscribe':
				return $this->generate_unsubscribe_nonce();
				break;
			case 'update-interests':
				return $this->generate_update_interests_nonce();
				break;
			case 'get-member':
				return $this->generate_get_member_nonce();
				break;
			default:
				return false;
				break;
		}
	}

	public function register_rest_endpoints() {
		register_rest_route(
			'prc-api/v3',
			'/mailchimp/subscribe/',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'subscribe_to_list_restfully' ),
				'args'                => array(
					'email'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_email( $param );
						},
					),
					'fname'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'lname'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'interests' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'captcha_token' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'api_key' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'origin_url' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;

					// check for a nonce value
					if ( ! isset( $_REQUEST['_wpnonce'] ) ) {
						return false;
					}
					// verify the nonce value
					$nonce = $_REQUEST['_wpnonce'];
					return $this->verify_subscribe_nonce( $nonce );
				},
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/mailchimp/unsubscribe/',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'remove_member_from_list_restfully' ),
				'args'                => array(
					'email' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_email( $param );
						},
					),
					'api_key' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'origin_url' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					// check for a nonce value
					if ( ! isset( $_REQUEST['nonce'] ) ) {
						return false;
					}
					// verify the nonce value
					$nonce = $_REQUEST['nonce'];
					return $this->verify_unsubscribe_nonce( $nonce );
				},
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/mailchimp/update/',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_member_interests_restfully' ),
				'args'                => array(
					'email'     => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_email( $param );
						},
					),
					'interests' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_array( $param );
						},
					),
					'api_key' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'origin_url' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					// check for a nonce value
					if ( ! isset( $_REQUEST['nonce'] ) ) {
						return false;
					}
					// verify the nonce value
					$nonce = $_REQUEST['nonce'];
					return $this->verify_update_interests_nonce( $nonce );
				},
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/mailchimp/get-member/',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_member_restfully' ),
				'args'                => array(
					'email' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_email( $param );
						},
					),
					'api_key' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					// check for a nonce value
					if ( ! isset( $_REQUEST['nonce'] ) ) {
						return false;
					}
					// verify the nonce value
					$nonce = $_REQUEST['nonce'];
					return $this->verify_get_member_nonce( $nonce );
				},
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/mailchimp/get-segments/',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_segments_restfully' ),
				'args'                => array(
					'api_key' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);
	}

	private function verify_captcha( $response_token ) {
		$data = array(
            'secret' => PRC_HCAPTCHA_SECRET,
            'response' => $response_token
        );

		$response = wp_remote_post( "https://hcaptcha.com/siteverify", array('body' => $data) );
		$body     = wp_remote_retrieve_body( $response );

		$responseData = json_decode($body);
		if( $responseData->success ) {
			return true;
		} else {
			return false;
		}
	}

	public function update_member_interests_restfully( \WP_REST_Request $request ) {
		$email     = $request->get_param( 'email' );
		$interests = $request->get_param( 'interests' );
		$api_key = $request->get_param('api_key');
		$mailchimp_api = new Mailchimp_API($email, array(
			'api_key' => $api_key,
			'list_id' => $this->default_list_id,
		));
		return $mailchimp_api->update_interests( $interests );
	}

	public function subscribe_to_list_restfully( \WP_REST_Request $request ) {
		$email = $request->get_param( 'email' );
		$fname = $request->get_param( 'fname' );
		$lname = $request->get_param( 'lname' );

		$captcha_token = $request->get_param( 'captcha_token' );
		$api_key = $request->get_param('api_key');

		$origin_url = $request->get_param('origin_url');

		$verified = $this->verify_captcha( $captcha_token );

		if ( false === $verified ) {
			return new WP_Error(401, 'Captcha could not be verified', array( 'token' => $captcha_token ) );
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

		$mailchimp_api = new Mailchimp_API($email, array(
			'api_key' => $api_key,
			'list_id' => $this->default_list_id,
		));

		return $mailchimp_api->subscribe_to_list( $name, $interests, $origin_url );
	}

	public function remove_member_from_list_restfully( \WP_REST_Request $request ) {
		$email = $request->get_param( 'email' );
		$api_key = $request->get_param('api_key');
		$mailchimp_api = new Mailchimp_API($email, array(
			'api_key' => $api_key,
			'list_id' => $this->default_list_id,
		));
		return $mailchimp_api->unsubscribe_from_list();
	}

	public function get_member_restfully( \WP_REST_Request $request ) {
		$email = $request->get_param( 'email' );
		$api_key = $request->get_param('api_key');
		$mailchimp_api = new Mailchimp_API($email, array(
			'api_key' => $api_key,
			'list_id' => $this->default_list_id,
		));
		return $mailchimp_api->get_member();
	}

	public function get_segments_restfully( \WP_REST_Request $request ) {
		$api_key = $request->get_param('api_key');
		$mailchimp_api = new Mailchimp_API(null, array(
			'api_key' => $api_key,
			'list_id' => $this->default_list_id,
		));
		return $mailchimp_api->get_segment_ids();
	}

	/**
	 * This should run monthly in the action scheduler system.
	 * @hook prc_run_monthly
	 * @return void
	 */
	public function update_segments_list_monthly() {
		$mailchimp_api = new Mailchimp_API(null, array(
			'api_key' => null, // Use the default API key.
			'list_id' => $this->default_list_id,
		));
		$interests = $mailchimp_api->get_segment_ids();
		update_option( 'prc_mailchimp_segment_ids', $interests );
	}

	/**
	 * @hook mandrill_payload
	 * @param mixed $message
	 * @return void
	 */
	public function mandrill_format_message($message) {
		$titles = array(
			'wp_PRC_User_Accounts->mail_new_user'           => 'Account created',
			'wp_wpmu_signup_user_notification'              => 'Activate your account',
			'wp_retrieve_password'                          => 'Reset your password',
			'wp_wp_update_user'                             => 'Password updated',
			'wp_wp_password_change_notification'            => 'Password updated',
			'wp_wpmu_welcome_user_notification'             => 'Welcome to Pew Research Center Publishing Platform',
			'wp_newuser_notify_siteadmin'                   => 'New account notification',
			'wp_Two_Factor_Email->generate_and_email_token' => 'Login confirmation code',
		);

		$content = ( isset( $titles[ $message['tags']['automatic'][0] ] ) ) ?
		$titles[ $message['tags']['automatic'][0] ] : 'Pew Research Center notification';

		// Set lede
		$message['template']['content'][] = array(
			'name'    => 'lede',
			'content' => $content,
		);

		// Set preheader
		$message['template']['content'][] = array(
			'name'    => 'preheader',
			'content' => $content,
		);

		// Make links clickable
		$message['template']['content'][0]['content'] = make_clickable( $message['template']['content'][0]['content'] );

		return $message;
	}
}
