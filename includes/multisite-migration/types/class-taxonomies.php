<?php
namespace PRC\Platform;
use WP_Error;

class Taxonomies_Migration extends Multisite_Migration {

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

		if (
			is_int($this->original_post_id) &&
			is_int($this->original_site_id) &&
			is_int($this->target_post_id)   &&
			is_int($this->target_site_id)
		) {
			$this->allow_processing = true;
		}
	}

	public function verify_topic_categories($post_id, $allow_overwrite = false, $dry_run = true) {
		// get existing terms and save them in post meta as a backup...
		$existing_terms = wp_get_post_categories( $post_id, array('fields' => 'ids') );
		$new_terms = false;

		$original_post_id = $this->get_original_post_id($post_id);
		$original_site_id = $this->get_original_blog_id($post_id);

		switch_to_blog( $original_site_id );
		$stub_post = get_post_meta( $original_post_id, '_stub_post', true );
		restore_current_blog();

		if ( !empty($stub_post) ) {
			switch_to_blog(1);
			$stub_post = get_post( $stub_post );
			$temp_terms = false;
			if ( !empty($stub_post) && !is_wp_error($stub_post) ) {
				$temp_terms = wp_get_post_terms( $stub_post->ID, 'topic', array('fields' => 'slugs') );
			}
			restore_current_blog();

			if ( false !== $temp_terms && !is_wp_error($temp_terms) ) {
				$temp_terms = array_map( function($term) {
					return get_term_by( 'slug', $term, 'category' );
				}, $temp_terms );
				$new_terms = array_map( function($term) {
					return $term->term_id;
				}, $temp_terms );
			}
		}

		if ($existing_terms) {
			update_post_meta( $post_id, '_migration_verification_categories_backup', $existing_terms );
		}

		return rest_ensure_response( array(
			'status' => 200,
			'existingTerms' => $existing_terms,
			'newTerms' => $new_terms,
		) );
	}

}
