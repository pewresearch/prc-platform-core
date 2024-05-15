<?php
namespace PRC\Platform;
use WP_Error;
use \PRC_PLATFORM_FACEBOOK_APP_ID;
class Social {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-social';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . 'class-bitly.php';
		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action( 'wp_head', $this, 'place_facebook_app_id_in_head' );
			new Bitly( $this->version, $loader );
		}
	}

	/**
	 * @hook wp_head
	 * @return void
	 */
	public function place_facebook_app_id_in_head() {
		$fb_key = PRC_PLATFORM_FACEBOOK_APP_ID;
		// If on a dev server then override the site selection and use test ID.
		if ( 'production' !== wp_get_environment_type() ) {
			$fb_key = null;
		}
		echo '<meta property="share:appID:fb" content="' . esc_attr( $fb_key ) . '">';
	}
}
