<?php
namespace PRC\Platform;
use WP_Error;

/** A class for updating a Newsletter Glue post's title and excerpt to match its subject and preview text fields */

/**
 * Class Newsletter
 * @package PRC\Platform
 * @since 1.0.0
 * @access public
 * @property int $post_id
 * @property string $handle
 * @property string $enabled_post_type
 */

class Newsletter {
	public $post_id = null;
	public static $handle = 'prc-platform-post-newsletter-glue';
	public static $post_type = 'newsletterglue';

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
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'prc_platform_on_update', $this, 'update_newsletter_title_and_excerpt', 10, 1 );
		}
	}

	/**
	 * Update the title and excerpt of the post.
	 *
	 * @param mixed $post
	 * @return void
	 */
	public function update_newsletter_title_and_excerpt( $post ) {
		if ( self::$post_type !== $post->post_type ) {
			return;
		}

		// check to see if the attr _newsletterglue exists on the post meta
		$newsletterglue = get_post_meta( $post->ID, '_newsletterglue', true );
		if ( ! $newsletterglue ) {
			return;
		}
		$newsletterglue_subject = $newsletterglue['subject'];
		$newsletterglue_preview_text = $newsletterglue['preview_text'];

		// get post title and excerpt
		$title = get_the_title( $post->ID );
		$excerpt = get_the_excerpt( $post->ID );

		// if the post title and excerpt are the same as the newsletterglue subject and preview text, return
		if ( $title === $newsletterglue_subject && $excerpt === $newsletterglue_preview_text ) {
			return;
		}

		$post = array(
			'post_title' => $newsletterglue_subject,
			'post_excerpt' => $newsletterglue_preview_text,
		);

		wp_update_post( $post );

	}
}
