<?php
namespace PRC\Platform;

use Error;
use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

/**
 * A PHP based API for interacting with Facets WP data via the REST API.
 */
class Facets_API {
	public $query_args;
	public $query_id;
	public $cache_key;
	public $registered_facets = array();
	public $selected_choices = array();

	public function __construct($query) {
		$this->query_args = $this->construct_query_args($query);
		$this->cache_key = $this->construct_cache_key($query);
		$this->registered_facets = $this->get_registered_facets();
		$this->selected_choices = $this->get_selected_choices();
	}

	public function construct_cache_key($query = array()) {
		return md5(wp_json_encode($query));
	}

	public function construct_query_args($query_args = array()) {
		$query_args = apply_filters('prc_platform_pub_listing_default_args', $query_args);
		$query_args = array_merge($query_args, array(
			'paged' => 1
		));
		if ( !empty($query_args['s']) ) {
			$query_args['es'] = true;
		}
		return $query_args;
	}

	public function get_current_selection($facet_slug) {
		$current_url = home_url( add_query_arg( null, null ) );
		$current_query = wp_parse_url($current_url, PHP_URL_QUERY);
		$current_selection = null;
		$facet_slug = '_' . $facet_slug;
		// see if $facetwp_facet_slug is in the query string
		// if it is, then we're going to store it in $new_content
		if ( $current_query ) {
			$query_vars = wp_parse_args($current_query);
			if ( array_key_exists($facet_slug, $query_vars) ) {
				$current_selection = explode(',', $query_vars[$facet_slug]);
			}
		}
		return $current_selection;
	}

	public function get_registered_facets() {
		$settings = get_option('facetwp_settings', false);
		if ( !$settings ) {
			return array();
		}
		$registered_facets = array();
		$facets = json_decode($settings, true)['facets'];
		foreach ($facets as $facet) {
			$facet_slug = '_' . $facet['name'];
			$registered_facets[$facet['name']] = $this->get_current_selection($facet['name']);
		}
		return $registered_facets;
	}

	public function get_selected_choices() {
		$selected_choices = array();
		foreach ($this->registered_facets as $facet_slug => $selected) {
			if ( !empty($selected) ) {
				$selected_choices[$facet_slug] = $selected;
			}
		}
		return $selected_choices;
	}

	public function query() {
		$cached = new Cache();
		$cached_data = $cached->get($this->cache_key, 'facets_group');
		if ( $cached_data ) {
			return $cached_data;
		}

		$args = apply_filters('prc_platform_facets_api_args', array(
			'facets'     => $this->registered_facets,
			'query_args' => $this->query_args,
			'settings'   => array(
				'first_load' => true,
			),
		));

		// Build FacetWP rest request.
		$request = new \WP_REST_Request( 'POST', '/facetwp/v1/fetch' );
		$request->set_param( 'data', wp_json_encode( $args ) );

		// Send request.
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );

		$data = apply_filters('prc_platform_facets_api_response', $data);

		$cached->store($this->cache_key, 'facets_group', $data);
		return $data;
	}
}
