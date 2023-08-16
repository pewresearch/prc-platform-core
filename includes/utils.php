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
