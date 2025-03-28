<?php

if ( defined( 'WP_CLI' ) && WP_CLI && class_exists( 'WPCOM_VIP_CLI_Command' ) ) {

	class Social_CLI_Commands extends WPCOM_VIP_CLI_Command {
		/**
		 * Updates shortlinks for all published objects in a given post type.
		 *
		 * Takes a post type (required).
		 *
		 * @subcommand regenerate-shortlinks
		 * @synopsis --post-type=<post-type> [--dry-run]
		 */
		public function regenerate_shortlinks( $args, $assoc_args ) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$posts_per_page = 100;
			$paged          = 1;
			$count          = 0;

			// Post id is required, otherwise an error will be returned.
			if ( isset( $assoc_args['post-type'] ) ) {
				$post_type = $assoc_args['post-type'];
				// Check that the post type is valid.
				if ( ! post_type_exists( $post_type ) ) {
					WP_CLI::error( 'Invalid post type: ' . $post_type . '.' );
				}
			} else {
				// Caution: calling WP_CLI::error stops the execution of the command. Use it only in case you want to stop the execution. Otherwise, use WP_CLI::warning or WP_CLI::line for non-blocking errors.
				WP_CLI::error( 'Must have --post-type attached.' );
			}

			// If --dry-run is not set, then it will default to true. Must set --dry-run explicitly to false to run this command.
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

			if ( $dry_run ) {
				WP_CLI::line( '🦺 Running in dry-run mode, safety on.' );
			} else {
				WP_CLI::line( '🔴 Live Fire, Safety off! 🔴' );
				// Ask for confirmation.
				WP_CLI::confirm( 'This process is non-destructive, if a post already has a properly registered shortlink with bitly then it will merely reset whats present on the post meta, it will take a while to process, so be patient. All of the generate actions will be run asyncronously, proceed?' );
			}

			$shortlinks = new PRC\Platform\Shortlinks();

			do {

				$posts = get_posts(
					array(
						'posts_per_page'   => $posts_per_page,
						'paged'            => $paged,
						'post_type'        => $post_type,
						'post_status'      => 'publish',
						'suppress_filters' => 'false',
						'fields'           => 'ids',
					)
				);

				foreach ( $posts as $post ) {
					if ( ! $dry_run ) {
						$scheduled = $shortlinks->schedule_shortlink_generation( $post->ID );
						if ( $scheduled ) {
							WP_CLI::line( '🟢 Shortlink generation scheduled for post ' . $post->ID );
						} else {
							WP_CLI::line( '🟡 Shortlink generation already scheduled for post ' . $post->ID );
						}
					}
					++$count;
				}

				// Pause.
				WP_CLI::line( 'Pausing for a breath...' );
				sleep( 3 );

				// Free up memory.
				$this->vip_inmemory_cleanup();

				/*
				At this point, we have to decide whether to increase the value of $paged. In case a value which is being used for querying the posts (like post_status in our example) is being changed via the command, we should keep the WP_Query starting from the beginning in every iteration.
				* If the any value used for querying the posts is not being changed, then we need to update the value in order to walk through all the posts. */
				++$paged;
			} while ( count( $posts ) );

			if ( false === $dry_run ) {
				WP_CLI::success( sprintf( '%d posts have successfully been published and had their metakeys updated.', $count ) );
			} else {
				WP_CLI::success( sprintf( '%d posts will be published and have their metakeys updated.', $count ) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}
	}

	WP_CLI::add_command( 'prc social', 'Social_CLI_Commands' );

}
