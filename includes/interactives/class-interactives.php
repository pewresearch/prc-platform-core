<?php
namespace PRC\Platform;

use LogicException;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class Interactives {
	public static $post_type = 'interactive';
	public static $data_meta_key = '_interactive_data_attachment_id';
	public static $rewrites_meta_key = '_interactive_rewrites';
	public static $dev_notes_meta_key = '_interactive_dev_notes';
	public static $rewrites_option_key = '_interactives_rewrites';
	public static $rewrites_meta_properties = array(
		'key' 	   => array(
			'type' => 'string',
		),
		'pattern' => array(
			'type' => 'string',
		),
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-interactive-post-type';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->load_dependencies();
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );
			$loader->add_action( 'init', $this, 'rewrite_tags' );
			$loader->add_action( 'init', $this, 'rewrite_index', 11 );
			$loader->add_action( 'prc_platform_on_publish', $this, 'rewrite_update_hook' );
			$loader->add_action( 'prc_platform_on_update', $this, 'rewrite_update_hook' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_panel_assets' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );

			new Loader_Block($loader);
			new Legacy_Interactive_Containment_System($loader);
		}
	}

	/**
	 * Register the Interactive post type
	 * @hook init
	 */
	public function register_type() {
		$labels = array(
			'name'               => 'Interactive Products',
			'singular_name'      => 'Interactive',
			'menu_name'          => 'Interactives',
			'parent_item_colon'  => 'Parent Interactive:',
			'all_items'          => 'Interactives',
			'view_item'          => 'View Interactive',
			'add_new_item'       => 'Add New Interactive',
			'add_new'            => 'Add New',
			'edit_item'          => 'Edit Interactive',
			'update_item'        => 'Update Interactive',
			'search_items'       => 'Search Interactives',
			'not_found'          => 'Not found',
			'not_found_in_trash' => 'Not found in Trash',
		);

		$rewrite = array(
			'slug'       => 'interactive',
			'with_front' => true,
			'pages'      => false,
			'feeds'      => true,
		);

		$args = array(
			'labels'              => $labels,
			'supports'            => array( 'title', 'editor', 'thumbnail', 'revisions', 'excerpt', 'custom-fields' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_rest'        => true,
			'show_in_menu'        => true,
			'show_in_nav_menus'   => true,
			'show_in_admin_bar'   => true,
			'menu_position'       => 42,
			'menu_icon'           => 'dashicons-analytics',
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'capability_type'     => 'post',
			'rewrite'             => $rewrite,
			'taxonomies' 		  => array( 'category', 'research-teams' ),
			'template'            => array(
				array( 'prc-platform/interactive-loader', array())
			),
		);

		register_post_type( self::$post_type, $args );

		register_post_meta(
			self::$post_type,
			self::$data_meta_key,
			array(
				'show_in_rest' => true,
				'single' => true,
				'type' => 'number',
			)
		);

		register_post_meta(
			self::$post_type,
			self::$rewrites_meta_key,
			array(
				'single' => true,
				'type' => 'array',
				'description'   => 'Array of custom rewrite schemas for this interactive.',
				'show_in_rest'  => array(
					'schema' => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$rewrites_meta_properties
						),
					),
				),
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			self::$post_type,
			self::$dev_notes_meta_key,
			array(
				'show_in_rest' => true,
				'single' => true,
				'type' => 'string',
			)
		);
	}

	/**
	 * Signal that Interactive post type should utilize Gutenberg
	 * @hook prc_load_gutenberg
	 * @param mixed $post_types
	 * @return array
	 */
	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	/**
	 * Register /interactives/get-assets and /interactives/get-data rest endpoints.
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array $endpoints
	 */
	public function register_endpoints($endpoints) {
		$get_assets = array(
			'route' => '/interactives/get-assets',
			'methods' => 'GET',
			'callback' => array( $this, 'get_assets_restfully' ),
			'permission_callback' => function() {
				return current_user_can('edit_posts');
			}
		);

		$get_data = array(
			'route' => '/interactives/get-data/(?P<attachmentId>\d+)',
			'methods' => 'GET',
			'callback' => array( $this, 'get_data_restfully' ),
			'args' => array(
				'asString' => array(
					'default' => false,
					'type' => 'boolean',
				),
			),
			'permission_callback' => function() {
				return true; // @TODO check for nonce permissions.
			}
		);

		array_push($endpoints, $get_assets, $get_data);
		return $endpoints;
	}

	/**
	 * Gets the either json or csv data from an attachment and returns it as an restfully formatted array OR a string blob.
	 * @param WP_REST_Request $request
	 * @return mixed WP_Error|WP_REST_Response|string
	 */
	public function get_data_restfully( \WP_REST_Request $request ) {
		$attachment_id = $request->get_param('attachmentId');
		$return_as_string = $request->get_param('asString');
		$data = null;
		$file_type = null;
		if ( $attachment_id ) {
			$file = get_attached_file($attachment_id);
			if ( $file ) {
				$file_type = wp_check_filetype($file);
				if ( 'application/json' === $file_type['type'] ) {
					$file = file_get_contents($file);
					$data = json_decode( $file, true );
				} else if ( 'text/csv' === $file_type['type'] ) {
					$file = file( $file );
					$data = array_map( 'str_getcsv', $file );
				}
			}
		}

		if ( null === $data || false === $data ) {
			$data = new WP_Error( 'no_data', 'No data found for interactive', array( 'status' => 404 ) );
		}
		if ( $return_as_string ) {
			if ( 'text/csv' === $file_type['type'] ) {
				return implode( "\n", array_map( function( $row ) {
					return implode( ',', $row );
				}, $data ) );
			}
			return $file;
		}
		return rest_ensure_response( $data );
	}

	public function get_assets_restfully( \WP_REST_Request $request ) {
		return rest_ensure_response( $this->get_assets() );
	}

	/**
	 * This returns an array of /interactives assets by research area then by year then by interactive name. Each interactive contains the necessary information to load the interactive including it's Title, Description, and most importantly the CSS and JS files.
	 * @return Array|WP_Error
	 */
	public function get_assets( ) {
		$interactives = array();

		$interactives_dir = PRC_INTERACTIVES_DIR;
		// using glob to get all directories (except /blocks) in the interactives directory
		$research_teams = glob( $interactives_dir . '/*', GLOB_ONLYDIR );
		foreach ( $research_teams as $research_team ) {
			if ( basename( $research_team ) === 'blocks' || basename( $research_team ) === '.template' ) {
				continue;
			}
			$research_team_name = basename( $research_team );
			$interactives[$research_team_name] = array();

			$years = glob( $research_team . '/*', GLOB_ONLYDIR );
			foreach ( $years as $year ) {
				$year_name = basename( $year );
				$interactives[$research_team_name][$year_name] = array();

				$interactive_names = glob( $year . '/*', GLOB_ONLYDIR );
				foreach ( $interactive_names as $interactive_name ) {
					$interactive_name = basename( $interactive_name );
					$build_path = $year . '/' . $interactive_name . '/build/';
					$info_file = $build_path . 'block.json';
					$dependency_file = $build_path . 'index.asset.php';
					$build_url = PRC_INTERACTIVES_URL . $research_team_name . '/' . $year_name . '/' . $interactive_name . '/build/';

					$blob = array(
						'slug' => $interactive_name,
						'title' => '',
						'description' => '',
						'css_file' => false,
						'js_file' => false,
						'dependencies' => array(),
						'version' => null,
					);

					if ( file_exists($dependency_file) ) {
						$dependency_file = include($dependency_file);
						$blob['dependencies'] = $dependency_file['dependencies'];
						$blob['version'] = $dependency_file['version'];
					}

					if ( file_exists( $info_file ) ) {
						$info_file = json_decode( file_get_contents( $info_file ), true );
						$blob['title'] = array_key_exists('title', $info_file) ? $info_file['title'] : null;
						$blob['description'] = array_key_exists('description', $info_file) ? $info_file['description'] : null;

						$blob['css_file'] = $build_url . $info_file['style'];
						$blob['js_file'] = $build_url . $info_file['viewScript'];
					}

					$interactives[$research_team_name][$year_name][] = $blob;
				}
			}
		}

		return $interactives;
	}

	/**
	 * Returns a single interactive asset by slug.
	 * @param mixed $interactive_slug
	 * @return mixed Array|false
	 */
	public function get_asset($interactive_slug) {
		$interactives = $this->get_assets();
		foreach ( $interactives as $research_team_name => $years ) {
			foreach ( $years as $year_name => $interactives ) {
				foreach ( $interactives as $interactive ) {
					if ( $interactive['slug'] === $interactive_slug ) {
						return $interactive;
					}
				}
			}
		}
		return false;
	}

	/**
	 * WIP: I'm not sure I want to pre-register all the interactives into the scripts registry like this. I think I'd rather just register them as they are enqueued.
	 * Register the assets for all interactives.
	 * @hook init
	 */
	public function register_assets() {
		$assets = $this->get_assets();
		foreach ( $assets as $research_team => $years) {
			foreach ( $years as $year => $interactives ) {
				foreach ( $interactives as $interactive ) {
					if ( $interactive['css_file'] ) {
						wp_enqueue_style(
							'prc-platform-interactive-' . $interactive['slug'],
							$interactive['css_file'],
							array(),
							$interactive['version']
						);
					}
					if ( $interactive['js_file'] ) {
						wp_enqueue_script(
							'prc-platform-interactive-' . $interactive['slug'],
							$interactive['js_file'],
							$interactive['dependencies'],
							$interactive['version'],
							array(
								'strategy' =>'defer',
								'in_footer' => true,
							)
						);
					}
				}
			}
		}
	}

	/**
	 * Load a single interactive by slug.
	 *
	 * This function is used by the interactive loader block to load the necessary assets for an interactive.
	 *
	 * @param mixed $slug
	 * @return string[]
	 */
	public function load($slug) {
		$interactives = new Interactives(null, null);
		$assets = $interactives->get_asset($slug);
		$enqueued = array();
		if ( $assets['css_file'] ) {
			$styled = wp_enqueue_style(
				'prc-platform-interactive-' . $slug,
				$assets['css_file'],
				array(),
				$assets['version']
			);
			if ( $styled ) {
				$enqueued['style'] = 'prc-platform-interactive-' . $slug;
			}
		}
		if ( $assets['js_file'] ) {
			$scripted = wp_enqueue_script(
				'prc-platform-interactive-' . $slug,
				$assets['js_file'],
				$assets['dependencies'],
				$assets['version'],
				array(
					'strategy' =>'defer',
					'in_footer' => true,
				)
			);
			if ( $scripted ) {
				$enqueued['script'] = 'prc-platform-interactive-' . $slug;
			}
		}
		return $enqueued;
	}

	/**
	 * Load a single interactive, via Wpackio (legacy) by slug.
	 *
	 * @param mixed $args
	 * @return void|false|array
	 * @throws LogicException
	 */
	public function load_legacy_wpackIO($args) {
		$args = wp_parse_args(
			$args,
			array(
				'appName' => '',
				'path'    => false,
				'deps'    => false,
				'version' => '1.0',
			)
		);
		$enqueued = array();

		if ( is_admin() ) {
			return;
		}

		$app_name     = array_key_exists( 'appname', $args ) ? $args['appname'] : $args['appName'];

		if ( ! $app_name ) {
			return false;
		}

		require_once( plugin_dir_path( __FILE__ ) . 'class-legacy-wpackio-loader.php' );

		$deps = array('jquery', 'wp-element');
		if ( false !== $args['deps'] && ! empty( $args['deps'] )) {
			$deps = array_merge( $deps, explode( ',', $args['deps'] ) );
		}

		$dir = WP_PLUGIN_DIR . '/interactives/' . $args['path'] . '/src';

		$enqueue = new WPackio( $app_name, 'dist', $args['version'], 'plugin', $dir );

		$interactive_manifest = $enqueue->register(
			'interactive',
			'main',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => $deps,
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
		if ( false === $interactive_manifest ) {
			return false;
		}

		$script_handle = array_pop( $interactive_manifest['js'] )['handle'];
		$style_handle  = array_pop( $interactive_manifest['css'] )['handle'];
		if ( $script_handle ) {
			$enqueued['script'] = $script_handle;
			wp_enqueue_script( $script_handle );
		}
		if ( $style_handle ) {
			$enqueued['style'] = $style_handle;
			wp_enqueue_style( $style_handle );
		}

		return $enqueued;
	}

	/**
	 * Include all blocks from the /blocks directory.
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

	private function load_dependencies() {
		require_once plugin_dir_path( __FILE__ ) . '/legacy-containment-system/class-legacy-containment-system.php';
		$this->load_blocks();
	}

	/**
	 * @TODO: at some point id like these rewrites functions moved into a class of its own coupled with the interface.
	 * @hook enqueue_block_editor_assets
	 */
	/**
	 * @hook enqueue_block_editor_assets
	 * @return WP_Error|true
	 */
	public function register_panel_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'panel/build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'panel/build/index.js';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * Enqueue the assets for this block editor plugin.
	 * @hook enqueue_block_editor_assets
	 * @return void
	 */
	public function enqueue_panel_assets() {
		$registered = $this->register_panel_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			$screen = get_current_screen();
			if ( in_array( $screen->post_type, array(self::$post_type) ) ) {
				wp_enqueue_script( self::$handle );
			}
		}
	}

	/**
	 * Update the rewrite index for this interactive.
	 * @param mixed $post_id
	 * @param mixed $post_slug
	 * @param bool $rewrites
	 * @return false|void
	 */
	public function update_rewrite( $post_id, $post_slug, $rewrites = false ) {
		if ( false === $rewrites ) {
			return false;
		}

		$patterns = $rewrites;

		// Double sanity check that we have an array of patterns.
		if ( ! $patterns || ! is_array( $patterns ) || empty( $patterns ) ) {
			return;
		}

		// Check if we have an index already, if not initialize it with the post_slug from this request.
		$index_data = get_option( self::$rewrites_option_key );
		if ( ! $index_data ) {
			$index_data = array( $post_slug => array() );
		} elseif ( ! array_key_exists( $post_slug, $index_data ) ) {
			$index_data[ $post_slug ] = array();
		}

		$i = 0;
		foreach ( $patterns as $pattern ) {
			// Setup empty array, also if there is any prior data here this will empty it and recreate the entry ensuring we have the latest data.
			$index_data[ $post_slug ][ $i ] = array();
			// Get pattern values.
			$values = explode( '/', $pattern );
			foreach ( $values as $key => $value ) {
				$value = str_replace(array('{', '}'), '', $value);
				if ( ! empty( $value ) ) {
					$index_data[ $post_slug ][ $i ][] = $value;
				}
			}
			$i++;
		}

		update_option( self::$rewrites_option_key, $index_data );
	}

	/**
	 * When an interactive is published or updated, update the rewrite index.
	 * @hook prc_platform_on_publish
	 * @hook prc_platform_on_update
	 * @param mixed $post
	 */
	public function rewrite_update_hook( $post ) {
		if ( self::$post_type !== $post->post_type ) {
			return;
		}
		$this->update_rewrite( $post->ID, $post->post_name, get_post_meta( $post->ID, self::$rewrites_meta_key, true ) );
	}

	/**
	 * Register the rewrite tags for all interactives.
	 * @hook init
	 */
	public function rewrite_tags() {
		$index = get_option( self::$rewrites_option_key );
		if ( $index === false ) {
			return;
		}
		foreach ( $index as $post_slug => $patterns ) {
			foreach ( $patterns as $pattern ) {
				if ( ! is_array( $pattern ) ) {
					continue;
				}
				foreach ( $pattern as $value ) {
					add_rewrite_tag( "%{$value}%", '([^&]+)' );
				}
			}
		}
	}

	/**
	 * Register the rewrite rules for all interactives.
	 * @hook init
	 */
	public function rewrite_index() {
		$index = get_option( self::$rewrites_option_key );
		if ( $index === false ) {
			return;
		}
		foreach ( $index as $post_slug => $patterns ) {
			foreach ( $patterns as $pattern ) {
				if ( ! is_array( $pattern ) ) {
					continue;
				}
				$options_string = '';
				$rewrite_string = '';
				$i              = 1;
				foreach ( $pattern as $value ) {
					if ( $i > 1 ) {
						$options_string .= '&';
					}
					$options_string .= $value . '=$matches[' . $i . ']';
					$rewrite_string .= '([^/]*)\/';
					$i++;
				}
				add_rewrite_rule(
					"interactives\/{$post_slug}\/{$rewrite_string}?$",
					"index.php?interactives={$post_slug}&{$options_string}",
					'top'
				);
			}
		}
	}

	/**
	 * Get the rewrite params for the current interactive.
	 * @return void|false|array
	 */
	public function get_rewrites_params() {
		$index = get_option( self::$rewrites_option_key );
		if ( ! is_singular( self::$post_type ) || false == $index || empty( $index ) ) {
			return;
		}

		global $wp_query;
		$url_vars = array();

		foreach ( $index as $post_slug => $patterns ) {
			foreach ( $patterns as $pattern ) {
				if ( is_array( $pattern ) ) {
					foreach ( $pattern as $value ) {
						if ( isset( $wp_query->query_vars[ $value ] ) ) {
							$url_vars[ $value ] = $wp_query->query_vars[ $value ];
						}
					}
				}
			}
		}

		if ( empty( $url_vars ) ) {
			return false;
		}

		return $url_vars;
	}
}
