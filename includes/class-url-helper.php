<?php
namespace PRC\Platform;

use WP_Error;
/**
 * URL Helper class for getting the post id from a url.
 * Whether its a preview link, an edit link, or a post link, URL Helper can get the post id for you.
 *
 * @package PRC\Platform
 */
class URL_Helper {
	/**
	 * The url.
	 *
	 * @var string
	 */
	public $url = null;
	/**
	 * The post id.
	 *
	 * @var int
	 */
	public $post_id = null;
	/**
	 * The allowed domains.
	 *
	 * @var array
	 */
	public static $allowed_domains = array(
		'platform.pewresearch.org',
		'pewresearch.org',
		'www.pewresearch.org',
		'alpha.pewresearch.org',
		'beta.pewresearch.org',
		'prc-platform.vipdev.lndo.site',
		// To Deprecate:
		'pewresearch-org-alpha.go-vip.net',
		'pewresearch-org-alpha.go-vip.co',
		'pewresearch-org-beta.go-vip.co',
		'pewresearch-org-beta.go-vip.net',
		'prc-local.vipdev.lndo.site',
	);

	/**
	 * Determine if a url is a valid PRC Platform url and if so return the post id.
	 *
	 * @param string $url The url to check.
	 * @return WP_Error|int The post id or a WP_Error if the url is not valid.
	 */
	public function __construct( string $url ) {
		// double check that url is a url string....
		if ( ! is_string( $url ) ) {
			return new \WP_Error( '404', 'No url in data, this is not a string' );
		}
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return new \WP_Error( '404', 'No url in data, this is not a valid url' );
		}
		if ( ! in_array( wp_parse_url( $url, PHP_URL_HOST ), self::$allowed_domains, true ) && strpos( $url, 'app.github.dev' ) === false ) {
			return new \WP_Error( '404', 'No url in data, this domain is not allowed' );
		}
		$this->url     = $url;
		$this->post_id = $this->get_post_id();
	}

	/**
	 * Get the post id from a url.
	 *
	 * @return int|false The post id or false if the post id could not be found.
	 */
	public function get_post_id() {
		if ( null === $this->url ) {
			return new \WP_Error( '404', 'No url in data' );
		}
		$url = $this->url;

		$post_id   = false;
		$operation = 'n/a';

		if ( $this->is_preview_link( $url ) ) {
			$operation = 'is_preview_link()';
			$post_id   = $this->get_post_id_from_preview_link( $url );
		} elseif ( $this->is_wp_admin_edit_link( $url ) ) {
			$operation = 'is_wp_admin_edit_link()';
			$post_id   = $this->get_post_id_from_edit_link( $url );
		} elseif ( $this->is_published_post_link( $url ) ) {
			$operation = 'is_published_post_link()';
			$post_id   = $this->get_post_id_from_published_link( $url );
		}

		if ( false === $post_id ) {
			return new \WP_Error( '404', \wp_sprintf( 'Post ID could not be found using URL_Helper using op: %s & url: %s', $operation, $url ) );
		}

		return $post_id;
	}

	/**
	 * Parse the url for parameters.
	 *
	 * @param string $url The url to parse.
	 * @return array|false The parameters or false if the url is not valid.
	 */
	private function parse_url_for_params( $url ) {
		$parts = wp_parse_url( $url );
		// If this url does not point to an allowed PRC domain then return false
		if ( ! in_array( $parts['host'], self::$allowed_domains, true ) ) {
			return false;
		}
		if ( ! array_key_exists( 'query', $parts ) ) {
			return array();
		}
		$params = array();
		wp_parse_str( $parts['query'], $params );
		return $params;
	}

	/**
	 * Check if the url is a preview link.
	 *
	 * @param string $url The url to check.
	 * @return bool True if the url is a preview link, false otherwise.
	 */
	private function is_preview_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'preview', $params ) ) {
			return $params['preview'];
		}
		return false;
	}

	/**
	 * Check if the url is a wp admin edit link.
	 *
	 * @param string $url The url to check.
	 * @return bool True if the url is a wp admin edit link, false otherwise.
	 */
	private function is_wp_admin_edit_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'action', $params ) && 'edit' === $params['action'] ) {
			return true;
		}
		return false;
	}

	/**
	 * Check if the url is a published post link.
	 *
	 * @param string $url The url to check.
	 * @return bool True if the url is a published post link, false otherwise.
	 */
	private function is_published_post_link( $url ) {
		$check = \wpcom_vip_url_to_postid( $url );
		if ( 0 === $check ) {
			return false;
		}
		return true;
	}

	/**
	 * Get the post id from a preview link.
	 *
	 * @param string $url The url to get the post id from.
	 * @return int|false The post id or false if the post id could not be found.
	 */
	private function get_post_id_from_preview_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'preview_id', $params ) ) {
			return (int) $params['preview_id'];
		} elseif ( array_key_exists( 'p', $params ) ) {
			return (int) $params['p'];
		}
		return false;
	}

	/**
	 * Get the post id from a wp admin edit link.
	 *
	 * @param string $url The url to get the post id from.
	 * @return int|false The post id or false if the post id could not be found.
	 */
	private function get_post_id_from_edit_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'post', $params ) ) {
			return (int) $params['post'];
		}
		return false;
	}

	/**
	 * Get the post id from a published link.
	 *
	 * @param string $url The url to get the post id from.
	 * @return int|false The post id or false if the post id could not be found.
	 */
	private function get_post_id_from_published_link( $url ) {
		return \wpcom_vip_url_to_postid( $url );
	}
}
