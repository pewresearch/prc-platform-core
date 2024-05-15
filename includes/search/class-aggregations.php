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
		}
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
