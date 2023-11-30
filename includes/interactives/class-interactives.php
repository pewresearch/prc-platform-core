<?php
namespace PRC\Platform;
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

	public static $handle = 'prc-platform-interactive-post-type';

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
	}

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

		if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
			$args['rewrite']['slug'] = 'interactives';
			$args['taxonomies'] = array( 'topic', 'research-teams' );
		}

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	public function register_meta_and_fields() {
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
	 * @hook rest_api_init
	 * @return void
	 */
	public function register_rest_endpoints() {
		register_rest_route(
			'prc-api/v3',
			'/interactives/get-assets',
			array(
				'methods' => 'GET',
				'callback' => array( $this, 'get_assets_restfully' ),
				'permission_callback' => function() {
					return current_user_can('edit_posts');
				}
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/interactives/get-data/(?P<attachmentId>\d+)',
			array(
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
			)
		);
	}

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
	 * @hook init
	 * @return void
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
	 * Loads the necessary script and attachment markup for an interactive to load on the front end.
	 * @param mixed $attributes
	 * @param mixed $content
	 * @param mixed $block
	 * @return string
	 */
	public function render_interactive_loader_callback($attributes, $content, $block) {
		if ( is_admin() ) {
			return;
		}

		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'id' => "js-{$attributes['slug']}"
		));

		$enqueued_handles = array();
		if ( $attributes['legacyWpackIo'] ) {
			$enqueued_handles = $this->load_legacy_wpackIO($attributes['legacyWpackIo']);
		} else if ( $attributes['legacyAssetsS3'] ) {
			// Do nothing for now...
			// @TODO: Build out the legacy assets S3 loader.
		} else {
			$enqueued_handles = $this->load($attributes['slug']);
		}

		$url_rewrites = $this->get_rewrites_params();
		if ( $url_rewrites && array_key_exists('script', $enqueued_handles) ) {
			// We want to localize whatever script the loader returns.
			$script_handle = $enqueued_handles['script'];
			// Use wp_add_inline_script to localize the script instead of wp_localize_script because we want to add the data before the script is enqueued and we want to support multiple localizations for the same script.
			wp_add_inline_script(
				$script_handle,
				'if ( typeof prcPlatformInteractives === "undefined" ) { var prcPlatformInteractives = {}; } prcPlatformInteractives["' . $attributes['slug'] . '"] = ' . json_encode(array(
					'urlVars' => $url_rewrites,
				)) . ';',
				'before'
			);
		}

		// Allow for filtering of the interactive content by other plugins.
		$content = apply_filters('prc_platform_interactive_loader_content', $content, $attributes, $block);

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			$block_wrapper_attrs,
			json_encode($attributes),
		);
	}

	/**
	 * @TODO: WIP, this block will render the referenced interactive.
	 * @param mixed $attributes
	 * @param mixed $content
	 * @param mixed $block
	 * @return string
	 */
	public function render_interactive_embed_callback($attributes, $content, $block) {
		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'id' => "js-{$attributes['slug']}"
		));

		return wp_sprintf(
			'<div %1$s>%2$s</div>',
			$block_wrapper_attrs,
			$content,
		);
	}

	public function block_init() {
		register_block_type(
			__DIR__ . '/build/loader-block',
			array(
				'render_callback' => array( $this, 'render_interactive_loader_callback' ),
			)
		);
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
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/panel/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/panel/index.js';

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
	 * @hook prc_platform_on_publish
	 * @hook prc_platform_on_update
	 * @param mixed $post
	 * @return void
	 */
	public function rewrite_update_hook( $post ) {
		if ( self::$post_type !== $post->post_type ) {
			return;
		}
		$this->update_rewrite( $post->ID, $post->post_name, get_post_meta( $post->ID, self::$rewrites_meta_key, true ) );
	}

	/**
	 * @hook init
	 * @return void
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
	 * @hook init 11, give it a chance to build the index first.
	 * @return void
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
