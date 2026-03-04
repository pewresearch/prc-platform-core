<?php
/**
 * PRC Platform Core Utilities
 *
 * @package prc-platform-core
 */

namespace PRC\Platform;

use DougSisk\CountryState\CountryState;
use Automattic\Jetpack\Device_Detection;

/**
 * Get the primary term id.
 *
 * @param int    $post_id Post ID.
 * @param string $taxonomy Taxonomy slug.
 * @return int|false Term ID if PRC Schema SEO active and primary term found, false otherwise.
 */
function get_primary_term_id( int $post_id, string $taxonomy ): ?int {
	if ( function_exists( '\PRC\Platform\Schema_SEO\Utils\get_primary_term_id' ) ) {
		return \PRC\Platform\Schema_SEO\Utils\get_primary_term_id( $post_id, $taxonomy );
	}
	return false;
}

/**
 * Get the domain for the server
 */
function get_domain() {
	return str_replace( array( 'https://', 'http://' ), '', get_site_url() );
}

/**
 * Get the current URL. Accounts for if off production.
 */
function get_current_url() {
	if ( 'production' !== wp_get_environment_type() ) {
		$request_uri = str_replace( '/pewresearch-org/', '/', $_SERVER['REQUEST_URI'] );
		return 'https://' . get_domain() . $request_uri;
	}
	return 'https://' . get_domain() . $_SERVER['REQUEST_URI'];
}

/**
 * Quick helper function for wp-admin to determine the current post type.
 *
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
 *
 * @param mixed $error The error to log (string, WP_Error, Throwable)
 * @return mixed $error The error that was logged (string, WP_Error, Throwable)
 */
function log_error( $error ) {
	$message = '';
	if ( $error instanceof \WP_Error ) {
		$message = $error->get_error_message();
		$code    = $error->get_error_code();
	} else {
		// Handle error when $error is not an instance of WP_Error
		// check if this is an Throwable and if so get the message and code
		if ( $error instanceof \Throwable ) {
			$message = $error->getMessage();
			$code    = $error->getCode();
		} elseif ( is_string( $error ) ) {
			$message = $error;
			$code    = 0;
		} else {
			$message = 'Unknown error';
			$code    = 0;
		}
	}

	do_action(
		'qm/debug',
		'LOG_ERROR:' . print_r(
			array(
				'message' => $message,
				'code'    => $code,
			),
			true
		)
	);

	if ( extension_loaded( 'newrelic' ) && function_exists( 'newrelic_notice_error' ) ) {
		// If the original error was an exception pass it along, otherwise let's create a new one with the message and code (if set)
		if ( $error instanceof \Throwable ) {
			\newrelic_notice_error( $error );
		} else {
			\newrelic_notice_error( $message, $code );
		}
	} else {
		error_log( print_r( $error, true ) );
	}

	return $error;
}

/**
 * Get a list of countries, US states, or industries
 *
 * @param string $list_of 'countries' | 'us-states' | 'countries-and-regions' | 'industries'
 * @return array $list
 */
function get_list_of( $list_of = null ) {
	$country_state = new CountryState();
	if ( 'us-states' === $list_of ) {
		// Get array of US states
		$list = $country_state->getStates( 'US' );
		$tmp  = array();
		foreach ( $list as $value => $label ) {
			$tmp[] = array(
				'label' => $label,
				'value' => $value,
			);
		}
		return $tmp;
	} elseif ( 'countries' === $list_of ) {
		// Get array of countries
		$list = $country_state->getCountries();
		$tmp  = array();
		foreach ( $list as $value => $label ) {
			$tmp[] = array(
				'label' => $label,
				'value' => $value,
			);
		}
		return $tmp;
	} elseif ( 'countries-and-regions' === $list_of ) {
		// Get array of countries AND our PRC defined regions
		$list = $country_state->getCountries();

		// Filter out specific countries by code
		$excluded_countries = array( 'AX', 'BL', 'BV', 'CC', 'CD', 'CW', 'CX', 'HM', 'IO', 'KN', 'LC', 'MF', 'PM', 'PN', 'RE', 'SJ', 'ST', 'TF', 'UM', 'VC', 'XK' );
		$list               = array_diff_key( $list, array_flip( $excluded_countries ) );

		$tmp = array(
			// array(
			// 'label' => 'All',
			// 'value' => 'all',
			// ),
			array(
				'label' => 'Global total',
				'value' => 'Global total',
			),
			array(
				'label' => 'All Asia-Pacific',
				'value' => 'All Asia-Pacific',
			),
			array(
				'label' => 'All Europe',
				'value' => 'All Europe',
			),
			array(
				'label' => 'All Latin America-Caribbean',
				'value' => 'All Latin America-Caribbean',
			),
			array(
				'label' => 'All Middle East-North Africa',
				'value' => 'All Middle East-North Africa',
			),
			array(
				'label' => 'All North America',
				'value' => 'All North America',
			),
			array(
				'label' => 'All sub-Saharan Africa',
				'value' => 'All sub-Saharan Africa',
			),
			array(
				'label' => 'Democratic Republic of the Congo',
				'value' => 'DRC',
			),
		);
		foreach ( $list as $value => $label ) {
			$tmp[] = array(
				'label' => $label,
				'value' => $label,
			);
		}
		return $tmp;
	} elseif ( 'industries' === $list_of ) {
		return array(
			array(
				'label' => 'Agriculture',
				'value' => 'agriculture',
			),
			array(
				'label' => 'Automotive',
				'value' => 'automotive',
			),
			array(
				'label' => 'Construction',
				'value' => 'construction',
			),
			array(
				'label' => 'Education',
				'value' => 'education',
			),
			array(
				'label' => 'Finance',
				'value' => 'finance',
			),
			array(
				'label' => 'Healthcare',
				'value' => 'healthcare',
			),
			array(
				'label' => 'Hospitality',
				'value' => 'hospitality',
			),
			array(
				'label' => 'Manufacturing',
				'value' => 'manufacturing',
			),
			array(
				'label' => 'Media',
				'value' => 'media',
			),
			array(
				'label' => 'Nonprofit',
				'value' => 'nonprofit',
			),
			array(
				'label' => 'Real Estate',
				'value' => 'real-estate',
			),
			array(
				'label' => 'Retail',
				'value' => 'retail',
			),
			array(
				'label' => 'Technology',
				'value' => 'technology',
			),
			array(
				'label' => 'Transportation',
				'value' => 'transportation',
			),
			array(
				'label' => 'Other',
				'value' => 'other',
			),
		);
	} else {
		// Return an empty array
		return array();
	}
}

/**
 * Device Detection
 * Powered by: https://github.com/Automattic/jetpack-device-detection
 *
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
	if ( class_exists( '\Automattic\Jetpack\Device_Detection' ) ) {
		return \Automattic\Jetpack\Device_Detection::get_info();
	} else {
		return array(
			'is_phone'      => false,
			'is_smartphone' => false,
			'is_tablet'     => false,
			'is_handheld'   => false,
			'is_desktop'    => true,
		);
	}
}

/**
 * Get the current device type
 *
 * @return string $device_type 'mobile' | 'tablet' | 'desktop'
 */
function get_current_device() {
	$devices = get_devices();
	return $devices['is_phone'] ? 'mobile' : ( $devices['is_tablet'] ? 'tablet' : 'desktop' );
}

/**
 * Get the ISO 3166-1 alpha-2 country code from a country name.
 *
 * Uses the DougSisk\CountryState library to look up country codes.
 * Returns the lowercase two-letter country code for use with flag-icons library.
 *
 * @param string $country_name The country name to look up (e.g., "Argentina", "United States").
 * @return string|null The lowercase ISO 3166-1 alpha-2 code (e.g., "ar", "us"), or null if not found.
 */
function get_country_code_from_name( string $country_name ): ?string {
	$country_state = new CountryState();
	$countries     = $country_state->getCountries(); // Returns ['US' => 'United States', ...].
	$normalized    = strtolower( trim( $country_name ) );

	// Handle common abbreviations or short names
	$abbreviation_map = array(
		'us'   => 'United States',
		'u.s.' => 'United States',
		'u.s'  => 'United States',
		'usa'  => 'United States',
		'uk'   => 'United Kingdom',
		'u.k.' => 'United Kingdom',
		'u.k'  => 'United Kingdom',
	);

	// If normalized name is a known abbreviation, map it to the formal country name
	if ( array_key_exists( $normalized, $abbreviation_map ) ) {
		$normalized = strtolower( $abbreviation_map[ $normalized ] );
	}

	// Also check if it's a direct country code (alpha-2), e.g., 'us', 'gb', etc.
	foreach ( $countries as $code => $name ) {
		if ( strtolower( $name ) === $normalized || strtolower( $code ) === $normalized ) {
			return strtolower( $code );
		}
	}

	return null;
}
