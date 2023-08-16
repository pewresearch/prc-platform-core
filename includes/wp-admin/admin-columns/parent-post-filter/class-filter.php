<?php

namespace PRC\Platform;

class Parent_Post_Filtering extends \ACP\Filtering\Model {

	public function filter_by_parent( $where ) {
		global $wpdb;

		if ( 'parent_posts' === $this->get_filter_value() ) {
			$where .= $wpdb->prepare( " AND {$wpdb->posts}.post_parent = 0
				AND {$wpdb->posts}.post_status = 'publish'
				AND {$wpdb->posts}.post_type = %s", $this->column->get_post_type() );
		}

		// do the same as above but only for child posts
		if ( 'child_posts' === $this->get_filter_value() ) {
			$where .= $wpdb->prepare( " AND {$wpdb->posts}.post_parent != 0
				AND {$wpdb->posts}.post_status = 'publish'
				AND {$wpdb->posts}.post_type = %s", $this->column->get_post_type() );
		}

		return $where;
	}

	public function get_filtering_vars( $vars ) {
		add_filter( 'posts_where', array( $this, 'filter_by_parent' ) );
		return $vars;
	}

	public function get_filtering_data() {
		return [
			'options' => [
				'parent_posts' => 'Parent Posts',
				'child_posts' => 'Child Posts',
			],
		];
	}

}
