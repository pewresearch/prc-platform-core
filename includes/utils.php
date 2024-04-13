<?php
namespace PRC\Platform;

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

function is_google_bot() {
	if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'Googlebot' ) !== false ) {
		return true;
	}
	return false;
}

function is_gpt_bot() {
	if ( strpos( $_SERVER['HTTP_USER_AGENT'], 'GPTBot' ) !== false ) {
		return true;
	}
	return false;
}

function is_bot() {
	if ( is_google_bot() || is_gpt_bot() ) {
		return true;
	}
	return false;
}

function is_facebook_request() {
	if (
		strpos( $_SERVER['HTTP_USER_AGENT'], 'facebookexternalhit/' ) !== false ||
		strpos( $_SERVER['HTTP_USER_AGENT'], 'facebookcatalog/1.0' ) !== false
	) {
		return true;
	}
	return false;
}

function is_twitter_request() {
	if (
		strpos( $_SERVER['HTTP_USER_AGENT'], 'Twitterbot' ) !== false
	) {
		return true;
	}
	return false;
}

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

function is_publications() {
	return is_home();
}

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

	do_action('qm/debug', print_r([
		'message' => $message,
		'code' => $code,
	], true));

	if ( function_exists( 'wp_sentry_safe' ) ) {
		wp_sentry_safe( function ( \Sentry\State\HubInterface $client ) use ( $error, $message, $code ) {
			// If the original error was an exception pass it along, otherwise let's create a new one with the message and code (if set)
			if ( $error instanceof \Exception ) {
				$client->captureException($error);
			} else {
				$client->captureMessage($message, \Sentry\Severity::error() );
			}
		} );
	} elseif ( extension_loaded('newrelic') && function_exists('newrelic_notice_error') ) {
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
