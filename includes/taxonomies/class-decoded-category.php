<?php
namespace PRC\Platform;

class Decoded_Category extends Taxonomies {
	/**
	 * The taxonomy slug.
	 *
	 * @var string
	 */
	protected static $taxonomy = 'decoded-category';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'init', $this, 'register' );
	}

	public function register() {
		$labels = array(
			'name'                       => _x( 'Decoded Category', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Decoded Category', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Decoded Category', 'text_domain' ),
			'all_items'                  => __( 'All Decoded Categories', 'text_domain' ),
			'parent_item'                => __( 'Parent Decoded Category', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Decoded Category:', 'text_domain' ),
			'new_item_name'              => __( 'New Decoded Category', 'text_domain' ),
			'add_new_item'               => __( 'Add Decoded Category', 'text_domain' ),
			'edit_item'                  => __( 'Edit Decoded Category', 'text_domain' ),
			'update_item'                => __( 'Update Decoded Category', 'text_domain' ),
			'view_item'                  => __( 'View Decoded Category', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate Decoded Category with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove Decoded Category', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Decoded Category', 'text_domain' ),
			'search_items'               => __( 'Search Decoded Category', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Decoded Category', 'text_domain' ),
			'items_list'                 => __( 'Decoded Category list', 'text_domain' ),
			'items_list_navigation'      => __( 'Decoded Category list navigation', 'text_domain' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		register_taxonomy( self::$taxonomy, 'decoded', $args );
	}
}
