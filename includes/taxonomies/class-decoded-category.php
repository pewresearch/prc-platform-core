<?php
namespace PRC\Platform;

class Decoded_Category extends Taxonomies {
	protected static $taxonomy = 'decoded-category';

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels     = array(
			'name'                       => _x( 'Decoded Topic', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Decoded Topic', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Decoded Topic', 'text_domain' ),
			'all_items'                  => __( 'All Decoded Topics', 'text_domain' ),
			'parent_item'                => __( 'Parent Decoded Topic', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Decoded Topic:', 'text_domain' ),
			'new_item_name'              => __( 'New Decoded Topic', 'text_domain' ),
			'add_new_item'               => __( 'Add Decoded Topic', 'text_domain' ),
			'edit_item'                  => __( 'Edit Decoded Topic', 'text_domain' ),
			'update_item'                => __( 'Update Decoded Topic', 'text_domain' ),
			'view_item'                  => __( 'View Decoded Topic', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate Decoded Topic'. ' with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove Decoded Topic', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Decoded Topic', 'text_domain' ),
			'search_items'               => __( 'Search Decoded Topic', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Decoded Topic', 'text_domain' ),
			'items_list'                 => __( 'Decoded Topic list', 'text_domain' ),
			'items_list_navigation'      => __( 'Decoded Topic list navigation', 'text_domain' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
		);

		register_taxonomy( self::$taxonomy, 'decoded', $args );
	}

}
