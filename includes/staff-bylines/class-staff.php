<?php
namespace PRC\Platform;
use WP_Error;
use TDS;

/**
 * This is the primary means of accessing a unified Staff member. Combining both term and post type.
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
	public $expertise;
	public $social_profiles;
	public $is_currently_employed = false;

	protected static $cache_ttl = 1 * HOUR_IN_SECONDS;

	public function __construct($post_id = false, $term_id = false) {
		// if post id is not false then we'll check the staff post, if term id is not false then well check the term and get the staff post id from there and then continue...
		if ( false === $post_id && false !== $term_id && is_int( $term_id ) ) {
			$post_id = $this->get_staff_post_id_from_term_id( $term_id );
		}

		if ( is_wp_error( $post_id ) ) {
			return new WP_Error( '404', 'Staff post not found, ID value not found.' );
		}

		$this->set_staff($post_id);
	}

	public function get_staff_post_id_from_term_id($term_id) {
		$staff_post_id = get_term_meta($term_id, 'tds_post_id', true);
		if ( empty($staff_post_id) || false === $staff_post_id ) {
			return new WP_Error( '404', 'This is not a staff post' );
		}
		return $staff_post_id;
	}

	public function get_staff_link($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}

		$display_byline_link = rest_sanitize_boolean(get_post_meta($staff_post_id, 'bylineLinkEnabled', true));
		if ( true !== $display_byline_link) {
			return false;
		}

		$term = TDS\get_related_term( $staff_post_id );
		if ( ! is_a( $term, 'WP_Term' ) ) {
			return new WP_Error( '404', 'Byline term not found, no matching term found for staff post.' );
		}
		$link = get_term_link( $term, 'bylines' );
		return $link;
	}

	public function get_cache($post_id) {
		$cache = wp_cache_get( $post_id, 'staff_data' );
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
				$this->ID,
				get_object_vars( $this ),
				'staff_data',
				self::$cache_ttl,
			);
		}
	}

	/**
	 * Set the staff object properties based on the staff/byline hybrid.
	 */
	public function set_staff($post_id) {
		if ( true === $this->get_cache($post_id) ) {
			return;
		}
		$staff_post = get_post( $post_id );
		if ( 'staff' !== $staff_post->post_type ) {
			return new WP_Error( '404', 'This is not a staff post' );
		}

		$staff_post_id = $staff_post->ID;
		$this->ID = (int) $staff_post_id;

		$this->name = $staff_post->post_title;
		$this->slug = $staff_post->post_name;
		$this->link = $this->get_staff_link($staff_post_id);
		$this->user_id = get_post_meta( $staff_post_id, 'user_id', true );
		$this->is_currently_employed = $this->check_employment_status($staff_post_id);
		$this->bio = apply_filters( 'the_content', $staff_post->post_content );
		$this->job_title = $this->get_job_title($staff_post_id);
		$this->job_title_extended = $this->get_job_title_extended($staff_post_id);
		$this->mini_bio = wp_sprintf(
			'<a href="%1$s">%2$s</a> <span>is %3$s</span>.',
			$this->link,
			$this->name,
			$this->job_title_extended
		);
		$this->photo = $this->get_staff_photo($staff_post_id);
		$this->social_profiles = $this->get_social_profiles($staff_post_id);
		$this->expertise = $this->get_expertise($staff_post_id);
		$this->set_cache();
	}

	public function check_employment_status($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}
		if ( has_term( 'former-staff', 'staff-type', $staff_post_id ) ) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Returns the job title for the staff member.
	 */
	public function get_job_title($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}
		$job_title = get_post_meta( $staff_post_id, 'jobTitle', true );
		if ( false === $this->is_currently_employed ) {
			$job_title = 'Former ' . $job_title;
		}
		return $job_title;
	}

	/**
	 * Returns the extended job title for the staff member.
	 */
	public function get_job_title_extended($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}
		$job_title_extended = get_post_meta( $staff_post_id, 'jobTitleExtended', true );
		if ( false === $this->is_currently_employed ) {
			$job_title_extended = preg_replace( '/(a|an) /', 'a former ', $job_title_extended );
		}
		return $job_title_extended;
	}

	/**
	 * Returns an array of expertise terms for the staff member.
	 */
	public function get_expertise($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}
		$terms     = get_the_terms( $staff_post_id, 'areas-of-expertise' );

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

	public function get_staff_photo($staff_post_id = false) {
		$staff_photo = false;
		$staff_photo_id = get_post_thumbnail_id($staff_post_id);
		$staff_photo = wp_get_attachment_image_src($staff_photo_id, 'full');
		$staff_portrait = wp_get_attachment_image_src($staff_photo_id, '160-portrait');
		if ( false !== $staff_photo || false !== $staff_portrait ) {
			$staff_photo = [];
		}
		if ( false !== $staff_photo ) {
			$staff_photo['full'] = $staff_photo;
		}
		if ( false !== $staff_portrait ) {
			$staff_photo['thumbnail'] = $staff_portrait;
		}
		return $staff_photo;
	}

	public function get_social_profiles($staff_post_id = false) {
		if ( false === $staff_post_id ) {
			$staff_post_id = $this->ID;
		}
		if ( false === $staff_post_id ) {
			return false;
		}
		return array();
	}
}
