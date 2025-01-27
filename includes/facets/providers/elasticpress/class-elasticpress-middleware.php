<?php
/**
 * Middleware for ElasticPress integration.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use \ElasticPress\Feature\Facets\Facets;

/**
 * Middleware for ElasticPress integration.
 */
class ElasticPress_Middleware {
	protected $ep_facets;

	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-elasticpress-facets-api.php';

		// ElasticPress:
		if ( class_exists( '\ElasticPress\Feature\Facets\Facets' ) ) {
			$this->ep_facets = new Facets();
		} else {
			error_log( 'ElasticPress Facets class does not exist.' );
		}
		$loader->add_action( 'pre_get_posts', $this, 'take_over_pub_listing_queries', 5, 1 );
		$loader->add_filter( 'ep_facet_include_taxonomies', $this, 'register_facets' );
		$loader->add_filter( 'ep_post_formatted_args', $this, 'restructure_ep_taxonomy_args', 10, 3 );
		$loader->add_filter( 'ep_formatted_args', $this, 'add_date_aggregations', 10, 3 );
		$loader->add_filter( 'ep_valid_response', $this, 'include_date_aggregation_in_response', 19, 4 );
		$loader->add_filter( 'ep_facet_taxonomies_size', $this, 'set_facet_taxonomies_size', 10, 2 );
		$loader->add_filter( 'ep_set_sort', $this, 'sort_ep_by_date', 20, 2 );
		$loader->add_filter( 'prc_platform_rewrite_query_vars', $this, 'register_query_vars' );
	}

	/**
	 * Enforce ElasticPress integration for pub listing queries.
	 * This allows facets to work on non search queries.
	 *
	 * @hook pre_get_posts
	 * @param WP_Query $query
	 */
	public function take_over_pub_listing_queries( $query ) {
		if ( $query->get( 'isPubListingQuery' ) && $query->is_search() ) {
			$query->set( 'ep_integrate', true );
		}
	}

	/**
	 * Get the facet UI type for a given taxonomy.
	 */
	public static function get_facet_type( $facet_slug ) {
		switch ( $facet_slug ) {
			case 'category':
			case 'formats':
				return 'checkbox';
			case 'bylines':
			case 'research-teams':
				return 'dropdown';
			case 'regions-countries':
				return 'radio';
			case 'years':
				return 'dropdown';
			default:
				return 'checkbox';
		}
	}

	/**
	 * Add taxonomy aggregations to ElasticPress.
	 *
	 * @hook ep_facet_include_taxonomies
	 * @param array $taxonomies
	 * @return array $taxonomies
	 */
	public static function get_facets_settings() {
		$category                      = get_taxonomy( 'category' );
		$category->facet_type          = self::get_facet_type( 'category' );
		$formats                       = get_taxonomy( 'formats' );
		$formats->facet_type           = self::get_facet_type( 'formats' );
		$bylines                       = get_taxonomy( 'bylines' );
		$bylines->facet_type           = self::get_facet_type( 'bylines' );
		$research_teams                = get_taxonomy( 'research-teams' );
		$research_teams->facet_type    = self::get_facet_type( 'research-teams' );
		$regions_countries             = get_taxonomy( 'regions-countries' );
		$regions_countries->facet_type = self::get_facet_type( 'regions-countries' );
		$years                         = (object) array(
			'name'       => 'years',
			'label'      => 'Years',
			'facet_type' => self::get_facet_type( 'years' ),
		);
		return array(
			'category'          => $category,
			'formats'           => $formats,
			'bylines'           => $bylines,
			'research-teams'    => $research_teams,
			'regions-countries' => $regions_countries,
			'years'             => $years,
		);
	}

	public function register_facets( $taxonomies ) {
		return self::get_facets_settings();
	}

	/**
	 * @hook prc_platform_rewrite_query_vars
	 */
	public function register_query_vars( $qvars ) {
		$qvars[] = 'ep_sort__by_date';
		return $qvars;
	}

	/**
	 * Sort ElasticPress results by date.
	 *
	 * @hook ep_set_sort
	 */
	public function sort_ep_by_date( $sort, $order ) {
		if ( ! get_query_var( 'ep_sort__by_date' ) ) {
			return $sort;
		}
		$sort = array(
			array(
				'post_date' => array(
					'order' => $order,
				),
			),
		);
		return $sort;
	}

	/**
	 * Restructure post_filter taxonomy statements to be more scoped. This matches OR inside taxonomy groups, and AND between taxonomy groups.
	 * This filter is especially formatted for elasticsearch queries.
	 *
	 * @hook ep_post_formatted_args
	 * @param array    $args
	 * @param array    $query_args
	 * @param WP_Query $wp_query
	 * @return array $args
	 */
	public function restructure_ep_taxonomy_args( $args, $query_args, $wp_query ) {
		// The taxonomy "should" statements that need to be restructured:
		if ( ! isset( $args['post_filter']['bool']['must'][0]['bool']['should'] ) ) {
			return $args;
		}
		// Some sanity checks:
		$x = $args['post_filter']['bool']['must'][0]['bool']['should'];
		if ( ! isset( $x ) ) {
			return $args;
		}
		if ( count( $x ) <= 1 ) {
			return $args;
		}
		$new = array();
		// Restructure the should statements so that they are grouped by taxonomy:
		foreach ( $x as $item ) {
			$new[] = array(
				'bool' => array(
					'should' => $item,
				),
			);
		}
		// Remove the old should statements:
		unset( $args['post_filter']['bool']['must'][0]['bool']['should'] );
		// Add the new structured must/should statements:
		$args['post_filter']['bool']['must'][0]['bool']['must'] = $new;

		return $args;
	}

	/**
	 * Setup a "years" aggregation for ElasticPress.
	 * This is a custom aggregation that is not provided by ElasticPress and
	 * will provide a bucketed list of years for the post_date field.
	 *
	 * @param array    $formatted_args
	 * @param array    $args
	 * @param WP_Query $wp_query
	 * @return array $year
	 */
	protected function set_year_aggregation( $formatted_args, $args, $wp_query ) {
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
		return $year;
	}

	/**
	 * @hook ep_formatted_args
	 */
	public function add_date_aggregations( $formatted_args, $args, $wp_query ) {
		// Years Aggregation:
		$formatted_args['aggs']['date_histogram'] = $this->set_year_aggregation( $formatted_args, $args, $wp_query );
		return $formatted_args;
	}

	/**
	 * Based on https://github.com/Automattic/ElasticPress/blob/2675125bd32c08aa397e581d447de796010605b5/includes%2Fclasses%2FFeature%2FFacets%2FFacets.php#L361-L399
	 * Hacky. Save aggregation data for later in a global
	 *
	 * @hook ep_valid_response
	 * @param  array $response ES response
	 * @param  array $query Prepared Elasticsearch query
	 * @param  array $query_args Current WP Query arguments
	 * @param  mixed $query_object Could be WP_Query, WP_User_Query, etc.
	 * @since  2.5
	 */
	public function include_date_aggregation_in_response( $response, $query, $query_args, $query_object ) {
		if ( empty( $query_object ) || 'WP_Query' !== get_class( $query_object ) || ! $this->ep_facets->is_facetable( $query_object ) ) {
			return $response;
		}

		if ( ! empty( $response['aggregations'] ) ) {
			if ( isset( $response['aggregations']['date_histogram'] ) && is_array( $response['aggregations']['date_histogram'] ) ) {
				foreach ( $response['aggregations']['date_histogram'] as $key => $agg ) {
					if ( 'doc_count' === $key ) {
						continue;
					}

					if ( ! is_array( $agg ) || empty( $agg['buckets'] ) ) {
						continue;
					}

					$GLOBALS['ep_facet_aggs'][ $key ] = array();

					foreach ( $agg['buckets'] as $bucket ) {
						$GLOBALS['ep_facet_aggs'][ $key ][ $bucket['key'] ] = $bucket['doc_count'];
					}
				}
			}
		}
	}

	/**
	 * Set the size of the taxonomy facets, how many records to return.
	 *
	 * @hook ep_facet_taxonomies_size
	 * @param int    $size
	 * @param string $taxonomy
	 * @return int $size
	 */
	public function set_facet_taxonomies_size( $size, $taxonomy ) {
		$size = 100; // We don't really have that many terms to return for formats or categories, but bylines is a different story. That said, this should return the highest counts first so this works out in the end.
		return $size;
	}
}
