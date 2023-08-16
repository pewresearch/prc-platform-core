<?php
namespace PRC\Platform;
use WP_Error;

class Search {
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

	public static $handle = 'prc-platform-search';

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
	 * Recommended in docs to disable relevancy when using ElasticPress.
	 * @hook facetwp_use_search_relevancy
	 * @return false
	 */
	public function facetwp_disable_search_relevancy() {
		return false;
	}

	/**
	 * Sanitizes search term early if present and limit to 100 characters both as a security and performance measure.
	 * @hook pre_get_posts
	 * @param $query
	 * @return modified WP_Query with s sanitized.
	 */
	public function sanitize_search_term( $query ) {
		if ( ! is_admin() && $query->is_main_query() && $query->is_search() ) {
			$query->set( 's', substr( sanitize_text_field( $query->query['s'] ), 0, 100 ) );
		}
		return $query;
	}

	/**
	 * Force ElasticPress results to sort by date
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
	 * @hook ep_highlight_should_add_clause
	 * @param mixed $add_highlight_clause
	 * @param mixed $formatted_args
	 * @param mixed $args
	 * @return true
	 */
	public function ep_enable_highlighting($add_highlight_clause, $formatted_args, $args) {
		return true;
	}
}
