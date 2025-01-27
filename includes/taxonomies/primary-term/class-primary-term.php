<?php
namespace PRC\Platform;

class Primary_Term extends Taxonomies {
	public function __construct($loader) {

	}

	public function register_primary_term_meta() {
		// for each public post type lets register the primary term meta.
		register_post_meta(
			'post',
			'primary_term_id',
			[
				'type' => 'integer',
				'single' => true,
				'show_in_rest' => true,
			]
		);

		register_rest_field(
			'post',
			'primary_term',
			[
				'get_callback' => [$this, 'get_primary_term'],
				'update_callback' => [$this, 'set_primary_term'],
				'schema' => null,
			]
		);
	}

	public function get_primary_term($object, $field_name, $request) {
		$primary_term_id = get_post_meta($object['id'], 'primary_term_id', true);
		if ($primary_term_id) {
			$term = get_term($primary_term_id);
			if ( !is_wp_error($term) ) {
				return $term;
			}
		}
		return null;
	}

	public function set_primary_term($value, $object) {
		update_post_meta($object->ID, 'primary_term_id', $value);
	}
}
