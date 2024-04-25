<?php
namespace PRC\Platform;

use Dataset_Downloads_Log_Query;
use WP_Error;
use WP_REST_Request;

class Datasets_Download_Logger extends Datasets {
	public static $handle = 'prc-platform-dataset-downloads-logger';

	public function __construct() {

	}

	public function init_db() {
		// Dont run anywhere but the primary site.
		if ( PRC_PRIMARY_SITE_ID !== get_current_blog_id() ) {
			return;
		}
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
				$nonce = $request->get_header('X-WP-Nonce');
				if (empty($nonce)) {
					return false; // Nonce missing, permission denied
				}
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
		$current_year = (int) gmdate( 'Y' );
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
		if ( wp_verify_nonce( $request->get_header('X-WP-Nonce'), 'WP_REST' ) === false ) {
			return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 403 ) );
		}
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
		// We run through these without checking the prior return because we want to log as much as possible in the event of a failure. This way the total is incremented first, the truest number, then the monthyl count, then lastly the users personal log.
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
		$user = new \PRC\Platform\User_Accounts\User_Data($uid, null);

		$existing_data = $user->get_data();
		if ( is_wp_error( $existing_data ) ) {
			\PRC\Platform\log_error('Couldnt log dataset to user'. print_r(['uid' => $uid, 'id' => $dataset_id], true));
			return rest_ensure_response( $existing_data );
		}
		\PRC\Platform\log_error('DATASETS FOR user'. print_r($existing_data['datasets'], true));
		$datasets = array_key_exists('datasets', $existing_data) ? $existing_data['datasets'] : array();
		// Check for legacy data and upgrade:
		$upgrade_check = !array_key_exists('v2', $datasets) && !empty($datasets);
		if ( $upgrade_check ) {
			$datasets = [
				'v1' => $datasets,
				'v2' => [],
			];
		} elseif ( !array_key_exists('v2', $datasets) ) {
			$datasets['v2'] = [];
		}

		// Check for existing log, if it doesnt exist, add it, if it does, update the date.
		if ( ! in_array( $dataset_id, $datasets['v2'] ) ) {
			$datasets['v2'][$dataset_id] = [
				'date' => current_time( 'mysql' ),
				'url' => get_permalink( $dataset_id ),
				'title' => get_the_title( $dataset_id ),
			];
		} else {
			$datasets['v2'][$dataset_id]['date'] = current_time( 'mysql' );
		}

		$new_datasets = $datasets;

		// Patch directly onto the user root, we replace datasets every time. In the future we could add a transformer to the get function that will get the titles and such so replacing is best.
		return $user->patch_data( $new_datasets, 'datasets' );
	}
}
