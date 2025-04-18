<?php
namespace PRC\Platform;

use WP_Error;

class Search {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-search';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . 'factoids/class-factoids.php';
		$this->init( $loader );
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_filter( 'robots_txt', $this, 'manage_robots_txt', 10, 2 );
			$loader->add_filter( 'wp_robots', $this, 'manage_robots', 10, 1 );
			$loader->add_action( 'pre_get_posts', $this, 'sanitize_search_term', 1, 1 );
			$loader->add_filter( 'ep_set_sort', $this, 'ep_sort_by_date', 10, 2 );
			$loader->add_filter( 'ep_highlight_should_add_clause', $this, 'ep_enable_highlighting', 10, 4 );
			new Search_Factoids( $loader );
		}
	}

	/**
	 * Manage the robots.txt file and hide /search pages from Googlebot.
	 *
	 * @param string $output The output.
	 * @param bool   $public Whether the site is public.
	 * @return string
	 */
	function manage_robots_txt( $output, $public ) {
		// Blocking internal /search pages from Googlebot.
		$output .= 'User-agent: Googlebot' . PHP_EOL;
		$output .= 'Disallow: /search/' . PHP_EOL;
		$output .= 'Disallow: /search' . PHP_EOL;
		$output .= 'Disallow: /?s=' . PHP_EOL;
		return $output;
	}

	/**
	 * Manage the robots meta for search.
	 *
	 * @hook wp_robots
	 * @param $robots_directives
	 * @return $robots_directives
	 */
	public function manage_robots( $robots_directives ) {
		if ( is_search() ) {
			$robots_directives['noindex']  = true;
			$robots_directives['nofollow'] = true;
		}
		return $robots_directives;
	}

	/**
	 * Sanitizes search term early if present and limit to 100 characters both as a security and performance measure.
	 *
	 * @hook pre_get_posts
	 * @param $query
	 */
	public function sanitize_search_term( $query ) {
		if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
			$query->set( 's', substr( sanitize_text_field( $query->query['s'] ), 0, 100 ) );
		}
		return $query;
	}

	/**
	 * Force ElasticPress results to sort by date
	 *
	 * @hook ep_set_sort
	 * @param mixed $sort
	 * @param mixed $order
	 * @return mixed
	 */
	public function ep_sort_by_date( $sort, $order ) {
		// Only enable this when __search_sort_by is set to 'date', otherwise default to relevancy.
		if ( isset( $_GET['_ep_sort_by'] ) && 'date' === $_GET['_ep_sort_by'] ) {
			$sort = array(
				array(
					'post_date' => array(
						'order' => $order,
					),
				),
			);
		}
		return $sort;
	}

	/**
	 * Enable ElasticPress highlighting
	 *
	 * @hook ep_highlight_should_add_clause
	 * @param mixed $add_highlight_clause
	 * @param mixed $formatted_args
	 * @param mixed $args
	 * @return true
	 */
	public function ep_enable_highlighting( $add_highlight_clause, $formatted_args, $args ) {
		return true;
	}
}
