<?php


use \WPackio as WPackio;

class Bylines extends PRC_Block_Editor_Plugins {
	public static $version = '1.1.2';
	public static $field_schema = array(
		'items' => array(
			'type'       => 'object',
			'properties' => array(
				'key'    => array(
					'type' => 'string',
				),
				'termId' => array(
					'type' => 'integer',
				),
			),
		),
	);
	//@TODO: Should really make this pull the info directly from the post type.
	protected static $enabled_post_types = array( 'post', 'short-read', 'interactives', 'fact-sheets', 'stub', 'mini-course' );

	public function __construct( $init = false ) {
		if ( true === $init ) {
			add_action( 'enqueue_block_editor_assets', array( $this, 'register_plugin' ) );
			add_action( 'init', array( $this, 'register_meta_fields' ) );
			add_filter( 'prc_default_post_header_args', array( $this, 'determine_bylines_display' ), 9, 1 );
		}
	}

	public function register_plugin() {
		if ( ! in_array( parent::get_wp_admin_current_post_type(), self::$enabled_post_types, true ) ) {
			return;
		}
		$enqueue = new WPackio( 'prcBlockPlugins', 'dist', self::$version, 'plugin', parent::$plugin_dir );
		$enqueue->enqueue(
			'plugins',
			'bylines-acknowledgements',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array(),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
	}

	public function determine_bylines_display( $args ) {
		$args['bylines'] = get_post_meta( (int) $args['post_id'], 'displayBylines', true );
		return $args;
	}

	public function register_meta_fields() {
		foreach ( self::$enabled_post_types as $post_type ) {
			register_post_meta(
				$post_type,
				'bylines',
				array(
					'single'        => true,
					'type'          => 'array',
					'show_in_rest'  => array(
						'schema' => self::$field_schema,
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);

			register_post_meta(
				$post_type,
				'acknowledgements',
				array(
					'single'        => true,
					'type'          => 'array',
					'show_in_rest'  => array(
						'schema' => self::$field_schema,
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);

			register_post_meta(
				$post_type,
				'displayBylines',
				array(
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'boolean',
					'default'       => true,
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}
}

new Bylines( true );
