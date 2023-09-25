<?php
namespace PRC\Platform;
use WP_Error;

class Block_Editor {
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

	public static $handle = 'prc-platform-block-editor';

	public static $wide_template_post_types = array(
		'homepage',
		'block_module',
		'interactive',
	);

	public static $wide_template_centered_content_post_types = array(
		'fact-sheet',
	);

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
	 * Rather than disabling variations one by one we're going to assume ALL should be disabled and instead these should be whitelisted.
	 * @return void
	 */
	public function allowed_embed_variations() {
		$allowed_embed_variations = array(
			'youtube',
			'vimeo',
			'twitter',
			'facebook',
			'instagram',
			'wordpress',
			'soundcloud',
			'flickr',
			'crowdsignal',
			'reddit',
			'imgur',
			'issuu',
			'screencast',
			'scribd',
			'slideshare',
			'speaker-deck',
			'tiktok',
			'ted',
			'tumblr',
			'videopress',
			'wordpress-tv',
			'wolfram-cloud',
		);

		return apply_filters( 'prc_platform_block_editor_allowed_embed_variations', $allowed_embed_variations );
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}

	public function print_wide_editor_style() {
		$width = 1136;
		ob_start();
		?>
.wp-block-post-content.wp-block-post-content-is-layout-flow {
	max-width: var(--wp--custom--max-width)!important;
	margin-left: auto;
	margin-right: auto;
}

.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
	max-width: 100%!important;
	margin-left: auto;
	margin-right: auto;
}
		<?php
		return normalize_whitespace(ob_get_clean());
	}

	public function print_wide_editor_centered_content_style() {
		$width = 1136;
		ob_start();
		?>
.wp-block-post-content.wp-block-post-content-is-layout-flow {
	max-width: var(--wp--custom--max-width)!important;
	margin-left: auto;
	margin-right: auto;
}

.editor-styles-wrapper .block-editor-block-list__layout.is-root-container > :where(:not(.alignleft):not(.alignright):not(.alignfull)) {
	max-width: 100%!important;
	margin-left: auto;
	margin-right: auto;
}

.wp-block-post-content.wp-block-post-content-is-layout-flow > .wp-block {
	max-width: var(--wp--custom--content-size)!important;
	margin-left: auto;
	margin-right: auto;
}
		<?php
		return normalize_whitespace(ob_get_clean());
	}

	public function post_type_template_css_defaults() {
		if ( !is_admin() ) {
			return;
		}
		$screen = get_current_screen();
		if ( in_array($screen->post_type, array_merge(
			self::$wide_template_post_types,
			self::$wide_template_centered_content_post_types
		)) ) {
			// enqueue the stylesheet
			$wide_style = in_array($screen->post_type, self::$wide_template_centered_content_post_types) ? $this->print_wide_editor_centered_content_style() : $this->print_wide_editor_style();
			wp_add_inline_style( 'wp-block-library', $wide_style );
		}
	}
}
