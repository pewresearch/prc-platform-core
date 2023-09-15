<?php
namespace PRC\Platform;

class URL_Helper {
	public $url = null;

	public static $allowed_domains = array(
		'platform.pewresearch.org',
		'pewresearch.org',
		'www.pewresearch.org',
		'pewresearch-org-preprod.go-vip.co',
		'pewresearch-org-develop.go-vip.co',
		'prc-local.vipdev.lndo.site',
		'prc-develop.vipdev.lndo.site',
		'prc-trunk.vipdev.lndo.site',
	);

	public function __construct( string $url ) {
		// double check that url is a url string....
		if ( ! is_string( $url ) ) {
			return new \WP_Error( '404', 'No url in data, this is not a string' );
		}
		if ( ! filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return new \WP_Error( '404', 'No url in data, this is not a valid url' );
		}
		if ( ! in_array( wp_parse_url( $url, PHP_URL_HOST ), self::$allowed_domains, true ) ) {
			return new \WP_Error( '404', 'No url in data, this domain is not allowed' );
		}
		$this->url = $url;
	}

	/**
	 * Get the post id and site id from a url.
	 */
	public function get() {
		if ( null === $this->url ) {
			return new \WP_Error( '404', 'No url in data' );
		}
		$url = $this->url;

		$post_id   = false;
		$operation = 'n/a';

		if ( $this->is_preview_link($url) ) {
			$operation = 'is_preview_link()';
			$post_id   = $this->get_post_id_from_preview_link( $url );
		} elseif ( $this->is_wp_admin_edit_link( $url ) ) {
			$operation = 'is_wp_admin_edit_link()';
			$post_id   = $this->get_post_id_from_edit_link( $url );
		} elseif ( $this->is_short_read_post_link( $url ) ) {
			$operation = 'is_short_read_post_link()';
			$post_id   = $this->get_post_id_from_short_read_link( $url );
		} elseif ( $this->is_published_post_link( $url ) ) {
			$operation = 'is_published_post_link()';
			$post_id   = $this->get_post_id_from_published_link( $url );
		}

		if ( false === $post_id ) {
			return new \WP_Error( '404', \wp_sprintf( 'Post ID could not be found using URL_Helper using op: %s & url: %s', $operation, $url ) );
		}

		return array(
			'post_id' => $post_id,
			'operation_used' => $operation,
		);
	}

	// Example: https://pewresearch.local/global/2020/10/06/unfavorable-views-of-china-reach-historic-highs-in-many-countries/?preview_id=48226&preview_nonce=019783bb59&preview=true
	public function parse_url_for_params( $url ) {
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

	// Sanity Check Operations:
	public function is_preview_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'preview', $params ) ) {
			return $params['preview'];
		}
		return false;
	}

	public function is_wp_admin_edit_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'action', $params ) && 'edit' === $params['action'] ) {
			return true;
		}
		return false;
	}

	public function is_published_post_link( $url ) {
		$check = \wpcom_vip_url_to_postid( $url );
		if ( 0 === $check ) {
			return false;
		}
		return true;
	}

	public function is_short_read_post_link( $url ) {
		if ( false !== strpos( $url, '/short-reads/' ) ) {
			return true;
		}
		return false;
	}

	// Post ID Extraction Operations:
	public function get_post_id_from_preview_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'preview_id', $params ) ) {
			return (int) $params['preview_id'];
		} elseif ( array_key_exists( 'p', $params ) ) {
			return (int) $params['p'];
		}
		return false;
	}

	public function get_post_id_from_edit_link( $url ) {
		$params = $this->parse_url_for_params( $url );
		if ( array_key_exists( 'post', $params ) ) {
			return (int) $params['post'];
		}
		return false;
	}

	public function get_post_id_from_short_read_link( $url ) {
		$slug = basename( $url );
		if ( ! is_string( $slug ) ) {
			return false;
		}

		$args = array(
			'name'        => $slug,
			'post_type'   => 'short-read',
			'post_status' => 'publish',
			'numberposts' => 1,
		);

		$posts = get_posts( $args );

		if ( $posts ) {
			return $posts[0]->ID;
		} else {
			return false;
		}
	}

	public function get_post_id_from_published_link( $url ) {
		return wpcom_vip_url_to_postid( $url );
	}
}
