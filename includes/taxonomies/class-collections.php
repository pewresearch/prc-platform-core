<?php
namespace PRC\Platform;

class Collections extends Taxonomies {
	protected static $post_types = array( 'post', 'page', 'fact-sheets','fact-sheet', 'interactives', 'interactive' );
	protected static $taxonomy = 'collection';

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Collections', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Collection', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Collections', 'text_domain' ),
			'all_items'                  => __( 'All collections', 'text_domain' ),
			'parent_item'                => __( 'Parent Collection', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Collection:', 'text_domain' ),
			'new_item_name'              => __( 'New Collection Name', 'text_domain' ),
			'add_new_item'               => __( 'Add New Collection', 'text_domain' ),
			'edit_item'                  => __( 'Edit Collection', 'text_domain' ),
			'update_item'                => __( 'Update Collection', 'text_domain' ),
			'view_item'                  => __( 'View Collection', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate collections with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove collections', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular collections', 'text_domain' ),
			'search_items'               => __( 'Search collections', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No collections', 'text_domain' ),
			'items_list'                 => __( 'Collections list', 'text_domain' ),
			'items_list_navigation'      => __( 'Collections list navigation', 'text_domain' ),
		);
		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		$post_types = apply_filters( "prc_taxonomy_{$taxonomy_name}_post_types", self::$post_types );

		register_taxonomy( $taxonomy_name, $post_types, $args );
	}

	/**
	 * Register the kicker_image field for the collection taxonomy on the REST API
	 * @hook rest_api_init
	 * @return void
	 */
	public function register_kicker_image_rest_field() {
		$taxonomy_name = self::$taxonomy;

		register_rest_field(
			$taxonomy_name,
			'kicker_image',
			array(
				'get_callback'    => array( $this, 'restfully_get_kicker_image' ),
				'update_callback' => null,
				'schema'          => null,
			)
		);
	}

	public function restfully_get_kicker_image( $object, $field_name, $request ) {
		$term_id = $object['id'];
		if ( ! $term_id ) {
			return null;
		}
		$kicker_image_id = get_term_meta( $term_id, 'kicker', true );
		$kicker_image = wp_get_attachment_image_src( $kicker_image_id, 'full' );
		return array(
			'image_id' => $kicker_image_id,
			'image' => $kicker_image,
		);
	}
}
