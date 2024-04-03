<?php
namespace PRC\Platform;

use Dataset_Downloads_Log_Query;
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
				'datesetId' => array(
					'required' => true,
					'type' => 'integer'
				),
			),
			'permission_callback' => function ( WP_REST_Request $request ) {
				$nonce = $request->get_header( 'x-wp-nonce' );
				// return ! wp_verify_nonce( $nonce, 'prc-dataset-download-nonce' ) || current_user_can( 'edit_posts' );
				return true;
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

		$allow_uid_access = current_user_can( 'edit_posts' );
		$uids = null;
		if ( $allow_uid_access ) {
			$query = new Dataset_Downloads_Log_Query(array(
				'id'    => $post_id,
				'orderby' => 'id',
				'order'   => 'asc',
				'number'  => 1, // Only retrieve a single record.
				'fields'  => array( 'id', 'uids' ),
			));
			if ( $query->items ) {
				// get the first item in $query->items and get the uids property from it...
				if (!empty($query->items) && isset($query->items[0]->uids)) {
					$uids = $query->items[0]->uids;
				} else {
					$uids = false;
				}
			}
		}

		$to_return = array(
			'total' => (int) get_post_meta( $post_id, '_total_downloads', true ),
			'log' => array(),
			'uids' => $uids,
			'authenticated' => $allow_uid_access,
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
		$data = json_decode( $request->get_body(), true );
		if ( ! array_key_exists( 'uid', $data ) ) {
			return new WP_Error( 'no_uid', 'No UID provided.', array( 'status' => 400 ) );
		}
		$uid = $data['uid'];

		$id = $request->get_param( 'datesetId' );
		if ( ! $id ) {
			return new WP_Error( 'no_dataset_id', 'No dataset ID provided.', array( 'status' => 400 ) );
		}

		$return            = array();
		$return['total']   = $this->increment_download_total( $id );
		$return['monthly'] = $this->log_monthly_download_count( $id );
		$return['uid']     = $this->log_dataset_to_user( $uid, $id );

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

	public function log_dataset_to_user( $uid, $dataset_id ) {
		$query_args = array(
			'user_id'    => $uid,
			'orderby'    => 'id',
			'order'      => 'asc',
			'number'     => 1, // Only retrieve a single record.
			'fields'     => array( 'id', 'dataset_ids' ),
		);
		$query = new Dataset_Downloads_Log_Query($query_args);

		$response = false;

		if ( $query->items ) {
			// If exists, update the uids.
			foreach ( $query->items as $record ) {
				$dataset_ids = maybe_unserialize( $record->dataset_ids );
				// If the dataset+od is already in the array, don't add it again.
				if ( in_array( $dataset_id, $dataset_ids ) ) {
					return;
				}
				$dataset_ids = array_merge( $dataset_ids, array( $dataset_id ) );
				$dataset_ids = maybe_serialize( $dataset_ids );
				$response = $query->update_item(
					$record->id,
					array(
						'dataset_ids' => $dataset_ids
					)
				);
			}
		} else {
			// First time, create
			$response = $query->add_item(
				array(
					'user_id' => $uid,
					'dataset_ids' => maybe_serialize( array( $dataset_id ) ),
				)
			);
		}

		return $response;
	}

	public function get_datasets_for_user($uid) {
		$query_args = array(
			'user_id' => $uid,
			'fields' => array( 'id', 'dataset_ids' ),
		);
		$query = new Dataset_Downloads_Log_Query($query_args);
		$datasets = array();
		if ( $query->items ) {
			foreach ( $query->items as $record ) {
				$dataset_ids = maybe_unserialize( $record->dataset_ids );
				$datasets = array_merge( $datasets, $dataset_ids );
			}
		}
		return $datasets;
	}
}

function query_datasets_log_for_user($user_id) {
	$query_args = array(
		'user_id' => $user_id,
		'fields' => array( 'id', 'dataset_ids' ),
	);
	$query = new Dataset_Downloads_Log_Query($query_args);
	$datasets = array();
	if ( $query->items ) {
		foreach ( $query->items as $record ) {
			$dataset_ids = maybe_unserialize( $record->dataset_ids );
			$datasets = array_merge( $datasets, $dataset_ids );
		}
	}
	return $datasets;
}
