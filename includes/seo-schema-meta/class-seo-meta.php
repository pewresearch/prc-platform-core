<?php
namespace PRC\Platform\SEO;

class Meta {
	protected $post_types = array();
	protected $meta_key   = 'SEO';
	public function __construct( $loader ) {
		$this->post_types = get_post_types();
		$loader->add_action( 'init', $this, 'register_meta' );
		$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
	}
	public function register_meta() {
		foreach ( $this->post_types as $post_type ) {
			register_post_meta(
				$post_type,
				$this->meta_key,
				array(
					'show_in_rest'      => array(
						'schema' => array(
							'type'       => 'object',
							'properties' => array(
								'title'       => array(
									'type'        => 'string',
									'description' => 'The SEO title for the post.',
								),
								'description' => array(
									'type'        => 'string',
									'description' => 'The SEO description for the post.',
								),
								'image'       => array(
									'type'        => 'string',
									'description' => 'The SEO image for the post.',
								),
							),
						),
					),
					'single'            => true,
					'type'              => 'object',
					'sanitize_callback' => function ( $meta_value ) {
						return $this->sanitize_meta( $meta_value );
					},
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	public function register_rest_fields() {
		foreach ( $this->post_types as $post_type ) {
			register_rest_field(
				$post_type,
				$this->meta_key,
				array(
					'get_callback'    => function ( $object ) {
						return $this->get_meta( $object['id'] );
					},
					'update_callback' => function ( $meta_value, $object ) {
						return $this->update_meta( $meta_value, $object['id'] );
					},
					'schema'          => array(
						'type'       => 'object',
						'properties' => array(
							'title'       => array(
								'type'        => 'string',
								'description' => 'The SEO title for the post.',
							),
							'description' => array(
								'type'        => 'string',
								'description' => 'The SEO description for the post.',
							),
							'image'       => array(
								'type'        => 'string',
								'description' => 'The SEO image for the post.',
							),
						),
					),
				)
			);
		}
	}

	public function get_meta( $post_id ) {
		$meta = get_post_meta( $post_id, 'prc_seo', true );
		return $meta;
	}

	public function update_meta( $meta_value, $post_id ) {
		$meta_value = $this->sanitize_meta( $meta_value );
		return update_post_meta( $post_id, 'prc_seo', $meta_value );
	}

	public function sanitize_meta( $meta_value ) {
		$meta_value = wp_parse_args(
			$meta_value,
			array(
				'title'       => '',
				'description' => '',
				'image'       => '',
			)
		);

		$meta_value['title']       = sanitize_text_field( $meta_value['title'] );
		$meta_value['description'] = sanitize_text_field( $meta_value['description'] );
		$meta_value['image']       = esc_url_raw( $meta_value['image'] );

		return $meta_value;
	}
}
