<?php
namespace PRC\Platform;

use WP_Error;
use TDS;

/**
 * Pass in an id get a fully formed staff member object
 * @package PRC\Platform
 */
class Staff {
	public $ID;
	public $name;
	public $slug;
	public $link;
	public $user_id;
	public $bio;
	public $mini_bio;
	public $job_title;
	public $job_title_extended;
	public $photo;
	public $photo_high_res;
	public $expertise;
	public $social_profiles;
	public $is_currently_employed = false;

	public function __construct($post_id = false, $term_id = false) {
		// if post id is not false then we'll check the staff post, if term id is not false then well check the term and get the staff post id from there and then continue...
		if ( false === $post_id && false !== $term_id && is_int( $term_id ) ) {
			$post_id = $this->get_staff_post_id_from_term_id( $term_id );
		}

		do_action('qm/debug', 'Staff post id: ' . $post_id);
		if ( is_wp_error( $post_id ) ) {
			return new WP_Error( '404', 'Staff post not found, ID value not found.' );
		}

		$this->set_staff($post_id);
	}

	public function get_staff_post_id_from_term_id($term_id) {
		$staff_post = TDS\get_related_post($term_id, 'bylines');
		if ( ! is_a( $staff_post, 'WP_Post' ) || 'staff' !== $staff_post->post_type ) {
			return new WP_Error( '404', 'This is not a staff post' );
		}
		return $staff_post->ID;
	}

	public function get_permalink() {
		if ( empty($this->ID) || !is_int($this->ID) ) {
			return new WP_Error( '404', 'Staff post not found, no ID value.' );
		}
		$term = TDS\get_related_term( $this->ID );
		if ( ! is_a( $term, 'WP_Term' ) ) {
			return new WP_Error( '404', 'Byline term not found, no matching term found for staff post.' );
		}
		return get_term_link( $term, 'bylines' );
	}

	public function get_cache($post_id) {
		$cache = wp_cache_get( 'staff-cache-' . $post_id );
		if ( false !== $cache && ! is_user_logged_in() ) {
			foreach ( $cache as $key => $value ) {
				$this->$key = $value;
			}
			return true;
		}
		return false;
	}

	public function set_cache() {
		if ( !is_preview() ) {
			wp_cache_set(
				'staff-cache-' . $this->ID,
				get_object_vars( $this ),
				'',
				1 * HOUR_IN_SECONDS
			);
		}
	}

	public function set_staff($post_id) {
		error_log('staff post: ' . print_r($post_id, true));
		if ( true === $this->get_cache($post_id) ) {
			return;
		}

		$staff_post = get_post( $post_id );
		// do a double check on post type...
		if ( 'staff' !== $staff_post->post_type ) {
			return new WP_Error( '404', 'This is not a staff post' );
		}

		$staff_post_id = $staff_post->ID;
		$this->ID = $staff_post_id;

		$this->name = $staff_post->post_title;
		$this->slug = $staff_post->post_name;
		$this->link = $this->get_permalink();
		$this->user_id = get_post_meta( $staff_post_id, 'user_id', true );
		$this->bio = apply_filters( 'the_content', $staff_post->post_content );
		$this->job_title = get_post_meta( $staff_post_id, 'job_title', true );
		$this->job_title_extended = get_post_meta( $staff_post_id, 'job_title_mini_bio', true );
		$this->photo = get_the_post_thumbnail( $staff_post_id, 'medium' );
		$this->photo_high_res = get_the_post_thumbnail( $staff_post_id, 'full' );
		$this->social_profiles = $this->get_social_profiles();
		$this->expertise = $this->get_expertise();
		$this->is_currently_employed = $this->check_employment_status();

		$this->set_cache();
	}

	public function check_employment_status() {
		if ( has_term( 'former-staff', 'staff-type', $this->ID ) ) {
			return false;
		} else {
			return true;
		}
	}

	public function get_expertise() {
		$terms     = get_the_terms( $this->ID, 'areas-of-expertise' );
		$expertise = array();
		if ( $terms ) {
			foreach ( $terms as $term ) {
				// if $term is wp error and or is not a term object then skip it.
				if ( is_wp_error( $term ) || ! is_object( $term ) ) {
					continue;
				}
				$link        = get_term_link( $term, 'areas-of-expertise' );
				$expertise[] = array(
					'url'   => $link,
					'label' => $term->name,
					'slug'  => $term->slug,
				);
			}
		}
		return $expertise;
	}

	public function get_social_profiles() {
		return array();
	}

	public function get(){

	}

	public function update() {

	}
}
