<?php
/**
 * Formats Taxonomy
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Formats Taxonomy
 *
 * @package PRC\Platform
 */
class Formats extends Taxonomies {
	/**
	 * Taxonomy name.
	 *
	 * @var string
	 */
	protected static $taxonomy = 'formats';

	/**
	 * Enforced post type pairs.
	 *
	 * @TODO: build filter for this
	 *
	 * @var array
	 */
	protected static $enforced_post_type_pairs = array(
		'short-read'     => 'short-read',
		'feature'        => 'feature',
		'fact-sheet'     => 'fact-sheet',
		'press-release'  => 'press-release',
		'quiz'           => 'quiz',
		'decoded'        => 'decoded',
		'dataset'        => 'dataset',
		'newsletterglue' => 'newsletter',
		'collections'    => 'collection',
	);

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
			$loader->add_action( 'prc_platform_on_incremental_save', $this, 'enforce_post_type_formats', 10, 1 );
			$loader->add_filter( 'prc_sitemap_supported_taxonomies', $this, 'opt_into_sitemap', 10, 1 );
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
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		// @TODO: Add filters into modules to signal support for format taxonomy.
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
				'collections',
			)
		);

		register_taxonomy( $taxonomy_name, $post_types, $args );
	}

	/**
	 * Enforce the format of the post.
	 *
	 * @hook prc_platform_on_incremental_save
	 *
	 * @param \WP_Post $post The post.
	 */
	public function enforce_post_type_formats( $post ) {
		$post_types = array_keys( self::$enforced_post_type_pairs );
		if ( $post_types && in_array( $post->post_type, $post_types ) ) {
			$format_term_slug = self::$enforced_post_type_pairs[ $post->post_type ];
			// Check if the post already has the format, if not, append it.
			$format            = wp_get_object_terms( $post->ID, 'formats' );
			$has_enforced_term = array_filter(
				$format,
				function ( $term ) use ( $format_term_slug ) {
					return $term->slug === $format_term_slug;
				}
			);
			$has_enforced_term = ! empty( $has_enforced_term );
			if ( ! $has_enforced_term ) {
				wp_set_object_terms( $post->ID, $format_term_slug, 'formats', true );
			}
		}
	}

	/**
	 * Opt into sitemap.
	 *
	 * @hook prc_sitemap_supported_taxonomies
	 *
	 * @param array $taxonomy_types The taxonomy types.
	 * @return array The taxonomy types.
	 */
	public function opt_into_sitemap( $taxonomy_types ) {
		$taxonomy_types[] = self::$taxonomy;
		return $taxonomy_types;
	}
}
