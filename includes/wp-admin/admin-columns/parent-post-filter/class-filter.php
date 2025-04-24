<?php
/**
 * Parent Post Filtering
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Parent Post Filtering
 *
 * @package PRC\Platform
 */
class Parent_Post_Filtering extends \ACP\Filtering\Model {

	/**
	 * Filter by parent posts
	 *
	 * @param string $where The WHERE clause.
	 * @return string The WHERE clause.
	 */
	public function filter_by_parent( $where ) {
		global $wpdb;

		if ( 'parent_posts' === $this->get_filter_value() ) {
			$where .= $wpdb->prepare(
				" AND {$wpdb->posts}.post_parent = 0
				AND {$wpdb->posts}.post_status = 'publish'
				AND {$wpdb->posts}.post_type = %s",
				$this->column->get_post_type() 
			);
		}

		// do the same as above but only for child posts
		if ( 'child_posts' === $this->get_filter_value() ) {
			$where .= $wpdb->prepare(
				" AND {$wpdb->posts}.post_parent != 0
				AND {$wpdb->posts}.post_status = 'publish'
				AND {$wpdb->posts}.post_type = %s",
				$this->column->get_post_type() 
			);
		}

		return $where;
	}

	/**
	 * Get the filtering vars
	 *
	 * @param array $vars The vars.
	 * @return array The vars.
	 */
	public function get_filtering_vars( $vars ) {
		add_filter( 'posts_where', array( $this, 'filter_by_parent' ) );
		return $vars;
	}

	/**
	 * Get the filtering data
	 *
	 * @return array The filtering data.
	 */
	public function get_filtering_data() {
		return array(
			'options' => array(
				'parent_posts' => 'Parent Posts',
				'child_posts'  => 'Child Posts',
			),
		);
	}
}
