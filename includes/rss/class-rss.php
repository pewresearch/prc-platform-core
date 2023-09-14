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
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

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
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
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
	 * @hook wp_feed_cache_transient_lifetime
	 * @param mixed $seconds
	 * @return int
	 */
	public function adjust_feed_cache_transient_lifetime($seconds) {
	    // 20 minutes in seconds...
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
