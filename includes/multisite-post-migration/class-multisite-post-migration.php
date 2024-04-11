<?php
namespace PRC\Platform;
use WP_Error;

/**
 * Tools to aid in post multisite collapse content migration.
 */
class Multisite_Post_Migration {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-multisite-post-migration';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// $loader->add_action('enqueue_block_editor_assets', $this, 'enqueue_assets');
			$loader->add_action('init', $this, 'register_fallback_meta');
			$loader->add_action('rest_api_init', $this, 'register_endpoint');
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
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	public function register_fallback_meta() {
		// Register fallback Distributor meta
		register_post_meta(
			'',
			'dt_original_blog_id',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
		register_post_meta(
			'',
			'dt_original_post_id',
			array(
				'single'        => true,
				'type'          => 'integer',
				'show_in_rest'  => true,
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	// Register this primitively so it works across codebases.
	public function register_endpoint() {
		register_rest_route( 'prc-api/v3', '/migration-tools/query-new-term', array(
			'methods'  => 'GET',
			'callback' => array( $this, 'restfully_query_for_new_term' ),
			'args'                => array(
				'taxonomy' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
				'oldTermId' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
				'oldSiteId' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_numeric( $param );
					},
				),
			),
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		));
	}

	/**
	 * Query for a new term by the old term id.
	 */
	public function query_new_term_by_old_term_id($taxonomy, $old_term_id, $old_site_id = 1) {
		// do a wp_term_query for the old term id
		$new_term = null;
		$new_term_id = false;
		switch_to_blog( $old_site_id );
		$term = get_term_by( 'term_id', $old_term_id, $taxonomy );
		$new_term_id = get_term_meta( $term->term_id, '_prc_migrated_term', true );
		restore_current_blog();
		if ( false === $new_term_id ) {
			return false;
		}
		switch_to_blog( 20 );
		$taxonomy = 'topic' === $taxonomy ? 'category' : $taxonomy; // 'topic' is 'category' on the new site
		$new_term = get_term_by( 'id', $new_term_id, $taxonomy );
		restore_current_blog();
		return $new_term;
	}

	public function restfully_query_for_new_term(\WP_REST_Request $request) {
		$taxonomy = $request->get_param('taxonomy');
		$old_term_id = $request->get_param('oldTermId');
		$old_site_id = $request->get_param('oldSiteId');
		$new_term = $this->query_new_term_by_old_term_id($taxonomy, $old_term_id, $old_site_id);
		if ( false === $new_term ) {
			return new WP_Error( 'term_not_found', 'Term not found', array( 'status' => 404 ) );
		}
		return $new_term;
	}
}
