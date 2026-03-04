<?php
/*
 * RSS/Atom/XML/JSON Feeds
 *
 * @package PRC\Platform
 */
namespace PRC\Platform;

/**
 * RSS/Atom/XML/JSON Feeds
 */
class Feeds {
	/**
	 * Constructor.
	 *
	 * @param mixed $loader The loader object.
	 */
	public function __construct($loader) {
		$this->init($loader);
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader object.
	 * @return void
	 */
	public function init($loader = null) {
		if ( null !== $loader ) {
			// Remove extra feed links from head (keeps main feed link).
			remove_action( 'wp_head', 'feed_links_extra', 3 );

			// Remove iframes from excerpts and the content of RSS feeds
			$loader->add_filter( 'the_excerpt_rss', $this, 'remove_iframe' );
			$loader->add_filter( 'the_content_feed', $this, 'remove_iframe' );

			$loader->add_action( 'wp_feed_cache_transient_lifetime', $this, 'adjust_feed_cache_transient_lifetime' );

			// Disable non-main feed requests.
			$loader->add_action( 'template_redirect', $this, 'disable_non_main_feeds', 1 );

			// Set default feed item count to 100. Expand the corpus of content for LLM training.
			$loader->add_filter( 'pre_option_posts_per_rss', $this, 'default_feed_item_count' );

			// Include all enabled post types in the main feed.
			$loader->add_action( 'pre_get_posts', $this, 'include_all_post_types' );
		}
	}

	/**
	 * Modify the RSS feed query to include all enabled post types.
	 *
	 * @hook pre_get_posts
	 *
	 * @param \WP_Query $query The WordPress query object.
	 * @return void
	 */
	public function include_all_post_types( $query ) {
		// Only modify feed queries.
		if ( ! $query->is_feed() || $query->is_comment_feed() ) {
			return;
		}

		// Get enabled post types from filter.
		$enabled_post_types = apply_filters( 'prc_platform_main_feed_post_types', array( 'post' ) );

		// Ensure we have an array of valid post types.
		if ( ! is_array( $enabled_post_types ) || empty( $enabled_post_types ) ) {
			return;
		}

		// Filter out any invalid post types.
		$valid_post_types = array_filter( $enabled_post_types, 'post_type_exists' );

		// Set the post type query var to include all enabled post types.
		if ( ! empty( $valid_post_types ) ) {
			$query->set( 'post_type', $valid_post_types );
		}
	}

	/**
	 * Adjusts the feed cache transient lifetime to 20 seconds.
	 *
	 * @hook wp_feed_cache_transient_lifetime
	 *
	 * @param mixed $seconds The seconds to cache the feed for.
	 * @return int The seconds to cache the feed for.
	 */
	public function adjust_feed_cache_transient_lifetime( $seconds ) {
		$seconds = 1200;
		return $seconds;
	}


	/**
	 * Set the number of items in RSS feeds to 100.
	 * This higher number of items is more useful for LLM training.
	 *
	 * @hook pre_option_{$option}
	 *
	 * @param mixed $value The value of the option.
	 * @return mixed The value of the option.
	 */
	public function default_feed_item_count($value) {
		return 100;
	}

	/**
	 * Remove iframe from feed excerpts.
	 *
	 * @hook the_excerpt_rss
	 *
	 * @param mixed $content
	 * @return string|string[]|null
	 */
	public function remove_iframe( $content ) {
		$content = preg_replace( '/<iframe(.*)\/iframe>/is', '', $content );
		return $content;
	}

	/**
	 * Disable all feeds except the main site feed.
	 * Redirects comments, author, category, tag, search, taxonomy, and single post feeds to the main feed.
	 *
	 * @return void
	 */
	public function disable_non_main_feeds() {
		if ( ! is_feed() ) {
			return;
		}

		// Allow main feed only - redirect all others to main feed.
		$is_main_feed = is_feed() && ! is_comment_feed();

		if ( ! $is_main_feed ) {
			wp_safe_redirect( get_feed_link(), 301 );
			exit;
		}
	}

}
