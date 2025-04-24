<?php
/**
 * Fund Pools Taxonomy
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * A private taxonomy to log the funders of grants against content in the system.
 *
 * @package PRC\Platform
 */
class Fund_Pools extends Taxonomies {
	/**
	 * Taxonomy name.
	 *
	 * @var string
	 */
	protected static $taxonomy = '_fund_pool';

	/**
	 * Constructor.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the taxonomy.
	 *
	 * @param mixed $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register' );
		}
	}

	/**
	 * Register the taxonomy.
	 *
	 * @hook init
	 */
	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => 'Fund Pool',
			'singular_name'              => 'Fund Pool',
			'menu_name'                  => 'Fund Pools',
			'all_items'                  => 'All',
			'parent_item'                => 'Parent Fund',
			'parent_item_colon'          => 'Parent Fund:',
			'new_item_name'              => 'New Fund Pool',
			'add_new_item'               => 'Add Fund Pool',
			'edit_item'                  => 'Edit Fund Pool',
			'update_item'                => 'Update Fund Pool',
			'view_item'                  => 'View Fund Pool',
			'separate_items_with_commas' => 'Separate fund pools with commas',
			'add_or_remove_items'        => 'Add or remove fund pool',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Fund Pools',
			'search_items'               => 'Search Fund Pools',
			'not_found'                  => 'Not found',
			'no_terms'                   => 'No fund pool found',
			'items_list'                 => 'List of Fund Pools',
			'items_list_navigation'      => 'Fund Pools Navigation',
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		// @TODO: Add filters into modules to signal support for fund pool taxonomy.
		$post_types = apply_filters(
			"prc_taxonomy_{$taxonomy_name}_post_types",
			array(
				'post',
				'short-read',
				'fact-sheet',
				'feature',
				'press-release',
				'quiz',
				'decoded',
				'dataset',
				'newsletterglue',
				'data-table',
			)
		);

		register_taxonomy( $taxonomy_name, $post_types, $args );

		register_term_meta(
			$taxonomy_name,
			'funder_url',
			array(
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
				'default'      => '',
			)
		);

		register_term_meta(
			$taxonomy_name,
			'funder_id',
			array(
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => true,
				'default'      => '',
			)
		);

		register_term_meta(
			$taxonomy_name,
			'_funder_budget',
			array(
				'type'         => 'string',
				'single'       => true,
				'show_in_rest' => false,
				'default'      => '',
			)
		);
	}
}
