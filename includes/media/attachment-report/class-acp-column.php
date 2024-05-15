<?php

namespace PRC_PLATFORM_COLUMNS;

class PRC_ATTACHMENTS_COLUMN extends \AC\Column {

	public function __construct() {

		// Identifier, pick an unique name. Single word, no spaces. Underscores allowed.
		$this->set_type( 'column-PRC_ATTACHMENTS_COLUMN' );

		// Default column label.
		$this->set_label( __( 'Attachments Report', 'ac-PRC_ATTACHMENTS_COLUMN' ) );
	}

	/**
	 * Returns the display value for the column.
	 *
	 * @param int $id ID
	 *
	 * @return string Value
	 */
	public function get_value( $post_id ) {
		$post_type = get_post_type( $post_id );
		$value = '<div class="prc-view-attachments-report-button" data-postType="'.$post_type.'" data-postId="'.$post_id.'">Loading Attachments...</div>';
		return $value;
	}

	/*
	 * (Optional) Enqueue CSS + JavaScript on the admin listings screen. You can remove this function is you do not use it!
	 *
	 * This action is called in the admin_head action on the listings screen where your column values are displayed.
	 * Use this action to add CSS + JavaScript
	 */
	public function scripts() {
		wp_enqueue_script( 'prc-platform-attachment-report' );
		wp_enqueue_style( 'wp-components' );
	}

}
