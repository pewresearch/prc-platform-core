<?php
namespace PRC\Platform;

class Research_Teams extends Taxonomies {
	protected static $taxonomy = 'research-teams';

	protected static $post_types = array(
		'post',
		'fact-sheet',
		'dataset',
		'interactive',
		'quiz',
	);

	public function __construct() {

	}

	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Research Teams', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Research Team', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Research Teams', 'text_domain' ),
			'all_items'                  => __( 'All Research Teams', 'text_domain' ),
			'parent_item'                => __( 'Parent Research Team', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Research Team:', 'text_domain' ),
			'new_item_name'              => __( 'New Research Team', 'text_domain' ),
			'add_new_item'               => __( 'Add New Research Team', 'text_domain' ),
			'edit_item'                  => __( 'Edit Research Teams', 'text_domain' ),
			'update_item'                => __( 'Update Research Team', 'text_domain' ),
			'view_item'                  => __( 'View Research Team', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate projects with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove projects', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Research Teams', 'text_domain' ),
			'search_items'               => __( 'Search Research Teams', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Research Teams', 'text_domain' ),
			'items_list'                 => __( 'Research Teams list', 'text_domain' ),
			'items_list_navigation'      => __( 'Research Teams list navigation', 'text_domain' ),
			'item_link'  			     => __( 'Research Team Link', 'text_domain' ),
			'item_link_description'      => __( 'A link to the Research Team.', 'text_domain' ),
		);
		$args   = array(
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
			'fact-sheet',
			'fact-sheets',
			'quiz',
			'short-read',
			'staff',
			'dataset',
			'stub',
		) );

		$registered = register_taxonomy( self::$taxonomy, $post_types, $args );

		return $registered;
	}

	// Adds a rewrite rule for each research term for the approved post types.
	public function add_rewrite_rules($rules) {
		$new_rules = array();
		// get all the terms from this taxonomy...
		$terms = get_terms(array(
			'taxonomy' => self::$taxonomy,
			'hide_empty' => false,
		));
		$term_names = array_map(function ($term) {
			return $term->slug;
		}, $terms);
		foreach($term_names as $term_name) {
			foreach(self::$post_types as $post_type) {
				if ( 'post' === $post_type ) {
					$new_rules[$term_name. '/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$'] = 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]';
				} else if ( 'fact-sheet' === $post_type ) {
					$new_rules[$term_name . '/fact-sheet/([^/]+)/?$'] = 'index.php?post_type=fact-sheet&name=$matches[1]';
				} else if ( 'quiz' === $post_type ) {
					$new_rules[$term_name . '/quiz/([^/]+)/?$'] = 'index.php?post_type=quiz&name=$matches[1]';
				} else if ( 'interactive' === $post_type ) {
					$new_rules[$term_name . '/interactive/([^/]+)/?$'] = 'index.php?post_type=interactive&name=$matches[1]';
				} else if ( 'dataset' === $post_type ) {
					$new_rules[$term_name . '/dataset/([^/]+)/?$'] = 'index.php?post_type=dataset&name=$matches[1]';
				}
			}
		}
		return array_merge($new_rules, $rules);
	}

	/**
	 * Add rewrite tag to post permalinks.
	 * @hook post_link
	 * @param mixed $permalink
	 * @param mixed $post
	 * @param mixed $leavename
	 * @return mixed
	 */
	public function modify_post_permalinks($permalink, $post) {
		// Check if the post belongs to the "research-teams" taxonomy
		if (in_array('research-teams', get_object_taxonomies($post)) && 'publish' === $post->post_status && in_array($post->post_type, self::$post_types)) {
			// Get the terms associated with the post
			$terms = get_the_terms($post, self::$taxonomy);
			if ($terms && !is_wp_error($terms)) {
				// Get the primary term
				$primary_term_id = get_post_meta($post->ID, '_yoast_wpseo_primary_' . self::$taxonomy, true);
				// search through $terms from a term object with term_id of $primary_term_id
				$primary_term = array_filter($terms, function ($term) use ($primary_term_id) {
					return $term->term_id == $primary_term_id;
				});

				$primary_term = !empty($primary_term) ? array_pop($primary_term) : array_pop($terms);
				$team_slug = $primary_term->slug;

				$site_base_url = get_site_url();
				$permalink = str_replace($site_base_url, $site_base_url . '/' . $team_slug, $permalink);
			}
		}

		return $permalink;
	}

}