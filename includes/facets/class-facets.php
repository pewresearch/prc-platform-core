<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

class Facets {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-facets';

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
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		require_once plugin_dir_path( __FILE__ ) . 'class-facets-api.php';

		$this->load_blocks();
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function init_blocks() {
		$facets_context_provider = new Facets_Context_Provider(
			$this->plugin_name,
			$this->version,
		);
		$facet_template = new Facet_Template(
			$this->plugin_name,
			$this->version,
		);
		$selected_tokens = new Selected_Tokens(
			$this->plugin_name,
			$this->version,
		);

		$facets_context_provider->block_init();
		$facet_template->block_init();
		$selected_tokens->block_init();

		add_filter('pre_render_block', array($facets_context_provider, 'hoist_facet_data_to_pre_render_stage'), 10, 3);
		add_filter('render_block_context', array($facets_context_provider, 'add_facet_data_to_context'), 10, 3);
	}

	public function init_rest_api() {
		add_filter(
			'facetwp_api_can_access',
			function( $boolean ) {
				return true; // Change this out for a nonce verification
			}
		);

		register_rest_route(
			'prc-api/v3',
			'/facets/get-settings',
			array(
				'methods' => 'GET',
				'callback' => array( $this, 'restfully_get_facet_settings' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/facets/query',
			array(
				'methods' => 'POST',
				'callback' => array( $this, 'restfully_query_facets' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	public function restfully_get_facet_settings() {
		$settings = get_option('facetwp_settings', false);
		return json_decode($settings);
	}

	public function restfully_query_facets( WP_REST_Request $request ) {
		$facets_api = new Facets_API(null);
		return $facets_api->query();
	}

	/**
	 * Manually register FacetWP facets
	 * @hook facetwp_facets
	 * @param mixed $facets
	 * @return mixed
	 */
	public function facetwp_register_facets($facets) {
		$facets = array(
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
				"operator" => "and",
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
				"choices" => "Past Month | -30 days
				Past 6 Months | -180 days
				Past 12 Months | -365 days
				Past 2 Years | -730 days"
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
		return $facets;
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
			'categories',
		) ) ) {
			if ( $params['depth'] > 0 ) {
				// don't index this row
				$params['facet_value'] = '';
			}
		}
		return $params;
	}

	public function init_api() {

	}

	public function init_cache() {

	}
}
