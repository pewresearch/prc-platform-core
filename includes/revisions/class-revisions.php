<?php
/**
 * Revisions class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Revisions class.
 */
class Revisions {
	/**
	 * Constructor.
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'revision_applied', $this, 'on_revision_application__copy_attachments', 10, 2 );
	}

	/**
	 * Copy attachments from the published post to the revision.
	 *
	 * @hook revision_applied
	 *
	 * @param int $published_post_id The ID of the published post.
	 * @param int $revision The revision.
	 */
	public function on_revision_application__copy_attachments( $published_post_id, $revision ) {
		$revision_id = $revision->ID;
		// Get the attachments from the revision, then set their post parent as the published post.
		$attachments = get_children(
			array(
				'post_parent' => $revision_id,
				'post_type'   => 'attachment',
				'numberposts' => 100,
			)
		);
		foreach ( $attachments as $attachment ) {
			$attachment_id = $attachment->ID;
			wp_update_post(
				array(
					'ID'          => $attachment_id,
					'post_parent' => $published_post_id,
				)
			);
		}
	}
}
