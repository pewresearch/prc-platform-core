<?php
namespace PRC\Platform;
use WP_Error;

class XX {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-post-report-package';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
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

	/**
	 * @hook pre_get_posts
	 * @param mixed $query
	 * @return mixed
	 */
	public function hide_back_chapter_posts($query) {
		if ( ! is_admin() && $query->is_main_query() && is_index() ) {
			$query->set( 'post_parent', 0 );
		}
	}

	/**
	 * Modify the post title if it's a child post in the admin view.
	 * @hook the_title
	 * @param title
	 */
	public function indicate_back_chapter_post( $title, $post_id = null ) {
		if ( ! function_exists('get_current_screen') ) {
			return $title;
		}

		// If we're not in admin or if our post_id isn't set return title.
		if ( ! is_admin() || null === $post_id ) {
			return $title;
		}

		$screen = get_current_screen();
		if ( ! $screen || 'edit' !== $screen->parent_base ) {
			return $title;
		}

		if ( 'post' !== get_post_type( $post_id ) ) {
			return $title;
		}

		// Add a dash before the title...
		if ( 0 !== wp_get_post_parent_id( $post_id ) ) {
			$title = '&mdash; ' . $title;
			// add a [Back Chapter] tag to the title...
			$title .= ' [Back Chapter]';
		}

		return $title;
	}
}
