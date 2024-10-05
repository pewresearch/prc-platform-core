<?php
namespace PRC\Platform;

use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

class FacetWP_Middleware {
	public static $facets = array(
		array(
			"name" => "categories",
			"label" => "Topics",
			"type" => "checkboxes",
			"source" => "tax/category",
			"parent_term" => "",
			"modifier_type" => "off",
			"modifier_values" => "",
			"hierarchical" => "yes",
			"show_expanded" => "no",
			"ghosts" => "yes",
			"preserve_ghosts" => "no",
			"operator" => "or",
			"orderby" => "count",
			"count" => "50",
			"soft_limit" => "5"
		),
		array(
			"name" => "research_teams",
			"label" => "Research Teams",
			"type" => "dropdown",
			"source" => "tax/research-teams",
			"label_any" => "Any",
			"parent_term" => "",
			"modifier_type" => "off",
			"modifier_values" => "",
			"hierarchical" => "no",
			"orderby" => "count",
			"count" => "25"
		),
		array(
			"name" => "formats",
			"label" => "Formats",
			"type" => "checkboxes",
			"source" => "tax/formats",
			"parent_term" => "",
			"modifier_type" => "off",
			"modifier_values" => "",
			"hierarchical" => "no",
			"show_expanded" => "no",
			"ghosts" => "yes",
			"preserve_ghosts" => "no",
			"operator" => "or",
			"orderby" => "count",
			"count" => "-1",
			"soft_limit" => "5"
		),
		array(
			"name" => "authors",
			"label" => "Authors",
			"type" => "dropdown",
			"source" => "tax/bylines",
			"label_any" => "Any",
			"parent_term" => "",
			"modifier_type" => "off",
			"modifier_values" => "",
			"hierarchical" => "no",
			"orderby" => "count",
			"count" => "-1"
		),
		array(
			"name" => "time_since",
			"label" => "Time Since",
			"type" => "time_since",
			"source" => "post_date",
			"label_any" => "By Date Range",
			"choices" => "Past Month | -30 days\nPast 6 Months | -180 days\nPast 12 Months | -365 days\nPast 2 Years | -730 days"
		),
		array(
			"name" => "date_range",
			"label" => "Date Range",
			"type" => "date_range",
			"source" => "post_date",
			"compare_type" => "",
			"fields" => "both",
			"format" => "Y"
		),
		array(
			"name" => "years",
			"label" => "Years",
			"type" => "yearly",
			"source" => "post_date",
			"label_any" => "Any",
			"orderby" => "count",
			"count" => "75"
		),
		array(
			"name" => "regions_countries",
			"label" => "Regions & Countries",
			"type" => "radio",
			"source" => "tax/regions-countries",
			"label_any" => "Any",
			"parent_term" => "",
			"modifier_type" => "off",
			"modifier_values" => "",
			"ghosts" => "yes",
			"preserve_ghosts" => "no",
			"orderby" => "count",
			"count" => "-1"
		),
	);

	/**
	 * Initialize FacetWP Class
	 * @param string $version
	 * @param mixed $loader
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-facetwp-api.php';
		// FacetWP:
		$loader->add_filter( 'facetwp_is_main_query', $this, 'facetwp_is_main_query', 10, 2 );
		$loader->add_filter( 'facetwp_api_can_access', $this, 'allow_facetwp_api_access' );
		$loader->add_filter( 'facetwp_indexer_query_args', $this, 'filter_facetwp_indexer_args', 10, 1 );
		$loader->add_filter( 'facetwp_index_row', $this, 'restrict_facet_row_depth', 10, 1 );
		$loader->add_filter( 'facetwp_facets', $this, 'register_facets', 10, 1 );
	}

	public function facetwp_is_main_query( $is_main_query, $query ) {
		// Short circuit if we're on a search results page for now.
		if ( $query->is_search() ) {
			$is_main_query = false;
		}
		return $is_main_query;
	}

	/**
	 * Allow FacetWP rest api access
	 * @hook facetwp_api_can_access
	 * @return true
	 */
	public function allow_facetwp_api_access() {
		return true;
	}

	public static function get_facets_settings() {
		$settings = get_option('facetwp_settings', false);
		$settings = json_decode($settings, true);
		$facets = array_key_exists('facets', $settings) ? $settings['facets'] : array();
		foreach ($facets as $facet_slug => $facet) {
			$facet['facet_type'] = FacetWP_API::get_facet_type($facet);
			$facets[$facet_slug] = $facet;
		}
		return $facets;
	}

	/**
	 * Manually register FacetWP facets
	 * @hook facetwp_facets
	 * @param mixed $facets
	 * @return mixed
	 */
	public function register_facets($facets) {
		return self::$facets;
	}

	/**
	 * Use default platform pub listing query args.
	 * @hook facetwp_indexer_query_args
	 *
	 * @param mixed $args
	 * @return mixed
	 */
	public function filter_facetwp_indexer_args( $args ) {
		$query_defaults = apply_filters('prc_platform_pub_listing_default_args', $args);
		$query_defaults['post_type'] = array_merge( $query_defaults['post_type'], array( 'dataset' ) );
		return array_merge($args, $query_defaults);
	}

	/**
	 * Limit topic, categories, and other hierarchical facets to depth 0; only returning parent terms.
	 * @hook facetwp_index_row
	 * @param mixed $params
	 * @param mixed $class
	 * @return mixed
	 */
	public function restrict_facet_row_depth($params) {
		if ( in_array( $params['facet_name'], array(
			'topics',
			'topic',
			'categories',
			'category',
		) ) ) {
			if ( $params['depth'] > 0 ) {
				// don't index this row
				$params['facet_value'] = '';
			}
		}
		return $params;
	}
}
