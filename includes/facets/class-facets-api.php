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
	public $cache_group;
	public $registered_facets = array();
	public $selected_choices = array();

	public function __construct($query) {
		$this->query_args = $this->construct_query_args($query);
		$this->registered_facets = $this->get_registered_facets();
		$this->selected_choices = $this->get_selected_choices();
		$this->cache_key = $this->construct_cache_key($query);
		$this->cache_group = $this->construct_cache_group();
	}

	public function construct_cache_key($query = array()) {
		$invalidate = get_option('prc_facet_cache_invalidate', '4/19/24');
		$query = array_merge($query, array(
			'paged' => 1
		));
		return md5(wp_json_encode([
			'query' => $query,
			'selected' => $this->selected_choices,
			'invalidate' => $invalidate,
		]));
	}

	public function construct_cache_group() {
		global $wp;
		$url_params = wp_parse_url( '/' . add_query_arg( array( $_GET ), $wp->request . '/' ) );
		if ( !is_array($url_params) || !array_key_exists('path', $url_params) ) {
			return false;
		}
		return preg_replace('/\/page\/[0-9]+/', '', $url_params['path']);
	}

	public function construct_query_args($query_args = array()) {
		$query_args = apply_filters('prc_platform_pub_listing_default_args', $query_args);
		$query_args = array_merge($query_args, array(
			'paged' => 1
		));
		// Even though we're not running on search pages we should offload to es if search is ever attempted.
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
		// If we are not on the primary site, return an empty array.
		// We do not allow other sites to query facets.
		// If we can't validate a cache group, and this is an outside user, then we'll failover as well.
		$failover = false === $this->cache_group && !is_user_logged_in();
		if ( is_paged() && 100 < get_query_var('paged') ) {
			$failover = true;
		}
		if ( is_search() || PRC_PRIMARY_SITE_ID !== get_current_blog_id() || $failover) {
			// @TODO: Experiment with creating a ElasticPress Facets data provider that matches this format... just needs to transform arguments...
			return [
				'facets'     => [],
				'query_args' => [],
				'settings'   => array(
					'first_load' => true,
				),
			];
		}
		// @TODO: We should check for things like is_404, is_search, etc. and we should check if there are even results in the query...
		do_action('qm/debug', 'facets_cache_key:: '.print_r($this->cache_key, true));

		$cache = new Facets_Cache();
		$cached_data = $cache->get($this->cache_key, $this->cache_group);
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

		$cache->store($this->cache_key, $this->cache_group, $data);

		return $data;
	}
}
