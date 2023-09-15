<?php
namespace PRC\Platform;
use WP_Error;

/**
 * We send all mail through Mailchimp's Mandrill service and we use Mailchimp to register newsletter subscriptions. This class handles both.
 * @package PRC\Platform
 */
class Mailchimp_API {
	public function __construct($email_address, $segments = array()) {
		// Check if the email address is valid.
		if (!is_email($email_address)) {
			return new WP_Error('invalid_email', 'The email address provided is invalid.');
		}

	}

	public function get_user() {

	}

	public function subscribe() {

	}

	public function update() {

	}

	public function unsubscribe() {

	}
}
