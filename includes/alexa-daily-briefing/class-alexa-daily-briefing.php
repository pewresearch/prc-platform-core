<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;

class Alexa_Daily_Briefing {
	public static $post_type = 'daily-brief';
	protected $api_key = '012091912012';

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

	public static $handle = 'prc-platform-alex-daily-briefing';

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
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	public function register_type() {
		$labels   = array(
			'name'                  => _x( 'Flash Briefings', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Flash Brief', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Flash Briefings', 'text_domain' ),
			'name_admin_bar'        => __( 'Flash Brief', 'text_domain' ),
			'archives'              => __( 'Flash Briefings Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Flash Brief:', 'text_domain' ),
			'all_items'             => __( 'All Flash Briefings', 'text_domain' ),
			'add_new_item'          => __( 'Add New Flash Brief', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Flash Brief', 'text_domain' ),
			'edit_item'             => __( 'Edit Flash Brief', 'text_domain' ),
			'update_item'           => __( 'Update Flash Brief', 'text_domain' ),
			'view_item'             => __( 'View Flash Brief', 'text_domain' ),
			'search_items'          => __( 'Search Flash Briefs', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Flash Brief', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Flash Brief', 'text_domain' ),
			'items_list'            => __( 'Flash Briefings list', 'text_domain' ),
			'items_list_navigation' => __( 'Flash Briefings list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Flash Brief list', 'text_domain' ),
		);
		$rewrite  = array(
			'slug'       => 'daily-brief',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);
		$supports = array( 'title', 'editor', 'author', 'thumbnail', 'revisions', 'custom-fields', 'excerpt' );
		$args     = array(
			'label'               => __( 'Flash Brief', 'text_domain' ),
			'description'         => __( 'An ai powered flash/daily briefing of PRC content for Alex and Google assistants.', 'text_domain' ),
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

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	public function register_rest_endpoint() {
		// Endpoint that we offer up to Amazon Alexa to ingest this content.
		register_rest_route(
			'prc-api/v2',
			'/daily-brief/alexa',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_callback' ),
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
				},
			)
		);
	}

	/**
	 * [rest_callback description]
	 *
	 * @param  WP_REST_Request $request [description]
	 * @return [type]                   [description]
	 */
	public function rest_callback( \WP_REST_Request $request ) {
		$api_key  = $request->get_param( 'apikey' );
		$response = false;

		if ( $this->api_key === $api_key ) {
			$args  = array(
				'post_type' => 'daily-brief',
			);
			$query = new WP_Query( $args );
			if ( $query->have_posts() ) {
				$response = array();
				while ( $query->have_posts() ) {
					$query->the_post();
					$post_id      = get_the_ID();
					$date         = get_the_date( 'c', $post_id );
					$text_content = wp_strip_all_tags( get_the_content() ) . ' For more, visit pew research dot org.';
					$link         = get_post_meta( $post_id, '_yoast_wpseo_canonical', true );
					if ( empty( $link ) ) {
						$link = get_permalink( $post_id );
					}
					$response[] = array(
						'uid'            => 'prc-daily-brief-' . $post_id,
						'updateDate'     => $date,
						'titleText'      => get_the_title(),
						'mainText'       => $text_content,
						'redirectionUrl' => $link,
					);
				}
				/* Restore original Post Data */
				wp_reset_postdata();
			}
		}
		return $response;
	}
}
