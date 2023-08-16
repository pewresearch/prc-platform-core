<?php
namespace PRC\Platform;
use WP_Error;

class Pages extends Multisite_Migration {
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

	public function process() {
		// check if this page has dt_original_post_parent or not
		$original_post_parent_id = get_post_meta($this->target_post_id, 'dt_original_post_parent', true);
		$updated = true;

		if (!empty($original_post_parent_id)) {
			// Go get pages with dt_original_post_id equal to this post's dt_original_post_parent
			$pages = get_posts(array(
				'post_type' => 'page',
				'posts_per_page' => 1,
				'fields' => 'ids',
				'meta_query' => array(
					array(
						'key' => 'dt_original_post_id',
						'value' => $original_post_parent_id,
					),
				),
			));
			if (!empty($pages)) {
				$new_post_parent_id = $pages[0];
				$updated = wp_update_post(array(
					'ID' => $this->target_post_id,
					'post_parent' => $new_post_parent_id,
				));
			} else {
				$updated = false; // Explicitly false because we didn't find a page with the original_post_parent_id
			}
		}

		return boolval($updated);
	}
}
