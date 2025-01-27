<?php
namespace PRC\Platform;

class SEO_Schema_Meta {
	public static $post_types = array();

	public function __construct( $loader ) {
		$this->init( $loader );
	}

	public function init( $loader ) {
		if ( null !== $loader ) {
			new SEO\Title( $loader );
			new SEO\Meta( $loader );
			self::$post_types = get_post_types();
			$loader->add_action( 'wp_head', $this, 'define_head_hook' );
			$loader->add_action( 'wp_footer', $this, 'define_footer_hook' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_panel' );
		}
	}

	/**
	 * @hook wp_head
	 */
	public function define_head_hook() {
		do_action( 'prc_seo_head' );
	}

	/**
	 * @hook wp_footer
	 */
	public function define_footer_hook() {
		do_action( 'prc_seo_footer' );
	}


	/**
	 * @hook enqueue_block_editor_assets
	 */
	public function enqueue_panel() {
		$screen = get_current_screen();
		if ( ! is_admin() || ! in_array( $screen->post_type, self::$post_types ) ) {
			return;
		}

		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$asset_slug = 'prc-platform-seo-panel';
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';

		wp_enqueue_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}
}
