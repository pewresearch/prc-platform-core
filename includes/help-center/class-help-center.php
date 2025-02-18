<?php

/**
 * Help Center
 * This class creates the help center app to expose the PRC Wiki to the editor.
 *
 * @package PRC\Platform
 */

 namespace PRC\Platform;
 use WP_Query;
 use WP_Error;

 /**
  * Help Center
  */
class Help_Center {
  public static $handle = 'prc-platform-help-center';


  /**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints');
		}
	}

	/**
	 * Register endpoint for getting 10 most recent wiki articles, and to search for articles.
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
	 */

	public function register_endpoints($endpoints) {
		array_push($endpoints, array(
			'route' => 'help-center/get-recent-wiki-articles',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_get_recent_wiki_articles' ),
			'permission_callback' => function () {
				return true;
				// return current_user_can('read');
			},
		));

		array_push($endpoints, array(
			'route' => 'help-center/search-wiki-articles',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_search_wiki_articles' ),
			'args'                => array(
				'search' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
				// return current_user_can('read');
			},
		));
		return $endpoints;
	}

	/**
	 * Get the 10 most recent wiki articles.
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
	 */
	public function restfully_get_recent_wiki_articles() {
		// switch to the wiki blog to get the articles (id 17)
		// get most recently modified articles first.
		$articles = array();
		$query_args = array(
			'post_type' => 'documentation',
			'posts_per_page' => 10,
			'orderby' => 'date',
			'order' => 'DESC',
		);

		switch_to_blog( 17 );
		$query = new WP_Query( $query_args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = get_the_ID();
				$articles[] = array(
					'postId' => $post_id,
					'url' => get_permalink( $post_id ),
					'title' => get_the_title(),
					'date' => get_the_date(),
					'excerpt' => get_the_excerpt(),
					'content' => apply_filters( 'the_content', get_the_content() ),
				);
			}
		}
		wp_reset_postdata();
		restore_current_blog();
		return $articles;
	}

	/**
	 * Search for wiki articles.
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
	 * @param WP_REST_Request $request
	 * @return array
	 * @throws WP_Error
	 */
	public function restfully_search_wiki_articles( $request ) {
		$search = $request->get_param( 'search' );
		if ( ! $search ) {
			return new WP_Error( 'no_search_term', 'No search term provided', array( 'status' => 400 ) );
		}

		$articles = array();
		$query_args = array(
			'post_type' => 'documentation',
			'posts_per_page' => 10,
			'orderby' => 'date',
			'order' => 'DESC',
			's' => $search,
			'es' => true,
		);

		switch_to_blog( 17 );
		$query = new WP_Query( $query_args );
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id = get_the_ID();
				$articles[] = array(
					'postId' => $post_id,
					'url' => get_permalink( $post_id ),
					'title' => get_the_title(),
					'date' => get_the_date(),
					'excerpt' => get_the_excerpt(),
					'content' => apply_filters( 'the_content', get_the_content() ),
				);
			}
		}
		wp_reset_postdata();
		restore_current_blog();
		return $articles;
	}

  	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';


		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
				wp_enqueue_script( self::$handle );
				wp_enqueue_style( self::$handle );
		}
	}
}
