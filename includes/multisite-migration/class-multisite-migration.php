<?php
namespace PRC\Platform;

use Exception;
use WP_Error;

class Multisite_Migration {
	public $migration_site_id = null;
	public static $migration_flag_key = '_prc_migrated_post';

	public function __construct() {
		$this->migration_site_id = PRC_MIGRATION_SITE;

		// Attachments Handler
		require_once( __DIR__ . '/types/class-attachment.php' );
		require_once( __DIR__ . '/types/class-multisection-report.php' );
		require_once( __DIR__ . '/types/class-staff-bylines.php' );
		require_once( __DIR__ . '/types/class-block-patcher.php' );
		require_once( __DIR__ . '/types/class-classic-editor-patcher.php' );
		require_once( __DIR__ . '/types/class-pages.php' );
		require_once( __DIR__ . '/types/class-related-posts.php' );
		require_once( __DIR__ . '/class-tools.php' );
		require_once( __DIR__ . '/class-wp-cli-commands.php' );
	}

	/**
	 * A helper function to log messages to the newrelic log if newrelic is loaded, otherwise it will log to the php error log.
	 * @param mixed $message
	 * @return void
	 */
	public static function log($message) {
		if ( extension_loaded('newrelic') && function_exists('newrelic_notice_error') ) {
			\newrelic_notice_error($message);
		} else {
			error_log($message);
		}
	}

	/**
	 * Get the original blog id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_blog_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_blog_id', true);
		// make the value into an integer if it can be.
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	/**
	 * Get the original post id from the post meta.
	 * @param mixed $post_id
	 * @return int|null
	 */
	public function get_original_post_id($post_id) {
		$value = get_post_meta($post_id, 'dt_original_post_id', true);
		if (is_numeric($value)) {
			return intval($value);
		} else {
			return null;
		}
	}

	/**
	 * Handles on-going migration of posts from the original site to the new site.
	 * New content will be migrated automatically at midnight every night.
	 * Posts will be queued at 6pm, capturing everything published between 6pm yesterday and 6pm today.
	 *
	 * @hook prc_run_at_end_of_day
	 */
	public function schedule_midnight_distributor_push() {
		// This shouldn't run on the migration site.
		if ( PRC_MIGRATION_SITE === get_current_blog_id() ) {
			return;
		}
		// At 6pm each day, lets get all the posts published today that dont have $migration_flag_key in their meta.
		// Then we're going to schedule a distributor push for each of them at midnight.
		// Let the date_query be looking for everything from 6pm yesterday to 6pm today.
		$posts = get_posts(
			array(
				'posts_per_page'   => 100, // This is a one time thing, so we can do them all at once.
				'post_type'        => array(
					'staff',
					'chart',
					'dataset',
					'fact-sheets',
					'short-read',
					'interactives',
					'post'
				),
				'post_status'      => 'publish',
				'date_query' => array(
					array(
						'after' => 'yesterday 6pm',
						'before' => 'today 6pm',
						'inclusive' => true,
					)
				),
				/// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
				'meta_query' => array(
					array(
						'key' => '_prc_migrated_post',
						'compare' => 'NOT EXISTS',
					)
				),
			)
		);

		foreach ( $posts as $post ) {
			// We're going to need to check the post type and depending on post type 1.) schedule its time out correctly (charts, staff, and datasets should occur first then everything else)'.
			// $timestamp should be midnight tonight.
			$timestamp = null;
			switch ($post->post_type) {
				case 'staff':
					$timestamp = strtotime('tomorrow midnight');
					break;

				case 'chart':
					$timestamp = strtotime('tomorrow midnight + 5 minutes');
					break;

				case 'dataset':
					$timestamp = strtotime('tomorrow midnight + 10 minutes');
					break;

				default:
					$timestamp = strtotime('tomorrow at 1am');
					break;
			}
			$action = 'prc_distributor_queue_push';
			$args = array(
				'post_id' => $post->ID,
				'push_target' => $this->migration_site_id,
			);
			$group = $this->migration_site_id . '_' . $post->ID;

			$is_next = as_next_scheduled_action($action, $args, $group);
			if (!$is_next) {
				as_schedule_single_action($timestamp, $action, $args, $group);
			}
		}
	}

	/**
	 * The primary action that starts the subsequent actions that handle the migration of a post.
	 * This will push the post to the target site and establish a Distributor connection between the two posts,
	 * so that future updates will be continue to be applied to the new post.
	 *
	 * @hook prc_distributor_queue_push
	 * @param mixed $post_id
	 * @param mixed $target_site_id
	 * @return array|WP_Error|void
	 */
	public function scheduled_distributor_push($post_id, $target_site_id) {
		$migrated = get_post_meta( $post_id, '_prc_migrated_post', true );
		if ( $migrated ) {
			return;
		}
		$distributor = new Distributor( $post_id, $target_site_id );
		$distributed = $distributor->push();

		// now its here that we could schedule follow up tasks to handle things like the media attachments and what not.
		$has_push_errors = array_key_exists('push-errors', $distributed) && !empty($distributed['push-errors']);
		if ( !is_wp_error($distributed) ) {
			update_post_meta( $post_id, '_prc_migrated_post', true );
			update_post_meta( $post_id, '_prc_migrated_new_post_id', $distributed['id'] );
		}

		if ($has_push_errors) {
			update_post_meta( $post_id, '_prc_migrated_post__errors', wp_json_encode($distributed['push-errors']) );
		}

		return $distributed;
	}

	/**
	 * Handles pushing attachments to the target site after a post is migrated and then re-establishing the parent relationship on the target site.
	 *
	 * @hook prc_distributor_queue_attachment_migration
	 * @param mixed $post_id
	 * @param mixed $meta
	 * @return array
	 * @throws Exception
	 */
	public function scheduled_distributor_attachments_push($post_id, $meta) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$attachments = new Attachments_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $attachments->migrate( $meta );
	}

	/**
	 * Handles re-connecting report materials and art-direction attachment meta after migration.
	 *
	 * @hook prc_distributor_queue_attachment_meta_migration
	 * @param mixed $post_id
	 * @param mixed $attachment_id_pairs
	 * @param mixed $meta
	 * @return bool
	 */
	public function scheduled_distributor_attachments_meta_mapping($post_id, $attachment_id_pairs, $meta) {
		$attachments = new Attachments_Migration(
			array('post_id' => null, 'site_id' => null),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $attachments->process_meta_mapping( $attachment_id_pairs, $meta );
	}

	/**
	 * Handle re-connecting post -> child post relationships and multisection report meta after migration.
	 *
	 * @hook prc_distributor_queue_multisection_migration
	 * @param mixed $post_id
	 * @param mixed $meta
	 * @return array
	 */
	public function scheduled_distributor_multisection_report_meta_mapping($post_id,  $meta) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$old_multisection_report = $meta['_multiSectionReport'];
		$multisection_report = new Multisection_Reports_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $multisection_report->process(
			$old_multisection_report
		);
	}

	/**
	 * Handle re-connecting related posts to their new posts after migration.
	 *
	 * prc_distributor_queue_related_posts_migration
	 * @param mixed $post_id
	 * @param mixed $meta
	 * @return WP_Error|true|void
	 */
	public function scheduled_distributor_related_posts_meta_mapping($post_id, $meta) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$old_related_posts = $meta['_relatedPosts'];
		$related_posts = new Related_Posts_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $related_posts->process($old_related_posts);
	}

	/**
	 * Handle re-connecting bylines to their new entities after migration.
	 *
	 * @hook prc_distributor_queue_bylines_migration
	 * @param mixed $post_id
	 * @param mixed $meta
	 * @return false|array
	 */
	public function scheduled_distributor_bylines_mapping($post_id,  $meta) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);

		$legacy_mapping = $meta['_legacy_mapping'];
		if ( empty($legacy_mapping) ) {
			return false;
		}

		$bylines = $meta['_bylines'];
		$acknowledgements = $meta['_acknowledgements'];

		$bylines_migration = new Bylines_Staff_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $bylines_migration->process(
			$legacy_mapping,
			$bylines,
			$acknowledgements
		);
	}

	/**
	 * Handle re-connecting block entitites to their new entities after migration.
	 *
	 * @hook prc_distributor_queue_block_entity_patching
	 * @param mixed $post_id
	 * @return int|WP_Error|true
	 */
	public function scheduled_distributor_block_entity_mapping($post_id) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);

		$block_patcher = new Block_Patcher(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $block_patcher->process_entities();
	}

	/**
	 * Handle re-connecting block entitites to their new entities after migration.
	 *
	 * @hook prc_distributor_queue_classic_editor_patching
	 * @param mixed $post_id
	 * @return int|WP_Error|true
	 */
	public function scheduled_distributor_classic_editor_mapping($post_id) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);

		$classic_patcher = new Classic_Editor_Patcher(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $classic_patcher->process_content();
	}

	/**
	 * Handle re-connecting media blocks to their new attachments after migration.
	 *
	 * @hook prc_distributor_queue_block_media_patching
	 * @param mixed $post_id
	 * @param array $attachment_id_pairs
	 * @return void
	 */
	public function scheduled_distributor_block_media_mapping($post_id, $attachment_id_pairs = array()) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);

		$block_patcher = new Block_Patcher(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $block_patcher->process_media($attachment_id_pairs);
	}

	/**
	 * Handle re-connecting page hierarchy after migration.
	 *
	 * @hook prc_distributor_queue_page_migration
	 * @param mixed $post_id
	 * @return void
	 */
	public function scheduled_distributor_page_mapping($post_id) {
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);

		$page_migration = new Pages_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->migration_site_id)
		);

		return $page_migration->process();
	}

	/**
	 * Handle re-connecting primary category after migration.
	 *
	 * @hook prc_distributor_queue_primary_category_migration
	 * @param mixed $post_id
	 * @param mixed $primary_category_slug
	 * @return int|bool|WP_Error
	 */
	public function scheduled_distributor_primary_category_mapping($post_id, $primary_category_slug) {
		$new_primary_category = get_category_by_slug($primary_category_slug);
		if (empty($new_primary_category)) {
			return new WP_Error('prc_migration_primary_category_not_found', 'The primary category could not be found on the target site.');
		}

		return update_post_meta($post_id, '_yoast_wpseo_primary_category', $new_primary_category->term_id);
	}

}
