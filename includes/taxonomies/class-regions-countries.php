<?php
namespace PRC\Platform;

class Regions_Countries extends Taxonomies {
	protected static $taxonomy = 'regions-countries';

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Regions & Countries', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Region/Country', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Regions & Countries', 'text_domain' ),
			'all_items'                  => __( 'All Regions & Countries', 'text_domain' ),
			'parent_item'                => __( 'Parent Region/Country', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Region/Country:', 'text_domain' ),
			'new_item_name'              => __( 'New Region/Country', 'text_domain' ),
			'add_new_item'               => __( 'Add New Region/Country', 'text_domain' ),
			'edit_item'                  => __( 'Edit Region/Country', 'text_domain' ),
			'update_item'                => __( 'Update Region/Country', 'text_domain' ),
			'view_item'                  => __( 'View Region/Country', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate regions & countries with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove region/country', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Regions & Countries', 'text_domain' ),
			'search_items'               => __( 'Search Regions & Countries', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Regions & Countries', 'text_domain' ),
			'items_list'                 => __( 'Regions & Countries list', 'text_domain' ),
			'items_list_navigation'      => __( 'Regions & Countries list navigation', 'text_domain' ),
			'item_link' 				 => __( 'Region/Country Link', 'text_domain' ),
			'item_link_description' 	 => __( 'The link to the region/country page.', 'text_domain' ),
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

		$post_types = apply_filters( "prc_taxonomy_{$taxonomy_name}_post_types", array(
			'post',
			'interactives',
			'interactive',
			'feature',
			'fact-sheet',
			'fact-sheets',
			'short-read',
			'quiz',
			'stub',
			'decoded',
			'block_module'
		) );

		register_taxonomy( self::$taxonomy, $post_types, $args );
	}

}
