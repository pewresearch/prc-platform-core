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
		$group = $this->original_site_id . '_' . $this->original_post_id . '_' . $this->target_post_id;
		return as_schedule_single_action(
			$timestamp,
			'prc_distributor_queue_attachment_meta_migration',
			array(
				'post_id' => $this->target_post_id,
				'attachment_id_pairs' => $attachment_id_pairs,
				'meta' => $meta,
			),
			$group,
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
		$group = $this->original_site_id . '_' . $this->original_post_id . '_' . $this->target_post_id;
		return as_schedule_single_action(
			$timestamp,
			'prc_distributor_queue_block_media_patching',
			array(
				'post_id' => $this->target_post_id,
				'attachment_id_pairs' => $attachment_id_pairs,
			),
			$group
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
	 * Copy attachments from the source site to the target site and build an array of attachment_id_pairs, mapping the old attachment id to the new id.
	 * @param mixed $post_id
	 * @param mixed $source_site_id
	 * @return array
	 */
	public function process( $meta = array(), $check_for_existing = false ) {
		if ( true !== $this->allow_processing ) {
			parent::log("UHOH: Attachments::process() called without all required arguments. " . $this->original_post_id . ' ' . $this->original_site_id . ' ' . $this->target_post_id . ' ' . $this->target_site_id);
			return new WP_Error( 'prc_attachments_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		parent::log('Processing attachments for post ' . $this->original_post_id . ' from site ' . $this->original_site_id . ' to post ' . $this->target_post_id . ' on site ' . $this->target_site_id);

		$attachment_id_pairs = array();
		switch_to_blog($this->original_site_id);
		$attached_media = get_attached_media(
			'',
			$this->original_post_id
		);
		$attached_media_ids = array_map(function($media) {
			return $media->ID;
		}, $attached_media);
		// This is media that should be copied over, but not attached.
		if ( isset($meta['_artDirection']) ) {
			$art_direction = $meta['_artDirection'];
			$art_direction_ids = [];
			foreach($art_direction as $size => $image) {
				$art_direction_ids[] = $image['id'];
			}
			$art_direction_ids = array_unique($art_direction_ids);
			$art_direction_ids = array_diff($art_direction_ids, $attached_media_ids);
			// This is media that is not in the attachments array, but should be copied over. As such we're dropping the is_unattached flag on these.
			$art_direction_media = array_map(function($id) {
				$media = get_post($id);
				if ( !is_wp_error($media) ) {
					$media = (array) $media;
					$media['is_unattached'] = true;
					return (object) $media;
				} else {
					return null;
				}
			}, $art_direction_ids);
			$attached_media = array_merge($attached_media, $art_direction_media);
		}
		if ( isset($meta['_featured_image_id']) && false !== $meta['_featured_image_id'] ) {
			$featured_image_id = $meta['_featured_image_id'];
			if ( ! in_array($featured_image_id, $attached_media_ids) ) {
				if ( 0 !== $featured_image_id ) {
					$featured_image = get_post($featured_image_id);
					if ( !is_wp_error($featured_image) ) {
						$attached_media[] = $featured_image;
					}
				}
			}
		}
		// Lets hack on some metadata to these attachments.
		if ( $attached_media ) {
			$attached_media = array_map( function( $media ) {
				$alt_text = get_post_meta($media->ID, '_wp_attachment_image_alt', true);
				$filename = get_post_meta($media->ID, '_wp_attached_file', true);
				// check if $filename ends in -jpg.webp, if so we should remove that and just use the jpg version.
				$filename = preg_replace('/-jpg\.webp$/', '.jpg', $filename);

				$media->alt_text = $alt_text;
				$media->filename = basename($filename);
				// get the full file url for the media
				// $file_url = wp_get_attachment_image_src($media->ID, 'full');
				// $file_url = false !== $file_url ? $file_url[0] : null;
				// $media->_old_guid = $file_url;
				$media->_old_guid = get_the_guid($media->ID);

				return $media;
			}, $attached_media );
		}
		restore_current_blog();

		if ( empty($attached_media) ) {
			parent::log("No attachments found for post " . $this->original_post_id . " on site " . $this->original_site_id);
			return new WP_Error( 'no_attachments', __( 'No attachments found.', 'prc' ) );
		}

		foreach($attached_media as $attachment) {
			$payload = (array) $attachment;
			$is_unattached = array_key_exists('is_unattached', $payload) ? $payload['is_unattached'] : false;
			// Reassign the outgoing attachment to the new post parent.
			$payload['post_parent'] = true === $is_unattached ? 0 : $this->target_post_id;
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

		// With completed array of attachment id pairs we should now schedule meta and core/image block operations to run.
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

	public function generate_attachment_metadata($attachment_id) {
		$meta = wp_get_attachment_metadata( $attachment_id );
		$meta['sizes'] = [];
		$meta['file'] = basename( get_attached_file( $attachment_id ) );
		return wp_update_attachment_metadata( $attachment_id , $meta );
	}

	public function copy_attachment($attachment, $check_for_existing = false) {
		// Lets get all the attachment details.
		$attachment_date = $attachment['post_date'];
		$attachment_name = $attachment['_attachment_name']; // Get image name

		// lets get the old guid...
		$old_guid = $attachment['_old_guid'];
		// remove the old guid from the attachment array
		unset($attachment['_old_guid']);
		// check if the $old_guid is in a format like this: https://prc-platform.vipdev.lndo.site/wp-content/uploads/sites/2/2024/02/xyz... where it has a year and month in it. It can also look like this...
 		//http://pewresearch.org/global/wp-content/blogs.dir/7/files/legacy/145-1.gif ... or this...
		// https://prc-platform.vipdev.lndo.site/global/wp-content/uploads/sites/2/2024/03/PG_24.03.13_DemocracyOpenEnds_Feature.png
		// We need to check if the post_date and the file url's date dont match. If not then we need to create a new attachment date variable with the correct date from the file url...
		// get the date from the file url in the same format as post date
		preg_match('/\/(\d{4})\/(\d{2})\//', $old_guid, $matches);
		$year = $matches[1];
		$month = $matches[2];
		$file_date = gmdate('Y/m', strtotime($year . '-' . $month . '-01'));
		/// So we have the file date, we have the attachment date.... Maybe we should just always use the file date...? That'd be more true woulnd't it

		$upload_dir = wp_upload_dir($file_date); // Get upload directory
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
			$attachment['post_parent'],
			true
		);

		// Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
		require_once( ABSPATH . 'wp-admin/includes/image.php' );

		// Generate the metadata for the attachment, and update the database record.
		$attach_data = wp_generate_attachment_metadata( $new_attachment_id, $target_filename );
		wp_update_attachment_metadata( $new_attachment_id, $attach_data );

		return $new_attachment_id; // Return new attachment ID
	}

	/**
	 * Having transfered the images we now have pairs of the old image ids and new image ids. We need to migrate art direction, report materials, and dataset download, and any other additional post meta that references an attachment ID in some way.
	 */
	public function process_meta_mapping( $attachment_id_pairs, $meta ) {
		// Lets story a copy of the attachment id pairs for this instance, hence why we're "adding" not updating and why we've set the "unique" param to false.
		add_post_meta( $this->target_post_id, '_prc_migration_attachment_id_pairs', $attachment_id_pairs, false );
		// This should run on pretty much all post types.
		$art_direction = $meta['_artDirection'];
		$report_materials = $meta['_reportMaterials'];
		$dataset_file_id = $meta['_dataset_download'];
		$featured_image_id = $meta['_featured_image_id'];

		$new_art_direction = $this->handle_art_direction_mapping( $attachment_id_pairs, $art_direction );
		$success = false;
		if ( ! empty( $new_art_direction ) ) {
			$success = update_post_meta( $this->target_post_id, 'artDirection', $new_art_direction );
		}
		// check if featured_image_id is in $attachment_id_pairs, and if it is not the same as the new_art_direction['a1']['id'] then we should update the featured image id to the new one.
		if ( array_key_exists($featured_image_id, $attachment_id_pairs)) {
			$new_featured_image_id = $attachment_id_pairs[$featured_image_id];
			if ( false === $new_art_direction ) {
				$success = set_post_thumbnail( $this->target_post_id, $new_featured_image_id );
			} else {
				if ( $new_art_direction['A1']['id'] !== $new_featured_image_id ) {
					$success = set_post_thumbnail( $this->target_post_id, $new_featured_image_id );
				}
			}
		}

		$report_materials = $this->handle_report_materials_mapping( $attachment_id_pairs, $report_materials );
		if ( ! empty( $report_materials ) ) {
			$success = update_post_meta( $this->target_post_id, 'reportMaterials', $report_materials );
		}

		$new_dataset_file_id = $this->handle_dataset_file_id_mapping( $attachment_id_pairs, $dataset_file_id );
		// We should check, if theres no id then we should proceed to check for the url and set that instead...
		if ( ! empty( $new_dataset_file_id ) ) {
			$success = update_post_meta( $this->target_post_id, '_download_attachment_id', $new_dataset_file_id );
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
				// If this doesnt have an attachment id we should skip it and add it to the new report materials array.
				// Even if this is supposed to be an attachment proper, this should still allow for downloads and the like..
				$new_report_materials[] = $report_material;
				continue;
			}

			// Replace the original attachment id with the new one
			$report_material['attachmentId'] = $new_attachment_id;
			// Replace the original url with the new url
			$report_material['url'] = wp_get_attachment_url($new_attachment_id);

			$new_report_materials[] = $report_material;
		}

		// if the origingal report_materials is not empty and the new rewport materials is empty then we should drop some meta on this post as a signal for later
		if ( empty($new_report_materials) && !empty($original_report_materials) ) {
			update_post_meta( $this->target_post_id, '_prc_migration_report_materials_missing', true );
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

		// ... what if there are no attachment_id_pairs... NO CONVERSION OCCURS, that's not good. We need to at least migrate the art direction

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

		if ( empty($new_art_direction) && !empty($original_art_direction) ) {
			update_post_meta( $this->target_post_id, '_prc_migration_art_direction_missing', true );
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
