<?php
namespace PRC\Platform;
use WP_Error;

class Convert_To_Blocks {
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

	public static $handle = 'prc-platform-convert-to-blocks';

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

	public function signal_conversion_needed($shortcode_name = null) {
		global $post;
		if ( ! $post ) {
			return;
		}
		if ( null === $shortcode_name ) {
			return new WP_Error( self::$handle, 'You must pass a shortcode name to signal conversion needed' );
		}
		$meta = get_post_meta( $post->ID, '_migration_legacy_shortcodes_detected', true );
		if ( ! $meta ) {
			update_post_meta( $post->ID, '_migration_legacy_shortcodes_detected', array(
				$shortcode_name,
			) );
		} else {
			// check if the shortcode is already in the array
			if ( ! in_array( $shortcode_name, $meta ) ) {
				$meta[] = $shortcode_name;
				update_post_meta( $post->ID, '_migration_legacy_shortcodes_detected', $meta );
			}
		}
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function register_legacy_shortcodes() {
		add_shortcode( 'tweetable', function( $attr, $content = null ) {
			$this->signal_conversion_needed('tweetable');
			return $content;
		} );
		add_shortcode( 'tweetable_text', function( $attr, $content = null ) {
			$this->signal_conversion_needed('tweetable_text');
			return $content;
		} );
		add_shortcode( 'pullquote', function( $attr, $content = null ) {
			$this->signal_conversion_needed('pullquote');
			return $content;
		} );
		add_shortcode( 'subheading', function( $attr, $content = null ) {
			$this->signal_conversion_needed('subheading');
			return $content;
		} );
		add_shortcode( 'sub_heading', function( $attr, $content = null ) {
			$this->signal_conversion_needed('sub_heading');
			return $content;
		} );
		add_shortcode( 'divider', function( $attr, $content = null ) {
			$this->signal_conversion_needed('divider');
			return $content;
		} );
		add_shortcode( 'line_divider', function( $attr, $content = null ) {
			$this->signal_conversion_needed('line_divider');
			return $content;
		} );
		add_shortcode( 'collapsible', function( $attr, $content = null ) {
			$this->signal_conversion_needed('collapsible');
			return $content;
		} );
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
		if ( ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}
}
