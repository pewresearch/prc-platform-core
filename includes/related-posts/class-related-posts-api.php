<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;

class Related_Posts_API extends Related_Posts {
	public $ID;
	public $post_type;
	public $args = array(
		'taxonomy' => 'category'
	);

	public function __construct($post_id, $args = array()) {
		$this->ID = $post_id;
		$post_type = get_post_type($post_id);
		if ( false === $post_type ) {
			return new WP_Error( 'invalid_post_id', __( 'Invalid post ID.' ) );
		}
		$this->post_type = $post_type;
		$this->args = wp_parse_args( $args, $this->args );
	}

	private function get_label($post_id) {
		// Construct Label
		$terms = wp_get_object_terms( $post_id, 'formats', array( 'fields' => 'names' ) );
		$label = 'Report';
		if ( ! is_wp_error( $terms ) || ! empty( $terms ) ) {
			$label = array_shift( $terms );
		}
		$label = ucwords(str_replace("-", " ", $label));
	}

	private function get_posts_with_matching_primary_terms($posts_per_page = 5, $fallback_to_taxonomy = false) {
		$taxonomy = $this->args['taxonomy'];
		$meta_key = '_yoast_wpseo_primary_'.$taxonomy;
		$related_posts = array();

		// Get the primary topic for this post.
		$primary_taxonomy_term_id = get_post_meta( $this->ID, $meta_key, true );
		$primary_taxonomy_term = get_term_by( 'term_taxonomy_id', (int) $primary_taxonomy_term_id, $taxonomy );

		if ( ! $primary_taxonomy_term ) {
			// Get the first term for this post.
			$terms = wp_get_post_terms( $this->ID, $taxonomy );
			if ( ! empty( $terms ) ) {
				$primary_taxonomy_term = $terms[0];
			}
		}
		if ( empty( $primary_taxonomy_term ) ) {
			return $related_posts;
		}

		$query_args = array(
			'post_type' => 'any', // Get all post types that are public
			'post_parent' => 0,
			'posts_per_page' => $posts_per_page,
			'meta_key' => $meta_key,
			'meta_value' => $primary_taxonomy_term->term_id,
			'post__not_in' => array( $this->ID ), // Exclude this post.
		);

		// If posts with matching primary term are not found, then fallback to searching for posts assigned to this posts priamry term.
		if ( true === $fallback_to_taxonomy ) {
			unset( $query_args['meta_key'] );
			unset( $query_args['meta_value'] );
			$query_args['tax_query'] = array(
				array(
					'taxonomy' => $taxonomy,
					'field'    => 'term_id',
					'terms'    => $primary_taxonomy_term->term_id,
				),
			);
		}

		$query = new WP_Query( $query_args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = get_the_ID();
				$label = $this->get_label( $post_id );
				$related_posts[] = array(
					'postId' => $post_id,
					'postType' => get_post_type(),
					'url' => get_permalink( $post_id ),
					'title' => get_the_title(),
					'date' => get_the_date(),
					'excerpt' => false,
					'label' => $label,
				);
			}
		}
		wp_reset_postdata();
		return $related_posts;
	}

	/**
	 * Structures custom related post data.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	private function get_custom_related_posts( ) {
		$data          = get_post_meta( $this->ID, self::$meta_key, true );
		if ( $this->is_JSON($data) ) {
			$data = json_decode( $data, true );
		}

		$related_posts = array();
		if ( empty( $data ) ) {
			return $related_posts;
		}

		foreach ( $data as $key => $item ) {
			if ( array_key_exists( 'postId', $item ) ) {
				$related_posts[] = array(
					'postId' => $item['postId'],
					'postType' => get_post_type($item['postId']),
					'date'   => array_key_exists( 'date', $item ) ? $item['date'] : null,
					'url'    => array_key_exists( 'permalink', $item ) ? $item['permalink'] : ( array_key_exists('link', $item) ? $item['link'] : null ),
					'title'  => array_key_exists( 'title', $item ) ? stripslashes( $item['title'] ) : null,
					'label'  => array_key_exists( 'label', $item ) && !empty( $item['label'] ) ? $item['label'] : 'Report',
				);
			}
		}

		return $related_posts;
	}

	/**
	 * Structures Jetpack Related Posts data and merges custom related posts. Sorts combined array by date desc.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	private function get_related_posts() {
		$post_id = $this->ID;
		$per_page = 5;

		$related_posts = array();

		// Only get related posts from parent posts.
		if ( 0 !== wp_get_post_parent_id( $post_id ) ) {
			$post_id = wp_get_post_parent_id( $post_id );
		}

		// Check for cached data
		$related_posts = wp_cache_get( $post_id, self::$cache_key );
		$custom_posts  = $this->get_custom_related_posts();

		if ( 5 > count( $custom_posts ) && ( empty( $related_posts ) || false === $related_posts ) ) {
			$related_posts = $this->get_posts_with_matching_primary_terms( $per_page );
			// If not enough related posts are found keying off primary topic widen the search and get all posts that at least have this post's primary topic as a topic.
			if ( 5 > count( $related_posts ) ) {
				$related_posts = $this->get_posts_with_matching_primary_terms( $per_page, true );

				if ( !is_preview() ) {
					// For queried related posts store in memcached.
					wp_cache_set( $post_id, $related_posts, self::$cache_key, self::$cache_time );
				}
			}
		}

		if ( false !== $related_posts && !empty( $related_posts ) ) {
			// If there are more than 5 related posts, then only show the first 5.
			$related_posts = array_slice( $related_posts, 0, $per_page );
		} else {
			$related_posts = array();
		}

		$related_posts = array_merge( $custom_posts, $related_posts );

		// Sort by date desc.
		usort( $related_posts, function( $a, $b ) {
			return strtotime( $b['date'] ) - strtotime( $a['date'] );
		} );

		// Restrict to only 5 items.
		$related_posts = array_slice( $related_posts, 0, $per_page );

		return $related_posts;
	}

	public function is_JSON($string){
		return is_string($string) && is_array(json_decode($string, true)) ? true : false;
	}

	/**
	 * Hooks on to prc_related_posts filter and returns a combined array of Jetpack and custom related posts.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	public function query() {
		// If this not an approved post type then return empty array.
		if ( ! in_array( $this->post_type, self::$enabled_post_types ) ) {
			return array();
		}
		return $this->get_related_posts();
	}
}
