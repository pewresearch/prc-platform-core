<?php
namespace PRC\Platform;
use WP_Error;

class Related_Posts {
	public static $cache_key = 'relatedPosts';
	public static $cache_time = 1 * HOUR_IN_SECONDS;
	protected static $enabled_post_types = array( 'post', 'short-read', 'decoded' );
	public static $meta_key = 'relatedPosts'; // related_posts
	public static $schema_properties = array(
		'date' 	   => array(
			'type' => 'string',
		),
		'key' 	   => array(
			'type' => 'string',
		),
		'link' 	   => array(
			'type' => 'string',
		),
		'permalink' => array(
			'type' => 'string',
		),
		'postId' 	   => array(
			'type' => 'integer',
		),
		'title' 	   => array(
			'type' => 'string',
		),
		'label' => array(
			'type' => 'string',
		),
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-related-posts';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . 'class-related-posts-api.php';
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_meta_fields' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_action( 'wpcom_vip_cache_pre_execute_purges', $this, 'clear_cache_on_purge' );
			$loader->add_action( 'prc_platform_on_update', $this, 'clear_cache_on_update' );
		}
	}

	public function register_meta_fields() {
		foreach ( self::$enabled_post_types as $post_type ) {
			register_post_meta(
				$post_type,
				self::$meta_key,
				array(
					'single'        => true,
					'type'          => 'array',
					'description'   => 'Array of custom related posts.',
					'show_in_rest'  => array(
						'schema' => array(
							'items' => array(
								'type'       => 'object',
								'properties' => self::$schema_properties
							),
						),
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
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

	/**
	 * @hook enqueue_block_editor_assets
	 * @return void
	 */
	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered )  ) {
			// get current screen
			$screen = get_current_screen();
			// check if the post type is allowed
			if ( in_array( $screen->post_type, self::$enabled_post_types ) ) {
				wp_enqueue_script( self::$handle );
			}
		}
	}

	/**
	 * Supports VIP caching to clear cache when requested by url.
	 * @hook wpcom_vip_cache_pre_execute_purges
	 * @param mixed $urls
	 * @return void
	 */
	public function clear_cache_on_purge( $urls ) {
		foreach ( $urls as $url ) {
			$url_to_post_id = url_to_postid($url);
			if ( 0 !== $url_to_post_id ) {
				wp_cache_delete( $url_to_post_id, self::$cache_key );
			}
		}
	}

	/**
	 * @hook prc_platform_on_update
	 * @param mixed $post
	 */
	public function clear_cache_on_update( $post ) {
		$post_id = $post->ID;
		wp_cache_delete( $post_id, self::$cache_key );
	}

	/**
	 * @hook prc_related_posts
	 * @param mixed $post_id
	 * @param mixed $args
	 * @return void
	 */
	public function process($post_id, $args = array()) {
		$api = new Related_Posts_API($post_id, $args);
		return $api->query();
	}
}
