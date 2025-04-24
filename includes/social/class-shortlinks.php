<?php
/**
 * The Shortlinks class.
 *
 * @since    1.0.0
 */

namespace PRC\Platform;

use WP_Error;

/**
 * The Shortlinks class.
 * This class is responsible for generating and updating the shortlink for a post.
 * As opposed to a longer Permalink, a Shortlink is a shorter URL that can be used to share a post.
 * Currently, this system uses Bitly to generate the shortlink.
 *
 * @since    1.0.0
 */
class Shortlinks {
	/**
	 * The handle for the shortlinks script.
	 *
	 * @var string
	 */
	protected static $handle = 'prc-platform-shortlinks';

	/**
	 * The action scheduler hook.
	 *
	 * @var string
	 */
	public static $action_scheduler_hook = 'prc_platform_shortlink_generate_url';

	/**
	 * The action scheduler group.
	 *
	 * @var string
	 */
	public static $action_scheduler_group = 'prc_platform_social';

	/**
	 * The meta key for the bitly url.
	 *
	 * @var string
	 */
	public static $meta_key = 'bitly';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader    The loader.
	 */
	public function __construct( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_meta' );
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'get_shortlink', $this, 'filter_get_shortlink', 100, 2 );
			$loader->add_action(
				'prc_platform_on_publish',
				$this,
				'on_publish_update_shortlink',
				50,
				1
			);
			$loader->add_action( 'admin_bar_menu', $this, 'add_admin_bar_tools', 100 );
			$loader->add_action( self::$action_scheduler_hook, $this, 'handle_scheduled_shortlink_generation', 10, 1 );
		}
	}

	/**
	 * Register the meta.
	 *
	 * @hook init
	 * @return void
	 */
	public function register_meta() {
		// Storage for the shortlink url.
		$public_post_types = get_post_types(
			array(
				'public' => true,
			)
		);
		foreach ( $public_post_types as $post_type ) {
			// Check if the post type supports revisions before we flag it on the meta registration.
			$supports_revisions = post_type_supports( $post_type, 'revisions' );
			// Register the meta.
			register_post_meta(
				$post_type,
				self::$meta_key,
				array(
					'single'            => true,
					'type'              => 'string',
					'revisions_enabled' => $supports_revisions,
					'show_in_rest'      => true,
				),
			);
		}
	}

	/**
	 * Register the REST fields.
	 *
	 * @hook rest_api_init
	 *
	 * @return void
	 */
	public function register_rest_fields() {
		// REST field for the shortlink url.
		$public_post_types = get_post_types(
			array(
				'public' => true,
			)
		);
		foreach ( $public_post_types as $post_type ) {
			register_rest_field(
				$post_type,
				'shortlink',
				array(
					'get_callback'        => function ( $post ) {
						return $this->get_shortlink( $post['id'] );
					},
					'update_callback'     => function ( $value, $post ) {
						$value = rest_sanitize_boolean( $value );
						$post_id = $post->ID;
						// If the value is null or empty then delete the bitly url, if it has a value then update the bitly url to point to the post.
						if ( true === $value ) {
							return rest_ensure_response( $this->update_shortlink( $post_id ) );
						} elseif ( false === $value ) {
							return rest_ensure_response( delete_post_meta( $post_id, self::$meta_key ) );
						}
						return rest_ensure_response( new WP_Error( 'invalid_value', 'Invalid value' ) );
					},
					'permission_callback' => function ( $post ) {
						return current_user_can( 'edit_post', $post->ID );
					},
					'schema'              => null,
				),
			);
		}
	}

	/**
	 * Get the shortlink url.
	 *
	 * @param int $post_id The post ID.
	 * @return string|false
	 */
	public function get_shortlink( $post_id ) {
		if ( get_post_meta( $post_id, self::$meta_key, true ) ) {
			$url = get_post_meta( $post_id, self::$meta_key, true );
			if ( is_array( $url ) ) {
				return $url['url'];
			} else {
				return $url;
			}
		} else {
			return false;
		}
	}

	/**
	 * Update the shortlink url.
	 *
	 * @param int $post_id The post ID.
	 * @return string|WP_Error
	 */
	public function update_shortlink( $post_id ) {
		$url = $this->query_for_shortlink( $post_id );
		if ( ! is_wp_error( $url ) ) {
			update_post_meta( $post_id, self::$meta_key, $url );
			return $url;
		}
		return new WP_Error( 'shortlink_error', 'Failed to update shortlink' );
	}

	/**
	 * Query bitly for a link.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $url     The url to shorten.
	 * @return string|WP_Error
	 */
	public function query_bitly( $url, $post_id = null ) {
		if ( ! defined( 'PRC_PLATFORM_BITLY_KEY' ) ) {
			return new WP_Error( 'bitly_error', 'PRC_PLATFORM_BITLY_KEY is not defined.' );
		}
		$rest_url = 'https://api-ssl.bitly.com/v4/shorten';

		$headers = array(
			'Content-Type'  => 'application/json',
			'Authorization' => 'Bearer ' . PRC_PLATFORM_BITLY_KEY,
		);

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
			log_error( print_r( $response, true ) );
		}

		if ( ! is_wp_error( $response ) ) {
			$json = json_decode( wp_remote_retrieve_body( $response ) );
			if ( isset( $json->link ) ) {
				return $json->link;
			}
		} else {
			$error = new WP_Error(
				'bitly_error',
				sprintf( 'Retrieving Bitly url for %s resulted in an error.', esc_url( $url ) ),
				array(
					'response' => $response,
					'req_args' => $req_args,
					'post_id'  => $post_id,
				)
			);
			return log_error( $error );
		}
	}

	/**
	 * Query bitly for a link.
	 *
	 * @param int    $post_id The post ID.
	 * @param string $url     The url to shorten.
	 * @return string|WP_Error
	 */
	private function query_for_shortlink( $post_id, $url = null ) {
		if ( null === $url ) {
			$url = get_permalink( $post_id );
		}

		// In the event this is run on a non production environment
		// we'll ensure the bit.ly url generated is for the production site.
		if ( strpos( $url, 'pewresearch.org' ) === false ) {
			$url = str_replace( home_url(), 'https://www.pewresearch.org', $url );
		}

		return $this->query_bitly( $url, $post_id );
	}

	/**
	 * Updates the post's meta with the shortlink url on publish.
	 *
	 * @hook prc_platform_on_publish
	 *
	 * @param  [type] $post_id [description]
	 * @param  [type] $post    [description]
	 * @param  [type] $update  [description]
	 * @return [type]          [description]
	 */
	public function on_publish_update_shortlink( $post ) {
		// On non production environments, we don't want to update the shortlink on publish.
		// You can stil utilize the rest api to update the shortlink.
		if ( 'production' !== wp_get_environment_type() ) {
			return;
		}

		if ( is_int( $post ) ) {
			$post_id = $post;
		} elseif ( is_object( $post ) && property_exists( $post, 'ID' ) ) {
			$post_id = $post->ID;
		} else {
			return log_error(
				new WP_Error(
					'bitly_error',
					sprintf( 'Updating Bitly url failed, no post object.' ),
					array(
						'post' => $post,
					)
				)
			);
		}

		// An extra sanity check to make sure we're not updating a revision.
		if ( wp_is_post_revision( $post_id ) ) {
			return false; // Exit early if this is just a revision or an update.
		}

		if ( $this->get_shortlink( $post_id ) ) {
			return false; // Exit early if the post already has a defined shortlink.
		}

		$short_circuit = apply_filters( 'prc_platform_disable_shortlink', false, $post_id );
		if ( true === $short_circuit ) {
			return false;
		}

		$this->update_shortlink( $post_id );
	}

	/**
	 * Filter the shortlink.
	 *
	 * @param string $url     The url.
	 * @param int    $post_id The post ID.
	 * @return string|false
	 */
	public function filter_get_shortlink( $url, $post_id ) {
		$shortlink = $this->get_shortlink( $post_id );
		if ( $shortlink ) {
			return $shortlink;
		} else {
			return $url;
		}
	}

	/**
	 * Enqueue the admin bar script.
	 *
	 * @return void
	 */
	public function enqueue_admin_bar_script() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$script     = wp_enqueue_script(
			self::$handle,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to enqueue all assets' );
		}
	}

	/**
	 * Add a link to either generate or reset the bitly url to the admin bar.
	 *
	 * @param WP_Admin_Bar $admin_bar The admin bar.
	 * @return void
	 */
	public function add_admin_bar_tools( $admin_bar ) {
		if ( ! is_singular() ) {
			return; // Bail early.
		}
		// Post needs to be published...
		if ( 'publish' !== get_post_status() ) {
			return;
		}
		// Check if the current user has edit other posts permissions.
		if ( ! current_user_can( 'edit_others_posts' ) ) {
			return;
		}

		$this->enqueue_admin_bar_script();

		$post_id  = get_the_ID();
		$rest_url = rest_get_route_for_post( $post_id );
		$rest_url = rest_url( $rest_url );

		$has_shortlink = $this->get_shortlink( $post_id );
		$label         = $has_shortlink ? 'Reset Shortlink' : 'Generate Shortlink';

		$admin_bar->add_menu(
			array(
				'id'     => 'reset-shortlink',
				'title'  => $label,
				'href'   => $rest_url,
				'parent' => 'tools',
			)
		);
	}


	/**
	 * Handle the scheduled bitly regeneration action from ACS.
	 *
	 * @param array $args The arguments.
	 * @return void
	 */
	public function handle_scheduled_shortlink_generation( $post_id ) {
		// Check if args has a post_id key.
		if ( ! isset( $post_id ) ) {
			return;
		}
		// Double check the post exists.
		if ( ! get_post( $post_id ) ) {
			return;
		}
		$this->update_shortlink( $post_id );
	}

	/**
	 * Schedule the bitly regeneration action.
	 *
	 * @param int $post_id The post ID.
	 * @return void
	 */
	public function schedule_shortlink_generation( $post_id ) {
		$args      = array( 'post_id' => $post_id );
		$scheduled = as_has_scheduled_action(
			self::$action_scheduler_hook,
			$args,
			self::$action_scheduler_group
		);
		if ( ! $scheduled ) {
			as_enqueue_async_action(
				self::$action_scheduler_hook,
				$args,
				$post_id,
				true,
				100 // Really late priority, this should happen only when other actions are finished.
			);
			return true;
		}
		return false;
	}
}
