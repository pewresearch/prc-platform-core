<?php
namespace PRC\Platform;

use WP_Query;
use WP_Error;
use TDS;

class Bylines {
	public static $handle = 'prc-platform-staff-bylines';
	public $blyines = array();
	public $should_display = false;

	public function __construct($args) {

	}

	public function determine_bylines_display( $args ) {
		return get_post_meta( (int) $args['post_id'], 'displayBylines', true );
	}

	public function get( $args ) {
		$bylines = array();
		$bylines = get_post_meta( (int) $args['post_id'], 'bylines', true );
		if ( ! is_array( $bylines ) ) {
			return new WP_Error( '404', 'Bylines not found, no bylines found for this post.' );
		}
		$to_return = array();
		foreach( $bylines as $byline ) {
			$staff = new Staff(false, $byline['termId']);
			if ( !is_wp_error($staff) ) {
				$to_return[] = get_object_vars($staff);
			}
		}
	}
}
