<?php
namespace PRC\Platform;
use WP_Error;
use \DrewM\MailChimp\MailChimp;

/**
 * We send all mail through Mailchimp's Mandrill service and we use Mailchimp to register newsletter subscriptions. This class handles both.
 * @package PRC\Platform
 */
class Mailchimp_API {
	private $email;
	private $api_key;
	private $list_id;

	protected function get_matching_api_key($key) {
		if ( 'mailchimp-form' === $key ) {
			return PRC_PLATFORM_MAILCHIMP_FORM_BLOCK_KEY;
		}
		if ( 'mailchimp-select' === $key ) {
			return PRC_PLATFORM_MAILCHIMP_SELECT_BLOCK_KEY;
		}
		return PRC_PLATFORM_MAILCHIMP_KEY;
	}

	public function __construct($email_address, $args = array(
		'api_key' => false,
		'list_id' => null,
	)) {
		if ( ! class_exists( 'DrewM\MailChimp\MailChimp' ) ) {
			return new WP_Error( 'no-mailchimp-class', __( 'No Mailchimp class found', 'prc-mailchimp-api' ), array( 'status' => 400 ) );
		}
		$this->email   = is_email($email_address);
		$this->api_key = $this->get_matching_api_key($args['api_key']);
		$this->list_id = $args['list_id'];
	}

	public function get_segment_ids() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$cache_key = 'prc-mailchimp-segments-' . $api_key;
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		$cached = get_transient( $cache_key );

		if ( $cached ) {
			return $cached;
		}

		$response = $mailchimp->get(
			"lists/$list_id/segments",
			array('count' => 100)
		);

		if ($mailchimp->success()) {
			$segments = $response['segments'];
			$segments = array_map(function($segment) {
				if (isset($segment['options']['conditions'][0]['value'][0])) {
					$interest_id = $segment['options']['conditions'][0]['value'][0];
				} else {
					// Handle the case where the value does not exist
					$interest_id = null; // or any default value
				}
				if (null === $interest_id || strlen($interest_id) < 2) {
					return null;
				}
				return array(
					'id' => $segment['id'],
					'name' => str_replace('Receives ', '', $segment['name']),
					'member_count' => $segment['member_count'],
					'interest_id' => $interest_id,
				);
			}, $segments);
			// clean segments of any null values
			$segments = array_filter($segments);

			set_transient(
				$cache_key,
				$segments,
				1 * DAY_IN_SECONDS
			);

			return rest_ensure_response($segments);
		} else {
			$error = new WP_Error( 'get-segments-error', __( $list_id . ' - segments - ' . $response['detail'], 'prc-mailchimp-api' ), array( 'status' => $response['status'] ) );
			return rest_ensure_response($error);
		}
	}

	private function construct_interests( $interests = array() ) {
		$return = array();
		foreach ( $interests as $interest_id ) {
			$return[ $interest_id ] = true;
		}
		return $return;
	}

	/**
	 * The first thing to know is that at PRC the way we use Segments is they are "interest" groups in a members profile that determines what auto segment they get assigned to. So in reality what we're doing is adding an "interest" to a member.
	 *
	 * @param [type] $email   [description]
	 * @param [type] $interest_id [description]
	 * @param [type] $list_id [description]
	 */
	private function add_interest( $interests = array() ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		$email = $this->email;
		if ( !$email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = $mailchimp->subscriberHash( $email );
		$result          = $mailchimp->patch(
			"lists/$list_id/members/$subscriber_hash",
			array(
				'interests' => $interests,
			)
		);

		if ( $mailchimp->success() ) {
			return array(
				'success'   => true,
				'status'    => $result['status'],
				'interests' => $result['interests'],
				'id'        => $result['id'],
			);
		} else {
			return new WP_Error( 'add-interest-to-member-error', __( $list_id . ' - ' . $result['detail'], 'my_textdomain' ), array( 'status' => $result['status'] ) );
		}
	}

	public function update_interests( $interests = array() ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		if ( empty($interests) ) {
			return new WP_Error( 'no-interests-provided', __( 'No interests provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$email = $this->email;
		if ( !$email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = $mailchimp->subscriberHash( $email );
		$result          = $mailchimp->patch(
			"lists/$list_id/members/$subscriber_hash",
			array(
				'interests' => $interests,
			)
		);

		if ( $mailchimp->success() ) {
			return array(
				'success'   => true,
				'status'    => $result['status'],
				'interests' => $result['interests'],
				'id'        => $result['id'],
			);
		} else {
			return new WP_Error( 'update-newsletter-preferences', __( $list_id . ' - ' . $result['detail'], 'my_textdomain' ), array( 'status' => $result['status'] ) );
		}

	}

	/**
	 * Add given email to the given list.
	 *
	 * @param mixed $email
	 * @param array $name
	 * @param array $interests
	 * @return array|WP_Error
	 */
	public function subscribe_to_list( $name = array(), $interests = array(), $origin_url = false ) {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		$email = $this->email;
		if ( !$email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$payload = array(
			'email_address' => $email,
			'status'        => 'subscribed',
		);

		// We may want to check $interests and if there are none then stop.

		if ( is_array( $interests ) && ! empty( $interests ) ) {
			$payload['interests'] = $this->construct_interests( $interests );
		}

		if ( ! empty( $name ) ) {
			$payload['merge_fields'] = array(
				'FNAME' => $name[0],
				'LNAME' => $name[1],
			);
		}
		// If origin url is not empty and is a valid url then add it to the payload.
		if ( !empty($origin_url) && !filter_var($origin_url, FILTER_VALIDATE_URL) === false) {
			$payload['merge_fields']['ORIGINURL'] = esc_url($origin_url);
		}

		$result = $mailchimp->post( "lists/$list_id/members", $payload );

		if ( $mailchimp->success() ) {
			return array(
				'success'   => true,
				'status'    => $result['status'],
				'interests' => $result['interests'],
				'id'        => $result['id'],
			);
		} else {
			if ( 'Member Exists' === $result['title'] ) {
				// Check if the member's status on the list is subscribed or not. If not, then re-add them.
				$subscriber_hash = $mailchimp->subscriberHash( $email );

				$mailchimp->patch(
					"lists/$list_id/members/$subscriber_hash",
					array(
						'status' => 'subscribed',
					)
				);
				// If member is already part of list then proceed to add interest to member, just a patch.
				return $this->add_interest( $this->construct_interests( $interests ), $api_key );
			} else {
				$subscriber_hash = $mailchimp->subscriberHash( $email );
				return new WP_Error( 'add-member-error', __( $list_id . ' - ' . $result['detail'], 'my_textdomain' ), array( 'status' => $result['status'] ) );
			}
		}
	}

	/**
	 * [remove_member_from_list description]
	 *
	 * @param  [type] $email       [description]
	 * @param  [type] $list_id     [description]
	 * @return [type]              [description]
	 */
	public function unsubscribe_from_list() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		$email = $this->email;
		if ( !$email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = $mailchimp->subscriberHash( $email );

		$result = $mailchimp->delete( "lists/$list_id/members/$subscriber_hash" );

		if ( $mailchimp->success() ) {
			return $result;
		} else {
			return new WP_Error( 'remover-member-error', __( $list_id . ' - ' . $result['detail'], 'my_textdomain' ), array( 'status' => $result['status'] ) );
		}
	}

	/**
	 * Returns a list of segments someone is in, based off of email address.
	 *
	 * @param  [type] $email [description]
	 * @return [type]                [description]
	 */
	public function get_member() {
		$api_key = $this->api_key;
		if ( is_wp_error( $api_key ) ) {
			return $api_key;
		}
		$mailchimp = new MailChimp( $api_key );

		$list_id = $this->list_id;

		$email = $this->email;
		if ( !$email ) {
			return new WP_Error( 'no-email-provided', __( 'No email provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}

		$subscriber_hash = $mailchimp->subscriberHash( $email );

		$result = $mailchimp->get( "lists/$list_id/members/$subscriber_hash" );
		// If subscriber found in this list.
		if ( $mailchimp->success() ) {
			return $result;
		} else {
			return new WP_Error( 'get-member-error', __( $list_id . ' - ' . $result['detail'], 'my_textdomain' ), array( 'status' => $result['status'] ) );
		}
	}
}


// $test = new Mailchimp_API(
// 	'smrubenstein@gmail.com',
// 	array(
// 		'api_key' => 'xyz',
// 		'list_id' => 'b0b0b0b0b0',
// 	)
// );

// $test->update_interests(
// 	array(
// 		'xyz',
// 		'abce',
// 	)
// );

// $test->subscribe_to_list(
// 	array(
// 		'fname' => 'Sam',
// 		'lname' => 'Rubenstein',
// 	),
// 	array(
// 		'xyz',
// 		'abce',
// 	),
// 	'https://www.pewresearch.org/article-page-url'
// );
