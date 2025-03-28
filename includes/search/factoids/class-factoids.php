<?php
namespace PRC\Platform;

class Search_Factoids {
	public static $post_type = 'factoid';

	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_action( 'init', $this, 'register_tax' );
			$loader->add_action( 'init', $this, 'block_init' );
			$loader->add_action( 'save_post_factoid', $this, 'update_index', 10, 3 );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
		}
	}

	public function register_type() {
		$labels   = array(
			'name'                  => _x( 'Factoids', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Factoid', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Factoids', 'text_domain' ),
			'name_admin_bar'        => __( 'Factoid', 'text_domain' ),
			'archives'              => __( 'Factoids Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Factoid:', 'text_domain' ),
			'all_items'             => __( 'All Factoids', 'text_domain' ),
			'add_new_item'          => __( 'Add New Factoid', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Factoid', 'text_domain' ),
			'edit_item'             => __( 'Edit Factoid', 'text_domain' ),
			'update_item'           => __( 'Update Factoid', 'text_domain' ),
			'view_item'             => __( 'View Factoid', 'text_domain' ),
			'search_items'          => __( 'Search Factoids', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Factoid', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Factoid', 'text_domain' ),
			'items_list'            => __( 'Factoids list', 'text_domain' ),
			'items_list_navigation' => __( 'Factoids list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Factoid list', 'text_domain' ),
		);
		$rewrite  = array(
			'slug'       => 'factoid',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);
		$supports = array( 'title', 'editor', 'author', 'thumbnail', 'revisions', 'custom-fields', 'excerpt' );
		$args     = array(
			'label'               => __( 'Factoid', 'text_domain' ),
			'description'         => __( 'Post Type Description', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => $supports,
			'taxonomies'          => array( 'search_term' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_position'       => 65,
			'menu_icon'           => 'dashicons-search',
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'can_export'          => true,
			'has_archive'         => false,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'show_in_rest'        => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);
		register_post_type( self::$post_type, $args );
	}

	public function register_tax() {
		$labels = array(
			'name'                       => 'Search Terms',
			'singular_name'              => 'Search Term',
			'search_items'               => 'Search Search Term',
			'popular_items'              => 'Popular Search Term',
			'all_items'                  => 'All Search Term',
			'parent_item'                => null,
			'parent_item_colon'          => null,
			'edit_item'                  => 'Edit Search Term',
			'update_item'                => 'Update Search Term',
			'add_new_item'               => 'Add New Search Term',
			'new_item_name'              => 'New Search Term Name',
			'separate_items_with_commas' => 'Separate search terms with commas',
			'add_or_remove_items'        => 'Add or remove search terms',
			'choose_from_most_used'      => 'Choose from the most used search terms',
		);
		$args   = array(
			'hierarchical'      => false,
			'labels'            => $labels,
			'show_ui'           => true,
			'query_var'         => false,
			'show_in_rest'      => true,
			'show_admin_column' => true,
		);
		register_taxonomy( 'search_term', 'factoid', $args );
	}

	/**
	 * Register the /factoids/search endpoint.
	 *
	 * @hook prc_api_endpoints
	 * @param  array $endpoints
	 * @return array $endpoints
	 */
	public function register_endpoint( $endpoints ) {
		array_push(
			$endpoints,
			array(
				'route'               => '/factoids/search',
				'methods'             => 'GET',
				'callback'            => array( $this, 'rest_callback' ),
				'args'                => array(
					'search_term' => array(
						'validate_callback' => function ( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);
		return $endpoints;
	}

	private function sanitize_search_term( $search_term ) {
		// remove quotes from $search_term
		$search_term = str_replace( '"', '', $search_term );
		// remove plus signs from $search_term
		$search_term = str_replace( '+', ' ', $search_term );
		// remove non-alphanumeric characters except for spaces from $search_term
		$search_term = preg_replace( '/[^\w\s]/', '', $search_term );
		return strtolower( str_replace( ' ', '-', $search_term ) );
	}

	/**
	 * Update the index when a factoid is saved.
	 *
	 * @TODO: we should probably integrate BerlinDB at some point and use that to build an index.
	 * @hook save_post_factoid
	 *
	 * @param  [type] $post_id [description]
	 * @param  [type] $post    [description]
	 * @param  [type] $update  [description]
	 * @return [type]          [description]
	 */
	public function update_index( $post_id, $post, $update ) {
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		if ( isset( $post->post_status ) && ! in_array( $post->post_status, array( 'draft', 'publish', 'trash' ) ) ) {
			return;
		}

		$terms = wp_get_post_terms( $post_id, 'search_term', array( 'fields' => 'names' ) );
		$index = get_option( 'factoid_index', array() );

		$temp_index = $index;

		// Remove the post id from the indexed term.
		if ( 'trash' === $post->post_status ) {
			foreach ( $terms as $term ) {
				$term = $this->sanitize_search_term( $term );
				if ( isset( $temp_index[ $term ] ) && in_array( $post_id, $temp_index[ $term ] ) ) {
					// Get the index key for the post id.
					$key = array_search( $post_id, $temp_index[ $term ] );
					// Remove the post id from the indexed term.
					unset( $temp_index[ $term ][ $key ] );
				}
			}
		} else {
			foreach ( $terms as $key => $term ) {
				$term = $this->sanitize_search_term( $term );
				// If the key already exists then just push onto the index key.
				if ( array_key_exists( $term, $index ) ) {
					if ( ! in_array( $post_id, $temp_index[ $term ] ) ) {
						array_push( $temp_index[ $term ], $post_id );
					}
				} else {
					$temp_index[ $term ] = array( $post_id );
				}
			}
		}

		update_option( 'factoid_index', $temp_index );
	}

	/**
	 * [get_index description]
	 *
	 * @param  [type] $search_term [description]
	 * @return [type]              [description]
	 */
	public function get_index( $search_term ) {
		if ( empty( $search_term ) ) {
			return false;
		}
		$search_term = $this->sanitize_search_term( $search_term );
		$index       = get_option( 'factoid_index', false );
		if ( false === $index ) {
			return false;
		}
		if ( array_key_exists( $search_term, $index ) ) {
			return $index[ $search_term ];
		} else {
			return false;
		}
	}

	/**
	 * [rest_callback description]
	 *
	 * @param  WP_REST_Request $request [description]
	 * @return [type]                   [description]
	 */
	public function rest_callback( \WP_REST_Request $request ) {
		$search_term = $request->get_param( 'search_term' );
		$response    = $this->get_index( $search_term );
		if ( false !== $response ) {
			$response = array(
				'facts' => $this->get_index( $search_term ),
				'key'   => str_replace( ' ', '', $search_term ),
			);
		}
		return $response;
	}

	public function render_factoid_callback( $attributes, $content, $block ) {
		if ( is_search() ) {
			$search_term = get_search_query( false );
			$post_ids    = $this->get_index( $search_term );

			if ( false !== $post_ids ) {
				foreach ( $post_ids as $key => $post_id ) {
					$factoid_post = get_post( $post_id );
					return apply_filters( 'the_content', $factoid_post->post_content );
				}
			}
		}
	}

	/**
	 * Initializes the factoid block
	 *
	 * @hook init
	 */
	public function block_init() {
		register_block_type(
			__DIR__ . '/build',
			array(
				'render_callback' => array( $this, 'render_factoid_callback' ),
			)
		);
	}
}
