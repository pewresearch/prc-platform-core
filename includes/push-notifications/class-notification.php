<?php
namespace PRC\Platform;

// Shapes a notification for a post
class Notification {
	public $post_id;
	public $title;
	public $excerpt;
	public $full_message;
	public $time;

	public function __construct($post_id) {
		$this->post_id = $post_id;
		$this->set_title();
		$this->set_excerpt();
		$this->set_full_message();
		$this->set_time();
	}

	protected function set_title() {
		$this->title = get_the_title($this->post_id);
	}

	protected function set_excerpt() {
		$this->excerpt = get_the_excerpt($this->post_id);
	}

	protected function set_full_message() {
		$this->full_message = get_the_content($this->post_id);
	}

	protected function set_time() {
		$this->time = get_the_time('U', $this->post_id);
	}

	public function push() {
		// Push the notification to the correct platform
		as_enqueue_async_action('prc_push_notification', [
			'post_id' => $this->post_id,
			'title' => $this->title,
			'excerpt' => $this->excerpt,
			'full_message' => $this->full_message,
			'time' => $this->time,
		]);
	}
}
