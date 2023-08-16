<?php
namespace PRC\Platform;

use WP_REST_Request;
use WP_Error;

/**
 * Panel and command line utility to run some follow up tools.
 * @package PRC\Platform
 */
class Multisite_Migration_Tools {
	public $migration_site_id = null;
	public static $handle = 'prc-platform-multisite-migration-tools';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct() {
		$this->migration_site_id = PRC_MIGRATION_SITE;
	}

	/**
	 * Get the original blog id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_blog_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_blog_id', true);
		// make the value into an integer if it can be.
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	/**
	 * Get the original post id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_post_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_post_id', true);
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	public function register_rest_endpoints() {
		// migration/info to get the original post and original site id
		// migration/verify/{tool} to run a tool to verify for example: migration/verify/topics
		register_rest_route(
			'prc-api/v3',
			'/migration/info',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_migration_info' ),
				'args'     => array(
					'postId' => array(
						'required' => true,
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
			)
		);

		register_rest_route(
			'prc-api/v3',
			'/migration/verify/(?P<tool>[a-zA-Z0-9-]+)',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'verify_tool' ),
				'args'     => array(
					'postId' => array(
						'required' => true,
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
					'allowOverwrite' => array(
						'required' => false,
						'validate_callback' => function( $param, $request, $key ) {
							return rest_is_boolean( $param );
						},
					),
					'dryRun' => array(
						'required' => false,
						'validate_callback' => function( $param, $request, $key ) {
							return rest_is_boolean( $param );
						},
					),
				),
			)
		);
	}

	public function get_migration_info( WP_REST_Request $request ) {
		$post_id = $request->get_param( 'postId' );
		$post_id = (int) $post_id;
		if ( ! $post_id ) {
			return new WP_Error( self::$handle, 'No post_id specified' );
		}
		$original_post_id = get_post_meta( $post_id, 'dt_original_post_id', true );
		$original_site_id = get_post_meta( $post_id, 'dt_original_blog_id', true );
		$original_parent_id = get_post_meta( $post_id, 'dt_original_post_parent', true );

		$has = array(
			'reportPackageMaterials' => get_post_meta( $post_id, '_reportMaterials', true ) ? true : false,
			'reportPackageConnection' => get_post_meta( $post_id, '_multiSectionReport', true ) ? true : false,
			'bylines' => true,
			'attachments' => get_post_meta( $post_id, '_artDirection', true ),
		);

		return array(
			'postId' => $original_post_id,
			'siteId' => $original_site_id,
			'parentId' => $original_parent_id,
			'has' => $has,
		);
	}

	public function verify_tool( WP_REST_Request $request ) {
		$tool = $request->get_param( 'tool' );
		if ( ! $tool ) {
			return new WP_Error( self::$handle, 'No tool specified' );
		}
		$tool = str_replace( '-', '_', $tool );

		$method = 'verify_' . $tool;
		if ( ! method_exists( $this, $method ) ) {
			return new WP_Error( self::$handle, 'Tool not found' );
		}

		$post_id = $request->get_param( 'postId' );
		$post_id = (int) $post_id;
		if ( ! $post_id ) {
			return new WP_Error( self::$handle, 'No postId specified' );
		}

		$allow_overwrite = $request->get_param( 'allowOverwrite' );
		$allow_overwrite = (bool) $allow_overwrite;

		$dry_run = $request->get_param( 'dryRun' );
		$dry_run = (bool) $dry_run;

		return $this->$method( $post_id, $allow_overwrite, $dry_run );
	}

	public function verify_topics() {
		// Go check stub index for this data?
	}

	public function verify_bylines() {
		// Go check stub index for this data?
	}

	public function verify_report_package_connection($post_id, $allow_overwrite = false, $dry_run = true) {
		// Check for existing data...
		$existing_data = get_post_meta( $post_id, 'multiSectionReport', true );
		if ( ! empty( $existing_data ) && true !== $allow_overwrite && true === $dry_run ) {
			return new WP_Error( 'existing-data', 'This post already has  multiSectionReport data.', $existing_data );
		}

		$original_post_id = $this->get_original_post_id($post_id);
		$original_site_id = $this->get_original_blog_id($post_id);
		$old_data = get_post_meta( $post_id, '_multiSectionReport', true );
		if ( empty( $old_data ) ) {
			return new WP_Error( 'no-data', 'No _multiSectionReport data found' );
		}

		$multisection_report = new Multisection_Reports(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $multisection_report->process(
			$old_data,
			$dry_run
		);
	}

	public function verify_art_direction($post_id, $allow_overwrite = false, $dry_run = true) {
		// Check for existing data...
		$existing_data = get_post_meta( $post_id, '_artDirection', true );
		if ( ! empty( $existing_data ) && true !== $allow_overwrite && true === $dry_run ) {
			return new WP_Error( 'existing-data', 'This post already has artDirection data.', $existing_data );
		}

		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$attachments = new Attachments(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $attachments->process( array(
			'_artDirection' => $existing_data,
		), true );
	}

	public function verify_related_posts() {

	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';

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

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}
}
