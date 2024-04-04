<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;

class Flash_Briefings {
	public static $post_type = 'daily-brief';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-flash-briefings';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $version    The version of this plugin.
	 * @param      Loader    $loader     The loader that will be used to register hooks with WordPress.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
		}
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';


		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			$screen = get_current_screen();
			if ( in_array( $screen->post_type, array(self::$post_type) ) ) {
				wp_enqueue_script( self::$handle );
				wp_enqueue_style( self::$handle );
			}
		}
	}

	/**
	 * Register the custom post type for the daily brief.
	 * @hook init
	 */
	public function register_type() {
		$labels   = array(
			'name'                  => _x( 'Flash Briefings', 'Post Type General Name', 'prc-platform-core' ),
			'singular_name'         => _x( 'Flash Brief', 'Post Type Singular Name', 'prc-platform-core' ),
			'menu_name'             => __( 'Flash Briefings', 'prc-platform-core' ),
			'name_admin_bar'        => __( 'Flash Brief', 'prc-platform-core' ),
			'archives'              => __( 'Flash Briefings Archives', 'prc-platform-core' ),
			'parent_item_colon'     => __( 'Parent Flash Brief:', 'prc-platform-core' ),
			'all_items'             => __( 'All Flash Briefings', 'prc-platform-core' ),
			'add_new_item'          => __( 'Add New Flash Brief', 'prc-platform-core' ),
			'add_new'               => __( 'Add New', 'prc-platform-core' ),
			'new_item'              => __( 'New Flash Brief', 'prc-platform-core' ),
			'edit_item'             => __( 'Edit Flash Brief', 'prc-platform-core' ),
			'update_item'           => __( 'Update Flash Brief', 'prc-platform-core' ),
			'view_item'             => __( 'View Flash Brief', 'prc-platform-core' ),
			'search_items'          => __( 'Search Flash Briefs', 'prc-platform-core' ),
			'not_found'             => __( 'Not found', 'prc-platform-core' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'prc-platform-core' ),
			'featured_image'        => __( 'Featured Image', 'prc-platform-core' ),
			'set_featured_image'    => __( 'Set featured image', 'prc-platform-core' ),
			'remove_featured_image' => __( 'Remove featured image', 'prc-platform-core' ),
			'use_featured_image'    => __( 'Use as featured image', 'prc-platform-core' ),
			'insert_into_item'      => __( 'Insert into Flash Brief', 'prc-platform-core' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Flash Brief', 'prc-platform-core' ),
			'items_list'            => __( 'Flash Briefings list', 'prc-platform-core' ),
			'items_list_navigation' => __( 'Flash Briefings list navigation', 'prc-platform-core' ),
			'filter_items_list'     => __( 'Filter Flash Brief list', 'prc-platform-core' ),
		);
		$rewrite  = array(
			'slug'       => 'flash-brief',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);
		$supports = array( 'title', 'editor', 'author', 'thumbnail', 'revisions', 'custom-fields', 'excerpt' );
		$args     = array(
			'label'               => __( 'Flash Brief', 'prc-platform-core' ),
			'description'         => __( 'A 🤖 PRC-Copilot powered flash/daily briefing for Alexa, Siri, and Google Assistants.', 'prc-platform-core' ),
			'labels'              => $labels,
			'supports'            => $supports,
			'taxonomies'          => array( 'search_term' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 5,
			'menu_icon'           => 'dashicons-format-status',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => true,
			'publicly_queryable'  => true,
			'show_in_rest'        => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);
		register_post_type( self::$post_type, $args );
	}

	/**
	 * Enable Gutenberg for the flash brief.
	 * @hook prc_load_gutenberg
	 * @param  array $post_types [description]
	 * @return array Post types that should have Gutenberg enabled.
	 */
	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	/**
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array $endpoints
	 */
	public function register_endpoints($endpoints) {
		$alexa = array(
			'route' 			  => '/flash-briefing/alexa',
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_alexa_flash_brief' ),
			'args'                => array(
				'apikey' => array(
					'default'           => 0,
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
			}
		);
		$siri = array(
			'route' 			  => '/flash-briefing/siri',
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_siri_flash_brief' ),
			'args'                => array(
				'apikey' => array(
					'default'           => 0,
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
			}
		);
		$google = array(
			'route' 			  => '/flash-briefing/google',
			'methods'             => 'GET',
			'callback'            => array( $this, 'get_google_flash_brief' ),
			'args'                => array(
				'apikey' => array(
					'default'           => 0,
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
			}
		);
		array_push($endpoints, $alexa);
		return $endpoints;
	}

	/**
	 * Get the briefings in a standard structure that other services can transform to their needs.
	 * @return array
	 */
	private function get_briefings() {
		$response = array();
		$args  = array(
			'post_type' => self::$post_type,
		);
		$query = new WP_Query( $args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id      = get_the_ID();
				$date         = get_the_date( 'c', $post_id );
				$content = wp_strip_all_tags( get_the_content() ) . ' For more, visit pew research dot org.';
				$link         = get_post_meta( $post_id, '_yoast_wpseo_canonical', true );
				if ( empty( $link ) ) {
					$link = get_permalink( $post_id );
				}
				$response[] = array(
					'id'      => $post_id,
					'date'    => $date,
					'title'   => get_the_title(),
					'content' => $content,
					'url' 	  => $link,
				);
			}
			wp_reset_postdata();
		}
		return $response;
	}

	/**
	 * Get the flash briefs for Alexa.
	 *
	 * @param  WP_REST_Request $request [description]
	 * @return [type]                   [description]
	 */
	public function get_alexa_flash_brief( \WP_REST_Request $request ) {
		$api_key  = $request->get_param( 'apikey' );
		$response = false;

		if ( PRC_PLATFORM_FLASH_BRIEFING_KEY === $api_key ) {
			$briefings = $this->get_briefings();
			if ( ! empty( $briefings ) ) {
				$response = array();
				foreach ($briefings as $briefing) {
					$response[] = array(
						'uid'            => 'prc-daily-brief-' . $briefing['id'],
						'updateDate'     => $briefing['date'],
						'titleText'      => $briefing['title'],
						'mainText'       => $briefing['content'],
						'redirectionUrl' => $briefing['url'],
					);
				}
				/* Restore original Post Data */
				wp_reset_postdata();
			}
		}
		return $response;
	}
}
