<?php
namespace PRC\Platform;

use Exception;
use WP_Error;
use WP_Term_Query;

class Multisite_Migration {
	public $primary_site_id = null;
	public static $migration_flag_key = '_prc_migrated_post';

	public function __construct() {
		$this->primary_site_id = PRC_PRIMARY_SITE_ID;
		require_once( __DIR__ . '/types/class-attachment.php' );
		require_once( __DIR__ . '/types/class-multisection-report.php' );
		require_once( __DIR__ . '/types/class-staff-bylines.php' );
		require_once( __DIR__ . '/types/class-block-patcher.php' );
		require_once( __DIR__ . '/types/class-related-posts.php' );
	}

	/**
	 * A helper function to log messages to the newrelic log if newrelic is loaded, otherwise it will log to the php error log.
	 * @param mixed $message
	 * @return void
	 */
	public static function log($message) {
		log_error($message);
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
	 * Handles pushing attachments to the target site after a post is migrated and then re-establishing the parent relationship on the target site.
	 *
	 * @hook prc_distributor_queue_attachment_migration
	 * @param mixed $post_id
	 * @param mixed $meta
	 * @return array
	 * @throws Exception
	 */
	public function scheduled_distributor_attachments_push($post_id, $meta) {
		self::log("scheduled_distributor_attachments_push: " . $post_id . print_r($meta, true));
		$original_site_id = $this->get_original_blog_id($post_id);
		$original_post_id = $this->get_original_post_id($post_id);
		$attachments = new Attachments_Migration(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id)
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
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id)
		);

		return $attachments->process_meta_mapping( $attachment_id_pairs, $meta );
	}

	/**
	 * @hook prc_distributor_queue_interactives_rewrites_migration
	 */
	public function scheduled_distributor_interactives_rewrites_mapping($post_id, $meta) {

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
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id)
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
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id)
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
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id)
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
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id),
			function($msg) {
				self::log($msg);
			}
		);

		return $block_patcher->process_entities();
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

		//_prc_migration_attachment_id_pairs

		$block_patcher = new Block_Patcher(
			array('post_id' => $original_post_id, 'site_id' => $original_site_id),
			array('post_id' => $post_id, 'site_id' => $this->primary_site_id),
			function($msg) {
				self::log($msg);
			}
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
	public function scheduled_distributor_primary_category_mapping($post_id, $primary_category_term_id) {
		// do a tax query for _prc_original_term_id equal to primary_category_term_id and get the new term id
		$categories = new WP_Term_Query(array(
			'taxonomy' => 'category',
			'fields' => 'ids',
			'meta_query' => array(
				array(
					'key' => '_prc_original_term_id',
					'value' => $primary_category_term_id,
					'compare' => '='
				)
			)
		));
		if (empty($categories->terms)) {
			return new WP_Error('prc_migration_primary_category_not_found', 'The primary category could not be found on the target site.');
		}
		$new_primary_category = $categories->terms[0];
		if (empty($new_primary_category)) {
			return new WP_Error('prc_migration_primary_category_not_found', 'The primary category could not be found on the target site.');
		}
		return update_post_meta($post_id, '_yoast_wpseo_primary_category', $new_primary_category->term_id);
	}

}
