<?php
namespace PRC\Platform;

use WP_Error;
use WP_REST_Request;
use WP_Query;

class Attachments_Panel {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-attachments-panel';

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
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_block_plugin_assets' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
		}
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

	public function register_endpoint($endpoints) {
		array_push($endpoints, array(
			'route' => '/attachments-panel',
			'methods'  => 'GET',
			'callback' => array( $this, 'get_attachments_restfully' ),
			'args'                => array(
				'postId' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		));
		return $endpoints;
	}

	public function get_attachments_restfully( $request ) {
		$post_id = $request->get_param( 'postId' );
		return $this->get_attachments_by_post_id( $post_id );
	}

	public function get_attachments_by_post_id( $post_id ) {
		$media_assets = array();
		$attachments_query = new WP_Query(
			array(
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'post_parent'    => $post_id,
				'posts_per_page' => 50,
				'orderby'        => 'menu_order',
				'order'          => 'ASC',
			)
		);

		if ( $attachments_query->have_posts() ) {
			while ( $attachments_query->have_posts() ) {
				$attachments_query->the_post();
				$media_assets[] = array(
					'id'   => get_the_ID(),
					'title' => get_the_title(),
					'type' => get_post_mime_type(),
					'url' => wp_get_attachment_image_src( get_the_ID(), 'large' )[0], // Why large? Because we don't need the absolute raw image for our preview purposes.
				);
			}
		}

		return $media_assets;
	}
}
