<?php
namespace PRC\Platform;
use WP_Error;

class Search_Aggregations {
	public static $handle = 'prc-platform-search-aggregations';

	/**
	 * Initialize the class and set its properties.
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $loader ) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'ep_facet_include_taxonomies', $this, 'taxonomy_aggregations' );
			// $loader->add_filter( 'ep_formatted_args', $this, 'vip_add_date_histogram_to_aggs', 10, 3 );
		}
	}

	/**
	 * @hook ep_formatted_args
	 */
	public function vip_add_date_histogram_to_aggs( $formatted_args, $args, $wp_query ) {
		if ( ! is_search() ) {
			return;
		}
		$year = array(
			'filter' => $formatted_args['post_filter'],
			'aggs'   => array(
				'years' => array(
					'terms' => array(
						'field' => 'date_terms.year',
						'order' => array( '_key' => 'desc' ),
					),
				),
			),
		);
		$formatted_args['aggs']['date_histogram'] = $year;

		return $formatted_args;
	}


	public function date_aggregations() {
		$time_since = [];
		$years = [];
		$range = [2010, 2020];
	}

	public function taxonomy_aggregations( $taxonomies ) {
		$category = get_taxonomy( 'category' );
		$formats = get_taxonomy( 'formats' );
		$bylines = get_taxonomy( 'bylines' );
		$research_teams = get_taxonomy( 'research-teams' );
		$regions_countries = get_taxonomy( 'regions-countries' );
		return [
			'category' => $category,
			'formats' => $formats,
			'bylines' => $bylines,
			'research-teams' => $research_teams,
			'regions-countries' => $regions_countries
		];
	}
}
