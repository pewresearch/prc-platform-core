<?php
namespace PRC\Platform;
use WP_Error;

class Post_Visibility {
	public static $enabled_post_types = array(
		'post',
		'page',
		'short-read',
		'fact-sheets',
		'fact-sheet',
		'interactive',
		'interactives',
		'quiz'
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-post-visibility';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_custom_visibility_statuses', 9 );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_action( 'pre_get_posts', $this, 'filter_pre_get_posts' );
			$loader->add_filter( 'rest_post_query', $this, 'filter_rest_query', 100, 2 );
			$loader->add_filter( 'prc_platform_pub_listing_default_args', $this, 'filter_pub_listing_query_args', 10, 1 );
		}
	}

	/**
	 * Register custom visibilty statuses that are present on origin posts but only used on stubs to determine their visibility in the index and search.
	 * The interface for setting these statuses is in plugins/prc-block-plugins.
	 * @return void
	 */
	public function register_custom_visibility_statuses() {
		foreach( self::$enabled_post_types as $post_type ) {
			register_post_meta(
				$post_type,
				'_postVisibility',
				array(
					'show_in_rest'  => array(
						'schema' => array(
							'type' => 'string',
							'default' => 'public',
							'description' => 'The visibility of the post in the index and search. Defaults to public. **Private and password protected posts are not affected by this setting and this respects their statuses.**',
							'enum' => array(
								null,
								'', // This is the default value
								'public',
								'hidden_from_search',
								'hidden_from_index',
							),
						),
					),
					'single'        => true,
					'default' 	    => 'public',
					'type'          => 'string',
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}

		register_post_status(
			'hidden_from_search',
			array(
				'label'               => __( 'Hidden from Search', 'wp-statuses' ),
				'label_count'         => _n_noop( 'Hidden from Search (but not index) <span class="count">(%s)</span>', 'Hidden from Search <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => true,
				'public'              => true,
				'publicly_queryable'  => true,
			)
		);

		register_post_status(
			'hidden_from_index',
			array(
				'label'               => __( 'Hidden from Index', 'wp-statuses' ),
				'label_count'         => _n_noop( 'Hidden from Index (but not search) <span class="count">(%s)</span>', 'Hidden from Index <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => false,
				'public'              => true,
				'publicly_queryable'  => false,
			)
		);
	}

	public function add_custom_visibility_statuses_to_rest() {
		foreach( self::$enabled_post_types as $post_type ) {
			register_rest_field(
				$post_type,
				'postVisibility',
				array(
					'get_callback'    => function( $object ) {
						return get_post_meta( $object['id'], '_postVisibility', true );
					},
					'update_callback' => function( $value, $object ) {
						return update_post_meta( $object->ID, '_postVisibility', $value );
					},
					'schema'          => array(
						'description' => __( 'Post visibility', 'wp-statuses' ),
						'type'        => 'string',
						'context'     => array( 'edit' ),
						'enum'        => array(
							null,
							'public',
							'hidden_from_search',
							'hidden_from_index',
						),
					),
				)
			);
		}
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( ! in_array( get_wp_admin_current_post_type(), self::$enabled_post_types, true ) ) {
			return;
		}
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}

	/**
	 * Add appropriate post_status arguments to restful queries.
	 * @hook rest_{post_type}_query
	 * @param mixed $args
	 * @param mixed $request
	 * @return void
	 */
	public function filter_rest_query( $args, $request ) {
		$referer = $request->get_header('referer');
		// Break up the refere into its url params
		$referer = wp_parse_url( $referer );
		$referer_query = array_key_exists('query', $referer) ? $referer['query'] : '';
		$referer_query = wp_parse_args( $referer_query );
		$post_type = array_key_exists('postType', $referer_query) ? $referer_query['postType'] : '';
		$post_id = array_key_exists('postId', $referer_query) ? $referer_query['postId'] : '';

		$allowed_ids = array(
			'prc-block-theme//index',
			'prc-block-theme//home',
			'prc-block-theme//category'
		);

		$is_publication_listing = $request->get_param('isPubListingQuery');

		if ( 'wp_template' === $post_type ) {
			if ( in_array($post_id, $allowed_ids) ){
				$args['post_status'] = $this->show_publish_and_hidden_from_search($args['post_status']);
			}
			if ( 'prc-block-theme//search' === $post_id ) {
				$args['post_status'] = $this->show_publish_and_hidden_from_index($args['post_status']);
			}
		} elseif ( $is_publication_listing ) {
			$args['post_status'] = $this->show_publish_and_hidden_from_search($args['post_status']);
		}

		return $args;
	}

	public function show_publish_and_hidden_from_search($post_status = array()){
		if ( !is_array($post_status) ) {
			$post_status = array($post_status);
		}
		$to_add = array(
			'publish',
			'hidden_from_search'
		);
		return array_merge($post_status, $to_add);
	}

	public function show_publish_and_hidden_from_index($post_status = array()){
		if ( !is_array($post_status) ) {
			$post_status = array($post_status);
		}
		$to_add = array(
			'publish',
			'hidden_from_index'
		);
		return array_merge($post_status, $to_add);
	}

	/**
	 * @hook prc_platform_pub_listing_default_args
	 * @param mixed $query
	 * @return mixed
	 */
	public function filter_pub_listing_query_args($query) {
		if ( is_admin() || !is_array($query) ) {
			return $query;
		}
		$post_status = array_key_exists('post_status', $query) ? $query['post_status'] : array();
		if ( !empty($query['s'] ) ){
			$query['post_status'] = $this->show_publish_and_hidden_from_index($post_status);
		} else {
			$query['post_status'] = $this->show_publish_and_hidden_from_search($post_status);
		}
		return $query;
	}

	/**
	 * Handle hiding posts from the index and search based on their visibility status.
	 *
	 * If on a "publication listing" only show posts that are "publish" or "hidden from search".
	 *
	 * If on a search page only show posts that are "publish" or "hidden from index".
	 *
	 * If on a byline page only show posts that are "publish" or "hidden from index".
	 *
	 * @hook pre_get_posts
	 *
	 * @param mixed $query
	 */
	public function filter_pre_get_posts($query) {
		if ( is_admin() || ! $query->is_main_query() || $query->is_page() ) {
			return $query;
		}

		// On "publication listing" only allow "publish" and "hidden from search" posts. Hidden from index posts wont appear.
		if ( $query->is_home() || $query->is_archive() || $query->is_tax() ) {
			$query->set( 'post_status', $this->show_publish_and_hidden_from_search() );
		}
		// On search only allow "publish" and "hidden from index" posts. Hidden from search posts wont appear.
		if ( $query->is_search() ) {
			$query->set( 'post_status', $this->show_publish_and_hidden_from_index() );
		}
		// On bylines only allow "publish" and "hidden from index" posts, giving a full accounting of a persons work. Hidden from search posts wont appear.
		if ( $query->is_tax('bylines') ) {
			$query->set( 'post_status', $this->show_publish_and_hidden_from_index() );
		}
	}

}
