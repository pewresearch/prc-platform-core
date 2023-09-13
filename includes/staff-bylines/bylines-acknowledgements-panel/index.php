<?php
namespace PRC\Platform;
use WP_Error;

class Bylines_Acknowledgements_Panel {
	protected static $enabled_post_types = array( 'post', 'short-read', 'interactive', 'fact-sheet', 'quiz', 'chart' );
	protected static $handle = 'prc-platform-bylines-acknowledgements-panel';
	public static $version = '4.0.0';

	public function __construct() {

	}

	public function get_wp_admin_current_post_type() {
		global $post, $typenow, $current_screen;
		if ( $post && $post->post_type ) {
			return $post->post_type;
		} elseif ( $typenow ) {
			return $typenow;

		} elseif ( $current_screen && $current_screen->post_type ) {
			return $current_screen->post_type;

		} elseif ( isset( $_REQUEST['post_type'] ) ) {
			return sanitize_key( $_REQUEST['post_type'] );
		}
		return null;
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
	 * Enqueue block plugin assets
	 * @hook enqueue_block_editor_assets
	 */
	public function enqueue_assets() {
		$this->register_assets();
		$registered = wp_script_is( self::$handle, 'registered' );
		if ( is_admin() && $registered && in_array($this->get_wp_admin_current_post_type(), self::$enabled_post_types, true) ) {
			wp_enqueue_script( self::$handle );
		}
	}
}
