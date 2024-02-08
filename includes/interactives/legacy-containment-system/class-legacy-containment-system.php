<?php
namespace PRC\Platform;
use WP_REST_Request;
use WP_Error;

class Legacy_Interactive_Containment_System {

	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_legacy_libraries' );
			$loader->add_action( 'prc_platform_interactive_loader_enqueue', $this, 'enqueue_legacy_scripts_and_styles', 10, 2 );
			$loader->add_action( 'rest_api_init', $this, 'register_legacy_firebase_endpoint' );
		}
	}

	public function is_legacy_interactive() {
		// if the interactive was published before the new system was in place and uses wpackio or assets, then its considered legacy.
	}

	/**
	 * Enqueues the legacy styles and scripts when the `interactivesContainment` query var is set.
	 * @hook prc_platform_interactive_loader_enqueue
	 */
	public function enqueue_legacy_scripts_and_styles($enqueued_handles, $is_legacy_wpackio = false) {
		wp_enqueue_script('legacy-semantic-ui');
		wp_add_inline_script('legacy-semantic-ui', 'window.siteURL = "' . get_site_url() . '";');
		// @TODO: need to add a prcUrlVars shim as well....
		wp_enqueue_style('legacy-semantic-ui');
	}

	/**
	 * Register a legacy firebase endpoint for interactives on the v2 prc-api namespace.
	 * @hook rest_api_init
	 */
	public function register_legacy_firebase_endpoint() {
		// register v2 on the prc-api and add /interactives?slug=xyz
		register_rest_route(
			'prc-api/v2',
			'/interactive',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_legacy_firebase_endpoint' ),
				'args'                => array(
					'slug' => array(
						'default'           => false,
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);
	}

	private function cache_data( $db, $slug, $data ) {
		if ( empty( $data ) ) {
			return false;
		}
		wp_cache_set( $slug, $data, $db, 1 * MONTH_IN_SECONDS );
		return $data;
	}

	public function get_db_data( $slug = null, $auth = false ) {
		$args = array(
			'db' => 'prc-app-prod-interactives',
			'slug' => $slug,
			'auth' => $auth,
		);
		$cache = wp_cache_get( $args['slug'], $args['db'] );
		if ( false !== $cache ) {
			return $cache;
		}

		$response_url = 'https://' . $args['db'] . '.firebaseio.com/' . $args['slug'] . '.json';
		if ( array_key_exists( 'auth', $args ) ) {
			if ( false !== $args['auth'] ) {
				$response_url .= '&auth=' . $args['auth'];
			}
		}

		if ( function_exists( 'vip_safe_wp_remote_get' ) ) {
			$response = vip_safe_wp_remote_get( $response_url );
		} else {
			$response = wp_remote_get( $response_url );
		}

		$error = false;
		$data  = false;
		if ( ! is_wp_error( $response ) ) {
			// Request succeded, get the data.
			if ( 200 === wp_remote_retrieve_response_code( $response ) ) {
				$body = wp_remote_retrieve_body( $response );
				$data = json_decode( $body, true );
			} else {
				// The response code was not what we were expecting, record the message
				$error = $response;
			}
		} else {
			$error = $response;
		}

		if ( $error ) {
			return rest_ensure_response( $error );
		}

		return $this->cache_data( $args['db'], $args['slug'], $data );
	}

	public function get_legacy_firebase_endpoint( WP_REST_Request $request ) {
		$slug     = $request->get_param( 'slug' );
		$response = false;
		if ( ! empty( $slug ) ) {
			$response = $this->get_db_data( $slug );
		}
		return $response;
	}

	/**
	 * Interactives Libraries (Highcharts, Highmaps, D3, Mapbox, etc)
	 *
	 * @return void
	 */
	public function register_legacy_libraries() {
		$scripts['highcharts'] = array(
			// _ as the script key means in registering it will take the $scripts key as the script name.... so this would just be registered as 'highcharts'
			'_'        => array(
				'/vendor/highcharts.js',
				array( 'jquery' ),
				'4.1.4',
				false,
			),
			'direct'   => array(
				'//cdnjs.cloudflare.com/ajax/libs/highcharts/5.0.9/highcharts.js',
				array( 'jquery' ),
				'5.0.9',
				false,
			),
			'cdn'      => array(
				'//code.highcharts.com/highcharts.js',
				array( 'jquery' ),
				'5.0.9',
				false,
			),
			'more-cdn' => array(
				'//code.highcharts.com/highcharts-more.js',
				array( 'jquery', 'highcharts-cdn' ),
				'5.0',
				false,
			),
			'old'      => array(
				'//cdnjs.cloudflare.com/ajax/libs/highcharts/4.2.4/highcharts.js',
				array( 'jquery' ),
				'4.2.4',
				false,
			),
			'more'     => array(
				'/vendor/highcharts-more.js',
				array( 'jquery' ),
				'4.1.4',
				false,
			),
			'export'   => array(
				'/vendor/highcharts-exports.min.js',
				array( 'jquery', 'highcharts' ),
				'4.1.4',
				false,
			),
		);

		$scripts['highmaps'] = array(
			'_'             => array(
				'/vendor/highmaps/highmaps.js',
				array( 'jquery' ),
				'6.1.0',
				false,
			),
			'latest'        => array(
				'/vendor/highmaps/highmaps.js',
				array( 'jquery' ),
				'6.1.0',
				false,
			),
			'proj4js'       => array(
				'/vendor/highmaps/proj4.js',
				array( 'highmaps', 'jquery' ),
				null,
				true,
			),
			'us-small'      => array(
				'/vendor/highmaps/us-small.js',
				array( 'highmaps', 'jquery' ),
				null,
				true,
			),
			'module'        => array(
				'/vendor/highmaps/highmaps-module.js',
				array( 'highcharts', 'jquery' ),
				'6.1.0',
				false,
			),
			'us'            => array(
				'/vendor/highmaps/highmaps-us-all.js',
				array( 'highmaps', 'jquery' ),
				null,
				true,
			),
			'us-counties'   => array(
				'/vendor/highmaps/highmaps-us-counties.js',
				array( 'highmaps', 'jquery' ),
				null,
				true,
			),
			'latin-america' => array(
				'/vendor/highmaps/highmaps-latin-america.js',
				array( 'highmaps', 'jquery' ),
				null,
				true,
			),
		);
		// 113th Congressional District Maps from http://code.highcharts.com/mapdata/
		$state_codes = array( 'ak', 'al', 'ar', 'as', 'az', 'ca', 'co', 'ct', 'dc', 'de', 'fl', 'ga', 'gu', 'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'ma', 'md', 'me', 'mi', 'mn', 'mo', 'mp', 'ms', 'mt', 'nc', 'nd', 'ne', 'nh', 'nj', 'nm', 'nv', 'ny', 'oh', 'ok', 'or', 'pa', 'pr', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'va', 'vt', 'wa', 'wi', 'wv', 'wy' );
		foreach ( $state_codes as $code ) {
			$scripts['highmaps'][ 'us-' . $code . '-congress-113' ] = array(
				'/vendor/highmaps/us-' . $code . '-congress-113.js',
				array( 'jquery', 'highmaps' ),
				null,
				true,
			);
		}

		$scripts['d3'] = array(
			'_'      => array(
				'/bower_components/d3-v3/d3.min.js',
				array( 'jquery' ),
				'3.5.17',
				false,
			),
			'v3'     => array(
				'/bower_components/d3-v3/d3.min.js',
				array( 'jquery' ),
				'3.5.17',
				true,
			),
			// Default.
			'v4'     => array(
				'/bower_components/d3/d3.min.js',
				array( 'jquery' ),
				'4.10.2',
				true,
			),
			'v5'     => array(
				'/bower_components/d3-v5/d3.min.js',
				array( 'jquery' ),
				'5.0',
				true,
			),
			// The following were in plugins/pew-scripts, legacy like.
			'sankey' => array(
				'/vendor/d3.sankey.js',
				array( 'd3' ),
				'5.0',
				false,
			),
			'geo'    => array(
				'/vendor/d3.geo.projection.v0.min.js',
				array( 'd3' ),
				'5.0',
				false,
			),
			'queue'  => array(
				'/vendor/d3.queue.min.js',
				array( 'd3' ),
				'5.0',
				false,
			),
		);

		$scripts['mapbox'] = array(
			'gl'          => array(
				'/bower_components/mapbox-gl/dist/mapbox-gl.js',
				array( 'jquery' ),
				'0.5.0',
				true,
			),
			'gl-geocoder' => array(
				'/bower_components/mapbox-gl/plugins/mapbox-gl-geocoder/v2.3.0/mapbox-gl-geocoder.min.js',
				array( 'jquery', 'mapbox-gl' ),
				'2.3.0',
				true,
			),
		);

		$scripts['misc'] = array(
			'handlebars'   => array(
				'/bower_components/handlebars/handlebars.min.js',
				array(),
				'1.0',
				true,
			),
			'isInViewport' => array(
				'/bower_components/isInViewport/lib/isInViewport.min.js',
				array( 'jquery' ),
				'3.0',
				false,
			),
			'topojson'     => array(
				'/vendor/topojson.v1.min.js',
				array( 'd3', 'd3-geo' ),
				'3.0',
				false,
			),
			'datamaps'     => array(
				'/vendor/datamaps.min.js',
				array( 'd3', 'topojson', 'd3-geo' ),
				'3.0',
				false,
			),
			'legacy-semantic-ui' => array(
				'/vendor/semantic.min.js',
				array( 'jquery' ),
				'2.4.2',
				false,
			)
		);

		foreach ( $scripts as $handle => $scripts ) {
			foreach ( $scripts as $script => $args ) {
				// If script url is relative then it does not need the content url
				if ( substr( $args[0], 0, 2 ) === '//' ) {
					$src = $args[0];
				} else {
					$src = plugin_dir_url( __FILE__ ) . 'scripts-shim' . $args[0];
				}

				if ( substr( $script, 0, 1 ) === '_' ) {
					$script_handle = $handle;
				} elseif ( 'misc' === $handle ) {
					$script_handle = $script;
				} else {
					$script_handle = $handle . '-' . $script;
				}
				if ( ! wp_script_is( $script_handle, 'registered' ) ) {
					wp_register_script(
						$script_handle,
						$src,
						$args[1],
						$args[2],
						$args[3]
					);
				}
			}
		}

		wp_register_style(
			'legacy-semantic-ui',
			plugin_dir_url( __FILE__ ) . 'semantic-ui-css-shim/dist/main.css'
		);

		// Mapbox styles.
		// wp_register_style(
		// 	'mapbox-gl',
		// 	content_url() . '/client-mu-plugins/prc-core/scripts/bower_components/mapbox-gl/dist/mapbox-gl.css'
		// );

		// wp_register_style(
		// 	'mapbox-gl-geocoder',
		// 	content_url() . '/client-mu-plugins/prc-core/scripts/bower_components/mapbox-gl/plugins/mapbox-gl-geocoder/v2.3.0/mapbox-gl-geocoder.css'
		// );
	}
}
