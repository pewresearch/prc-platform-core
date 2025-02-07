<?php
namespace PRC\Platform;

use Error;
use WP_Error;

/**
 * A PHP based API for interacting with Facets WP data via the REST API.
 */
class ElasticPress_Facets_API {
	protected $enable_cache = true;
	public $cache_key;
	public $cache_group;

	public $selected = array();
	protected $ep_facets;

	public $query_args;
	public $query_id;
	public $query;

	public function __construct( $query ) {
		$this->ep_facets   = new \ElasticPress\Feature\Facets\Facets();
		$this->selected    = $this->get_selected( null, true );
		$this->cache_key   = \PRC\Platform\Facets::construct_cache_key( $query, $this->selected );
		$this->cache_group = \PRC\Platform\Facets::construct_cache_group() . '-ep';
	}

	public function build_url( $filters = array() ) {
		return $this->ep_facets->build_query_url( $filters );
	}

	public function get_selected( $key = null, $failover_to_all = false ) {
		$selected = $this->ep_facets->get_selected();
		// If s key is set, then we're on a search page. Lets remoe it we dont need it
		if ( array_key_exists( 's', $selected ) ) {
			unset( $selected['s'] );
		}
		// Move $selected['taxonomies'] to the top level.
		if ( array_key_exists( 'taxonomies', $selected ) ) {
			$taxonomies = array_keys( $selected['taxonomies'] );
			// Condense the 'terms' sub object.
			foreach ( $taxonomies as $taxonomy ) {
				$selected[ $taxonomy ] = array_keys( $selected['taxonomies'][ $taxonomy ]['terms'] );
			}
			unset( $selected['taxonomies'] );
		}
		if ( null !== $key && array_key_exists( $key, $selected ) ) {
			return $selected[ $key ];
		} elseif ( $failover_to_all ) {
			return $selected;
		}
		return array();
	}

	/**
	 * This function is the main way to get "aggregations" (facets) data from ES.
	 * Returns a list of taxonomies with values and counts.
	 *
	 * @return array
	 */
	public function get_aggregations() {
		global $wp_query;
		if ( ! $wp_query->elasticsearch_success ) {
			do_action( 'qm/debug', 'Facets_API::get_aggregations:: Unsuccessful ES request, bail.' );
			return; // Unsuccessful ES request, bail, bail, bail.
		}
		global $ep_facet_aggs;
		$aggs = $ep_facet_aggs;
		foreach ( $aggs as $facet_slug => $facets_data ) {
			// Handle Year:
			if ( in_array(
				$facet_slug,
				array(
					'years',
					'year',
					'months',
				)
			) ) {
				$aggs[ $facet_slug ] = $facets_data;
				continue;
			}
			// Handle Taxonomy:
			$matched_terms     = $facets_data;
			$matched_term_keys = array_keys( $matched_terms );
			// Get all the terms for this taxonomy.
			$taxonomy_terms = get_terms(
				array(
					'taxonomy'   => $facet_slug,
					'hide_empty' => false,
					'fields'     => 'slugs',
				)
			);
			$new_terms      = array();
			// Recreate the EP aggregations array but merged with the data from all taxonomy terms from WP.
			foreach ( $taxonomy_terms as $term_slug ) {
				// Recreate the term_slug => post_count array, but with 0 for those that don't exist in the current aggregation set.
				if ( in_array( $term_slug, $matched_term_keys ) ) {
					$new_terms[ $term_slug ] = $matched_terms[ $term_slug ];
				} else {
					$new_terms[ $term_slug ] = 0;
				}
			}
			// Reorder new_terms so that those with counts are on top based on value.
			$new_terms = array_merge( array_flip( $matched_term_keys ), $new_terms );
			// Replace the old terms with the new terms.
			$aggs[ $facet_slug ] = $new_terms;
		}
		return $aggs;
	}

	protected function process_taxonomy_facet( $taxonomy, $terms ) {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			return false;
		}
		$taxonomy_facet = array(
			'choices'         => array(),
			'expandedChoices' => array(),
			'selected'        => $this->get_selected( $taxonomy ),
			'facetSlug'       => $taxonomy,
		);
		foreach ( $terms as $slug => $count ) {
			$term_obj = get_term_by( 'slug', $slug, $taxonomy );
			// Only allow top level terms
			if ( 0 !== $term_obj->parent ) {
				continue;
			}
			$selected                    = $taxonomy_facet['selected'];
			$taxonomy_facet['choices'][] = array(
				'count'      => $count,
				'label'      => \PRC\Platform\Facets::format_label( $term_obj->name ),
				'slug'       => $slug,
				'facetSlug'  => $taxonomy,
				'term_id'    => $term_obj->term_id,
				'value'      => $slug,
				'isSelected' => in_array( $slug, $selected ),
				'isRequired' => false, // None of these are required.
				'type'       => \PRC\Platform\ElasticPress_Middleware::get_facet_type( $taxonomy ),
			);
		}
		return $taxonomy_facet;
	}

	protected function process_datetime_facet( $facet_slug, $facets_data ) {
		$datetime_facet = array(
			'choices'         => array(),
			'expandedChoices' => array(),
			'selected'        => $this->get_selected( $facet_slug ),
			'facetSlug'       => $facet_slug,
		);
		foreach ( $facets_data as $year => $count ) {
			$selected                    = $datetime_facet['selected'];
			$datetime_facet['choices'][] = array(
				'count'      => $count,
				'label'      => \PRC\Platform\Facets::format_label( $year ),
				'slug'       => $year,
				'facetSlug'  => $facet_slug,
				'value'      => $year,
				'isSelected' => in_array( $year, $selected ),
				'isRequired' => false, // None of these are required.
				'type'       => \PRC\Platform\ElasticPress_Middleware::get_facet_type( $facet_slug ),
			);
		}
		return $datetime_facet;
	}

	/**
	 * This function translates Aggregations data from ElasticPress (VIP Enterprise Search) into "Facets" data for our interactive blocks.
	 */
	public function get_facets() {
		$failover = false;
		// If this is the main blog or a 404 page, we should failover to the default WP query.
		if ( 1 === get_current_blog_id() || is_404() ) {
			$failover = true;
		}
		// If this is a paged request and it exceeds page 300 then we should failover to the default WP query.
		if ( is_paged() && 300 < get_query_var( 'paged' ) ) {
			$failover = true;
		}
		if ( $failover ) {
			return array();
		}

		// If cache is enabled, check if we have a cached version of the facets.
		if ( $this->enable_cache ) {
			$cached_facets = wp_cache_get( $this->cache_key, $this->cache_group );
			if ( false !== $cached_facets ) {
				return $cached_facets;
			}
		}

		$aggregations = $this->get_aggregations();
		$facets       = array();
		foreach ( $aggregations as $facet_slug => $facets_data ) {
			do_action( 'qm/debug', 'PRC Facets - EP - Processing Facet:: ' . $facet_slug );
			global $ep_facet_aggs;
			$aggs = $ep_facet_aggs;
			if ( ! in_array(
				$facet_slug,
				array(
					'years',
					'year',
					'months',
				)
			) ) {
				$facets[ $facet_slug ] = $this->process_taxonomy_facet( $facet_slug, $facets_data );
			} else {
				$facets[ $facet_slug ] = $this->process_datetime_facet( $facet_slug, $facets_data );
			}
			do_action( 'qm/debug', ' -- Returned Facet:' . print_r( $facets[ $facet_slug ], true ) );
		}

		if ( ! is_preview() || ! empty( $facets ) ) {
			// If cache is enabled, cache the facets for 5 minutes.
			if ( $this->enable_cache ) {
				wp_cache_set(
					$this->cache_key,
					$facets,
					$this->cache_group,
					30 * MINUTE_IN_SECONDS
				);
			}
		}

		return $facets;
	}

	public function get_pagination() {
		global $wp_query;
		$pagination_data = array(
			'total_rows'  => $wp_query->found_posts,
			'per_page'    => $wp_query->post_count,
			'total_pages' => $wp_query->max_num_pages,
			'page'        => $wp_query->get( 'paged' ) + 1,
		);
		return $pagination_data;
	}
}
