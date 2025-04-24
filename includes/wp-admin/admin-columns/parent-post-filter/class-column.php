<?php
/**
 * Parent Post Column
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use ACP;

/**
 * Parent Post Column
 *
 * @package PRC\Platform
 */
class Parent_Post_Column extends \AC\Column implements ACP\Filtering\Filterable {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Identifier, pick an unique name. Single word, no spaces. Underscores allowed.
		$this->set_type( 'column-Parent_Post_Column' );
		// Default column label.
		$this->set_label( __( 'Parent Post', 'ac-Parent_Post_Column' ) );
	}

	/**
	 * Get the raw, underlying value for the column
	 * Not suitable for direct display, use get_value() for that
	 * This value will be used by 'inline-edit' and get_value().
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return mixed Value
	 */
	public function get_raw_value( $post_id ) {
		return wp_get_post_parent_id( $post_id );
	}

	/**
	 * Returns the display value for the column.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return string Value
	 */
	public function get_value( $post_id ) {
		$parent_post_id = $this->get_raw_value( $post_id );
		if ( 0 === $parent_post_id ) {
			return 'None';
		} else {
			$parent_post = get_post( $parent_post_id );
			return '<a href="' . get_edit_post_link( $parent_post_id ) . '">' . $parent_post->post_title . '</a>';
		}
		return '';
	}

	/**
	 * Get the filtering class
	 *
	 * @return ACP\Filtering\Filterable
	 */
	public function filtering() {
		return new Parent_Post_Filtering( $this );
	}
}
