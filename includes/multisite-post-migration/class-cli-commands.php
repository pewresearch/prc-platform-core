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

		/**
		 * Clears Yoast Redirects
		 *
		 * @subcommand clear-yoast-redirects
		 */
		public function clear_yoast_redirects() {
			// clear the values from wp_20_options wpseo-premium-redirects-export-regex, wpseo-premium-redirects-export-regex-plain, and wpseo-premium-redirects-base
			update_option( 'wpseo-premium-redirects-export-regex', '' );
			update_option( 'wpseo-premium-redirects-export-regex-plain', '' );
			update_option( 'wpseo-premium-redirects-base', '' );
		}

		protected function delete_action_from_ac_log($action_id) {
			global $wpdb;
			$wpdb->delete( $wpdb->prefix . 'actionscheduler_logs', array( 'action_id' => $action_id ) );
			$wpdb->delete( $wpdb->prefix . 'actionscheduler_actions', array( 'action_id' => $action_id ) );
		}

		/**
		 * Re-runs failed prc_distributor_queue_attachment_migration action
		 *
		 * @subcommand re-run-failed-attachments-migration
		 */
		public function re_run_failed_attachments_migration() {
			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$this->vip_inmemory_cleanup();

			$paged = 1;

			$failed_actions = as_get_scheduled_actions(array(
				'hook' => 'prc_distributor_queue_attachment_migration',
				'status' => 'failed',
				'per_page' => 200,
				'page' => $paged,
			));

			// Free up memory.
			$this->vip_inmemory_cleanup();

			foreach ( $failed_actions as $action_id => $action ) {
				$group = $action->get_group();
				$site_id = explode('_', $group)[0];
				$original_post_id = explode('_', $group)[1];
				$post_id = explode('_', $group)[2];
				$hook = $action->get_hook();
				$args = $action->get_args();
				WP_CLI::line( '🔧 Re-running failed attachments action: ' . $group . '::' .print_r($args, true) );
				// 30 seconds into the future...
				$timestamp = time() + 30;
				$this->delete_action_from_ac_log($action_id);
				$scheduled = as_schedule_single_action($timestamp, $hook, $args, $group, false);
				if ( 0 !== $scheduled ) {
					WP_CLI::success( '👍 Re-scheduled failed attachments action: ' . $group . '::' .print_r($args, true) );
				}
			}


			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}

		protected function update_attachment_links_in_post($post_id) {
			$attachment_id_pairs = get_post_meta($post_id, '_prc_migration_attachment_id_pairs', true);
			$blocks = parse_blocks( get_post($post_id)->post_content );
			$new_blocks = $this->parse_blocks_for_media_new($blocks, $attachment_id_pairs);
			$new_content = serialize_blocks($new_blocks);
			$post_data = array(
				'ID'           => $post_id,
				'post_content' => $new_content,
			);
			wp_update_post( $post_data );
		}

		protected function parse_blocks_for_media_new($blocks, $attachment_id_pairs) {
			$new_blocks = array();
			error_log(print_r(['blocks' => $blocks, 'attachment_id_pairs' => $attachment_id_pairs], true));

			foreach($blocks as $block) {
				if ( ! empty( $block['innerBlocks'] ) ) {
					$block['innerBlocks'] = $this->parse_blocks_for_media_new( $block['innerBlocks'], $attachment_id_pairs );
				}

				if ( 'core/image' === $block['blockName']) {
					// We may want to see what attachments have already been brought over here...
					$old_reference_id = $block['attrs']['id'];
					$new_reference_id = null;
					// We want to use wp tag processor to get the img src...
					$old_img_src = null;

					$tags = new \WP_HTML_Tag_Processor($block['innerHTML']);
					if ( $tags->next_tag( 'img' ) ) {
						$old_img_src = $tags->get_attribute( 'src' );
					}

					// check $attachment_id_pairs has a key with the old_reference_id
					if ( isset( $attachment_id_pairs[ $old_reference_id ] ) ) {
						$new_reference_id = $attachment_id_pairs[ $old_reference_id ];
					} else {
						// get the domain and the path from $old_img_src
						$domain = parse_url($old_img_src, PHP_URL_HOST);
						$path = parse_url($old_img_src, PHP_URL_PATH);
						$site_ids = [
							'global/' => 2,
							'social-trends/' => 3,
							'politics/' => 4,
							'hispanic/' => 5,
							'religion/' => 7,
							'journalism/' => 8,
							'internet/' => 9,
							'methods/' => 10,
							'science/' => 16,
							'race-ethnicity/' => 18,
							'decoded/' => 19,
							'pewresearch-org/' => 20,
						];
						// get the approrpriate site_id based on whether the $path contains the key of the $site_ids
						$site_id = null;
						foreach ($site_ids as $key => $value) {
							if (strpos($path, $key) !== false) {
								$site_id = $value;
								break;
							}
						}

						// So if the attachment id is not in the attachment id pairs, this may because were reference the NEW attachment id's being run on site 20.
						if ( null === $site_id ) {
							continue;
						}

						switch_to_blog($site_id);
						$attachment_id = \wpcom_vip_attachment_url_to_postid($old_img_src);
						// check that the attachment end of the file the /year/month/filename is the same as the old_img_src
						$attachment_url = wp_get_attachment_url($attachment_id);
						if ( false === $attachment_url ) {
							continue;
						}
						$attachment_url_parts = wp_parse_url($attachment_url);
						$attachment_path = $attachment_url_parts['path'];
						$old_img_src_parts = wp_parse_url($old_img_src);
						$old_img_src_path = $old_img_src_parts['path'];
						if ( $attachment_path === $old_img_src_path ) {
							$new_reference_id = $attachment_id;
						}
						restore_current_blog();

						if ( null !== $new_reference_id ) {
							$attachment_id_pairs[ $old_reference_id ] = $new_reference_id;
						} else {
							$posts = get_posts(array(
								'post_type' => 'attachment',
								'posts_per_page' => 1,
								'fields' => 'ids',
								'meta_query' => array(
									array(
										'key' => '_prc_migration_origin_object_id',
										'value' => $old_reference_id,
										'compare' => '=',
									),
									array(
										'key' => '_prc_migration_origin_site_id',
										'value' => $site_id,
										'compare' => '=',
									),
								),
							));
							error_log("PSOTS:".print_r($posts,true));
							if ( !empty($posts) ) {
								$new_reference_id = $posts[0];
							}
						}
					}

					// If we can find something well change it, otherwise we'll just leave it alone.
					if ( null !== $new_reference_id ) {
						$new_href = get_attachment_link( $new_reference_id );

						$size_slug = isset($block['attrs']['sizeSlug']) ? $block['attrs']['sizeSlug'] : 'full';
						$img_src = wp_get_attachment_image_src( $new_reference_id, $size_slug );
						$new_src = isset($img_src[0]) ? $img_src[0] : null;

						$tags = new \WP_HTML_Tag_Processor($block['innerHTML']);

						// Go get the <a> tag and change its href to the new href.
						if ( $new_href && $tags->next_tag( 'a' ) ) {
							$tags->set_attribute('rel', 'attachment wp-att-' . $new_reference_id);
							$tags->set_attribute( 'href', $new_href );
						};

						// Go get the img tag, look at the src attribute and change it to the new src.
						if ( $new_src && $tags->next_tag( 'img' ) ) {
							$img_src_updated = $tags->set_attribute( 'src', $new_src );

							// replace any wp-image-<old_id> with wp-image-<new_reference_id>
							$old_classname = $tags->get_attribute( 'class' );
							$new_classname = str_replace('wp-image-' . $old_reference_id, 'wp-image-' . $new_reference_id, $old_classname);
							$tags->set_attribute( 'class', $new_classname );
						}

						// Update the id attribute by looking it up by blockname.
						$block['attrs']['id'] = $new_reference_id;
						// Finally, update the innerHTML to this new content.
						$new_inner_html = $tags->get_updated_html();
						$block['innerHTML'] = $new_inner_html;
						$block['innerContent'][0] = $new_inner_html;
					} else {
						$block['attrs']['unmigrated'] = true;
					}
				}

				$new_blocks[] = $block;
			}

			return $new_blocks;
		}

		/**
		 * Fix Incorrect Attachment Links
		 *
		 * @subcommand fix-attachment-links
		 * @synopsis --id=<id> [--dry-run]
		 */
		public function fix_incorrect_attachment_links( $args, $assoc_args ) {
			if ( isset( $assoc_args['id'] ) ) {
				$post_id = $assoc_args['id'];
			} else {
				WP_CLI::error( 'Must have --id defined.' );
			}

			$this->update_attachment_links_in_post($post_id);
		}

	}

	WP_CLI::add_command( 'prc post-migration', '\PRC\Platform\Post_Migration_CLI_Commands' );
}
