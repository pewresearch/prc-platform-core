<?php
/**
 * The Social class.
 *
 * @since    1.0.0
 */

namespace PRC\Platform;

/**
 * The Social class.
 *
 * @since    1.0.0
 */
class Social {

	/**
	 * The handle for the social plugin.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-social';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader    The loader.
	 */
	public function __construct( $loader = null ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-shortlinks.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-cli-commands.php';
		if ( null !== $loader ) {
			$loader->add_action( 'wp_head', $this, 'place_facebook_app_id_in_head' );
			new Shortlinks( $loader );
		}
	}

	/**
	 * Place the Facebook app ID in the head.
	 *
	 * @hook wp_head
	 * @return void
	 */
	public function place_facebook_app_id_in_head() {
		// Sanity checks to ensure that the constants are defined.
		if ( ! defined( 'PRC_PLATFORM_FACEBOOK_APP_ID' ) ) {
			return;
		}
		$fb_key = PRC_PLATFORM_FACEBOOK_APP_ID;
		// If on a dev server then override the site selection and use test ID.
		if ( 'production' !== wp_get_environment_type() ) {
			$fb_key = null;
		}
		echo '<meta property="share:appID:fb" content="' . esc_attr( $fb_key ) . '">';
	}
}
