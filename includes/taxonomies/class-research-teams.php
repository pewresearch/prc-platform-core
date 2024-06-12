<?php
namespace PRC\Platform;

use WP_Taxonomy;
use WP_Error;

class Research_Teams extends Taxonomies {
	protected static $taxonomy = 'research-teams';

	protected static $post_types = array(
		'post',
		'fact-sheet',
		'dataset',
		'feature',
		'quiz',
	);

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
		$loader->add_filter( 'post_link', $this, 'modify_post_permalinks', 10, 2 );
		$loader->add_filter( 'post_type_link', $this, 'modify_post_permalinks', 10, 2 );
		$loader->add_filter( 'rewrite_rules_array', $this, 'add_rewrite_rules', 10, 1 );
		$loader->add_filter( 'facetwp_preload_url_vars', $this, 'rewrite_datasets_archives', 10, 1 );
	}

	/**
	 * Register the taxonomy.
	 * @return WP_Taxonomy|WP_Error
	 */
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
			'feature',
			'fact-sheet',
			'fact-sheets',
			'quiz',
			'short-read',
			'staff',
			'dataset',
			'stub',
			'decoded'
		) );

		return register_taxonomy( self::$taxonomy, $post_types, $args );
	}

	// Adds a rewrite rule for each research term for the approved post types.
	public function add_rewrite_rules($rules) {
		if ( 1 === get_current_blog_id() ) {
			return $rules;
		}
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
			// Skip Decoded and Pew Research Center
			if ( 'decoded' === $term_name || 'pew-research-center' === $term_name ) {
				continue;
			}
			foreach(self::$post_types as $post_type) {
				if ( 'post' === $post_type ) {
					$new_rules[$term_name. '/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/?$'] = 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]';
					// Add iframe rule:
					$new_rules[$term_name . '/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/embed/?$'] = 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&iframe=true';
					$new_rules[$term_name . '/([0-9]{4})/([0-9]{1,2})/([0-9]{1,2})/([^/]+)(?:/([0-9]+))?/iframe/?$'] = 'index.php?year=$matches[1]&monthnum=$matches[2]&day=$matches[3]&name=$matches[4]&iframe=true';
					// Add attachment rule:
					$new_rules[$term_name . '/[0-9]{4}/[0-9]{1,2}/[0-9]{1,2}/[^/]+/([^/]+)/?$'] = 'index.php?attachment=$matches[1]';
				} else if ( 'fact-sheet' === $post_type ) {
					$new_rules[$term_name . '/fact-sheet/([^/]+)/?$'] = 'index.php?post_type=fact-sheet&name=$matches[1]';
					// Add attachment rule:
					$new_rules[$term_name . '/fact-sheet/[^/]+/([^/]+)/?$'] = 'index.php?attachment=$matches[1]';
				} else if ( 'quiz' === $post_type ) {
					// Add /quiz rules:
					$new_rules[$term_name . '/quiz/([^/]+)/?$'] = 'index.php?post_type=quiz&name=$matches[1]';
					// Add /results rules:
					$new_rules[$term_name . '/quiz/([^/]+)/results/?$'] = 'index.php?post_type=quiz&name=$matches[1]&showResults=1';
					// A new, cacheable, results archetype rule.
					$new_rules[$term_name . '/quiz/([^/]+)/results/([^/]+)/?$'] = 'index.php?post_type=quiz&name=$matches[1]&showResults=1&archetype=$matches[2]';
					// Add iframe and embed rules:
					$new_rules[$term_name . '/quiz/([^/]+)/embed/?$'] = 'index.php?post_type=quiz&name=$matches[1]&iframe=true';
					$new_rules[$term_name . '/quiz/([^/]+)/iframe/?$'] = 'index.php?post_type=quiz&name=$matches[1]&iframe=true';
					// Add attachment rule:
					$new_rules[$term_name . '/quiz/[^/]+/([^/]+)/?$'] = 'index.php?attachment=$matches[1]';
				} else if ( 'feature' === $post_type ) {
					$new_rules[$term_name . '/feature/([^/]+)/?$'] = 'index.php?post_type=feature&name=$matches[1]';
					// Add attachment rule, very, very specific. This will only hit for attachment names that are 5 or more characters long.
					// This rule allows for the possibilitiy of other interactive rewrites
					// example url: https://orange-goggles-p7vp96jxg27xvw-80.app.github.dev/pewresearch-org/global/feature/testing-feature-loader/cleanshot-2024-03-23-at-00-19-002x/
					// make a regex using the example url where it would capture the attachment name but only so long as its longer than 4 characters
					$new_rules[$term_name . '/feature/[^/]+/([^/]{5,})/?$'] = 'index.php?attachment=$matches[1]';
					// $new_rules[$term_name . '/feature/([^/]+)/([^/]{5,})/?$'] = 'index.php?attachment=$matches[1]';
				} else if ( 'dataset' === $post_type ) {
					$new_rules[$term_name . '/datasets'] = 'index.php?post_type=dataset';
					$new_rules[$term_name . '/dataset/([^/]+)/?$'] = 'index.php?datasets=$matches[1]';
					// Add attachment rule:
					$new_rules[$term_name . '/dataset/[^/]+/([^/]+)/?$'] = 'index.php?attachment=$matches[1]';
				}
			}
		}
		return array_merge($new_rules, $rules);
	}

	/**
	 * Rewrites pewresearch.org/{research-team-name}/datasets to preload the selected facet
	 * @hook facetwp_preload_url_vars
	 */
	public function rewrite_datasets_archives($url_vars) {
		$current_url = FWP()->helper->get_uri();
		if ( strpos( $current_url, 'datasets' ) === false ) {
			return $url_vars;
		}
		$terms = get_terms(array(
			'taxonomy' => self::$taxonomy,
			'hide_empty' => false,
		));
		$term_names = array_map(function ($term) {
			return $term->slug;
		}, $terms);
		foreach($term_names as $term_name) {
			if ( strpos( $current_url, $term_name . '/datasets' ) !== false && empty( $url_vars['research_teams'] ) ){
				$url_vars['research_teams'] = [ $term_name ];
			}
		}
		return $url_vars;
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
		if ( 1 === get_current_blog_id() ) {
			return $permalink;
		}
		// Check if post has the "disable_research_team_permalink" meta key
		if (get_post_meta($post->ID, 'disable_research_team_permalink', true)) {
			return $permalink;
		}
		// Check if the post belongs to the "research-teams" taxonomy
		if (in_array('research-teams', get_object_taxonomies($post)) && in_array($post->post_status, ['publish', 'hidden_from_index', 'hidden_from_search']) && in_array($post->post_type, self::$post_types)) {
			// Get the terms associated with the post
			$terms = get_the_terms($post, self::$taxonomy);
			if ($terms && !is_wp_error($terms)) {
				// Get the primary term
				$primary_term_id = get_primary_term_id(self::$taxonomy, $post->ID);
				// search through $terms from a term object with term_id of $primary_term_id
				$primary_term = array_filter($terms, function ($term) use ($primary_term_id) {
					return $term->term_id == $primary_term_id;
				});

				$primary_term = !empty($primary_term) ? array_pop($primary_term) : array_pop($terms);
				$team_slug = $primary_term->slug;

				if ('pew-research-center' === $team_slug) {
					return $permalink;
				}

				$site_base_url = get_site_url();
				$permalink = str_replace($site_base_url, $site_base_url . '/' . $team_slug, $permalink);
			}
		}

		return $permalink;
	}

}
