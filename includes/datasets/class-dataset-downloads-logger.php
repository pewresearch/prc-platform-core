<?php
namespace PRC\Platform;
use WP_Error;
use WP_REST_Request;

class Downloads_Logger extends Datasets {

	public static $handle = 'prc-platform-dataset-downloads-logger';

	public function __construct() {

	}

	public function register_meta() {
		register_post_meta(
			parent::$post_object_name,
			'_total_downloads',
			array(
				'description'   => 'Total downloads counter for a dataset.',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'integer',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function register_rest_endpoints() {
		// ensure permission_callback checks for a valid nonce
		register_rest_route(
			'prc-api/v2',
			'datasets/log-download',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'restfully_log_download' ),
				'permission_callback' => function ( WP_REST_Request $request ) {
					$nonce = $request->get_header( 'x-wp-nonce' );
					return $this->verify_nonce( $nonce );
				},
			)
		);

		register_rest_field(
			parent::$post_object_name,
			'_downloads',
			array(
				'get_callback' => array( $this, 'restfully_get_download_log' ),
				'schema'       => null,
			)
		);
	}

	private function verify_nonce($nonce = '') {
		if ( ! wp_verify_nonce( $nonce, 'prc-dataset-download-nonce' ) ) {
			return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 403 ) );
		}
		return true;
	}

	public function restfully_get_download_log( $object ) {
		$post_id = (int) $object['id'];

		$to_return = array(
			'total' => (int) get_post_meta( $post_id, '_total_downloads', true ),
			'log' => array(),
		);

		$start_year = 2020;
		$current_year = (int) date( 'Y' );
		$years = range( $start_year, $current_year );

		foreach($years as $year) {
			$meta_key = '_downloads_' . $year;
			$to_return['log'][ $year ] = get_post_meta( $post_id, $meta_key, true );
		}

		return $to_return;
	}

	public function restfully_log_download( WP_REST_Request $request ) {
		$data    = json_decode( $request->get_body(), true );
		$id      = $data['id'];
		$return            = array();
		$return['total']   = $this->increment_download_total( $id );
		$return['monthly'] = $this->log_monthly_download_count( $id );
		return $return;
	}

	public function increment_download_total( $dataset_id ) {
		$total = get_post_meta( $dataset_id, '_total_downloads', true );
		++$total;
		$updated = update_post_meta( $dataset_id, '_total_downloads', $total );

		if ( false !== $updated ) {
			return true;
		} else {
			return new WP_Error( 'datasets/could-not-increment-total', 'Unable to increment download total.', array( 'status' => 500 ) );
		}
	}

	public function log_monthly_download_count( $dataset_id ) {
		$year     = wp_date( 'Y' );
		$month    = wp_date( 'm' );
		$meta_key = '_downloads_' . $year;

		$data = get_post_meta( $dataset_id, $meta_key, true );

		// Organize by date.
		if ( ! is_array( $data ) ) {
			$data = array();
		}

		if ( ! array_key_exists( $month, $data ) ) {
			$data[ $month ] = 1;
		}

		$data[ $month ] = $data[ $month ] + 1;

		$updated = update_post_meta( $dataset_id, $meta_key, $data );

		if ( false !== $updated ) {
			return true;
		} else {
			return new WP_Error( 'datasets/could-not-log-monthly', 'Unable to log monthly download data.', array( 'status' => 500 ) );
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
}
