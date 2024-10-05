<?php
namespace PRC\Platform;
use WP_Error;
use Jetpack_Gutenberg;

class Jetpack {
	public static $disallowed_modules = array(
		'sso',
	);
	public static $disallowed_extensions = array(
		'ai-assistant',
		'ai-assistant-support',
		'blogging-prompt',
		'calendly',
		'business-hours',
		'google-calendar',
		'instagram-gallery',
		'opentable',
		'eventbrite',
		'payments',
		'pinterest',
		'premium-content',
		'rating-star',
		'recurring-payments',
		'simple-payments',
		'tock',
		'wordads',
		'payments-intro',
		'payment-buttons',
	);
	public static $disallowed_blocks = array(
		'jetpack/contact-info',
		'jetpack/donations',
		'jetpack/podcast-player',
		'jetpack/payment-buttons',
		'jetpack/recurring-payments',
		'jetpack/payments-intro',
		'jetpack/opentable',
		'jetpack/calendly',
		'jetpack/rating-star',
		'jetpack/pinterest',
		'jetpack/google-calendar',
		'jetpack/eventbrite',
		'jetpack/instagram-gallery',
		'jetpack/mailchimp',
		'jetpack/revue',
		'jetpack/story',
		'jetpack/send-a-message',
		'premium-content/container',
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-jetpack';

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

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'jetpack_set_available_extensions', $this, 'set_available_jetpack_extensions' );
			$loader->add_filter( 'option_jetpack_active_modules', $this, 'set_available_jetpack_modules' );
			$loader->add_action( 'jetpack_register_gutenberg_extensions', $this, 'set_available_jetpack_blocks', 99 );
		}
	}

	/**
     * Filter Jetpack extensions.
	 *
	 * For now we're just disabling ai-assistant and ai-assistant-support.
	 *
	 * @hook jetpack_set_available_extensions
     *
     * @param array $extensions Jetpack extensions array.
     * @return array updated extensions array.
     */
	public function set_available_jetpack_extensions( $extensions ){
        $modified_extensions = array_filter(
            $extensions,
            function($extension) {
				$disallowed = self::$disallowed_extensions;
				// if this is not the primary site add back 'ai-assistant', 'ai-assistant-support',
				if ( PRC_PRIMARY_SITE_ID !== get_current_blog_id() || 'production' !== wp_get_environment_type() ) {
					$disallowed = array_diff(
						$disallowed,
						array(
							'ai-assistant',
							'ai-assistant-support',
						)
					);
				}
				return ! in_array(
					$extension,
					self::$disallowed_extensions
				);
			}
        );
		return $modified_extensions;
    }

	/**
	 * Disable Jetpack modules
	 * @hook option_jetpack_active_modules
	 */
	public function set_available_jetpack_modules( $modules ) {
		return array_filter(
			$modules,
			function($module) {
				return ! in_array(
					$module,
					self::$disallowed_modules
				);
			}
		);
	}

	/**
	 * Set available Jetpack blocks
	 * @hook jetpack_register_gutenberg_extensions
	 */
	function set_available_jetpack_blocks() {
		if ( ! class_exists( 'Jetpack_Gutenberg' ) ) {
			return;
		}
		foreach (self::$disallowed_blocks as $block_name) {
			Jetpack_Gutenberg::set_extension_unavailable(
				$block_name,
				'disallowed'
			);
		}

	}
}
