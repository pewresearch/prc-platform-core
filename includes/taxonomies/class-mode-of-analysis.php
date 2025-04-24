<?php
/**
 * Mode of Analysis Taxonomy
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Mode of Analysis Taxonomy
 *
 * @package PRC\Platform
 */
class Mode_Of_Analysis extends Taxonomies {
	/**
	 * Taxonomy name.
	 *
	 * @var string
	 */
	protected static $taxonomy = 'mode-of-analysis';

	/**
	 * Constructor.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'init', $this, 'register' );
	}

	/**
	 * Register the taxonomy.
	 *
	 * @hook init
	 */
	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Mode of Analysis', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Mode of Analysis', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Mode of Analysis', 'text_domain' ),
			'all_items'                  => __( 'All Mode of Analysis', 'text_domain' ),
			'parent_item'                => __( 'Parent Mode of Analysis', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Mode of Analysis:', 'text_domain' ),
			'new_item_name'              => __( 'New Mode of Analysis', 'text_domain' ),
			'add_new_item'               => __( 'Add Mode of Analysis', 'text_domain' ),
			'edit_item'                  => __( 'Edit Mode of Analysis', 'text_domain' ),
			'update_item'                => __( 'Update Mode of Analysis', 'text_domain' ),
			'view_item'                  => __( 'View Mode of Analysis', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate Mode of Analysis with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove Mode of Analysis', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Mode of Analysis', 'text_domain' ),
			'search_items'               => __( 'Search Mode of Analysis', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Mode of Analysis', 'text_domain' ),
			'items_list'                 => __( 'Mode of Analysis list', 'text_domain' ),
			'items_list_navigation'      => __( 'Mode of Analysis list navigation', 'text_domain' ),
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

		// @TODO: Add filters into modules to signal support for mode of analysis taxonomy.
		$post_types = apply_filters(
			"prc_taxonomy_{$taxonomy_name}_post_types",
			array(
				'post',
				'interactives',
				'interactive',
				'feature',
				'fact-sheet',
				'fact-sheets',
				'stub',
				'decoded',
			)
		);

		register_taxonomy( self::$taxonomy, $post_types, $args );
	}
}
