<?php
namespace PRC\Platform;

use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

class Facets {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-facets';

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
			"operator" => "and",
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
	 * Include all blocks from the plugin's /blocks directory.
	 * @return void
	 */
	private function load_blocks() {
		$block_files = glob( plugin_dir_path( __FILE__ ) . '/blocks/*', GLOB_ONLYDIR );
		foreach ($block_files as $block) {
			$block = basename($block);
			$block_file_path = 'blocks/' . $block . '/' . $block . '.php';
			if ( file_exists( plugin_dir_path( __FILE__ ) . $block_file_path ) ) {
				require_once plugin_dir_path( __FILE__ ) . $block_file_path;
			}
		}
	}

	/**
	 * Initialize Facets Class
	 * @param string $version
	 * @param mixed $loader
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . 'cache/class-cache.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-facets-api.php';
		$this->load_blocks();
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			new Facets_Cache($loader);

			// FacetWP:
			$loader->add_filter( 'facetwp_api_can_access', $this, 'allow_facetwp_api_access' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
			$loader->add_filter( 'facetwp_indexer_query_args', $this, 'filter_facetwp_indexer_args', 10, 1 );
			$loader->add_filter( 'facetwp_index_row', $this, 'restrict_facet_row_depth', 10, 1 );
			$loader->add_filter( 'facetwp_facets', $this, 'facetwp_register_facets', 10, 1 );
			$loader->add_filter( 'facetwp_is_main_query', $this, 'facetwp_is_main_query', 10, 2 );

			// Blocks:
			new Facets_Context_Provider($loader);
			new Facet_Template($loader);
			new Facets_Selected_Tokens($loader);
			new Facets_Pager($loader);
			new Facets_Update_Button($loader);
		}
	}

	/**
	 * Allow FacetWP rest api access
	 * @hook facetwp_api_can_access
	 * @return true
	 */
	public function allow_facetwp_api_access() {
		return true;
	}

	public function facetwp_is_main_query( $is_main_query, $query ) {
		// Short circuit if we're on a search results page for now.
		if ( $query->is_search() ) {
			$is_main_query = false;
		}
		return $is_main_query;
	}

	/**
	 * Register FacetWP Endpoints
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array $endpoints
	 */
	public function register_endpoints($endpoints) {
		$settings = array(
			'route' => '/facets/get-settings',
			'methods' => 'GET',
			'callback' => array( $this, 'restfully_get_facet_settings' ),
			'permission_callback' => '__return_true',
		);
		$query = array(
			'route' => '/facets/query',
			'methods' => 'POST',
			'callback' => array( $this, 'restfully_query_facets' ),
			'permission_callback' => '__return_true',
		);
		array_push($endpoints, $settings, $query);
		return $endpoints;
	}

	public function restfully_get_facet_settings() {
		$settings = get_option('facetwp_settings', false);
		return json_decode($settings);
	}

	public function restfully_query_facets( WP_REST_Request $request ) {
		// @TODO pass existing wp_query args into facets api where null is currently.
		$nonce_is_valid = wp_verify_nonce( $request->get_header('X-WP-Nonce'), 'wp_rest' );
		if ( !$nonce_is_valid ) {
			return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 403 ) );
		}
		$query_args = null;
		$facets_api = new Facets_API($query_args);
		return $facets_api->query();
	}

	/**
	 * Manually register FacetWP facets
	 * @hook facetwp_facets
	 * @param mixed $facets
	 * @return mixed
	 */
	public function facetwp_register_facets($facets) {
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
