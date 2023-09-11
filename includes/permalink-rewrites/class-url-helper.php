<?php
namespace PRC\Platform;

class URL_Helper {
	public $url = null;

	public static $allowed_domains = array(
		'pewresearch-org-preprod.go-vip.co',
		'pewresearch-org-develop.go-vip.co',
		'prc-local.vipdev.lndo.site',
		'prc-develop.vipdev.lndo.site',
		'prc-trunk.vipdev.lndo.site',
		'pewresearch.org',
		'www.pewresearch.org',
		'platform.pewresearch.org'
	);

	public function __construct( string $url ) {
		/**
		 * @TODO: Sanitize these variables further.
		 */
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
	public function get($look_for_stub = false) {
		if ( null === $this->url ) {
			return new \WP_Error( '404', 'No url in data' );
		}
		$url = $this->url;

		$post_id   = false;
		$site_id   = $this->get_site_id_from_url( $url );
		$stub_id   = false;
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
		} elseif ( $this->is_published_post_link( $url, $site_id ) ) {
			$operation = 'is_published_post_link()';
			$post_id   = $this->get_post_id_from_published_link( $url, $site_id );
		}

		if ( false === $post_id ) {
			return new \WP_Error( '404', \wp_sprintf( 'Post ID could not be found using URL_Helper using op: %s & url: %s', $operation, $url ) );
		}

		if ( $look_for_stub ) {
			$stub_id = $this->get_stub_id_from_post_id( $post_id, $site_id );
			if ( false === $stub_id ) {
				return new \WP_Error( '404', \wp_sprintf( 'Stub ID could not be found using URL_Helper using op: %s & url: %s', $operation, $url ) );
			}
		}

		return array(
			'post_id' => $post_id,
			'site_id' => $site_id,
			'stub_id' => $stub_id,
			'operation_used' => $operation,
		);
	}

	public function get_site_id_from_url( $url ) {
		if ( false !== strpos( $url, '/global/' ) ) {
			$site_id = 2;
		} elseif ( false !== strpos( $url, '/social-trends/' ) ) {
			$site_id = 3;
		} elseif ( false !== strpos( $url, '/politics/' ) ) {
			$site_id = 4;
		} elseif ( false !== strpos( $url, '/hispanic/' ) ) {
			$site_id = 5;
		} elseif ( false !== strpos( $url, '/religion/' ) ) {
			$site_id = 7;
		} elseif ( false !== strpos( $url, '/journalism/' ) ) {
			$site_id = 8;
		} elseif ( false !== strpos( $url, '/internet/' ) ) {
			$site_id = 9;
		} elseif ( false !== strpos( $url, '/methods/' ) ) {
			$site_id = 10;
		} elseif ( false !== strpos( $url, '/science/' ) ) {
			$site_id = 16;
		} elseif ( false !== strpos( $url, '/race-ethnicity/' ) ) {
			$site_id = 18;
		} elseif ( false !== strpos( $url, '/decoded/' ) ) {
			$site_id = 19;
		} else {
			$site_id = 1;
		}

		return $site_id;
	}

	// https://pewresearch.local/global/2020/10/06/unfavorable-views-of-china-reach-historic-highs-in-many-countries/?preview_id=48226&preview_nonce=019783bb59&preview=true
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

	public function is_published_post_link( $url, $site_id ) {
		switch_to_blog( $site_id );
		$check = \wpcom_vip_url_to_postid( $url );
		restore_current_blog();
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
			'post_type'   => 'short-read', // @TODO change this to short-read
			'post_status' => 'publish',
			'numberposts' => 1,
		);

		switch_to_blog( 1 );
		$posts = get_posts( $args );
		restore_current_blog();

		if ( $posts ) {
			return $posts[0]->ID;
		} else {
			return false;
		}
	}

	public function get_post_id_from_published_link( $url, $site_id ) {
		switch_to_blog( $site_id );
		$post_id = wpcom_vip_url_to_postid( $url );
		restore_current_blog();
		return $post_id;
	}

	public function get_stub_id_from_post_id( $post_id, $site_id ) {
		$stub_id = false;
		switch_to_blog( $site_id );
		$stub_id = get_post_meta( $post_id, '_stub_post', true );
		restore_current_blog();
		return $stub_id;
	}
}
