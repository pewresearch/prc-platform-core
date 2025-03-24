<?php
namespace PRC\Platform;

use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;

/**
 * A PHP based method for interacting with VIP Enterprise Search facets data via blocks anywhere, including archive pages.
 */
class Facets {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Current Site ID
	 */
	private $site_id;

	/**
	 * The unique identifier of this plugin.
	 */
	public static $handle = 'prc-platform-facets';

	/**
	 * Initialize Facets Class
	 *
	 * @param string $version
	 * @param mixed  $loader
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->site_id = get_current_blog_id();

		// Include middleware for FacetWP and ElasticPress.
		require_once plugin_dir_path( __FILE__ ) . 'providers/facet-wp/class-facetwp-middleware.php';
		require_once plugin_dir_path( __FILE__ ) . 'providers/elasticpress/class-elasticpress-middleware.php';

		// Include block files.
		$this->load_blocks();

		// Initialize hybrid facets system.
		$this->init( $loader );
	}

	/**
	 * Include all blocks from the /blocks directory.
	 *
	 * @return void
	 */
	private function load_blocks() {
		$block_files = glob( plugin_dir_path( __FILE__ ) . '/blocks/*', GLOB_ONLYDIR );
		foreach ( $block_files as $block ) {
			$block           = basename( $block );
			$block_file_path = 'blocks/' . $block . '/' . $block . '.php';
			if ( file_exists( plugin_dir_path( __FILE__ ) . $block_file_path ) ) {
				require_once plugin_dir_path( __FILE__ ) . $block_file_path;
			}
		}
	}

	public static function use_ep_facets() {
		$uri = isset( $_SERVER['REQUEST_URI'] ) ? esc_url_raw( $_SERVER['REQUEST_URI'] ) : '';
		if ( strpos( $uri, '/search' ) !== false ) {
			return true;
		}
		return false;
	}

	public static function format_label( $label ) {
		// If the label is a datetime let's check if its in the years only format and if so, return the year.
		if ( strtotime( $label ) !== false ) {
			return preg_match( '/^\d{4}$/', $label ) ? $label : gmdate( 'Y', strtotime( $label ) );
		}
		// Render any ampersands and such in the label
		return html_entity_decode( $label );
	}

	/**
	 * Constructs a cache key based on the current query and selected facets.
	 *
	 * @param array $query
	 * @param array $selected
	 * @return string
	 */
	public static function construct_cache_key( $query = array(), $selected = array() ) {
		$invalidate = '10/09/2024g';
		// Remove pagination from the query args
		$query = array_merge(
			$query,
			array(
				'paged' => 1,
			)
		);
		// Construct an md5 hash of the query and selected facets and a quick invalidation metho.
		return md5(
			wp_json_encode(
				array(
					'query'      => $query,
					'selected'   => $selected,
					'invalidate' => $invalidate,
				)
			)
		);
	}

	/**
	 * Constructs a cache group based on the current URL.
	 */
	public static function construct_cache_group() {
		global $wp;
		// Construct an array of URL parameters from the current request to WP.
		$url_params = wp_parse_url( '/' . add_query_arg( array( $_GET ), $wp->request . '/' ) );
		if ( ! is_array( $url_params ) || ! array_key_exists( 'path', $url_params ) ) {
			return false;
		}
		// Remove pagination from the cache group
		return preg_replace( '/\/page\/[0-9]+/', '', $url_params['path'] );
	}

	public function init( $loader = null ) {
		if ( null !== $loader && $this->site_id === \PRC_PRIMARY_SITE_ID ) {
			// FacetWP Back Compat:
			// We need to determine when to load these middlewares. If it's a search page, lets use EP, otherwise use FacetWP.
			new FacetWP_Middleware( $loader );
			new ElasticPress_Middleware( $loader );

			// Blocks:
			new Facets_Context_Provider( $loader );
			new Facet_Template( $loader );
			new Facets_Selected_Tokens( $loader );
			new Facets_Results_Info( $loader );
			new Facet_Search_Relevancy( $loader );
			new Facet_Select_Field( $loader );

			// Rest Endpoints for Block Editor interactions:
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
		}
	}

	/**
	 * Register REST API endpoints for facet templating.
	 *
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array $endpoints
	 */
	public function register_endpoints( $endpoints ) {
		$settings = array(
			'route'               => '/facets/get-settings',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_get_facet_settings' ),
			'permission_callback' => '__return_true',
			'args'                => array(
				'templateSlug' => array(
					'description' => 'The slug of the site-editor template. This is used to determine which facets middleware should be enabled.',
					'type'        => 'string',
					'required'    => true,
					'default'     => 'archive',
				),
			),
		);
		array_push( $endpoints, $settings );
		return $endpoints;
	}

	public function restfully_get_facet_settings( WP_REST_Request $request ) {
		$tempalte_slug = $request->get_param( 'templateSlug' );
		if ( str_contains( $tempalte_slug, 'search' ) ) {
			return ElasticPress_Middleware::get_facets_settings();
		} else {
			return FacetWP_Middleware::get_facets_settings();
		}
	}
}
