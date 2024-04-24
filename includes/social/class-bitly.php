<?php
namespace PRC\Platform;
use WP_Error;
class Bitly {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'wp_head', $this, 'flush_shortlink' );
			$loader->add_action( 'prc_platform_on_publish', $this, 'update_post_with_shortlink', 10, 1 );
			$loader->add_action( 'admin_bar_menu', $this, 'add_quick_edit', 100 );
			$loader->add_filter( 'get_shortlink', $this, 'filter_get_shortlink', 100, 2 );
			$loader->add_action( 'init', $this, 'register_meta' );
		}
	}

	public function register_meta() {
		register_post_meta( '', 'bitly', array(
			'type'         => 'string',
			'description'  => 'The shortened bitly url for the post.',
			'single'       => true,
			'show_in_rest' => true,
		) );

	}

	private function get_bitly_shortlink( $post_id, $url = null ) {
		// if ( 'production' !== wp_get_environment_type() ) {
		// 	return $url;
		// }
		$rest_url = 'https://api-ssl.bitly.com/v4/shorten';

		$headers = array(
			'Content-Type'  => 'application/json',
			'Authorization' => 'Bearer ' . PRC_PLATFORM_BITLY_KEY,
		);

		if ( null === $url ) {
			$url = get_permalink( $post_id );
		}

		$req_args = array(
			'headers' => $headers,
			'body'    => wp_json_encode(
				array(
					'long_url' => $url,
				),
			),
		);

		// Allow API credentials and other options to be switched.
		$req_args = (array) apply_filters( 'bitly_request_args', $req_args, $post_id );

		$response = wp_remote_post( $rest_url, $req_args );

		if ( WP_DEBUG ) {
			error_log( 'BITLY:: '. print_r( $response, true ) );
		}

		if ( ! is_wp_error( $response ) ) {
			$json = json_decode( wp_remote_retrieve_body( $response ) );
			if ( isset( $json->link ) ) {
				return $json->link;
			}
		} else {
			$error = \WP_Error(
				'bitly_error',
				sprintf( 'Retrieving Bitly url for %s resulted in an error.', esc_url( $url ) ),
				array(
					'response' => $response,
					'req_args' => $req_args,
					'post_id' => $post_id,
				)
			);
			return log_error( $error );
		}
	}

	/**
	 * Updates the post with postmeta 'bitly' with the bitly shortened url.
	 *
	 * @param  [type] $post_id [description]
	 * @param  [type] $post    [description]
	 * @param  [type] $update  [description]
	 * @return [type]          [description]
	 */
	public function update_post_with_shortlink( $post ) {
		if ( is_int( $post ) ) {
			$post_id = $post;
		} elseif ( is_object( $post ) && property_exists( $post, 'ID' ) ) {
			$post_id = $post->ID;
		} else {
			log_error(new WP_Error(
				'bitly_error',
				sprintf( 'Updating Bitly url failed, no post object.' ),
				array(
					'post' => $post,
				)
			));
		}

		if ( wp_is_post_revision( $post_id ) ) {
			return; // Exit early if this is just a revision or an update.
		}

		if ( get_post_meta( $post_id, 'bitly', true ) ) {
			return; // Exit early if the post already has a bitly url.
		}

		$short_circuit = apply_filters( 'prc_platform_disable_bitly', false, $post_id );
		if ( true === $short_circuit ) {
			return;
		}

		$permalink = get_permalink( $post_id );

		// if ( 'production' !== wp_get_environment_type() ) {
		// 	return $permalink;
		// }

		$bitly_url = $this->get_bitly_shortlink( $post_id, $permalink );
		if ( false !== $bitly_url ) {
			update_post_meta( $post_id, 'bitly', $bitly_url );
		}
	}

	public function get_shortlink( $post_id ) {
		if ( get_post_meta( $post_id, 'bitly', true ) ) {
			$url = get_post_meta( $post_id, 'bitly', true );
			if ( is_array( $url ) ) {
				return $url['url'];
			} else {
				return $url;
			}
		} else {
			return false;
		}
	}

	public function filter_get_shortlink( $url, $post_id ) {
		if ( get_post_meta( $post_id, 'bitly', true ) ) {
			$url = $this->get_shortlink( $post_id );
		}
		return $url;
	}

	public function flush_shortlink() {
		if ( isset( $_GET['flush_bitly'] ) && isset( $_GET['_bitly_nonce']) && $_GET['flush_bitly'] == 1 && is_single() && is_user_logged_in() && wp_verify_nonce( $_GET['_bitly_nonce'], 'prc-bitly-nonce' ) ) {
			global $post;

			delete_post_meta( $post->ID, 'bitly' );

			$this->update_post_with_shortlink( $post->ID, false, false );
		}
	}

	public function add_quick_edit( $admin_bar ) {
		if ( ! is_singular() ) {
			return; // Bail early.
		}

		if ( ! get_post_meta( get_the_ID(), 'bitly', true ) ) {
			return;
		}

		$nonce = wp_create_nonce( 'prc-bitly-nonce' );

		$admin_bar->add_menu(
			array(
				'id'    => 'reset-bitly-link',
				'title' => __( 'Reset Bit.ly Link' ),
				'href'  => add_query_arg( array( 'flush_bitly' => true, '_bitly_nonce' => $nonce ), get_the_permalink() ),
				'parent' => 'tools',
			)
		);
	}

	// When the url for a post changes, yoast automatically creates redirects, on that action we should also generate a new bitly url (and maybe save the old ones for reference??)
	public function watch_for_url_change() {

	}

}
