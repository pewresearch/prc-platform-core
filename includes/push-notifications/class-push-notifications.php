<?php
namespace PRC\Platform;

class Push_Notifications {
	public static $post_type = 'push_notification';
	public static $allowed_post_types = ['post', 'feature', 'quiz', 'newsletter'];
	public function __construct() {
		//
	}

	public function register_post_type() {

	}

	// This function will create push_notification post when a specific taxonomy has new content added to it
	/**
	 * @hook ‘set_object_terms’
	 */
	public function auto_create_notification_when_taxonomy_update($object_id, $terms, $tt_ids, $taxonomy, $append, $old_tt_ids) {
		// Check if the taxonomy is the one we are interested in
		if ($taxonomy !== 'category') {
			return;
		}

		// Check if the post type is the one we are interested in
		$post_type = get_post_type($object_id);
		if (!in_array($post_type, self::$allowed_post_types)) {
			return;
		}

		// Check if this taxonomy has any subscribers...

		$new_notification = new Notification($object_id);
		// $new_notification->push();
	}
}
