<?php
namespace PRC\Platform;

use WPCOM_VIP_CLI_Command;
use WP_CLI;
use WP_Error;
use wpcom_vip_get_page_by_title;
use Alley\WP\Block_Converter\Block_Converter;
use Alley\WP\Block_Converter\Block;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * Manage the migration of posts from one site to the new pewresearch-org.
	 */
	class Migration_CLI_Command extends WPCOM_VIP_CLI_Command {
		public $target_site_id = null;
		public $action_name = 'prc_migration_pull_and_replace';

		public function __construct() {
			$this->target_site_id = PRC_PRIMARY_SITE_ID;
		}

		/**
		 * Pulls updates and replaces content for all posts of a given post-type.
		 *
		 * @subcommand run-for-post-type
		 * @synopsis --post-type=<post-type> [--dry-run]
		 */
		public function run_for_post_type( $args, $assoc_args ) {
			$site_id = get_current_blog_id();
			if ( $site_id !== $this->target_site_id ) {
				WP_CLI::error( 'This command must be run from the migration site.' );
			}
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( isset( $assoc_args['post-type'] ) ) {
				$post_type = $assoc_args['post-type'];
			} else {
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
				WP_CLI::line( 'Running in dry-run mode.' );
			} else {
				WP_CLI::line( 'Live fire!' );
			}

			$posts_per_page = 100;
			$count = 0; // We'll use this to count the number of posts we've migrated as we go.
			$paged = 1;

			do {
				// Get all posts of the given post-type that have been migrated and have proper original_post_id and original_blog_id meta.
				$query_args = array(
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'post_type'        => $post_type,
					'post_status'      => array(
						'publish',
						'public',
						'hidden_from_search',
						'hidden_from_index'
					),
					'meta_query'       => array(
						array(
							'key'     => 'dt_original_blog_id',
							'compare' => 'EXISTS',
						),
						array(
							'key'     => 'dt_original_post_id',
							'compare' => 'EXISTS',
						),
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

					if ( ! $dry_run ) {
						$cli_step_log = "{$cli_info['count']} :: {$cli_info['paged']} ::: {$cli_info['query_count']}";
						// Set up action variables.
						$timestamp = time() + 60;
						$action = $this->action_name;
						$action_args = array(
							'post_id' => $post->ID,
						);
						$action_group = $this->target_site_id . '_' . $post->ID;

						// We should check to see if this action has already been scheduled, if so, we should not schedule it again.
						if ( as_next_scheduled_action( $action, $action_args, $action_group ) ) {
							WP_CLI::warning( sprintf(
								'%s - %s has already been scheduled for migration. %s',
								WP_CLI::colorize( '%B'.$post_type.'%n' ),
								WP_CLI::colorize( '%G'.$post->ID.'%n' ),
								$cli_step_log,
							) );
							continue;
						}

						// Schedule action.
						// @hook $action name
						$position = as_schedule_single_action(
							$timestamp,
							$action,
							$action_args,
							$action_group,
						);

						WP_CLI::success( sprintf(
							'%s - %s scheduled for updating. Position in action queue: %s - %s',
							WP_CLI::colorize( '%B'.$post_type.'%n' ),
							WP_CLI::colorize( '%G'.$post->ID.'%n' ),
							WP_CLI::colorize( '%G'.$position.'%n' ),
							$cli_step_log,
						) );
					} else {
						WP_CLI::success( sprintf(
							'%s - %s will be scheduled for updating when run with dry-run trigger safety off. %s',
							WP_CLI::colorize( '%B'.$post_type.'%n' ),
							WP_CLI::colorize( '%G'.$post->ID.'%n' ),
							$cli_step_log,
						) );
					}
				}

				// Pause.
				sleep( 5 );

				// Free up memory.
				$this->vip_inmemory_cleanup();

				$paged++;
			} while ( count( $posts ) );

			if ( false === $dry_run ) {
				WP_CLI::success( sprintf(
					'%s - %s objects are currently migrating.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%B'.$post_type.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'Dry run complete. %s - %s objects were not migrated at this time as the safety is still engaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%B'.$post_type.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * Pulls updates and replaces content for a singular post
		 *
		 * @subcommand run-for-post
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function run_for_post( $args, $assoc_args ) {
			$site_id = get_current_blog_id();
			if ( $site_id !== $this->target_site_id ) {
				WP_CLI::error( 'This command must be run from the migration site.' );
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

			$post_to_update = get_post( $post_id );

			if ( ! $post_to_update ) {
				WP_CLI::error( sprintf( 'Post %d does not exist.', $post_id ) );
			}

			if ( ! $dry_run ) {
				// $timstamp should be 1 min into the future
				$timestamp = time() + 60;
				$action = $this->action_name;
				$position = as_schedule_single_action(
					$timestamp,
					$action,
					array(
						'post_id' => $post_to_update->ID,
					),
					$this->target_site_id . '_' . $post_to_update->ID
				);
				WP_CLI::success( sprintf(
					'%s scheduled for migration. Position in action queue: %s',
					WP_CLI::colorize( '%G'.$post_to_update->ID.'%n' ),
					WP_CLI::colorize( '%G'.$position.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'%s will be scheduled when the trigger safety is disengaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$post_to_update->ID.'%n' ),
				) );
			}

			$this->vip_inmemory_cleanup();

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}



		/**
		 * Migrates 1 singular post.
		 *
		 * @subcommand convert-classic-post
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function convert_classic_post( $args, $assoc_args ) {
			if ( get_current_blog_id() !== $this->target_site_id ) {
				WP_CLI::error( 'This command must be run from the migration site.' );
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

			$post_to_migrate = get_post( $post_id );
			if ( has_blocks($post_to_migrate) ) {
				WP_CLI::error( sprintf( 'Post %d has blocks.', $post_id ) );
			}

			if ( ! $post_to_migrate ) {
				WP_CLI::error( sprintf( 'Post %s does not exist.', $post_id ) );
			}

			$original_post_id = get_post_meta($post_id, 'dt_original_post_id', true);
			$original_blog_id = get_post_meta($post_id, 'dt_original_blog_id', true);

			$post_content = $post_to_migrate->post_content;
			$converter = new Classic_To_Blocks(array(
				'post_id' => $original_post_id,
				'site_id' => $original_blog_id
			), array(
				'post_id' => $post_id,
				'site_id' => $this->target_site_id
			), function($msg) {
				WP_CLI::line($msg);
			});
			$new_content = $converter->process_blocks($post_content);

			if ( ! $dry_run ) {
				wp_update_post(array(
					'ID' => $post_id,
					'post_content' => $new_content
				));
			} else {
				WP_CLI::line( 'Dry run complete. Expected output: ' . print_r($new_content, true) );
			}

			$this->vip_inmemory_cleanup();

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

	}

	WP_CLI::add_command( 'prc migration', '\PRC\Platform\Migration_CLI_Command' );
}
