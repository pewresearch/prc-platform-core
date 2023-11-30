<?php
namespace PRC\Platform;

/**
 * An API for managing and interacting with FacetWP.
 * @package
 */
class Facets_API {
	public $cache = false;
	public static $cron_schedule = 'twicedaily';
	public static $cron_name = 'prc_scheduled_facet_index';

	public function __construct( $init = false ) {
		if ( true === $init ) {
			// $this->cache = new Cache(false);


			// add_filter( 'facetwp_facets', array($this, 'fwp_register_facets'), 10, 1 );

			// add_filter( 'facetwp_indexer_query_args', array( $this, 'fwp_indexer_args' ) );

			add_filter( 'prc_facets_api_data', array($this, 'format_topic_response') );

			add_filter( 'prc_facets_active_selections', array($this, 'get_active_selections') );

			add_action( 'init', array($this, 'fwp_schedule_indexer_activation') );

		}
	}

	public function fwp_scheduled_index() {
		if ( function_exists('FWP') ) {
// 			FWP()->indexer->index();
		}
	}

	public function fwp_schedule_indexer_activation() {
		$args = array(
			'recurrence' => self::$cron_schedule,
			'schedule' => 'schedule',
			'name' => self::$cron_name,
			'cb' => array($this, 'fwp_scheduled_index'),
			'multisite'=> false,
			'plugin_root_file'=> '',
			'run_on_creation'=> true,
			'args' => array()
		);

		// $cronplus = new CronPlus( $args );
		// $cronplus->schedule_event();
	}

	/**
	 * Manually register FacetWP facets
	 * @param mixed $facets
	 * @return mixed
	 */
	public function fwp_register_facets($facets) {
		// error_log('facetwp_facets...'.print_r($facets, true));
		// $facets[] = [
		// 	'label' => 'My Search',
		// 	'name' => 'my_search',
		// 	'type' => 'search',
		// 	'search_engine' => '',
		// 	'placeholder' => 'Enter keywords',
		// ];
		return $facets;
	}

	public function get_active_selections() {
		global $wp_query;
		$query_vars = $wp_query->query_vars;
		$parsed = $this->parse_facets_and_path($query_vars);
		if ( false === $parsed ) {
			return array();
		}
		return $parsed['facets'];
	}

	/**
	 * Filters FacetWP indexing arguments. Hooks into platform and block-library filter to ensure correct query args are used via blocks.
	 *
	 * @param array $args
	 * @return array
	 */
	public function fwp_indexer_args( $args ) {
		$query_defaults = apply_filters('prc_platform_pub_listing_default_args', $args);
		return array_merge($args, $query_defaults);
	}

	/**
	 * Provide an example of the shape of data as it comes back from the Facet WP API.
	 * @return array
	 */
	private function _data_shape() {
		return array(
			'facets' => array(
				'formats' => array(
					'choices' => array(
						array(
							'count' => 3153, // The number of posts that match this facet choice.
							'depth' => 0, // Whether this facet is a root level object.
							'parent_id' => 0,
							'term_id' => 10818957,
							'label' => "Report",
							'value' => "report",
						)
					),
					'selected' => array('short-read'), // Even for single value facets this is an array.
					'label' => 'Formats',
					'name' => 'formats',
					'type' => 'checkboxes',
				)
			),
			'pager' => array(
				'per_page' => 10,
				'page' => 1,
				'total_rows' => 3153,
				'total_pages' => 314,
			),
			'post_type' => 'post',
			'is_taxonomy' => false,
		);
	}

	public function format_topic_response( $data ) {
		$facets = $data['facets'];
		$facet_keys = array_keys($facets);

		if ( in_array('topic', $facet_keys ) ) {
			$choices = $facets['topic']['choices'];
			// Strip the topic's facet down to only parent terms.
			$data['facets']['topic']['choices'] = array_filter($choices, function($choice) {
				return $choice['depth'] === 0;
			});
		}
		return $data;
	}

	public function parse_facets_and_path( $query_vars ) {
		// Get currently active facets from the url.
		global $wp;
		$url_params = wp_parse_url( '/' . add_query_arg( array( $_GET ), $wp->request . '/' ) );

		if ( !is_array($url_params) || !array_key_exists('path', $url_params) ) {
			return false;
		}

		// Set up the query params we know we have and set their values accordingly.
		$query_params = array();
		if ( is_array($url_params) && array_key_exists('query', $url_params) ) {
			parse_str( $url_params['query'], $_q );
			// Parse $url_params['query'] into an array, and remove the prepending _ from each key.
			foreach( $_q as $key => $value) {
				// Remove prepending _ from key. This is a FacetWP convention.
				$query_params[ltrim($key, '_')] = $value;
			}
		}

		$selected_facets = array();
		// Determine if we are on a taxonomy archive, if so we need to to use the info later to signal to other facets.
		// Each taxonomy should inform it's own facet of its active term.
		$current_taxonomy = array_key_exists('taxonomy', $query_vars) ? $query_vars['taxonomy'] : false;
		$registered_facets = array();// @TODO:

		// Format facets to match FacetWP query vars syntax (_facet_name) and get currently selected values.
		foreach ($registered_facets as $facet_name) {
			$default = array();
			// Check if the current facet is selected, and if so set it's default value to the matching query param value.
			if ( array_key_exists($facet_name, $query_params) ) {
				// Convert the query param value to an array, split along comma delimiters.
				$default = explode(',', $query_params[$facet_name]);
			}
			// If we are on a taxonomy page and it is this facet then get it's value from query_vars instead of FacetWP.
			// This is why it's critical that the facet is set to the same name as the taxonomy, so we can do this check.
			// We have to transform the current taxonomy to replace hyphens with underscores to match facetwp.
			if ( $facet_name === str_replace('-', '_', $current_taxonomy) ) {
				$default = array_key_exists($current_taxonomy, $query_vars) ? array($query_vars[$current_taxonomy]) : array();
			}

			$selected_facets[$facet_name] = $default;
		}

		// As of 2023-02-01 per Kelly we are enabling Topic facet on ALL pages.
		// // By default we DO want topics, but there are some use cases where we need it
		// // like if we're on a topic taxonomy page so we can be contextually aware what topic is active and inform the other facets (even though we dont show the topic facet on this page),
		// // also on search pages we want users to be able to filter results by topic, here we do show a UI for that.
		// $topic_facet = array_key_exists('topic', $selected_facets) ? $selected_facets['topic'] : false;
		// unset($selected_facets['topic']);
		// if ( in_array($current_taxonomy, array('topic', 'regions-countries')) || (array_key_exists('s', $query_vars) && !empty($query_vars['s'])) ) {
		// 	$selected_facets['topic'] = $topic_facet;
		// }

		// Remove page/{number}/ from the cache_group, we don't want to cache the page number.
		return array(
			'facets' => $selected_facets,
			'path' => preg_replace('/\/page\/[0-9]+/', '', $url_params['path'])
		);
	}

	public function get_facetwp_data( $post_type = 'post', $selected_facets = array(), $search_term = false ) {
		$query_args = array(
			'post_type' => $post_type,
			'paged'     => 1,
			'post_status' => array( 'publish', 'hidden_from_search' ),
		);
		if ( !is_search() ) {
			// Only query top level posts, not children.
			$query_args['post_parent'] = 0;
		} elseif (false !== $search_term) {
			$query_args['s'] = $search_term;
			$query_args['es'] = true; // Ensure ElasticPress is used.
			$query_args['post_status'] = array( 'publish', 'hidden_from_index' );
		}

		$args =  apply_filters('prc_facets_api_args', array(
			'facets'     => $selected_facets,
			'query_args' => $query_args,
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

		return apply_filters('prc_facets_api_data', $data);
	}

	public function parse_facetwp_data($wp_query) {
		if ( !is_object($wp_query) ) {
			return new WP_Error('invalid_wp_query', 'parse_facetwp_data could not parse passed WP_Query object');
		}

		// Get current paged number, if this is a search page and term, and/or if this is a taxonomy archive from the WP_Query object.
		$query_vars = $wp_query->query_vars;
		$is_taxonomy = array_key_exists('taxonomy', $query_vars) ? str_replace('-', '_', $query_vars['taxonomy']) : false;
		$page = array_key_exists('paged', $query_vars) && 0 !== $query_vars['paged'] ? $query_vars['paged'] : 1;
		// Remove paged from query vars, we'll add it back later. For the API this information is unnecessary
		unset($query_vars['paged']);
		$post_type = $wp_query->get('post_type');
		$search_term = array_key_exists('s', $query_vars) && !empty($query_vars['s']) ? $query_vars['s'] : false;

		// Parse the currently selected facets by getting the current url and parsing it.
		$parsed = $this->parse_facets_and_path($query_vars);
		if ( false === $parsed ) {
			return new WP_Error('invalid_url', 'parse_facetwp_data could not parse passed URL');
		}

		$cache_key = md5( wp_json_encode( array(
			$parsed['facets'],
			array(
				'post_type' => $post_type,
				'search' => $search_term,
				'taxonomy' => array_key_exists('taxonomy', $query_vars) && !empty($query_vars['taxonomy']) ? $query_vars['taxonomy'] : false,
			),
		) ) );
		$cache_group = $parsed['path'];
		if ( '' === $cache_group ) {
			return new WP_Error('invalid_cache_group', 'parse_facetwp_data could not create a cache group');
		}

		// Checked for cached data for this url and this query.
		$facetwp_data = $this->cache->get( $cache_key, $cache_group );
		$cached = true;
		if ( false === $facetwp_data ) {
			$cached = false;

			$facetwp_data = $this->get_facetwp_data(
				$post_type,
				$parsed['facets'],
				$search_term
			);

			$this->cache->store( $cache_key, $cache_group, $facetwp_data );
		}

		$facetwp_data['pager']['page'] = $page;
		$facetwp_data['is_taxonomy'] = $is_taxonomy;
		$facetwp_data['post_type'] = $post_type;

		$to_return = array(
			'data'   => $facetwp_data,
			'cached' => $cached,
			'debug' => array(
				'enabled'        => false,
				'size'           => 0,
			),
		);
		// If WP_DEBUG is enabled add debugging information to the response.
		// Useful when working locally to check how the above functions are returning/transforming data.
		if ( WP_DEBUG ) {
			$to_return['debug']['enabled'] = true;
			$to_return['debug']['parsed'] = $parsed;
			$to_return['debug']['cacheKey'] = $cache_key;
			$to_return['debug']['cacheGroup'] = $cache_group;
		}
		// Watch for payload sizes, if they get too big we need to look at caching the data differently.
		$to_return['debug']['size'] = mb_strlen(wp_json_encode($to_return), '8bit') / 1024; // In KB

		return $to_return;
	}
}
