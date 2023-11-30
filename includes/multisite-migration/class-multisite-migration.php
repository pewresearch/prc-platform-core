<?php
namespace PRC\Platform;

use Exception;
use WP_Error;

class Multisite_Migration {
	public $migration_site_id = null;
	public static $migration_flag_key = '_prc_migrated_post';

	public function __construct() {
		$this->migration_site_id = PRC_PRIMARY_SITE_ID;

		// Attachments Handler
		require_once( __DIR__ . '/types/class-attachment.php' );
		require_once( __DIR__ . '/types/class-multisection-report.php' );
		require_once( __DIR__ . '/types/class-staff-bylines.php' );
		require_once( __DIR__ . '/types/class-block-patcher.php' );
		require_once( __DIR__ . '/types/class-classic-to-blocks.php');
		require_once( __DIR__ . '/types/class-related-posts.php' );
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
	 * The primary action that starts the subsequent actions that handle the migration of a post.
	 * This will PULL updates to the post and clean up any data that needs to be cleaned up.
	 *
	 * @hook prc_migration_pull_and_replace
	 * @param mixed $post_id
	 * @return array|WP_Error|void
	 */
	public function scheduled_distributor_push($post_id) {
		// Give the post id we need to first check that it has a original blog id and original post id.
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		if (empty($original_site_id) || empty($original_post_id)) {
			return new WP_Error('prc_migration_missing_original_ids', 'The original blog id or original post id is missing from the post meta.');
		}

		// First we need to gather up some information that we can pass down to each subsequent action:
		// 1. Lets get all the attachments associated with this post into an array.
		// 2. Lets get all the images that should be associated with this post from its post content into an array. Account for blocks, account for classic editor html content when searching for images...
		// 3. We'll get the attachment id's for report materials and for art direction.
		// Combine all these into unique attachment id's and urls.

		// 3. Get all the currently assigned taxonomy terms for this post.
		// 4. Get the currently set primay category/topic term for this post.

		// Then we're going to switch into the original_site_id and get the original_post_id post.
		// 1. We'll get all the attachments associated with this post into an array.
		// 2. We'll get all the images that should be associated with this post from its content just like above.
		// 3. We'll get all the attachment ids in report materials and in art direction and make sure they are in the attachments array. If not we'll add them to the attachments array.
		// Combine all these into unique attachment id's and urls.

		// 3. We'll check the images that we found in the content against the attachments we found properly attached and make sure its 1:1. If not we'll make an array of the images from the content missing from the attachments array. We'll also make an array of any matching new post attachment id's paired with their old post attachment id's so that we can run simple updates against these attachments later. For the missing one's we'll copy those over.
		// 4. We'll get the post content and determine if its blocks or not. If its block we'll run one class to update things. If its classic we'll run another.
		// BLOCK CONTENT FIXES:
		// 1. Search for [footnotes] and replace these with <sup> wp footnotes markup and then construct post meta that has the gutenberg footnotes structure.
		// 2. Run through image blocks and patch the media id's and sources and links to their new attachment ids and such.
		// CLASSIC CONTENT FIXES:
		// 1. Update all the current content to blocks. Along the way this class will update shortcodes to their new blocks and such.
		// 2. During the conversion process also run through images and convert to blocks with the new image data.
		//
		// 5. We'll ensure the taxonomy term slugs match (account for our {taxonomy}_ slug schema on non migration site). If not then we'll make sure the term exists on the target site if not then we'll create it, otherwise we'll just get the term id and update the post with the new term id.
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
