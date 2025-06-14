<?php
/**
 * Mailchimp API Integration
 *
 * Handles all Mailchimp API interactions including newsletter subscriptions and list management.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_Error;
use MailchimpMarketing\ApiClient;

/**
 * We send all mail through Mailchimp's Mandrill service and we use Mailchimp to register newsletter subscriptions. This class handles both.
 *
 * @package PRC\Platform
 */
class Mailchimp_API {
	/**
	 * The email address to operate on.
	 *
	 * @var string
	 */
	public $email;

	/**
	 * The Mailchimp API key to use.
	 *
	 * @var string
	 */
	public $api_key;

	/**
	 * The Mailchimp list ID to operate on.
	 *
	 * @var string
	 */
	public $list_id;

	/**
	 * The Mailchimp API client instance.
	 *
	 * @var ApiClient
	 */
	public $mailchimp;

	/**
	 * Gets the appropriate API key based on the provided key type.
	 *
	 * @param string $key The type of API key to retrieve.
	 * @return string|void The API key if found, void otherwise.
	 */
	protected function get_matching_api_key( $key ) {
		if ( ! defined( 'PRC_PLATFORM_MAILCHIMP_KEY' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_MAILCHIMP_FORM_BLOCK_KEY' ) ) {
			return;
		}
		if ( ! defined( 'PRC_PLATFORM_MAILCHIMP_SELECT_BLOCK_KEY' ) ) {
			return;
		}

		if ( 'mailchimp-form' === $key ) {
			return PRC_PLATFORM_MAILCHIMP_FORM_BLOCK_KEY;
		}
		if ( 'mailchimp-select' === $key ) {
			return PRC_PLATFORM_MAILCHIMP_SELECT_BLOCK_KEY;
		}
		return PRC_PLATFORM_MAILCHIMP_KEY;
	}

	/**
	 * Constructor for the Mailchimp API class.
	 *
	 * @param string $email_address The email address to operate on.
	 * @param array  $args          Additional arguments.
	 *                              - api_key: The API key to use.
	 *                              - list_id: The list ID to operate on.
	 */
	public function __construct($email_address, $args = array(
		'api_key' => false,
		'list_id' => null,
	)) {
		if ( ! class_exists( 'MailchimpMarketing\ApiClient' ) ) {
			return new WP_Error( 'no-mailchimp-class', __( 'No Mailchimp class found', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}
		$this->email   = is_email( $email_address );
		$this->api_key = $this->get_matching_api_key( $args['api_key'] );
		$this->list_id = $args['list_id'];

		$this->mailchimp = new ApiClient();
		$config          = array(
			'apiKey' => $this->api_key,
			'server' => substr( $this->api_key, -3 ), // Extract server prefix from API key.
		);
		$this->mailchimp->setConfig( $config );
	}

	/**
	 * Gets the segment IDs for the current list.
	 *
	 * @return array|WP_Error The segment IDs or an error.
	 */
	public function get_segment_ids() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$cache_key = 'prc-mailchimp-segments';

		$list_id = $this->list_id;

		$cached = wp_cache_get( $cache_key );

		if ( $cached ) {
			return $cached;
		}

		try {
			$response = $this->mailchimp->lists->listSegments( $list_id );
			$segments = $response->segments;

			$segments = array_map(
				function ( $segment ) {
					if ( isset( $segment->options->conditions[0]->value[0] ) ) {
						$interest_id = $segment->options->conditions[0]->value[0];
					} else {
						$interest_id = null;
					}
					if ( null === $interest_id || strlen( $interest_id ) < 2 ) {
						return null;
					}
					return array(
						'id'           => $segment->id,
						'name'         => str_replace( 'Receives ', '', $segment->name ),
						'member_count' => $segment->member_count,
						'interest_id'  => $interest_id,
					);
				},
				$segments
			);

			$segments = array_filter( $segments );
			wp_cache_set( $cache_key, $segments, '', 1 * DAY_IN_SECONDS );

			return rest_ensure_response( $segments );
		} catch ( \Exception $e ) {
			$error = new WP_Error( 'get-segments-error', __( 'Failed to get segments', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
			return rest_ensure_response( $error );
		}
	}

	/**
	 * Constructs the interests array for API calls.
	 *
	 * @param array $interests The interests to construct.
	 * @return array The constructed interests array.
	 */
	private function construct_interests( $interests = array() ) {
		$return = array();
		foreach ( $interests as $interest_id ) {
			$return[ $interest_id ] = true;
		}
		return $return;
	}

	/**
	 * Adds interests to a member's profile.
	 *
	 * @param array $interests The interests to add.
	 * @return array|WP_Error The result or an error.
	 */
	private function add_interest( $interests = array() ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}

		$list_id = $this->list_id;

		$email = $this->email;
		if ( ! $email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = md5( strtolower( $email ) );

		try {
			$result = $this->mailchimp->lists->updateListMember(
				$list_id,
				$subscriber_hash,
				array(
					'interests' => $interests,
				)
			);

			return array(
				'success'   => true,
				'status'    => $result->status,
				'interests' => $result->interests,
				'id'        => $result->id,
			);
		} catch ( \Exception $e ) {
			return new WP_Error( 'add-interest-to-member-error', $e->getMessage(), array( 'status' => 400 ) );
		}
	}

	/**
	 * Updates a member's interests.
	 *
	 * @param array $interests The interests to update.
	 * @return array|WP_Error The result or an error.
	 */
	public function update_interests( $interests = array() ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}

		$list_id = $this->list_id;

		if ( empty( $interests ) ) {
			return new WP_Error( 'no-interests-provided', __( 'No interests provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$email = $this->email;
		if ( ! $email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = md5( strtolower( $email ) );

		try {
			$result = $this->mailchimp->lists->updateListMember(
				$list_id,
				$subscriber_hash,
				array(
					'interests' => $interests,
				)
			);

			return array(
				'success'   => true,
				'status'    => $result->status,
				'interests' => $result->interests,
				'id'        => $result->id,
			);
		} catch ( \Exception $e ) {
			return new WP_Error( 'update-newsletter-preferences', $e->getMessage(), array( 'status' => 400 ) );
		}
	}

	/**
	 * Subscribes an email to the list.
	 *
	 * @param array  $name        The name array containing first and last name.
	 * @param array  $interests   The interests to set.
	 * @param string $origin_url  The origin URL of the subscription.
	 * @return array|WP_Error The result or an error.
	 */
	public function subscribe_to_list( $name = array(), $interests = array(), $origin_url = false ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}

		$list_id = $this->list_id;

		$email = $this->email;
		if ( ! $email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$payload = array(
			'email_address' => $email,
			'status'        => 'subscribed',
		);

		if ( is_array( $interests ) && ! empty( $interests ) ) {
			$payload['interests'] = $this->construct_interests( $interests );
		}

		if ( ! empty( $name ) ) {
			$payload['merge_fields'] = array(
				'FNAME' => $name[0],
				'LNAME' => $name[1],
			);
		}

		if ( ! empty( $origin_url ) && ! filter_var( $origin_url, FILTER_VALIDATE_URL ) === false ) {
			$payload['merge_fields']['ORIGINURL'] = esc_url( $origin_url );
		}

		try {
			$result = $this->mailchimp->lists->addListMember( $list_id, $payload );

			return array(
				'success'   => true,
				'status'    => $result->status,
				'interests' => $result->interests,
				'id'        => $result->id,
			);
		} catch ( \Exception $e ) {
			if ( strpos( $e->getMessage(), 'Member Exists' ) !== false ) {
				$subscriber_hash = md5( strtolower( $email ) );

				try {
					$this->mailchimp->lists->updateListMember(
						$list_id,
						$subscriber_hash,
						array(
							'status' => 'subscribed',
						)
					);

					return $this->add_interest( $this->construct_interests( $interests ) );
				} catch ( \Exception $update_error ) {
					return new WP_Error( 'update-member-error', $update_error->getMessage(), array( 'status' => 400 ) );
				}
			}
			return new WP_Error( 'add-member-error', $e->getMessage(), array( 'status' => 400 ) );
		}
	}

	/**
	 * Unsubscribes an email from the list.
	 *
	 * @return array|WP_Error The result or an error.
	 */
	public function unsubscribe_from_list() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}

		$list_id = $this->list_id;

		$email = $this->email;
		if ( ! $email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = md5( strtolower( $email ) );

		try {
			$result = $this->mailchimp->lists->deleteListMember( $list_id, $subscriber_hash );
			return $result;
		} catch ( \Exception $e ) {
			return new WP_Error( 'remove-member-error', $e->getMessage(), array( 'status' => 400 ) );
		}
	}

	/**
	 * Gets a member's information.
	 *
	 * @return array|WP_Error The member information or an error.
	 */
	public function get_member() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}

		$list_id = $this->list_id;

		$email = $this->email;
		if ( ! $email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = md5( strtolower( $email ) );

		try {
			$result = $this->mailchimp->lists->getListMember( $list_id, $subscriber_hash );
			return $result;
		} catch ( \Exception $e ) {
			return new WP_Error( 'get-member-error', $e->getMessage(), array( 'status' => 400 ) );
		}
	}
}


// $test = new Mailchimp_API(
// 'smrubenstein@gmail.com',
// array(
// 'api_key' => 'xyz',
// 'list_id' => 'b0b0b0b0b0',
// )
// );

// $test->update_interests(
// array(
// 'xyz',
// 'abce',
// )
// );

// $test->subscribe_to_list(
// array(
// 'fname' => 'Sam',
// 'lname' => 'Rubenstein',
// ),
// array(
// 'xyz',
// 'abce',
// ),
// 'https://www.pewresearch.org/article-page-url'
// );
