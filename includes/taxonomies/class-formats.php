<?php
namespace PRC\Platform;

class Formats extends Taxonomies {
	protected static $taxonomy = 'formats';

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => 'Formats',
			'singular_name'              => 'Format',
			'menu_name'                  => 'Formats',
			'all_items'                  => 'All',
			'parent_item'                => 'Parent Format',
			'parent_item_colon'          => 'Parent Format:',
			'new_item_name'              => 'New Format',
			'add_new_item'               => 'Add Format',
			'edit_item'                  => 'Edit Format',
			'update_item'                => 'Update Format',
			'view_item'                  => 'View Format',
			'separate_items_with_commas' => 'Separate formats with commas',
			'add_or_remove_items'        => 'Add or remove formats',
			'choose_from_most_used'      => 'Choos from the most used',
			'popular_items'              => 'Popular Formats',
			'search_items'               => 'Search Formats',
			'not_found'                  => 'Not found',
			'no_terms'                   => 'No formats',
			'items_list'                 => 'Formats list',
			'items_list_navigation'      => 'Formats list navigation',
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

		$post_types = apply_filters( "prc_taxonomy_{$taxonomy_name}_post_types", array(
			'post',
			'short-read',
			'fact-sheets',
			'fact-sheet',
			'interactives',
			'interactive',
			'press-release',
			'quiz',
			'decoded',
			'stub'
		) );

		register_taxonomy( $taxonomy_name, $post_types, $args );
	}
}
