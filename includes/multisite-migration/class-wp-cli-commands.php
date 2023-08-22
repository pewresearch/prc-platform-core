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
	class Migration_CLI_Command extends WPCOM_VIP_CLI_Command {
		public $target_site_id = null;

		public function __construct() {
			$this->target_site_id = PRC_MIGRATION_SITE;
		}

		public function get_unmigrated_post_counts( $post_type = 'post' ) {
			global $wpdb;
			$post_status = 'publish';
			if ( 'attachment' === $post_type ) {
				$post_status = 'inherit';
			}

			// Define the query to get the total number of posts of the post post type where the post does not have a post meta key of _prc_migrated_post present
			$query = $wpdb->prepare(
				"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type = %s AND post_status = %s AND ID NOT IN (SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = %s)",
				$post_type,
				$post_status,
				'_prc_migrated_post'
			);

			// Execute the query and get the total number of posts
			$count = $wpdb->get_var($query);

			// Return the total number of posts
			return $count;
		}

		/**
		 * Migrates a taxonomy, including its hierarchy, to a new site. This will not maintain connections.
		 *
		 * @subcommand run-for-taxonomy
		 * @synopsis --taxonomy=<taxonomy> [--dry-run]
		 */
		public function run_for_taxonomy( $args, $assoc_args ) {
			if ( 1 !== get_current_blog_id() ) {
				WP_CLI::error( 'This command must be run from the source site.' );
			}
			// Need to get the taxonomy terms from the source site even if empty and then we need to create them on the target site. We also need to store any original parent id's and original id's as term meta on the target site.
			// Disable term counting, Elasticsearch indexing, and PushPress.
			// When its done then dispatch a new action on the target site that will re-connect the terms to their new parents.

			$this->start_bulk_operation();

			// Meta key is required, otherwise an error will be returned.
			if ( isset( $assoc_args['taxonomy'] ) ) {
				$taxonomy = $assoc_args['taxonomy'];
			} else {
				// Caution: calling WP_CLI::error stops the execution of the command. Use it only in case you want to stop the execution. Otherwise, use WP_CLI::warning or WP_CLI::line for non-blocking errors.
				WP_CLI::error( 'Must have --taxonomy defined.' );
			}
			$new_taxonomy = $taxonomy;
			if ( 'topic' === $taxonomy ) {
				$new_taxonomy = 'category';
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

			/**
			 * Create new terms on target site.
			 */
			$terms_per_page = 125;
			$count = 0;
			$paged = 1;
			do {
				$query_args = array(
					'number' => $terms_per_page,
					'paged' => $paged,
					'taxonomy' => $taxonomy,
					'hide_empty' => false,
					'fields' => 'all',
					'meta_query' => array(
						'relation' => 'AND',
						array(
							'key' => '_prc_migrated_term',
							'compare' => 'NOT EXISTS',
						),
						array(
							'key' => '_prc_do_not_migrate',
							'compare' => 'NOT EXISTS',
						)
					),
				);
				$terms = get_terms($query_args);

				foreach ( $terms as $term ) {
					$count++;
					if ( ! $dry_run ) {
						switch_to_blog( $this->target_site_id );
						// Create term
						$new_term = wp_insert_term( $term->name, $new_taxonomy, array(
							'description' => $term->description,
							'slug' => $term->slug,
						) );
						update_term_meta( $new_term['term_id'], '_prc_original_term_id', $term->term_id );
						if ( 0 !== $term->parent ) {
							update_term_meta( $new_term['term_id'], '_prc_original_term_parent_id', $term->parent );
						}
						restore_current_blog();

						update_term_meta( $term->term_id, '_prc_migrated_term', true );

						WP_CLI::success( sprintf(
							'Term %s has begun migration',
							WP_CLI::colorize( '%G'.$term->term_id.'%n' ),
						) );
					} else {
						WP_CLI::success( sprintf(
							'Term %s will be migrated when run with dry-run trigger safety off.',
							WP_CLI::colorize( '%G'.$term->term_id.'%n' ),
						) );
					}
				}

				// Pause.
				sleep( 3 );

				// Free up memory.
				$this->vip_inmemory_cleanup();

				$paged++;

			} while ( count( $terms ) );


			if ( ! $dry_run ) {
				WP_CLI::success( 'Terms created on target site. Now re-establishing hierarchy...' );
				/**
				 * Re-establish hierarchy on target site.
				 */
				switch_to_blog( $this->target_site_id );
				$new_terms = get_terms( array(
					'taxonomy' => $new_taxonomy,
					'hide_empty' => false,
					'fields' => 'all',
					'meta_query' => array(
						'relation' => 'AND',
						array(
							'key' => '_prc_original_term_id',
							'compare' => 'EXISTS',
						),
						array(
							'key' => '_prc_original_term_parent_id',
							'compare' => 'EXISTS',
					))
				) );
				foreach ($new_terms as $new_term) {
					$original_parent_id = get_term_meta( $new_term->term_id, '_prc_original_term_parent_id', true );
					// Check once
					$original_parent_term = get_terms( array(
						'number' => 1,
						'taxonomy' => $new_taxonomy,
						'hide_empty' => false,
						'fields' => 'all',
						'meta_query' => array(
							array(
								'key' => '_prc_original_term_id',
								'value' => $original_parent_id,
							),
						),
					) );
					// Check twice
					if ($original_parent_term) {
						$original_parent_term = array_pop($original_parent_term);
						$original_term_id = $original_parent_term->term_id;
						$updated = wp_update_term( $new_term->term_id, $new_taxonomy, array(
							'parent' => $original_term_id,
						) );
						if ( is_wp_error($updated) ) {
							WP_CLI::warning( sprintf(
								'Term: %s could not re-assign its hierarchy. Original parent term id: %s',
								WP_CLI::colorize( '%G'.$new_term->term_id.'%n' ),
								WP_CLI::colorize( '%R'.$original_term_id.'%n' ),
							) );
						} else {
							WP_CLI::success( sprintf(
								'Term Hierarchy Re-established: %s to %s',
								WP_CLI::colorize( '%G'.$new_term->term_id.'%n' ),
								WP_CLI::colorize( '%G'.$original_term_id.'%n' ),
							) );
						}
					}
				}
				restore_current_blog();
			}

			if ( ! $dry_run ) {
				WP_CLI::success( sprintf(
					'%d %s terms have been moved and their original hierarchy re-established.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%G'.$taxonomy.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'Dry run complete. %s terms were not migrated at this time, run with %s to migrate them.',
					WP_CLI::colorize( '%G'.$taxonomy.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * Migrates a post type from one site to another. Copies the post, it's required and still relevant meta, its taxonomy terms data, and its attachments (if any). Meta data, taxonomy term data, and child posts are re-connected in a later step.
		 *
		 * @subcommand run-for-post-type
		 * @synopsis --post-type=<post-type> [--dry-run]
		 */
		public function run_for_post_type( $args, $assoc_args ) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

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
				WP_CLI::line( 'Running in dry-run mode.' );
			} else {
				WP_CLI::line( 'Live fire!' );
			}

			$original_site_id = get_current_blog_id();
			$posts_per_page = 100;
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
							'key' => '_prc_migrated_post',
							'compare' => 'NOT EXISTS',
						),
						array(
							'key' => '_prc_do_not_migrate',
							'compare' => 'NOT EXISTS',
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

					if ( ! $dry_run ) {
						$cli_step_log = "{$cli_info['count']} :: {$cli_info['paged']} ::: {$cli_info['query_count']}";
						// Set up action variables.
						$timestamp = time() + 60;
						$action = 'prc_distributor_queue_push';
						$action_args = array(
							'post_id' => $post->ID,
							'push_target' => $this->target_site_id,
						);
						$action_group = $this->target_site_id . '_' . $post->ID;

						// Check if this has a _redirect post meta, and if it does then check if it's to something in this domain, if so skip this post.
						$redirect = get_post_meta( $post->ID, '_redirect', true );
						if ( strpos( $redirect, get_bloginfo( 'url' ) ) !== false ) {
							WP_CLI::warning( sprintf(
								'%s - %s has a redirect to %s; skipping. %s',
								WP_CLI::colorize( '%B'.$post_type.'%n' ),
								WP_CLI::colorize( '%G'.$post->ID.'%n' ),
								WP_CLI::colorize( '%G'.$redirect.'%n' ),
								$cli_step_log,
							) );
							update_post_meta( $post->ID, '_prc_do_not_migrate', true );
							continue;
						}

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
							'%s - %s scheduled for migration. Position in action queue: %s - %s',
							WP_CLI::colorize( '%B'.$post_type.'%n' ),
							WP_CLI::colorize( '%G'.$post->ID.'%n' ),
							WP_CLI::colorize( '%G'.$position.'%n' ),
							$cli_step_log,
						) );
					} else {
						WP_CLI::success( sprintf(
							'%s - %s will be scheduled for migration when run with dry-run trigger safety off. %s',
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
		 * Migrates 1 singular post.
		 *
		 * @subcommand run-for-post
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function run_for_post( $args, $assoc_args ) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( isset( $assoc_args['id'] ) ) {
				$post_id = $assoc_args['id'];
			} else {
				WP_CLI::error( 'Must have --id defined.' );
			}

			$original_site_id = get_current_blog_id();

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

			if ( ! $post_to_migrate ) {
				WP_CLI::error( sprintf( 'Post %d does not exist.', $post_id ) );
			}

			if ( ! $dry_run ) {
				// DO action
				// $timstamp should be 1 min into the future
				$timestamp = time() + 60;
				$position = as_schedule_single_action(
					$timestamp,
					'prc_distributor_queue_push',
					array(
						'post_id' => $post_to_migrate->ID,
						'push_target' => $this->target_site_id,
					),
					$this->target_site_id . '_' . $post_to_migrate->ID
				);
				WP_CLI::success( sprintf(
					'%s scheduled for migration. Position in action queue: %s',
					WP_CLI::colorize( '%G'.$post_to_migrate->ID.'%n' ),
					WP_CLI::colorize( '%G'.$position.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'%s will be scheduled when the trigger safety is disengaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$post_to_migrate->ID.'%n' ),
				) );
			}

			$this->vip_inmemory_cleanup();

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * Migrates 1 singular post.
		 *
		 * @subcommand process-post
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function process_post( $args, $assoc_args ) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( isset( $assoc_args['id'] ) ) {
				$post_id = $assoc_args['id'];
			} else {
				WP_CLI::error( 'Must have --id defined.' );
			}

			$original_site_id = get_current_blog_id();

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

			if ( ! $post_to_migrate ) {
				WP_CLI::error( sprintf( 'Post %s does not exist.', $post_id ) );
			}

			if ( ! $dry_run ) {
				$timestamp = time() + 60;

				$entity_processing_position = as_schedule_single_action(
					$timestamp,
					'prc_distributor_queue_block_entity_patching',
					array(
						'post_id' => $post_to_migrate->ID,
					),
					get_current_blog_id() . '_' . $post_id,
				);

				$media_processing_position = as_schedule_single_action(
					$timestamp + 1,
					'prc_distributor_queue_block_media_patching',
					array(
						'post_id' => $post_to_migrate->ID,
						'attachment_id_pairs' => array(),
					),
					get_current_blog_id() . '_' . $post_to_migrate->ID
				);

				WP_CLI::success( sprintf(
					'Post %s scheduled for processing. Entity processing position: %s. Media processing position: %s',
					WP_CLI::colorize( '%G'.$post_to_migrate->ID.'%n' ),
					WP_CLI::colorize( '%R'.$entity_processing_position.'%n' ),
					WP_CLI::colorize( '%R'.$media_processing_position.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'Post %s will be scheduled for processing when run with dry-run trigger safety off.',
					WP_CLI::colorize( '%G'.$post_to_migrate->ID.'%n' ),
				) );
			}

			$this->vip_inmemory_cleanup();

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		/**
		 * A fix for the missing staff posts of old bylines.
		 *
		 * @subcommand bylines-fix
		 * @synopsis [--dry-run]
		 * @return void
		 */
		public function bylines_fix( $args, $assoc_args ) {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			if ( 20 !== get_current_blog_id() ) {
				WP_CLI::error( 'This command must be run from the new pewresearch-org site, site 20.' );
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
			$ignore = array();

			do {
				$query_args = array(
					'taxonomy'         => 'bylines',
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'hide_empty'       => false,
					/// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
					'meta_query' => array(
						array(
							'key' => 'tds_post_id',
							'compare' => 'NOT EXISTS',
						),
					),
					'exclude' => $ignore,
				);

				$terms = get_terms($query_args);

				foreach ( $terms as $term ) {
					// count the number of posts we've migrated as we go.
					$count++;
					WP_CLI::line("Count: $count");

					$create_new = false;
					// Check if a staff post exists with the same name
					$staff_post = wpcom_vip_get_page_by_title( $term->name, OBJECT, 'staff' );
					if ( ! $staff_post ) {
						$create_new = true;
					} else {
						$tds_term_id = get_post_meta( $staff_post->ID, 'tds_term_id', true );
						if ( $tds_term_id ) {
							WP_CLI::line(
								sprintf(
									'%s cant connect to staff post %s (%s) because it is already connected to term %s (%s)',
									WP_CLI::colorize( '%B' . $term->slug . '%n' ),
									WP_CLI::colorize( '%B' . $staff_post->ID . '%n' ),
									WP_CLI::colorize( '%G' . $staff_post->post_name . '%n' ),
									WP_CLI::colorize( '%G' . $tds_term_id . '%n' ),
									WP_CLI::colorize( '%G' . get_term( $tds_term_id )->slug . '%n' ),
								)
							);
							$ignore[] = $term->term_id;
							continue;
							// return new WP_Error( 'term_already_connected', 'This staff post is already connected to a term. Requires further inspection. Term: ' . $term->name . ' Staff Post: ' . $staff_post->ID );
						}
					}
					if ( ! $dry_run ) {
						// Do bylines check and fix
						if ( false === $create_new && isset($staff_post->ID) && isset($term->term_id) ) {
							update_term_meta( $term->term_id, 'tds_post_id', $staff_post->ID );
							update_post_meta( $staff_post->ID, 'tds_term_id', $term->term_id );
							WP_CLI::success( sprintf(
								'%s - %s connected to %s',
								WP_CLI::colorize( '%B' . $staff_post->ID . '%n' ),
								WP_CLI::colorize( '%G' . $term->name . '%n' ),
							) );
						}
						if ( true === $create_new ) {
							// Unhook the TDS post hook so we don't
							remove_action( 'save_post', \TDS\get_save_post_hook( 'staff', 'bylines' ), 10, 2 );

							// Create staff post
							$staff_post = wp_insert_post( array(
								'post_title' => $term->name,
								'post_type' => 'staff',
								'post_status' => 'publish',
							) );

							update_term_meta( $term->term_id, 'tds_post_id', $staff_post );
							update_post_meta( $staff_post, 'tds_term_id', $term->term_id );

							WP_CLI::success( sprintf(
								'%s - %s created and connected to %s',
								WP_CLI::colorize( '%B' . $staff_post . '%n' ),
								WP_CLI::colorize( '%G' . $term->name . '%n' ),
								WP_CLI::colorize( '%G' . $term->term_id . '%n' ),
							) );

							// Re-hook the action
							add_action( 'save_post', \TDS\get_save_post_hook( 'staff', 'bylines' ), 10, 2 );
						}
					} else {
						WP_CLI::success( sprintf(
							'%s - %s will be created and connected to %s when run with dry-run trigger safety off.',
							WP_CLI::colorize( '%B' . $staff_post . '%n' ),
							WP_CLI::colorize( '%G' . $term->name . '%n' ),
							WP_CLI::colorize( '%G' . $term->term_id . '%n' ),
						) );
					}
				}

				// Pause.
				sleep( 5 );

				// Free up memory.
				$this->vip_inmemory_cleanup();

				$paged++;
			} while ( count( $terms ) );

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

	}

	WP_CLI::add_command( 'prc migration', '\PRC\Platform\Migration_CLI_Command' );
}
