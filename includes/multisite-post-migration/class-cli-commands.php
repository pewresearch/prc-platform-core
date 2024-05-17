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

		/**
		 * Follow up cleanup
		 *
		 * @subcommand cleanup-duplicate-bylines
		 * @synopsis --duplicate=<duplicate-byline> --canonical=<canonical-byline> [--dry-run]
		 */
		public function cleanup_duplicate_bylines( $args, $assoc_args ) {
			$duplicate_byline = $assoc_args['duplicate'];
			$canonical_byline = $assoc_args['canonical'];

			$duplicate_byline_term = get_term_by('slug', $duplicate_byline, 'bylines');
			$canonical_byline_term = get_term_by('slug', $canonical_byline, 'bylines');

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
				WP_CLI::line( '☠️ Callback armed and ready' );
			}

			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$posts_per_page = 200;
			$count = 0; // We'll use this to count the number of posts we've migrated as we go.
			$paged = 1;

			do {
				// get all objects that have the duplicate byline and assign them to the canonical byline
				$query_args = array(
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'post_type'        => '', // All post types
					'post_status'      => array('publish', 'public', 'hidden_from_search', 'hidden_from_index'),
					'tax_query'        => array(
						array(
							'taxonomy' => 'bylines',
							'field'    => 'slug',
							'terms'    => $duplicate_byline,
						),
					),
				);

				$posts = get_posts($query_args);

				foreach ( $posts as $post ) {
					// count the number of posts we've migrated as we go.
					$count++;

					$bylines = get_post_meta( $post->ID, 'bylines', true );

					// This updates the bylines values in post meta to match the new term as well.
					// $bylines is an array of arrays, each array has a termId and a key. Check if the $duplicate_byline->term_id (if that property exists) is in the bylines array. If so, replace the termId with the $canonical_byline->term_id( if that property exists).
					if ( is_array( $bylines ) ) {
						$bylines = array_map( function( $byline ) use ( $duplicate_byline_term, $canonical_byline_term ) {
							if ( isset( $byline['termId'] ) && $byline['termId'] === $duplicate_byline_term->term_id ) {
								$byline['termId'] = $canonical_byline_term->term_id;
							}
							return $byline;
						}, $bylines );
					}

					WP_CLI::line( '🔧 Cleaning up duplicate byline: ' . $post->ID . '::' . $post->post_name );
					WP_CLI::line( '🔧 Assigning canonical byline: ' . $canonical_byline );
					WP_CLI::line( '🔧 Removing duplicate byline: ' . $duplicate_byline );
					WP_CLI::line( '🔧 Updating bylines in post meta: ' . print_r($bylines, true) );

					if ( ! $dry_run ) {
						// Do the thing
						wp_set_object_terms( $post->ID, $canonical_byline, 'bylines', true );
						// Remove the duplicate byline
						wp_remove_object_terms( $post->ID, $duplicate_byline, 'bylines' );
						// Update the bylines in post meta
						update_post_meta( $post->ID, 'bylines', $bylines );
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
					'🧼 %s objects are currently being cleaned.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'🧼 Dry run complete. %s objects were not cleaned at this time as the safety is still engaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}


		/**
		 * Follow up cleanup
		 *
		 * @subcommand cleanup-duplicate-datasets
		 * @synopsis [--dry-run]
		 */
		public function cleanup_duplicate_datasets( $args, $assoc_args ) {
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
				WP_CLI::line( '☠️ Callback armed and ready' );
			}

			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$posts_per_page = 200;
			$count = 0; // We'll use this to count the number of posts we've migrated as we go.
			$paged = 1;

			do {
				$query_args = array(
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'post_type'        => 'dataset', // All post types
					'post_status'      => array('publish', 'public', 'hidden_from_search', 'hidden_from_index'),
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

					$post_name = $post->post_name;
					$duplicate = false;
					// check if $post_name has a -{single digit number} at the end but not if its more than a single digit
					if ( preg_match( '/-(2|3|4|5|6|7|8)$/', $post_name ) ) {
						$duplicate = true;
						// check if "wave-{number}-{number} is int he post_name
						if ( preg_match( '/wave-\d+-\d+/', $post_name ) ) {
							$duplicate = true;
						} elseif ( preg_match( '/wave-(2|3|4|5|6|7|8|9)/', $post_name ) ) {
							$duplicate = false;
						} else {
							$duplicate = true;
						}
					}

					if ( $duplicate ) {
						WP_CLI::line( '🔧 Cleaning up duplicate dataset: ' . $post->ID . '::' . $post->post_name );
						if ( ! $dry_run ) {
							// delete the post
							wp_delete_post( $post->ID );
						}
					}

					if ( ! $dry_run ) {
						wp_set_object_terms( $post->ID, 'dataset', 'formats', false );
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
					'🧼 %s objects are currently being cleaned.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'🧼 Dry run complete. %s objects were not cleaned at this time as the safety is still engaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}



		/**
		 * Follow up cleanup
		 *
		 * @subcommand cleanup-page-templates
		 * @synopsis [--dry-run]
		 */
		public function cleanup_page_templates( $args, $assoc_args ) {
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
				WP_CLI::line( '☠️ Callback armed and ready' );
			}

			// Disable term counting, Elasticsearch indexing, and PushPress.
			$this->start_bulk_operation();

			$posts_per_page = 200;
			$count = 0; // We'll use this to count the number of posts we've migrated as we go.
			$paged = 1;

			do {
				$query_args = array(
					'posts_per_page'   => $posts_per_page,
					'paged'            => $paged,
					'post_type'        => 'page', // All post types
					'post_status'      => array('publish', 'public', 'draft', 'pending', 'private', 'future'),
					'meta_key'         => '_wp_page_template',
					'meta_compare'     => 'EXISTS',
				);

				$posts = get_posts($query_args);

				foreach ( $posts as $post ) {
					// count the number of posts we've migrated as we go.
					$count++;

					WP_CLI::line( '🔧 Cleaning up page template: ' . $post->ID . '::' . $post->post_name );
					if ( ! $dry_run ) {
						delete_post_meta( $post->ID, '_wp_page_template' );
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
					'🧼 %s objects are currently being cleaned.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
				) );
			} else {
				WP_CLI::success( sprintf(
					'🧼 Dry run complete. %s objects were not cleaned at this time as the safety is still engaged, run with %s to turn off trigger safety.',
					WP_CLI::colorize( '%G'.$count.'%n' ),
					WP_CLI::colorize( '%R--dry-run=false%n' ),
				) );
			}

			// Trigger a term count as well as trigger bulk indexing of Elasticsearch site.
			$this->end_bulk_operation();
		}


		// WORK IN PROGRESS::::



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
