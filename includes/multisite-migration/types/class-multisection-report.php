<?php
namespace PRC\Platform;
use WP_Error;

class Multisection_Reports extends Multisite_Migration {
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

	public function get_child_posts() {
		$child_posts = get_posts(array(
			'post_type' => 'post',
			'posts_per_page' => -1,
			'post_status' => 'any',
			'fields' => 'ids',
			'meta_query' => array(
				array(
					'key' => 'dt_original_post_parent',
					'value' => $this->original_post_id,
					'compare' => '=',
				),
				array(
					'key' => 'dt_original_blog_id',
					'value' => $this->original_site_id,
					'compare' => '=',
				),
			),
		) );

		return $child_posts;
	}

	/**
	 * Copy attachments from the source site to the target site.
	 * @param mixed $post_id
	 * @param mixed $source_site_id
	 * @return array
	 */
	public function process( $old_multisection_report = array(), $dry_run = false ) {
		if ( true !== $this->allow_processing ) {
			parent::log("UHOH: Multisection_Reports::process() called without all required arguments.");
			return new WP_Error( 'prc_multissection_reports_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		$updated = false;

		$child_id_old_new_pairs = array();

		$child_posts = $this->get_child_posts();
		$order = 0;
		foreach ($child_posts as $child_post_id) {
			$child_original_post_id = get_post_meta($child_post_id, 'dt_original_post_id', true);

			if ( false === $dry_run ) {
				// update the post_parent for the child post, this re-establishes hierarchy.
				$updated = wp_update_post(array(
					'ID' => $child_post_id,
					'post_parent' => $this->target_post_id,
					'menu_order'  => $order,
				), true);

				$order++;
			}

			if ( !is_wp_error($updated) ) {
				$child_id_old_new_pairs[$child_original_post_id] = $child_post_id;
			}
		}

		$updated_meta = $this->handle_multisection_report_mapping($child_id_old_new_pairs, $old_multisection_report);
		if ( !empty($updated_meta) ) {
			if ( false === $dry_run ) {
				update_post_meta($this->target_post_id, 'multiSectionReport', $updated_meta);
			}
		}

		if ( true === $dry_run ) {
			return array(
				'raw' => $child_id_old_new_pairs,
				'proposed' => $updated_meta,
			);
		} else {
			return $updated;
		}
	}

	private function handle_multisection_report_mapping( $child_id_old_new_pairs, $multisection_report ) {
		if ( empty( $child_id_old_new_pairs ) || empty( $multisection_report ) ) {
			return false;
		}

		$new_multisection_report = array();

		foreach ($multisection_report as $child_post) {
			$new_post_id = null;
			$original_post_id = $child_post['postId'];
			if ( array_key_exists($original_post_id, $child_id_old_new_pairs) ) {
				$new_post_id = $child_id_old_new_pairs[$original_post_id];
			}

			if ( null === $new_post_id ) {
				continue;
			}

			// Replace the original attachment id with the new one
			$child_post['postId'] = $new_post_id;

			$new_multisection_report[] = $child_post;
		}

		if ( !empty($new_multisection_report) ) {
			return $new_multisection_report;
		} else {
			return $new_multisection_report;
		}
	}
}
