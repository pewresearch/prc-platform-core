<?php
/**
 * Primary Term Taxonomy
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Primary Term Taxonomy
 *
 * @package PRC\Platform
 */
class Primary_Term extends Taxonomies {
	/**
	 * Constructor.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'init', $this, 'register_primary_term_meta' );
	}

	/**
	 * Register the primary term meta.
	 *
	 * @hook init
	 * @return void
	 */
	public function register_primary_term_meta() {
		// for each public post type lets register the primary term meta.
		register_post_meta(
			'post',
			'primary_term_id',
			array(
				'type'         => 'integer',
				'single'       => true,
				'show_in_rest' => true,
			)
		);

		register_rest_field(
			'post',
			'primary_term',
			array(
				'get_callback'    => array( $this, 'get_primary_term' ),
				'update_callback' => array( $this, 'set_primary_term' ),
				'schema'          => null,
			)
		);
	}

	/**
	 * Get the primary term.
	 *
	 * @param mixed $object The object.
	 * @param mixed $field_name The field name.
	 * @param mixed $request The request.
	 * @return mixed The primary term.
	 */
	public function get_primary_term( $object, $field_name, $request ) {
		$primary_term_id = get_post_meta( $object['id'], 'primary_term_id', true );
		if ( $primary_term_id ) {
			$term = get_term( $primary_term_id );
			if ( ! is_wp_error( $term ) ) {
				return $term;
			}
		}
		return null;
	}

	/**
	 * Set the primary term.
	 *
	 * @param mixed $value The value.
	 * @param mixed $object The object.
	 * @return void
	 */
	public function set_primary_term( $value, $object ) {
		update_post_meta( $object->ID, 'primary_term_id', $value );
	}
}
