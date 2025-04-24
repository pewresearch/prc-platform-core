<?php
/**
 * WP Entity Search REST API Endpoint.
 *
 * @package PRC\Platform\Scripts\WP_Entity_Search
 */
namespace PRC\Platform\Scripts\WP_Entity_Search;

use WP_Query, WP_User_Query, WP_Term_Query, WP_REST_Request;
use PRC\Platform\URL_Helper;

use function PRC\Platform\log_error;

/**
 * WP Entity Search REST API Endpoint.
 */
class Rest_API_Endpoint {
	/**
	 * Endpoint.
	 *
	 * @var array
	 */
	public static $endpoint = array();

	/**
	 * Constructor.
	 */
	public function __construct() {
		self::$endpoint = array(
			'route'               => '/components/wp-entity-search',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_handle_wp_entity_search' ),
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'entity_type'     => array(
					'required' => false,
					'type'     => 'string',
					'default'  => 'postType',
				),
				'entity_sub_type' => array(
					'required' => true,
					'type'     => array( 'string', 'array' ),
					'default'  => 'post',
				),
				'search'          => array(
					'required'    => true,
					'type'        => 'string',
					'description' => 'The search term to use.',
				),
			),
		);
		add_filter( 'prc_api_endpoints', array( $this, 'register_rest_endpoints' ) );
	}

	/**
	 * Get the endpoint.
	 *
	 * @return array
	 */
	public function get_endpoint() {
		return self::$endpoint;
	}

	/**
	 * Shape the item.
	 *
	 * @param mixed $item
	 * @return array
	 */
	protected function shape_item( $item ) {
		$new_item = array();
		// Check if $item is a WP_Post class or WP_Term class
		if ( is_a( $item, 'WP_Post' ) ) {
			$new_item['entityName']        = $item->post_title;
			$new_item['entityDescription'] = $item->post_excerpt;
			$new_item['entityDate']        = $item->post_date;
			$new_item['entityType']        = 'postType';
			$new_item['entitySubType']     = $item->post_type;
			$new_item['entitySlug']        = $item->post_name;
			$new_item['entityId']          = $item->ID;
			$new_item['entityUrl']         = get_permalink( $item->ID );
		} elseif ( is_a( $item, 'WP_Term' ) ) {
			$new_item['entityName']        = $item->name;
			$new_item['entityDescription'] = $item->description;
			$new_item['entityDate']        = null;
			$new_item['entityType']        = 'taxonomy';
			$new_item['entitySubType']     = $item->taxonomy;
			$new_item['entitySlug']        = $item->slug;
			$new_item['entityId']          = $item->term_id;
			$new_item['entityUrl']         = get_term_link( $item->term_id );
		}
		return (object) $new_item;
	}

	/**
	 * Get the ID from the URL.
	 *
	 * @param string $url
	 * @return array
	 */
	protected function get_id_from_url( $url ) {
		$url_helper = new URL_Helper( $url );
		$post_id    = $url_helper->get_post_id();
		$post_type  = get_post_type( $post_id );
		if ( in_array( $post_type, array( 'dataset', 'staff' ) ) ) {
			$term = \TDS\get_related_term( $post_id );
			if ( $term ) {
				return $this->shape_item( $term );
			}
		}
		return $this->shape_item( get_post( $post_id ) );
	}

	/**
	 * Search posts for a value.
	 *
	 * @param string $search_value
	 * @param array  $post_types
	 * @param array  $entity_status
	 * @return array
	 */
	protected function search_posts_for_value( $search_value, $post_types = array(), $entity_status = array( 'publish' ) ) {
		$args = array(
			's'           => $search_value,
			'es'          => true,
			'post_type'   => $post_types,
			'per_page'    => 25,
			'post_status' => $entity_status,
			'post_parent' => 0,

		);
		$query   = new WP_Query( $args );
		$posts   = $query->posts;
		$matches = array();
		foreach ( $posts as $post ) {
			$matches[] = $this->shape_item( $post );
		}
		return $matches;
	}

	/**
	 * Search users for a value.
	 *
	 * @param string $search_value
	 * @return array
	 */
	protected function search_users_for_value( $search_value ) {
		$args    = array(
			'search' => $search_value,
			'number' => 25,
		);
		$query   = new WP_User_Query( $args );
		$users   = $query->get_results();
		$matches = array();
		foreach ( $users as $user ) {
			$matches[] = $user;
		}
		return $matches;
	}

	/**
	 * Search taxonomy for a value.
	 *
	 * @param string $search_value
	 * @param array  $taxonomies
	 * @return array
	 */
	protected function search_taxonomy_for_value( $search_value, $taxonomies = array() ) {
		$args    = array(
			'search'     => $search_value,
			'taxonomy'   => $taxonomies,
			'number'     => 25,
			'hide_empty' => false,
			'es'         => true,
		);
		$query   = new WP_Term_Query( $args );
		$terms   = $query->get_terms();
		$matches = array();
		foreach ( $terms as $term ) {
			$matches[] = $this->shape_item( $term );
		}
		return $matches;
	}

	/**
	 * Query for a search value.
	 *
	 * @param string $search_value
	 * @param string $entity_type
	 * @param array  $entity_sub_type
	 * @param array  $entity_status
	 * @return array
	 */
	protected function query_for_search_value( $search_value, $entity_type, $entity_sub_type, $entity_status ) {
		$entity_matches = array();
		// determine if search_value is a url...
		$is_url = filter_var( $search_value, FILTER_VALIDATE_URL );
		if ( $is_url ) {
			$entity_matches = $this->get_id_from_url( $search_value );
			$entity_matches = get_post( $entity_matches );
			$entity_matches = array( $entity_matches );
		} elseif ( 'postType' === $entity_type ) {
			$entity_matches = $this->search_posts_for_value( $search_value, $entity_sub_type, $entity_status );
		} elseif ( 'taxonomy' === $entity_type ) {
			$entity_matches = $this->search_taxonomy_for_value( $search_value, $entity_sub_type );
		} elseif ( 'user' === $entity_type ) {
			$entity_matches = $this->search_users_for_value( $search_value );
		}
		return rest_ensure_response( $entity_matches );
	}

	/**
	 * Restfully log a download for a dataset.
	 *
	 * @param WP_REST_Request $request
	 * @return array|WP_Error
	 */
	public function restfully_handle_wp_entity_search( WP_REST_Request $request ) {
		$search_value    = $request->get_param( 'search' );
		$entity_type     = $request->get_param( 'entity_type' );
		$entity_sub_type = $request->get_param( 'entity_sub_type' );
		$entity_status   = $request->get_param( 'entity_status' );
		if ( ! is_array( $entity_sub_type ) ) {
			$entity_sub_type = explode( ',', $entity_sub_type );
		}
		if ( ! is_array( $entity_sub_type ) ) {
			$entity_sub_type = array( $entity_sub_type );
		}
		if ( ! is_array( $entity_status ) ) {
			$entity_status = explode( ',', $entity_status );
		}
		if ( ! is_array( $entity_status ) ) {
			$entity_status = array( $entity_status );
		}
		return $this->query_for_search_value( $search_value, $entity_type, $entity_sub_type, $entity_status );
	}

	/**
	 * Register the rest endpoints.
	 *
	 * @param array $endpoints
	 * @return array
	 * @hook prc_api_endpoints
	 */
	public function register_rest_endpoints( $endpoints ) {
		return array_merge( $endpoints, array( $this->get_endpoint() ) );
	}
}
