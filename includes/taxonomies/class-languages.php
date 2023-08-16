<?php
namespace PRC\Platform;

class Languages extends Taxonomies {
	protected static $taxonomy = 'languages';

	public function __construct() {

	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Languages', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Language', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Languages', 'text_domain' ),
			'all_items'                  => __( 'All Languages', 'text_domain' ),
			'parent_item'                => __( 'Parent Language', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Language:', 'text_domain' ),
			'new_item_name'              => __( 'New Language', 'text_domain' ),
			'add_new_item'               => __( 'Add New Language', 'text_domain' ),
			'edit_item'                  => __( 'Edit Languages', 'text_domain' ),
			'update_item'                => __( 'Update Language', 'text_domain' ),
			'view_item'                  => __( 'View Language', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate Languages with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove Languages', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Languages', 'text_domain' ),
			'search_items'               => __( 'Search Languages', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Languages', 'text_domain' ),
			'items_list'                 => __( 'Languages list', 'text_domain' ),
			'items_list_navigation'      => __( 'Languages list navigation', 'text_domain' ),
		);
		$args   = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		$post_types = apply_filters( "prc_taxonomy_{$taxonomy_name}_post_types", array(
			'post',
			'fact-sheets',
			'fact-sheet',
			'stub',
		) );

		register_taxonomy( self::$taxonomy, $post_types, $args );
	}

}
