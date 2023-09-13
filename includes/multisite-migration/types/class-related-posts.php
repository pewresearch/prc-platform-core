<?php
namespace PRC\Platform;
use WP_Error;

class Related_Posts_Migration extends Multisite_Migration {
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

	public function get_new_post_id_from_old_id( $old_post_id ) {
		$match = get_posts(array(
			'post_type' => 'post',
			'post_status' => 'publish',
			'fields' => 'ids',
			'numberposts' => 1,
			'meta_query' => array(
				array(
					'key' => 'dt_original_post_id',
					'value' => $old_post_id,
					'compare' => '=',
				),
				array(
					'key' => 'dt_original_blog_id',
					'value' => $this->original_site_id,
					'compare' => '=',
				),
			),
		));
		if ( !empty($match) ) {
			return $match[0];
		}
		return false;
	}

	public function process($old_related_posts) {
		// loop through the related posts, go find the new post id based on the old post. If you can't find it then keep the existing data..
		if ( true === $this->allow_processing && !empty($old_related_posts) ) {
			//
			$new_related_posts = array();
			foreach ($old_related_posts as $related_post) {
				$new_post_id = $this->get_new_post_id_from_old_id($related_post['id']);
				$related_post['postId'] = $new_post_id;
				$related_post['permalink'] = get_permalink($new_post_id);
			}

			if ( !empty($new_related_posts) ) {
				update_post_meta($this->target_post_id, 'relatedPosts', $new_related_posts);
			} else {
				return new WP_Error('no_related_posts', 'No related posts found for this post.');
			}

			return true;
		}
	}
}
