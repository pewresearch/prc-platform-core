<?php
namespace PRC\Platform;
use WP_Error;

/**
 * General RSS Feed Modifications
 * For post type specific templates see their respective classes.
 * @package PRC\Platform
 */
class RSS_Feeds {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-rss-feeds';

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
			$loader->add_filter('the_excerpt_rss', $this, 'remove_iframe');
			$loader->add_filter('the_content_feed', $this, 'remove_iframe');
			$loader->add_action('wp_feed_cache_transient_lifetime', $this, 'adjust_feed_cache_transient_lifetime');
			$loader->add_action('wp_head', $this, 'add_to_head', 10);
		}
	}

	/**
	 * @hook the_excerpt_rss
	 * @param mixed $content
	 * @return string|string[]|null
	 */
	public function remove_iframe($content) {
		$content = preg_replace( '/<iframe(.*)\/iframe>/is', '', $content );
	    return $content;
	}

	/**
	 * Adjusts the feed cache transient lifetime to 20 seconds.
	 * @hook wp_feed_cache_transient_lifetime
	 * @param mixed $seconds
	 * @return int
	 */
	public function adjust_feed_cache_transient_lifetime($seconds) {
		return 1200;
	}

	/**
	 * @hook wp_head
	 * @return void
	 */
	public function add_to_head() {
		global $post, $wp_query;

		if( is_tax() ) {
			if( $wp_query->queried_object ) {
				$term = $wp_query->queried_object;
				$title = get_bloginfo('name') . ' ' . $term->name;
				$link = get_term_link($term);
				if ( is_wp_error($link) ) {
					return;
				}
				echo wp_sprintf(
					'<link rel="alternate" type="application/rss+xml" title="%1$s RSS Feed" href="%2$s/feed/">',
					esc_attr($title),
					esc_url($link),
				);
			}
		}

		if( 'short-read' === get_post_type( $post ) ) {
			$post_type = get_post_type_object( 'short-read' );
			$title = get_bloginfo('name') . ' ' . $post_type->label;
			$link = get_post_type_archive_link( 'short-read' );
			echo wp_sprintf(
				'<link rel="alternate" type="application/rss+xml" title="%1$s RSS Feed" href="%2$s/feed/">',
				esc_attr($title),
				esc_url($link),
			);
		}

	}
}
