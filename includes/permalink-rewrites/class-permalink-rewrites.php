<?php
namespace PRC\Platform;
use WP_Error;
use WP_REST_Request;

class Permalink_Rewrites {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-permalink-rewrites';

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
			$loader->add_action( 'init', $this, 'register_rewrites' );
			$loader->add_action( 'init', $this, 'register_tags' );
			$loader->add_filter( 'query_vars', $this, 'register_query_vars' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
		}
	}

	/**
	 * Registers the rewrite rules for PRC Platform with WordPress.
	 * @hook init
	 * @uses prc_platform_rewrite_rules
	 */
	public function register_rewrites() {
		if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
			return;
		}
		$rewrite_rules = apply_filters( 'prc_platform_rewrite_rules', array() );
		foreach ( $rewrite_rules as $rule => $query ) {
			add_rewrite_rule( $rule, $query, 'top' );
		}
	}

	/**
	 * Registers the rewrite tags for PRC Platform with WordPress.
	 * @hook init
	 * @uses prc_platform_rewrite_tags
	 * @return void
	 */
	public function register_tags() {
		if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
			return;
		}
		$rewrite_tags = apply_filters( 'prc_platform_rewrite_tags', array() );
		foreach ( $rewrite_tags as $tag ) {
			add_rewrite_tag( $tag['tag'], $tag['regex'], $tag['query'] );
		}
	}

	/**
	 * Registers any additional query vars for PRC Platform with WordPress.
	 * @hook query_vars
	 * @uses prc_platform_rewrite_query_vars
	 * @param array $query_vars
	 * @return array $query_vars
	 */
	public function register_query_vars($query_vars) {
		if ( get_current_blog_id() !== PRC_PRIMARY_SITE_ID ) {
			return $query_vars;
		}
		$rewrite_query_vars = apply_filters( 'prc_platform_rewrite_query_vars', array() );
		foreach ( $rewrite_query_vars as $var ) {
			$query_vars[] = $var;
		}
		return $query_vars;
	}

	/**
	 * Gets the post id and post type for a url restfully.
	 * @param WP_REST_Request $request
	 * @return WP_Error|array
	 */
	public function restfully_get_postid_by_url( \WP_REST_Request $request ) {
		$url = $request->get_param( 'url' );
		if ( empty( $url ) ) {
			return new WP_Error( 'no-url-provided', __( 'No url provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}
		$post_id = \wpcom_vip_url_to_postid( $url );
		if ( 0 === $post_id ) {
			return new WP_Error( 'no-post-found', __( 'No post found', 'my_textdomain' ), array( 'status' => 404 ) );
		}
		return array(
			'postId' => $post_id,
			'postType' => get_post_type( $post_id ),
		);
	}

	/**
	 * Registers the endpoint for getting a post id by url.
	 * @hook prc_api_endpoints
	 * @param array $endpoints
	 * @return array
	 */
	public function register_endpoint($endpoints) {
		array_push($endpoints, array(
			'route' 			  => '/utils/postid-by-url',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_get_postid_by_url' ),
			'args'                => array(
				'url' => array(
					'validate_callback' => function( $param, $request, $key ) {
						$url = filter_var( $param, FILTER_VALIDATE_URL );
						if ( $url === false ) {
							return false;
						}
						return true;
					},
				),
			),
			'permission_callback' => function () {
				return user_can( get_current_user_id(), 'edit_posts' );
			},
		));
		return $endpoints;
	}
}
