<?php
/**
 * Permalink Rewrites class for managing permalink structure and query variables.
 *
 * @package PRC\Platform
 * @since   1.0.0
 */

namespace PRC\Platform;

use WP_Error;
use WP_REST_Request;
use WP_Speculation_Rules;
/**
 * Permalink Rewrites class for managing permalink structure and query variables.
 *
 * @package PRC\Platform
 * @since   1.0.0
 */
class Permalink_Rewrites {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
		require_once plugin_dir_path( __FILE__ ) . 'class-url-helper.php';
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_filter( 'wp_speculation_rules_configuration', $this, 'manage_speculative_loading' );
			$loader->add_action( 'wp_load_speculation_rules', $this, 'define_additional_speculation_rules' );
			$loader->add_action( 'init', $this, 'register_rewrites' );
			$loader->add_action( 'init', $this, 'register_tags' );
			$loader->add_filter( 'query_vars', $this, 'register_query_vars' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
		}
	}

	/**
	 * Manage speculative loading configuration.
	 * We prefetch "moderate" eageasrness for the PRC Platform.
	 * This means as users hover over links we will prefetch, rather than prerender
	 * the link for them. This gets all the assets on the page loaded and ready to go.
	 *
	 * @hook wp_speculation_rules_configuration
	 *
	 * @param array $config The configuration array.
	 * @return array The modified configuration array.
	 */
	public function manage_speculative_loading( $config ) {
		if ( is_array( $config ) ) {
			$config['mode']      = 'prefetch';
			$config['eagerness'] = 'moderate';
		}
		return $config;
	}

	/**
	 * Define additional speculation rules.
	 *
	 * We want to eagerly prefetch the following urls:
	 * - /publications/
	 * - /topics/
	 * - /topics-categorized/
	 * - /topics-condensed/
	 * - /tools-and-resources/
	 *
	 * This means as users hit page with links to these urls present on the page,
	 * we will automatically prefetch the assets for these pages without requiring
	 * them to hover or interact with the links in question.
	 *
	 * @hook wp_load_speculation_rules
	 *
	 * @param \WP_Speculation_Rules $speculation_rules The speculation rules.
	 */
	public function define_additional_speculation_rules( \WP_Speculation_Rules $speculation_rules ) {
		$speculation_rules->add_rule(
			'prefetch',
			'prc-platform-eager-prefetch-rule',
			array(
				'source'    => 'list',
				'urls'      => array(
					'/publications/',
					'/topics/',
					'/topics-categorized/',
					'/topics-condensed/',
					'/tools-and-resources/',
				),
				'eagerness' => 'eager',
			)
		);
	}

	/**
	 * Registers the rewrite rules for PRC Platform with WordPress.
	 *
	 * @hook init
	 * @uses prc_platform_rewrite_rules
	 */
	public function register_rewrites() {
		if ( 1 === get_current_blog_id() ) {
			return;
		}
		$rewrite_rules = apply_filters( 'prc_platform_rewrite_rules', array() );
		foreach ( $rewrite_rules as $rule => $query ) {
			add_rewrite_rule( $rule, $query, 'top' );
		}
	}

	/**
	 * Registers the rewrite tags for PRC Platform with WordPress.
	 *
	 * @hook init
	 * @uses prc_platform_rewrite_tags
	 */
	public function register_tags() {
		if ( 1 === get_current_blog_id() ) {
			return;
		}
		$rewrite_tags = apply_filters( 'prc_platform_rewrite_tags', array() );
		foreach ( $rewrite_tags as $tag ) {
			add_rewrite_tag( $tag['tag'], $tag['regex'], $tag['query'] );
		}
	}

	/**
	 * Registers any additional query vars for PRC Platform with WordPress.
	 *
	 * @hook query_vars
	 * @uses prc_platform_rewrite_query_vars
	 *
	 * @param array $query_vars The query vars.
	 * @return array $query_vars The modified query vars.
	 */
	public function register_query_vars( $query_vars ) {
		if ( 1 === get_current_blog_id() ) {
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
	 *
	 * @param WP_REST_Request $request The request.
	 * @return WP_Error|array The post id and post type.
	 */
	public function restfully_get_postid_by_url( WP_REST_Request $request ) {
		$url = $request->get_param( 'url' );
		if ( empty( $url ) ) {
			return new WP_Error( 'no-url-provided', __( 'No url provided', 'my_textdomain' ), array( 'status' => 400 ) );
		}
		$post_id = \wpcom_vip_url_to_postid( $url );
		if ( 0 === $post_id ) {
			return new WP_Error( 'no-post-found', __( 'No post found', 'my_textdomain' ), array( 'status' => 404 ) );
		}
		return array(
			'postId'   => $post_id,
			'postType' => get_post_type( $post_id ),
		);
	}

	/**
	 * Registers the endpoint for getting a post id by url.
	 *
	 * @hook prc_api_endpoints
	 *
	 * @param array $endpoints The endpoints.
	 * @return array The modified endpoints.
	 */
	public function register_endpoint( $endpoints ) {
		array_push(
			$endpoints,
			array(
				'route'               => '/utils/postid-by-url',
				'methods'             => 'GET',
				'callback'            => array( $this, 'restfully_get_postid_by_url' ),
				'args'                => array(
					'url' => array(
						'validate_callback' => function ( $param, $request, $key ) {
							$url = filter_var( $param, FILTER_VALIDATE_URL );
							if ( false === $url ) {
								return false;
							}
							return true;
						},
					),
				),
				'permission_callback' => function () {
					return user_can( get_current_user_id(), 'edit_posts' );
				},
			)
		);
		return $endpoints;
	}
}
