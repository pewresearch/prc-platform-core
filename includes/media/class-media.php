<?php
namespace PRC\Platform;

/**
 * The media "manager" for the PRC Platform. Manages image sizes, art direction, attachment downloads, and more.
 * @package
 */
class Media {
	/**
	 * The media sizes defined in media-sizes.json
	 * @var mixed
	 */
	public $media_sizes = array();

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;

		// load the media-sizes.json file into the $media_sizes array.
		$this->media_sizes = \wp_json_file_decode(
			plugin_dir_path( dirname( __FILE__ ) ) . 'media/media-sizes.json',
			array( 'associative' => true)
		);

		// Load attachment downloader. /{attachment}/download url schema
		require_once plugin_dir_path( __FILE__ ) . 'class-attachment-downloader.php';
		// Load art direction system (replaces featured images).
		require_once plugin_dir_path( __FILE__ ) . 'art-direction/class-art-direction.php';
		// Load the attachment report functionality.
		require_once plugin_dir_path( __FILE__ ) . 'attachment-report/class-attachment-report.php';
		// Load the attachment panel functionality.
		require_once plugin_dir_path( __FILE__ ) . 'attachments-panel/class-attachments-panel.php';

		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'upload_size_limit', $this, 'enforce_maximum_file_size_limit' );
			$loader->add_action( 'admin_init', $this, 'enforce_image_defaults' );
			$loader->add_action( 'init', $this, 'register_image_sizes' );
			$loader->add_action( 'enable-media-replace-upload-done', $this, 'replace_media_clear_cdn', 100, 3 );
			$loader->add_filter( 'image_size_names_choose', $this, 'filter_image_sizes_dropdown' );
			$loader->add_filter( 'vip_go_srcset_enabled', $this, 'enable_srcset' );
			$loader->add_filter(
				'default_site_option_ms_files_rewriting', $this,'handle_legacy_multisite_files_rewrites', 1000
			);
			$loader->add_filter( 'oembed_dataparse', $this, 'youtube_remove_related', 10, 3 );
			$loader->add_filter( 'upload_mimes', $this, 'allow_json_uploads' );

			new Attachment_Downloader( $this->version, $loader );
			new Art_Direction( $this->version, $loader );
			new Attachment_Report( $this->version, $loader );
			new Attachments_Panel( $this->version, $loader );
		}
	}

	public function enforce_maximum_file_size_limit($limit) {
		return 15 * 1024 * 1024; // 15MB in bytes
	}

	/**
	 * Enforce a default image size, and default images to link to their attachment(post).
	 */
	public function enforce_image_defaults() {
		if ( 'post' !== get_option( 'image_default_link_type' ) ) {
			update_option( 'image_default_link_type', 'post' );
		}
		if ( '640-wide' !== get_option( 'image_default_size' ) ) {
			update_option( 'image_default_size', '640-wide' );
		}
	}

	/**
	 * Define available media sizes
	 */
	public function register_image_sizes() {
		if ( empty( $this->media_sizes ) ) {
			return;
		}

		add_theme_support( 'post-thumbnails' );
		foreach( $this->media_sizes as $name => $size ) {
			add_image_size( $name, $size['width'], $size['height'], $size['crop'] );
		}
	}

	public function filter_image_sizes_dropdown( $sizes ) {
		foreach ( $this->media_sizes as $name => $size ) {
			$sizes[$name] = $size['label'];
		}
		return $sizes;
	}

	/**
	 * Clears the cdn cache for a media url on successful upload replacement.
	 *
	 * @param mixed $target_url
	 * @param mixed $source_url
	 * @param mixed $post_id
	 * @return void
	 */
	public function replace_media_clear_cdn( $target_url, $source_url, $post_id ) {
		// If the wpcom_vip_purge_edge_cache_for_url() function is defined, then we can clear the CDN cache.
		if ( function_exists( 'wpcom_vip_purge_edge_cache_for_url' ) && $target_url ) {
			return \wpcom_vip_purge_edge_cache_for_url( $target_url );
		}
	}

	/**
	 * @hook vip_go_srcset_enabled
	 * @return true
	 */
	public function enable_srcset() {
		return true;
	}

	public function handle_legacy_multisite_files_rewrites() {
		return false;
	}

	/**
	 * Remove "related" from Youtube embeds
	 * @hook oembed_dataparse
	 * @param mixed $return
	 * @param mixed $data
	 * @param mixed $url
	 * @return mixed
	 */
	public function youtube_remove_related( $return, $data, $url ) {
		$is_youtube = strpos( $data->provider_url, 'youtube.com' );
		if ( $is_youtube && ! empty( $return ) && is_string( $return ) ) {
			$return = str_replace( '?feature=oembed', '?feature=oembed&rel=0', $return );
		}
		return $return;
	}

	/**
	 * We do not want images without captions to have <p> tags so we're going to be stripping those.
	 * @hook the_content
	 *
	 * @param  $content = post content search for img tags.
	 * @return filtered content with <p><img changed to <img> we'll manually be wrapping in a <figure> tag w JS.
	 * @author Seth
	 */
	public function remove_p_around_img( $content ) {
		$content = preg_replace( '/<p>\s*(<a .*>)?\s*(<img .* \/>)\s*(<\/a>)?\s*<\/p>/iU', '\1\2\3', $content );
		return $content;
	}

	/**
	 * @hook upload_mimes
	 * @param mixed $existing_mimes
	 * @return mixed
	 */
	public function allow_json_uploads($existing_mimes) {
		$existing_mimes['json'] = 'application/json';
		return $existing_mimes;
	}
}
