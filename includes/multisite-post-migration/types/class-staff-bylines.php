<?php
namespace PRC\Platform;
use WP_Error;

class Bylines_Staff_Migration extends Multisite_Migration {
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

	private function get_new_term_id($term_slug) {
		return get_term_by('slug', $term_slug, 'bylines')->term_id;
	}

	/**
	 * Find matching byline terms and their matching term id's and change the mapping on bylines and acknowledgements accordingly.
	 * @param mixed $post_id
	 * @param mixed $source_site_id
	 * @return array
	 */
	public function process( $legacy_mapping = array(), $bylines = array(), $acknowledgements = array() ) {
		if ( true !== $this->allow_processing ) {
			parent::log("UHOH: Bylines_Staff_Migration::process() called without all required arguments.");
			return new WP_Error( 'prc_staff_bylines_migration_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		$updated_bylines = array();
		foreach($bylines as $byline) {
			$term_id = $byline['termId'];
			$term_slug = $legacy_mapping[$term_id];
			$new_term_id = $this->get_new_term_id($term_slug);
			$byline['termId'] = $new_term_id;
			$updated_bylines[] = $byline;
		}

		$updated_acknowledgements = array();
		foreach($acknowledgements as $acknowledgement) {
			$term_id = $acknowledgement['termId'];
			$term_slug = $legacy_mapping[$term_id];
			$new_term_id = $this->get_new_term_id($term_slug);
			$acknowledgement['termId'] = $new_term_id;
			$updated_acknowledgements[] = $acknowledgement;
		}

		$bylines_updated = update_post_meta( $this->target_post_id, 'bylines', $updated_bylines );
		$acknowledgements_updated = update_post_meta( $this->target_post_id, 'acknowledgements', $updated_acknowledgements );

		if ( !$bylines_updated ) {
			return new WP_Error( 'prc_staff_bylines_migration_bylines_update_failed', __( 'Failed to update bylines.', 'prc' ) );
		}
		if ( !$acknowledgements_updated ) {
			return new WP_Error( 'prc_staff_bylines_migration_acknowledgements_update_failed', __( 'Failed to update acknowledgements.', 'prc' ) );
		}
	}
}
