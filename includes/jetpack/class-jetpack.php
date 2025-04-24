<?php
/**
 * Jetpack
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use Jetpack_Gutenberg;

/**
 * Jetpack
 *
 * @package PRC\Platform
 */
class Jetpack {
	/**
	 * Disallowed Jetpack modules.
	 *
	 * @var array
	 */
	public static $disallowed_modules = array(
		'sso',
	);

	/**
	 * Disallowed Jetpack extensions.
	 *
	 * @var array
	 */
	public static $disallowed_extensions = array(
		'blogging-prompt',
		'business-hours',
		// 'button',
		'calendly',
		'donations',
		'google-calendar',
		'instagram-gallery',
		'mailchimp',
		'map',
		'likes',
		'like',
		'opentable',
		'eventbrite',
		'payments',
		'pinterest',
		'premium-content',
		'podcast-player',
		'send-a-message',
		'whatsapp-button',
		'shortlinks',
		'slideshow',
		'story',
		'paywall',
		'blogroll',
		'blogroll-itme',
		'nextdoor',
		'sharing-button',
		'sharing-buttons',
		'goodreads',
		'rating-star',
		'recurring-payments',
		'simple-payments',
		'sharing',
		'tock',
		'wordads',
		'payments-intro',
		'payment-buttons',
	);

	/**
	 * Disallowed Jetpack blocks.
	 *
	 * @var array
	 */
	public static $disallowed_blocks = array(
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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader       The loader object.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the Jetpack class.
	 *
	 * @param      string $loader       The loader object.
	 */
	public function init( $loader = null ) {
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
	public function set_available_jetpack_extensions( $extensions ) {
		$modified_extensions = array_filter(
			$extensions,
			function ( $extension ) {
				$disallowed = self::$disallowed_extensions;
				return ! in_array(
					$extension,
					$disallowed
				);
			}
		);
		return $modified_extensions;
	}

	/**
	 * Disable Jetpack modules
	 *
	 * @hook option_jetpack_active_modules
	 *
	 * @param array $modules Jetpack modules array.
	 * @return array updated modules array.
	 */
	public function set_available_jetpack_modules( $modules ) {
		return array_filter(
			$modules,
			function ( $module ) {
				return ! in_array(
					$module,
					self::$disallowed_modules
				);
			}
		);
	}

	/**
	 * Set available Jetpack blocks
	 *
	 * @hook jetpack_register_gutenberg_extensions
	 */
	public function set_available_jetpack_blocks() {
		if ( ! class_exists( 'Jetpack_Gutenberg' ) ) {
			return;
		}
		foreach ( self::$disallowed_blocks as $block_name ) {
			Jetpack_Gutenberg::set_extension_unavailable(
				$block_name,
				'disallowed'
			);
		}
	}
}
