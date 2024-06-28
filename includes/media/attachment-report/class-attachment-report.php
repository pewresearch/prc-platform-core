<?php
namespace PRC\Platform;
use WP_Error;
use WP_REST_Request;
class Attachment_Report {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-attachment-report';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'query_vars', $this, 'register_query_vars' );
			$loader->add_action( 'wp_enqueue_scripts', $this, 'enqueue_frontend_assets' );
			$loader->add_filter( 'the_content', $this, 'add_report_to_content' );
			$loader->add_action( 'admin_enqueue_scripts', $this, 'register_assets' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
			$loader->add_action( 'ac/ready', $this, 'register_column' );
		}
	}

	public function register_query_vars( $vars ) {
		$vars[] = 'attachmentsReport';
		return $vars;
	}

	public function register_column() {
		// Use the hook below if you only want a free column
		add_action( 'ac/column_types', function ( \AC\ListScreen $list_screen ) {
			// require the acp-column.php file in this directory
			require_once( plugin_dir_path( __FILE__ ) . 'class-acp-column.php' );

			if ( 'post' === $list_screen->get_key() ) {
				// Register a column for the Free version WITHOUT pro features
				$list_screen->register_column_type( new \PRC_PLATFORM_COLUMNS\PRC_ATTACHMENTS_COLUMN() );
			}
		} );
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';

		$script_dependencies = array_merge(
			$asset_file['dependencies'],
			array( 'media-editor' )
		);

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$script_dependencies,
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array( 'wp-components' ),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_block_plugin_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	public function enqueue_frontend_assets() {
		$registered = $this->register_assets();
		if ( ! is_admin() && ! is_wp_error( $registered ) && get_query_var(
			'attachmentsReport',
			false
		) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	public function add_report_to_content( $post_content ) {
		if ( get_query_var( 'attachmentsReport', false ) ) {
			$post_id = get_the_ID();
			$post_type = get_post_type( $post_id );
			$post_content = '<div id="js-prc-attachments-report-frontend" data-postType="'.$post_type.'" data-postId="'.$post_id.'"></div>';
		}
		return $post_content;
	}

	/**
	 * Adds the attachment report endpoint to the REST API
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return array
	 */
	public function register_endpoint($endpoints) {
		array_push($endpoints, array(
			'route' => '/attachments-report/get/(?P<post_id>\d+)',
			'methods'  => 'GET',
			'callback' => array( $this, 'get_attachments_restfully' ),
			'args'                => array(
				'mime_type' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
					'default' => 'all',
				),
				'include_children' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_bool( $param);
					},
					'default' => true,
				)
			),
			'permission_callback' => function () {
				return true;
			},
		));
		return $endpoints;
	}

	public function get_attachments_by_post_id( $post_id, $mime_type = 'image' ) {
		$attachments = get_attached_media( 'all' === $mime_type ? '' : $mime_type, $post_id );
		if ( empty( $attachments ) ) {
			return array();
		}

		$new_attachments = array();
		foreach ( $attachments as $attachment ) {
			$meta = get_post_meta( $attachment->ID, '_wp_attachment_metadata', true );
			$width = 0;
			$height = 0;
			if ( !empty( $meta ) ) {
				$width = array_key_exists('width', $meta) ? $meta['width'] : null;
				$height = array_key_exists('height', $meta) ? $meta['height'] : null;
			}
			$new_attachments[] = array(
				'id' => $attachment->ID,
				'title' => $attachment->post_title,
				'caption' => $attachment->post_excerpt,
				'description' => $attachment->post_content,
				'alt' => get_post_meta( $attachment->ID, '_wp_attachment_image_alt', true ),
				'mimeType' => $attachment->post_mime_type,
				'url' => wp_get_attachment_url( $attachment->ID ),
				'thumbnailUrl' => wp_get_attachment_thumb_url( $attachment->ID ),
				'squareUrl' => wp_get_attachment_image_url( $attachment->ID, 'square' ),
				'width' => $width,
				'height' => $height,
				'owner' => $post_id,
			);
		}
		return $new_attachments;
	}

	/**
	 * Returns an array of attachments, including their caption, description, and alt text for a given post object.
	 *
	 * @param mixed $object
	 * @return void
	 */
	public function get_attachments_restfully( WP_REST_Request $request ) {
		$post_id = $request->get_param( 'post_id' );
		$mime_type = $request->get_param( 'mime_type' );
		$include_children = $request->get_param( 'include_children' );

		$post_id = (int) $post_id;
		// Is this a parent post or child post, if so change the post_id to the parent post.
		$post_parent = wp_get_post_parent_id( $post_id );
		if ( 0 !== $post_parent && false !== $post_parent ) {
			$post_id = $post_parent;
		}

		$attachments = $this->get_attachments_by_post_id( $post_id, $mime_type );

		if ( $include_children ) {
			$this_post_post_type = get_post_type( $post_id );
			$children = get_children( array(
				'post_parent' => $post_id,
				'post_type' => $this_post_post_type,
				'numberposts' => 25, // HARD LIMIT of 25 children
				'post_status' => array( 'publish', 'draft' ),
			) );
			$child_attachments = array();
			foreach ( $children as $child ) {
				$child_attachments[] = $this->get_attachments_by_post_id( $child->ID, $mime_type );
			}
			$attachments = array_merge( $attachments, ...$child_attachments );
		}

		// Ensure that we don't have any empty arrays in the attachments array
		// $attachments = array_filter( $attachments );

		return array(
			'postTitle' => get_the_title( $post_id ),
			'attachments' => $attachments,
		);
	}
}
