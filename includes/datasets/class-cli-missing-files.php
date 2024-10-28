<?php
namespace PRC\Platform;
use WPCOM_VIP_CLI_Command;
use WP_CLI;
use WP_Error;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * Manage the migration of posts from one site to the new pewresearch-org.
	 */
	class Dataset_Missing_Files extends WPCOM_VIP_CLI_Command {

		public function __construct() {

		}

		/**
		 * Query and mark datasets that are missing files.
		 * @param array $args
		 * @param array $assoc_args
		 * @synopsis [--dry-run]
		 */
		public function run($args, $assoc_args) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( isset( $assoc_args['dry-run'] ) ) {
				// Passing `--dry-run=false` to the command leads to the `false` value being set to string `'false'`, but casting `'false'` to bool produces `true`. Thus the special handling.
				if ( 'false' === $assoc_args['dry-run'] ) {
					$dry_run = false;
				} else {
					$dry_run = (bool) $assoc_args['dry-run'];
				}
			} else {
				$dry_run = true;
			}

			if ( false === $dry_run ) {
				WP_CLI::line( '👤 🔴  Callback armed and ready' );
			} else {
				WP_CLI::line( '👤 🛟  Running in dry-run mode, callback is disarmed.' );
			}

			$posts_per_page = 100;
			$paged = 1;
			$count = 0;

			do {

				$args = [
					'post_type'        => 'dataset',
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'suppress_filters' => false,
					'meta_query'       => [
						[
							'key' => '_download_attachment_id',
							'compare' => 'NOT EXISTS',
						],
					],
				];

				$posts = get_posts($args);

				foreach ( $posts as $post ) {
					if ( ! $dry_run ) {
						update_post_meta( $post->ID, '_dataset_file_missing', true );
					}
					$count++;
				}

				// Pause.
				WP_CLI::line( 'Pausing for a breath...' );
				sleep( 3 );

				// Free up memory.
				$this->vip_inmemory_cleanup();

				/* At this point, we have to decide whether to increase the value of $paged. In case a value which is being used for querying the posts (like post_status in our example) is being changed via the command, we should keep the WP_Query starting from the beginning in every iteration.
				* If the any value used for querying the posts is not being changed, then we need to update the value in order to walk through all the posts. */
				$paged++;
			} while ( count( $posts ) );

			if ( false === $dry_run ) {
				WP_CLI::success( sprintf( '%d datasets have successfully been identified as having missing files and had their metakeys updated.', $count ) );
			} else {
				WP_CLI::success( sprintf( '%d datasets will be identified as having missing files and have their metakeys updated.', $count ) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}
	}

	WP_CLI::add_command( 'prc datasets missing-files', '\PRC\Platform\Dataset_Missing_Files' );
}
