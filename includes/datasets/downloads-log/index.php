<?php
namespace PRC\Platform;

use Dataset_Downloads_Log;
use WP_Error;
use WP_REST_Request;

class Datasets_Download_Logger extends Datasets {
	public static $handle = 'prc-platform-dataset-downloads-logger';

	public function __construct() {
		// Setup the database tables.
		require_once plugin_dir_path( __FILE__ ) . '/database/index.php';
	}

	/**
	 * Register meta for the dataset download logger.
	 * @hook init
	 */
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

	/**
	 * Register rest endpoints for dataset downloads logger.
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array $endpoints
	 */
	public function register_download_logger_endpoint($endpoints) {
		$log_download_endpoint = array(
			'route' 		      => 'datasets/log-download',
			'methods'             => 'POST',
			'callback'            => array( $this, 'restfully_log_download' ),
			'args'                => array(
				'id' => array(
					'required' => true,
					'type' => 'integer'
				),
				'uuid' => array(
					'required' => true,
					'type' => 'string'
				),
			),
			'permission_callback' => function ( WP_REST_Request $request ) {
				$nonce = $request->get_header( 'x-wp-nonce' );
				return $this->verify_nonce( $nonce );
			},
		);
		array_push($endpoints, $log_download_endpoint);
		return $endpoints;
	}

	/**
	 * Register rest fields for dataset downloads logger.
	 * @hook rest_api_init
	 */
	public function register_field() {
		// Provide total downloads as a field on the dataset object.
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

	/**
	 * Get the download log for a dataset object.
	 * @param mixed $object
	 * @return (int|array)[]|(int|array)[]
	 */
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

	/**
	 * Restfully log a download for a dataset.
	 * @param WP_REST_Request $request
	 * @return array|WP_Error
	 */
	public function restfully_log_download( WP_REST_Request $request ) {
		$data    = json_decode( $request->get_body(), true );
		$id      = $data['id'];
		$uuid    = $data['uuid'];
		$return            = array();
		$return['total']   = $this->increment_download_total( $id );
		$return['monthly'] = $this->log_monthly_download_count( $id );
		$this->log_uuid_to_dataset( $id, $uuid );
		return $return;
	}

	/**
	 * Increment the total download count for a dataset.
	 * @param mixed $dataset_id
	 * @return true|WP_Error
	 */
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

	/**
	 * Log a download for a dataset.
	 * @param mixed $dataset_id
	 * @return true|WP_Error
	 */
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

	public function log_uuid_to_dataset( $dataset_id, $uuid ) {
		$query_args = array(
			'id'    => $dataset_id,
			'orderby' => 'id',
			'order'   => 'asc',
			'number'  => 1, // Only retrieve a single record.
			'fields'  => array( 'id', 'uuids' ),
		);
		$query = new Dataset_Downloads_Log($query_args);

		$response = false;

		if ( $query->items ) {
			// If exists, update the uuids.
			foreach ( $query->items as $record ) {
				$response = $query->update_item(
					$record->id,
					array(
						'uuids' => array_merge( $record->uuids, array( $uuid ) ),
					)
				);
			}
		} else {
			// First time, create
			$response = $query->create_item(
				array(
					'uuids' => array( $uuid ),
				)
			);
		}

		return $response;
	}
}
