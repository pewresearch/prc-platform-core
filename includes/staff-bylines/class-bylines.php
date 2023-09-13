<?php
namespace PRC\Platform;

use WP_Query;
use WP_Error;
use TDS;

class Bylines {
	public static $handle = 'prc-platform-staff-bylines';
	public $post_id;
	public $bylines;
	public $should_display = false;

	public function __construct($post_id, $args = array()) {
		if ( !is_int($post_id) ) {
			$this->bylines = new WP_Error( '404', 'Bylines not found, no post id provided.' );
		}
		$this->post_id = $post_id;
		$this->should_display = $this->determine_bylines_display();
		$this->bylines = $this->get();
	}

	/**
	 * Translates the {key, termId} array to {termId, postId, name, link, jobTitle}
	 * @return void
	 */
	private function get_staff_objects($bylines = array()) {
		$to_return = array();
		foreach( $bylines as $byline ) {
			$staff = new Staff(false, $byline['termId']);
			if ( !is_wp_error($staff) ) {
				$to_return[$byline['termId']] = get_object_vars($staff);
			}
		}
		return $to_return;
	}

	public function get() {
		$bylines = array();
		$bylines = get_post_meta( $this->post_id, 'bylines', true );
		if ( ! is_array( $bylines ) ) {
			return new WP_Error( '404', 'Bylines not found, no bylines found for this post '.$this->post_id );
		}
		return $this->get_staff_objects($bylines);
	}

	private function determine_bylines_display() {
		return get_post_meta( $this->post_id, 'displayBylines', true );
	}

	private function format_string($return_html = false) {
		$output = '';
		$total  = count( $this->bylines );
		$and    = 'and';
		$i      = 1;
		foreach ( $this->bylines as $term_id => $d ) {
			if ( 1 < $total && $i === $total ) {
				$output .= ' ' . $and . ' ';
			} elseif ( 1 < $total && 1 !== $i ) {
				$output .= ', ';
			}
			if ( false === $return_html ) {
				$output .= $d['name'];
			} else {
				$output .= wp_sprintf(
					'<%1$s %2$s>%3$s</%1$s>',
					false !== $d['link'] ? 'a' : 'span',
					false !== $d['link'] ? 'rel="author" href="' . $d['link'] . '" aria-label="View author archive for ' . $d['name'] . '"' : '',
					$d['name']
				);
			}
			$i++;
		}
		return $output;
	}

	public function format($type = 'array') {
		if ( 'array' === $type ) {
			return $this->bylines;
		}
		if ( 'string' === $type ) {
			return $this->format_string();
		}
		if ( 'html' === $type ) {
			return $this->format_string(true);
		}
	}
}
