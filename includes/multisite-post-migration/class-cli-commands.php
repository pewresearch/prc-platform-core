<?php
namespace PRC\Platform;
use WPCOM_VIP_CLI_Command;
use WP_CLI;
use WP_Error;
use wpcom_vip_get_page_by_title;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * Manage the migration of posts from one site to the new pewresearch-org.
	 */
	class Post_Migration_CLI_Commands extends WPCOM_VIP_CLI_Command {
		public function __construct() {
		}

		protected function process_cleanup_action_on_obj($args, $data, $group, $cli_step_log) {
			$args = wp_parse_args($args, [
				'post_id' => null,
				'post_type' => null,
			]);
			$post_id = $args['post_id'];
			$post_type = $args['post_type'];
			// Set up action:
			// Timestamp 1 min into future
			$timestamp = time() + 60;
			// This action hook
			$action = 'prc_post_migration_action__attachments_link_cleanup';
			// The arguments we're passing through to the action
			$action_args = array(
				'post_id' => $post_id,
				'data' => $data,
			);

			// We should check to see if this action has already been scheduled, if so, we should not schedule it again.
			if ( as_next_scheduled_action( $action, $action_args, $group ) ) {
				WP_CLI::warning( sprintf(
					'⌛ %s - %s has already been scheduled for clean up. %s',
					WP_CLI::colorize( '%B'.$post_type.'%n' ),
					WP_CLI::colorize( '%G'.$post_id.'%n' ),
					$cli_step_log,
				) );
				return;
			}

			// Lets actually schedule the action.
			$position = as_schedule_single_action(
				$timestamp,
				$action,
				$action_args,
				$group,
			);

			WP_CLI::success( sprintf(
				'👍 🧼 %s - %s scheduled for post-migration clean up. Position in action queue: %s - %s',
				WP_CLI::colorize( '%B'.$post_type.'%n' ),
				WP_CLI::colorize( '%G'.$post_id.'%n' ),
				WP_CLI::colorize( '%G'.$position.'%n' ),
				$cli_step_log,
			) );
		}

		/**
		 * Follow up cleanup
		 *
		 * @subcommand run-for-post-type
		 * @synopsis --post-type=<post-type> [--dry-run]
		 */
		public function run_for_post_type( $args, $assoc_args ) {
			if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
				WP_CLI::error( 'This command can only be run on the primary site.' );
			}

			// Meta key is required, otherwise an error will be returned.
			if ( isset( $assoc_args['post-type'] ) ) {
				$post_type = $assoc_args['post-type'];
			} else {
				// Caution: calling WP_CLI::error stops the execution of the command. Use it only in case you want to stop the execution. Otherwise, use WP_CLI::warning or WP_CLI::line for non-blocking errors.
				WP_CLI::error( 'Must have --post-type defined.' );
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
				WP_CLI::line( '🛟 Running in dry-run mode, callback is disarmed.' );
			} else {
				WP_CLI::line( '☠️ Live fire! Armed and ready to clean objects... with extreme prejudice 🧼 😎 💥.' );
			}

			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$posts_per_page = 150;
			$count = 0; // We'll use this to count the number of posts we've migrated as we go.
			$paged = 1;

			do {
				$query_args = array(
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'post_type'        => $post_type,
					'post_status'      => array('publish', 'public', 'hidden_from_search', 'hidden_from_index'),
					/// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'meta_query' => array(
						'relation' => 'AND',
						array(
							'key' => 'dt_original_blog_id', // Only ensure we're getting migrated posts
							'compare' => 'EXISTS',
						),
						array(
							'key' => 'dt_original_post_id', // Only ensure we're getting migrated posts
							'compare' => 'EXISTS',
						)
					),
				);

				$posts = get_posts($query_args);

				foreach ( $posts as $post ) {
					// count the number of posts we've migrated as we go.
					$count++;

					$cli_info = array(
						'count' => WP_CLI::colorize( '%M('.$count.')%n' ),
						'paged' => WP_CLI::colorize( '%m'.$paged.'%n' ),
						'query_count' => WP_CLI::colorize( '%m'.count( $posts ).'%n' ),
					);
					$cli_step_log = "{$cli_info['count']} :: {$cli_info['paged']} ::: {$cli_info['query_count']}";

					$original_site_id = get_post_meta( $post->ID, 'dt_original_blog_id', true );
					$original_post_id = get_post_meta( $post->ID, 'dt_original_post_id', true );

					// The group this action belongs to
					$action_group = $original_site_id . '_' . $original_post_id . '_' . $post->ID;

					if ( ! $dry_run ) {
						$this->process_cleanup_action_on_obj(
							[
								'post_id' => $post->ID,
								'post_type' => $post_type,
							],
							[], // data we want to pass in if needed...
							$action_group,
							$cli_step_log
						);
					} else {
						WP_CLI::success( sprintf(
							'👍 🧼 %s - %s will be scheduled for post-migration clean up when run with dry-run trigger safety off. %s',
							WP_CLI::colorize( '%B'.$post_type.'%n' ),
							WP_CLI::colorize( '%G'.$post->ID.'%n' ),
							$cli_step_log,
						) );
					}
				}

				// Free up memory.
				$this->vip_inmemory_cleanup();

				// Pause.
				WP_CLI::line('😴💤 sleeping for 5 seconds...');
				sleep( 5 );

				$paged++;
			} while ( count( $posts ) );

			if ( false === $dry_run ) {
				WP_CLI::success( sprintf(
					'🧼 %s - %s objects are currently being cleaned.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%B'.$post_type.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'🧼 Dry run complete. %s - %s objects were not cleaned at this time as the safety is still engaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%B'.$post_type.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * Migrates 1 singular post as specified by id.
		 *
		 * @subcommand run-for-post
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function run_for_post( $args, $assoc_args ) {
			if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
				WP_CLI::error( 'This command can only be run on the primary site.' );
			}

			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( isset( $assoc_args['id'] ) ) {
				$post_id = $assoc_args['id'];
			} else {
				WP_CLI::error( 'Must have --id defined.' );
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
				WP_CLI::line( 'Running in dry-run mode.' );
			} else {
				WP_CLI::line( 'Live fire!' );
			}

			$post_to_process = get_post( $post_id );

			if ( ! $post_to_process ) {
				WP_CLI::error( sprintf( '🔍 Post %d does not exist.', $post_id ) );
			}

			$original_site_id = get_post_meta( $post_to_process->ID, 'dt_original_blog_id', true );
			$original_post_id = get_post_meta( $post_to_process->ID, 'dt_original_post_id', true );

			// The group this action belongs to
			$action_group = $original_site_id . '_' . $original_post_id . '_' . $post_id;

			if ( ! $dry_run ) {
				$this->process_cleanup_action_on_obj(
					[
						'post_id' => $post_id,
						'post_type' => $post_to_process->post_type,
					],
					[], // data we want to pass in if needed...
					$action_group,
					'👍 🧼'
				);
			} else {
				WP_CLI::success( sprintf(
					'⏳ 🧼 %s will be scheduled for cleanup when the trigger safety is disengaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$post_to_process->ID.'%n' ),
				) );
			}

			$this->vip_inmemory_cleanup();

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * Tests a follow up blury image fix
		 *
		 * @subcommand test
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function test( $args, $assoc_args ) {
			if ( isset( $assoc_args['id'] ) ) {
				$post_id = $assoc_args['id'];
			} else {
				WP_CLI::error( 'Must have --id defined.' );
			}

			$post = get_post($post_id);

			// Find the img tag
			if (preg_match('/img src="(.*?\?w=(\d+))"/', $post->post_content, $matches)) {
				// Remove ?w=some number from the img tag
				$new_img_tag = str_replace($matches[1], explode('?', $matches[1])[0], $post->post_content);
				// Insert the width into the wp:image tag
				$new_wp_image_tag = preg_replace('/<!-- wp:image {.*?} -->/', '<!-- wp:image {{"width":' . $matches[2] . '}} -->', $new_img_tag);
				// Update the post_content in the database
				$post_data = array(
					'ID'           => $post->ID,
					'post_content' => $new_wp_image_tag,
				);
				wp_update_post( $post_data );
			}
		}

	}

	WP_CLI::add_command( 'prc post-migration', '\PRC\Platform\Post_Migration_CLI_Commands' );
}
