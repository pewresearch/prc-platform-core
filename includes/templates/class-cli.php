<?php
/**
 * WP-CLI commands for bulk template updates.
 *
 * @package PRC\Platform\Templates
 */

namespace PRC\Platform\Templates;

if ( defined( 'WP_CLI' ) && WP_CLI && class_exists( 'WPCOM_VIP_CLI_Command' ) ) {

	/**
	 * Bulk update page templates across posts.
	 */
	class CLI extends \WPCOM_VIP_CLI_Command {

		/**
		 * Bulk update posts from one template to another.
		 *
		 * @subcommand bulk-update
		 * @synopsis --old-template=<slug> --new-template=<slug> [--post-type=<type>] [--dry-run]
		 *
		 * @param array $args       Positional arguments.
		 * @param array $assoc_args Associative arguments.
		 */
		public function bulk_update( $args, $assoc_args ) {
			$old_template = isset( $assoc_args['old-template'] ) ? $assoc_args['old-template'] : '';
			$new_template = isset( $assoc_args['new-template'] ) ? $assoc_args['new-template'] : '';

			if ( empty( $old_template ) ) {
				\WP_CLI::error( '--old-template is required.' );
			}
			if ( empty( $new_template ) ) {
				\WP_CLI::error( '--new-template is required.' );
			}

			$post_type = isset( $assoc_args['post-type'] ) ? $assoc_args['post-type'] : 'any';

			if ( isset( $assoc_args['dry-run'] ) ) {
				if ( 'false' === $assoc_args['dry-run'] ) {
					$dry_run = false;
				} else {
					$dry_run = (bool) $assoc_args['dry-run'];
				}
			} else {
				$dry_run = true;
			}

			if ( $dry_run ) {
				\WP_CLI::line( 'Running in dry-run mode. No changes will be made.' );
			} else {
				\WP_CLI::line( 'Live mode. Posts will be updated.' );
				\WP_CLI::confirm(
					sprintf(
						'Update all posts from template "%s" to "%s"?',
						$old_template,
						$new_template
					),
					$assoc_args
				);
				$this->start_bulk_operation();
			}

			$posts_per_page = 100;
			$paged          = 1;
			$count          = 0;

			$query_args = array(
				'posts_per_page' => $posts_per_page,
				'paged'          => $paged,
				'post_type'      => $post_type,
				'post_status'    => 'any',
				'fields'         => 'ids',
				'no_found_rows'  => true,
				// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query -- Intentional; required for template lookup.
				'meta_query'     => array(
					array(
						'key'   => '_wp_page_template',
						'value' => $old_template,
					),
				),
			);

			do {
				$query_args['paged'] = $paged;
				$query               = new \WP_Query( $query_args );
				$post_ids            = $query->posts;

				foreach ( $post_ids as $post_id ) {
					$post = get_post( $post_id );
					if ( ! $post ) {
						continue;
					}

					if ( ! $dry_run ) {
						update_post_meta( $post_id, '_wp_page_template', $new_template );
					}

					\WP_CLI::log(
						sprintf(
							'[%s] ID %d: %s (%s)',
							$dry_run ? 'dry-run' : 'updated',
							$post_id,
							$post->post_title,
							$post->post_type
						)
					);

					++$count;
				}

				if ( ! $dry_run && ! empty( $post_ids ) ) {
					$this->vip_inmemory_cleanup();
				}

				/*
				 * In live mode, processed posts drop out of the meta_query (their _wp_page_template
				 * no longer matches). Incrementing $paged would advance the offset past posts that
				 * shifted down, skipping them. See prc-datasets class-cli.php for the same pitfall.
				 */
				if ( $dry_run ) {
					++$paged;
				}
			} while ( ! empty( $post_ids ) );

			if ( ! $dry_run ) {
				$this->end_bulk_operation();
			}

			\WP_CLI::success(
				sprintf(
					'%d post(s) %s from "%s" to "%s".',
					$count,
					$dry_run ? 'would be updated' : 'updated',
					$old_template,
					$new_template
				)
			);
		}
	}

	\WP_CLI::add_command( 'prc templates', __NAMESPACE__ . '\\CLI' );

}
