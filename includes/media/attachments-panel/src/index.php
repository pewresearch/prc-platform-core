<?php
use \WPackio as WPackio;

class Media_Assets extends PRC_Block_Editor_Plugins {
	// The user id of the producer who will beta test this functionality.
	// Because of this, this functionality needs to not interfere with normal publishing.
	public $beta_test_user = 578;

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'enqueue_block_editor_assets', array( $this, 'register_plugin' ) );
			add_action( 'rest_api_init', array( $this, 'register_rest_endpoints' ) );
		}
	}

	/**
	 * Determine if the current user should have access to this feature during beta.
	 */
	private function is_beta_test_user() {
		$user_id = get_current_user_id();
		return is_super_admin($user_id) || $user_id === $this->beta_test_user;
	}

	public function register_plugin() {
		if ( ! $this->is_beta_test_user() ) {
			return;
		}
		// Check if we are in a valid post type such as post, page, blog, fact-sheet, interactive
		if ( ! in_array( parent::get_wp_admin_current_post_type(), array( 'page', 'post', 'fact-tank', 'fact-sheets' ), true ) ) {
			return;
		}
		$enqueue = new WPackio( 'prcBlockPlugins', 'dist', parent::$version, 'plugin', parent::$plugin_dir );

		$enqueue->enqueue(
			'plugins',
			'media-assets-panel',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array( 'lodash' ),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
	}

	public function register_rest_endpoints() {
		register_rest_route(
			'prc-api/v2',
			'/media-assets',
			array(
				'methods'  => 'GET',
				'callback' => array( $this, 'get_media_assets_restfully' ),
				'args'                => array(
					'postId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return $this->is_beta_test_user() && current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function get_media_assets_restfully( $request ) {
		$post_id = $request->get_param( 'postId' );
		return $this->get_media_assets_by_post_id( $post_id );
	}

	public function get_media_assets_by_post_id( $post_id ) {
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

new Media_Assets( true );
