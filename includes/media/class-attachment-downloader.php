<?php
namespace PRC\Platform;
use WP_Error;

/**
 * Handles the /download attachment URL rewrite. When a user visits an attachment page URL with /download/ at the end, the attachment will be downloaded.
 * @package
 */
class Attachment_Downloader {
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

	/**
	 * Download Image Attachments by adding /download/ to the end of an attachment page URL
	 *
	 * @param  [type] $rules [description]
	 * @return [type]        [description]
	 */
	public function attachment_download_rewrite() {
		if ( ! function_exists( 'hm_add_rewrite_rule' ) ) {
			return new WP_Error( 'hm-rewrite-missing', 'HM Rewrite plugin is required to use this feature' );
		}
		hm_add_rewrite_rule(array(
			'regex'            => '[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/download/?$',
			'query'            => 'index.php?attachment=$matches[1]&attachment-download=1',
			'request_callback' => function() {
				$this->download_attachment_template( null );
			},
		));
	}

	/**
	 * Add a query var to enable attachment download.
	 *
	 * @param array $query_vars Query vars.
	 * @return array
	 */
	public function download_attachment_query_vars( $query_vars ) {
		$query_vars[] = 'attachment-download';
		return $query_vars;
	}

	/**
	 * Check if the 'attachment-download' query var is set.
	 * If it is, then the user is trying to download an image attachment.
	 *
	 * Check if the path to the file exists.
	 * If it doesn't, throw a 404.
	 *
	 * Check if the file extension is an image extension.
	 * If it isn't, throw a 404.
	 *
	 * Create a new filename for the image attachment.
	 *
	 * Serve up the image file, enjoy!
	 *
	 * @param string $template The path to the current template.
	 * @return string $template The path to the current template.
	 */

	public function download_attachment_template( $template ) {
		global $post, $wp_query;
		// If the 'attachment-download' query var hasn't been set then we're not interested....
		if ( ! get_query_var( 'attachment-download' ) ) {
			return $template;
		}

		// Get the path of the file on the file system...
		$file = get_attached_file( $post->ID );

		// The file doesn't exist or there is another problem... Throw a 404 and then bail....
		if ( ! $file || ! file_exists( $file ) ) {
			$wp_query->set_404();
			$template = TEMPLATEPATH . '/404.php';
			return $template;
		}

		// Lets make sure the attachment is an image...
		$image_exts = array( 'jpg', 'jpeg', 'jpe', 'gif', 'png', 'webp' );
		$ext        = preg_match( '/\.([^.]+)$/', $file, $matches ) ? strtolower( $matches[1] ) : false;

		// Not an image? Throw a 404 and then bail.
		if ( ! $ext || ! in_array( $ext, $image_exts ) ) {
			$wp_query->set_404();
			$template = TEMPLATEPATH . '/404.php';
			return $template;
		}

		// Create a new filename for the image...
		$file_name = sanitize_title( $post->post_title ) . '.' . $ext;

		// Serve up the image file.
		header( "Content-type:image/$ext" );
		header( 'Content-Disposition:attachment;filename=' . $file_name );
		readfile( $file );

		die();
	}
}
