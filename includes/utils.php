<?php
namespace PRC\Platform;
use DougSisk\CountryState\CountryState;
use Automattic\Jetpack\Device_Detection;

/**
 * Get the domain for the server
 */
function get_domain() {
	return str_replace(['https://', 'http://'], '', get_site_url());
}

/**
 * Quick helper function for wp-admin to determine the current post type.
 * @return string|null The current post type or null if not found.
 */
function get_wp_admin_current_post_type() {
	global $post, $typenow, $current_screen;

	if ( $post && $post->post_type ) {
		return $post->post_type;

	} elseif ( $typenow ) {
		return $typenow;

	} elseif ( $current_screen && $current_screen->post_type ) {
		return $current_screen->post_type;

	} elseif ( isset( $_REQUEST['post_type'] ) ) {
		return sanitize_key( $_REQUEST['post_type'] );
	}

	return null;
}

/**
 * Check if the current request is from Googlebot
 */
function is_google_bot() {
	if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Googlebot' ) !== false ) {
		return true;
	}
	return false;
}

/**
 * Check if the current request is from GPTBot
 */
function is_gpt_bot() {
	if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'GPTBot' ) !== false ) {
		return true;
	}
	return false;
}

/**
 * Check if the current request is from a bot
 */
function is_bot() {
	if ( is_google_bot() || is_gpt_bot() ) {
		return true;
	}
	return false;
}

/**
 * Check if the current request is from Facebook
 */
function is_facebook_request() {
	if (
		strpos( $_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit/' ) !== false ||
		strpos( $_SERVER['HTTP_USER_AGENT'], 'facebookcatalog/1.0' ) !== false
	) {
		return true;
	}
	return false;
}

/**
 * Check if the current request is from Twitter
 */
function is_twitter_request() {
	if (
		strpos( $_SERVER['HTTP_USER_AGENT'], 'Twitterbot' ) !== false
	) {
		return true;
	}
	return false;
}

/**
 * Check if the current page is an index page
 */
function is_index( $include_search = false ) {
	$return = false;
	if ( is_home() || is_archive() || is_tax() ) {
		$return = true;
	} else {
		$return = false;
	}
	if ( true === $include_search && is_search() ) {
		$return = true;
	}
	return $return;
}

/**
 * Check if the current page is a publication page
 */
function is_publications() {
	return is_home();
}

/**
 * Log an error to the error log and optionally to New Relic
 * @param mixed $error The error to log (string, WP_Error, Throwable)
 * @return mixed $error The error that was logged (string, WP_Error, Throwable)
 */
function log_error($error) {
	$message = '';
	if ( $error instanceof \WP_Error ) {
		$message = $error->get_error_message();
		$code = $error->get_error_code();
	} else {
		// Handle error when $error is not an instance of WP_Error
		// check if this is an Throwable and if so get the message and code
		if ( $error instanceof \Throwable ) {
			$message = $error->getMessage();
			$code = $error->getCode();
		} else if ( is_string($error) ) {
			$message = $error;
			$code = 0;
		} else {
			$message = 'Unknown error';
			$code = 0;
		}
	}

	do_action('qm/debug', 'LOG_ERROR:' . print_r([
		'message' => $message,
		'code' => $code,
	], true));

	if ( extension_loaded('newrelic') && function_exists('newrelic_notice_error') ) {
		// If the original error was an exception pass it along, otherwise let's create a new one with the message and code (if set)
		if ( $error instanceof \Throwable ) {
			\newrelic_notice_error($error);
		} else {
			\newrelic_notice_error($message, $code);
		}
	} else {
		error_log(print_r($error, true));
	}

	return $error;
}

/**
 * Get a list of countries, US states, or industries
 * @param string $list_of 'countries' | 'us-states' | 'countries-and-regions' | 'industries'
 * @return array $list
 */
function get_list_of($list_of = null) {
	$country_state = new CountryState();
	if ( 'us-states' === $list_of ) {
		// Get array of US states
		$list = $country_state->getStates('US');
		$tmp = [];
		foreach ($list as $value => $label) {
			$tmp[] = [
				'label' => $label,
				'value' => $value,
			];
		}
		return $tmp;
	} elseif ( 'countries' === $list_of ) {
		// Get array of countries
		$list = $country_state->getCountries();
		$tmp = [];
		foreach ($list as $value => $label) {
			$tmp[] = [
				'label' => $label,
				'value' => $value,
			];
		}
		return $tmp;
	} elseif ( 'countries-and-regions' === $list_of ) {
		// Get array of countries AND our PRC defined regions
		$list = $country_state->getCountries();
		$tmp = [
				[
				'label' => 'All',
				'value' => 'all',
			],
			[
				'label' => 'Global',
				'value' => 'global',
			],
			[
				'label' => 'Asia-Pacific',
				'value' => 'asia-pacific',
			],
			[
				'label' => 'Europe',
				'value' => 'europe',
			],
			[
				'label' => 'Latin America-Caribbean',
				'value' => 'latin america-caribbean',
			],
			[
				'label' => 'Middle East-North Africa',
				'value' => 'middle east-north africa',
			],
			[
				'label' => 'North America',
				'value' => 'north america',
			],
			[
				'label' => 'Sub-Saharan Africa',
				'value' => 'sub-saharan africa',
			],
		];
		foreach ($list as $value => $label) {
			$tmp[] = [
				'label' => $label,
				'value' => $value,
			];
		}
		return $tmp;
	} elseif ( 'industries' === $list_of ) {
		return [
			[
				'label' => 'Agriculture',
				'value' => 'agriculture',
			],
			[
				'label' => 'Automotive',
				'value' => 'automotive',
			],
			[
				'label' => 'Construction',
				'value' => 'construction',
			],
			[
				'label' => 'Education',
				'value' => 'education',
			],
			[
				'label' => 'Finance',
				'value' => 'finance',
			],
			[
				'label' => 'Healthcare',
				'value' => 'healthcare',
			],
			[
				'label' => 'Hospitality',
				'value' => 'hospitality',
			],
			[
				'label' => 'Manufacturing',
				'value' => 'manufacturing',
			],
			[
				'label' => 'Media',
				'value' => 'media',
			],
			[
				'label' => 'Nonprofit',
				'value' => 'nonprofit',
			],
			[
				'label' => 'Real Estate',
				'value' => 'real-estate',
			],
			[
				'label' => 'Retail',
				'value' => 'retail',
			],
			[
				'label' => 'Technology',
				'value' => 'technology',
			],
			[
				'label' => 'Transportation',
				'value' => 'transportation',
			],
			[
				'label' => 'Other',
				'value' => 'other',
			],
		];
	} else {
		// Return an empty array
		return [];
	}
}

/**
 * Device Detection
 * Powered by: https://github.com/Automattic/jetpack-device-detection
 * @return array $device_info array(
 *  'is_phone'            => (bool) Whether the current device is a mobile phone.
 *  'is_smartphone'       => (bool) Whether the current device is a smartphone.
 *  'is_tablet'           => (bool) Whether the current device is a tablet device.
 *  'is_handheld'         => (bool) Whether the current device is a handheld device.
 *  'is_desktop'          => (bool) Whether the current device is a laptop / desktop device.
 *  'platform'            => (string) Detected platform.
 *  'is_phone_matched_ua' => (string) Matched UA.
 * );
 */
function get_devices() {
	return Device_Detection::get_info();
}

/**
 * Get the current device type
 * @return string $device_type 'mobile' | 'tablet' | 'desktop'
 */
function get_current_device() {
	$devices = get_devices();
	return $devices['is_phone'] ? 'mobile' : ($devices['is_tablet'] ? 'tablet' : 'desktop');
}
