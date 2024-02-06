<?php
namespace PRC\Platform;
use WP_Error;

class Apple_News {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-apple-news';

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
		if (null !== $loader) {
			$loader->add_filter( 'apple_news_exporter_byline', $this, 'get_bylines', 10, 2) ;
			$loader->add_filter( 'apple_news_skip_push', $this, 'skip_push', 10, 1) ;
		}
	}

	/**
	 * Returns bylines from our staff-bylines hybrid system.
	 *
	 * @hook apple_news_exporter_byline
	 *
	 * @param mixed $byline
	 * @param mixed $post_id
	 * @return string $byline
	 */
	public function get_bylines($byline, $post_id) {
		$bylines = new Bylines($post_id);
		return 'By ' . $bylines->format('string');
	}

	/**
	 * If the post is not on production, skip pushing to Apple News.
	 * @hook apple_news_skip_push
	 * @param mixed $post_id
	 * @return bool
	 */
	public function skip_push_on_non_prod_env($post_id) {
		// @TODO Check post status, if its post_hidden, skip.
		return 'production' !== wp_get_environment_type();
	}
}
