<?php
namespace PRC\Platform;

use Exception;
use WP_Error;
use WP_Query;

class Attachments_Migration extends Multisite_Migration {
	public $original_post_id = null;
	public $original_site_id = null;
	public $target_post_id = null;
	public $target_site_id = null;
	public $allow_processing = false;

	public function __construct( $original_post = array(
		'post_id' => null,
		'site_id' => null,
	), $target_post = array(
		'post_id' => null,
		'site_id' => null,
	) ) {
		$this->original_post_id = $original_post['post_id'];
		$this->original_site_id = $original_post['site_id'];
		$this->target_post_id = $target_post['post_id'];
		$this->target_site_id = $target_post['site_id'];

		// if all the values in the original_post array and $target_post array are integers then we can allow processing:
		if (
			is_int($this->original_post_id) &&
			is_int($this->original_site_id) &&
			is_int($this->target_post_id)   &&
			is_int($this->target_site_id)
		) {
			$this->allow_processing = true;
		}
	}

	public function schedule_meta_mapping($attachment_id_pairs, $meta) {
		// Check if a action has already been scheduled for this post and if so cancel it to allow this more recent one to run.
		$is_next = as_next_scheduled_action('prc_distributor_queue_attachment_meta_migration', array(
			'post_id' => $this->target_post_id,
		));
		if ( $is_next ) {
			as_unschedule_action($is_next);
		}
		// Schedule the meta mapping 5 minutes later
		$timestamp = time() + (60 * 4);
		return as_schedule_single_action(
			$timestamp,
			'prc_distributor_queue_attachment_meta_migration',
			array(
				'post_id' => $this->target_post_id,
				'attachment_id_pairs' => $attachment_id_pairs,
				'meta' => $meta,
			),
			get_current_blog_id() . '_' . $this->target_post_id
		);
	}

	/**
	 * @hook prc_distributor_queue_block_media_patching
	 * @param mixed $attachment_id_pairs
	 * @return void
	 * @throws Exception
	 */
	public function schedule_block_media_matching($attachment_id_pairs) {
		// Check if a action has already been scheduled for this post and if so cancel it to allow this more recent one to run.
		$is_next = as_next_scheduled_action('prc_distributor_queue_block_media_patching', array(
			'post_id' => $this->target_post_id,
		));
		if ( $is_next ) {
			as_unschedule_action($is_next);
		}
		// Schedule the block media matching 5 minutes later
		$timestamp = time() + (60 * 4);
		return as_schedule_single_action(
			$timestamp,
			'prc_distributor_queue_block_media_patching',
			array(
				'post_id' => $this->target_post_id,
				'attachment_id_pairs' => $attachment_id_pairs,
			),
			get_current_blog_id() . '_' . $this->target_post_id
		);
	}

	/**
	 * Copy attachments from the source site to the target site, without checking for existing attachments.
	 * @param array $meta
	 * @return array
	 * @throws Exception
	 */
	public function migrate($meta = array()) {
		return $this->process($meta, false);
	}

	/**
	 * Copy attachments from the source site to the target site.
	 * @param mixed $post_id
	 * @param mixed $source_site_id
	 * @return array
	 */
	public function process( $meta = array(), $check_for_existing = false ) {
		if ( true !== $this->allow_processing ) {
			parent::log("UHOH: Attachments::process() called without all required arguments.");
			return new WP_Error( 'prc_attachments_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		parent::log('Processing attachments for post ' . $this->original_post_id . ' from site ' . $this->original_site_id . ' to post ' . $this->target_post_id . ' on site ' . $this->target_site_id);

		$attachment_id_pairs = array();
		switch_to_blog($this->original_site_id);
		$attached_media = get_attached_media(
			get_allowed_mime_types(),
			$this->original_post_id
		);
		// Lets hack on some metadata to these attachments.
		if ( $attached_media ) {
			$attached_media = array_map( function( $media ) {
				$alt_text = get_post_meta($media->ID, '_wp_attachment_image_alt', true);
				$filename = get_post_meta($media->ID, '_wp_attached_file', true);

				$media->alt_text = $alt_text;
				$media->filename = basename($filename);

				return $media;
			}, $attached_media );
		}
		restore_current_blog();

		if ( empty($attached_media) ) {
			return new WP_Error( 'no_attachments', __( 'No attachments found.', 'prc' ) );
		}

		foreach($attached_media as $attachment) {
			$payload = (array) $attachment;
			// Reassign the outgoing attachment to the new post parent.
			$payload['post_parent'] = $this->target_post_id;
			// Remove the ID so that it will be created as a new attachment.
			unset($payload['ID']);
			// Remove the guid so that it will be created as a new attachment.
			unset($payload['guid']);
			$payload['_wp_attachment_image_alt'] = isset($attachment->alt_text) ? $attachment->alt_text : null;
			$payload['_attachment_name'] = isset($attachment->filename) ? $attachment->filename : null;
			$payload['_prc_migration_origin_object_id'] = $attachment->ID;

			// Store pair of old id and new id.
			$attachment_id_pairs[$attachment->ID] = $this->copy_attachment($payload, $check_for_existing);
		}

		$meta_position = $this->schedule_meta_mapping($attachment_id_pairs, $meta);
		$media_matching_position = $this->schedule_block_media_matching($attachment_id_pairs);

		if ( ! $meta_position ) {
			return new WP_Error( 'prc_attachments_scheduling_failed', __( 'Failed to schedule attachment meta mapping.', 'prc' ) );
		}

		if ( ! $media_matching_position ) {
			return new WP_Error( 'prc_attachments_scheduling_failed', __( 'Failed to schedule block media matching.', 'prc' ) );
		}

		return true;
	}

	public function copy_attachment($attachment, $check_for_existing = false) {
		// Lets get all the attachment details.
		$attachment_date = $attachment['post_date'];
		$attachment_name = $attachment['_attachment_name']; // Get image name
		$upload_dir = wp_upload_dir($attachment_date); // Get upload directory
		$target_filename = $upload_dir['path'] . '/' . $attachment_name; // Set target path

		$new_attachment_args = array(
			'guid' => $upload_dir['url'] . '/' . $attachment_name,
			'post_mime_type' => $attachment['post_mime_type'],
			'post_title' => $attachment['post_title'],
			'post_name' => $attachment_name,
			'post_content' => '',
			'post_date' => $attachment_date,
			'post_author' => $attachment['post_author'],
			'meta_input' => array(
				'_wp_attachment_image_alt' => $attachment['_wp_attachment_image_alt'],
				'_prc_migration_origin_object_id' => $attachment['_prc_migration_origin_object_id'],
				'_prc_migration_origin_site_id' => $this->original_site_id,
			),
		);

		if ( $check_for_existing ) {
			// Check if attachment already exists.
			$existing_attachment = new WP_Query( array(
				'post_type' => 'attachment',
				'post_status' => 'any',
				'meta_query' => array(
					array(
						'key' => '_prc_migration_origin_object_id',
						'value' => $attachment['_prc_migration_origin_object_id'],
					),
					array(
						'key' => '_prc_migration_origin_site_id',
						'value' => $this->original_site_id,
					),
				),
				'posts_per_page' => 1,
				'fields' => 'ids',
			) );
			if ( $existing_attachment->have_posts() ) {
				// If it does, lets just return the ID.
				return $existing_attachment->posts[0];
			}
		}

		// Insert attachment into target site.
		$new_attachment_id = wp_insert_attachment(
			$new_attachment_args,
			$target_filename,
			$this->target_post_id,
			true
		);

		// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
		require_once( ABSPATH . 'wp-admin/includes/image.php' );

		// Generate the metadata for the attachment, and update the database record.
		$attach_data = wp_generate_attachment_metadata( $new_attachment_id, $target_filename );
		wp_update_attachment_metadata( $new_attachment_id, $attach_data );

		return $new_attachment_id; // Return new attachment ID
	}

	public function process_meta_mapping( $attachment_id_pairs, $meta ) {
		// Lets story a copy of the attachment id pairs for this instance, hence why we're "adding" not updating and why we've set the "unique" param to false.
		add_post_meta( $this->target_post_id, '_prc_migration_attachment_id_pairs', $attachment_id_pairs, false );
		// This should run on pretty much all post types.
		$art_direction = $meta['_artDirection'];
		// @TODO: make this separate so it only runs on `post` post types.
		$report_materials = $meta['_reportMaterials'];
		// @TODO: make this separate so it only runs on `dataset` post types.
		$dataset_file_id = $meta['_dataset_download'];

		$new_art_direction = $this->handle_art_direction_mapping( $attachment_id_pairs, $art_direction );
		$success = false;
		if ( ! empty( $new_art_direction ) ) {
			$success = update_post_meta( $this->target_post_id, 'artDirection', $new_art_direction );
		}

		$report_materials = $this->handle_report_materials_mapping( $attachment_id_pairs, $report_materials );
		if ( ! empty( $report_materials ) ) {
			$success = update_post_meta( $this->target_post_id, 'reportMaterials', $report_materials );
		}

		$new_dataset_file_id = $this->handle_dataset_file_id_mapping( $attachment_id_pairs, $dataset_file_id );
		// We should check, if theres no id then we should proceed to check for the url and set that instead...
		if ( ! empty( $new_dataset_file_id ) ) {
			$success = update_post_meta( $this->target_post_id, 'dataset_download', $new_dataset_file_id );
		}

		return boolval( $success );
	}

	private function handle_report_materials_mapping( $attachment_id_pairs, $original_report_materials ) {
		if ( empty( $attachment_id_pairs ) || empty( $original_report_materials ) ) {
			return false;
		}

		$new_report_materials = array();

		foreach ($original_report_materials as $report_material) {
			$new_attachment_id = null;
			$original_attachment_id = $report_material['attachmentId'];
			if ( array_key_exists($original_attachment_id, $attachment_id_pairs) ) {
				$new_attachment_id = $attachment_id_pairs[$original_attachment_id];
			}

			if ( null === $new_attachment_id ) {
				continue;
			}

			// Replace the original attachment id with the new one
			$report_material['attachmentId'] = $new_attachment_id;
			// Replace the original url with the new url
			$report_material['url'] = wp_get_attachment_url($new_attachment_id);

			$new_report_materials[] = $report_material;
		}

		if ( !empty($new_report_materials) ) {
			return $new_report_materials;
		} else {
			return $original_report_materials;
		}
	}

	private function handle_art_direction_mapping( $attachment_id_pairs, $original_art_direction ) {
		if ( empty( $attachment_id_pairs ) || empty( $original_art_direction ) ) {
			return false;
		}

		$new_art_direction = array();

		foreach ($original_art_direction as $image_size => $art) {
			$new_attachment_id = null;
			$original_attachment_id = $art['id'];
			if ( array_key_exists($original_attachment_id, $attachment_id_pairs) ) {
				$new_attachment_id = $attachment_id_pairs[$original_attachment_id];
			}

			if ( null === $new_attachment_id ) {
				continue;
			}

			// Replace the original attachment id with the new one
			$art['id'] = $new_attachment_id;
			// Replace the original url with the new url
			$art['url'] = wp_get_attachment_image_url($new_attachment_id, $image_size);
			$art['rawUrl'] = wp_get_attachment_url($new_attachment_id);

			$new_art_direction[$image_size] = $art;
		}

		if ( !empty($new_art_direction) ) {
			return $new_art_direction;
		} else {
			return $original_art_direction;
		}
	}

	private function handle_dataset_file_id_mapping( $attachment_id_pairs, $original_dataset_file_id ) {
		parent::log("handle_dataset_file_id_mapping" . print_r($attachment_id_pairs, true));

		if ( empty( $attachment_id_pairs ) || empty( $original_dataset_file_id ) ) {
			return false;
		}

		$new_attachment_id = null;
		$original_attachment_id = $original_dataset_file_id;
		if ( array_key_exists($original_attachment_id, $attachment_id_pairs) ) {
			$new_attachment_id = $attachment_id_pairs[$original_attachment_id];
		}

		if ( null === $new_attachment_id ) {
			return false;
		}

		return $new_attachment_id;
	}
}
