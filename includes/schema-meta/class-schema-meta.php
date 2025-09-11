<?php
/**
 * Schema Meta class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WPSEO_Options;

/**
 * This class handles constructing and managing the broad schema.org object graph and Google/Facebook/Twitter social metadata. As well as research related meta like DOI, PMID, etc.
 *
 * @package
 */
class Schema_Meta {
	/**
	 * The loader.
	 *
	 * @var Loader
	 */
	protected $loader = null;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader    The loader.
	 */
	public function __construct( $loader ) {
		$this->loader = $loader;
		$this->init();
		if ( WP_DEBUG ) {
			add_filter( 'yoast_seo_development_mode', '__return_true' );
		}
	}

	/**
	 * Initialize the hooks.
	 */
	public function init() {
		if ( null !== $this->loader ) {
			$this->loader->add_filter( 'wpseo_robots', $this, 'yoast_seo_no_index' );

			$this->loader->add_filter( 'wpvip_parsely_load_mu', $this, 'enable_parsely_mu_on_vip' );
			$this->loader->add_filter( 'wp_parsely_metadata', $this, 'disable_parsely_json_ld', 10, 3 );
			$this->loader->add_filter( 'wpseo_frontend_presenters', $this, 'add_parsely_meta' );

			$this->loader->add_filter( 'wpseo_opengraph_title', $this, 'remove_pipe_from_social_titles', 10, 1 );
			$this->loader->add_filter( 'wpseo_title', $this, 'remove_numeric_prefix_from_child_post_titles', 10, 1 );
			$this->loader->add_filter( 'wpseo_opengraph_title', $this, 'remove_numeric_prefix_from_child_post_titles', 11, 1 );
			$this->loader->add_filter( 'wpseo_twitter_title', $this, 'remove_numeric_prefix_from_child_post_titles', 10, 1 );
			$this->loader->add_filter( 'wpseo_twitter_creator_account', $this, 'yoast_seo_default_twitter' );
			$this->loader->add_filter( 'wpseo_hide_version', $this, 'yoast_hide_version' );
			$this->loader->add_filter( 'wpseo_canonical', $this, 'get_attachment_canonical_link_back_to_parent' );
			$this->loader->add_filter( 'wpseo_schema_graph', $this, 'correct_schema_graph_searchaction' );
		}
	}

	/**
	 * Enable VIP's WP Parsely integration.
	 *
	 * @hook wpvip_parsely_load_mu
	 * @return true
	 */
	public function enable_parsely_mu_on_vip() {
		return true;
	}

	/**
	 * Disable indexing on specific page combinations.
	 * - Publication pages AND search pages (unless it's the first page)
	 * - Facets: Formats, research areas, regions/countries, days, year range
	 * - Attachment pages that are attached to a post, if they are on their own then they should be indexed
	 *
	 * @hook wpseo_robots
	 *
	 * @TODO: Change this to work with wp core robots hooks (YOAST-MIGRATION)
	 *
	 * @param string $robots The robots string.
	 * @return string The robots string.
	 */
	public function yoast_seo_no_index( $robots ) {
		global $paged;

		// On publication pages AND on search pages we do not want to index the page if it is not the first page.
		if ( is_index( true ) && $paged > 1 ) {
			$robots = 'noindex';
		}

		if ( get_query_var( 'formats' ) || get_query_var( 'reasearch-areas' ) || get_query_var( 'regions-countries' ) || get_query_var( 'days' ) || get_query_var( 'yr_min' ) || get_query_var( 'yr_max' ) ) {
			$robots = 'noindex,nofollow';
		}

		// We do not want to index attachment pages??
		if ( is_attachment() ) {
			$post_id = get_the_ID();
			if ( 0 !== wp_get_post_parent_id( $post_id ) ) {
				$robots = 'noindex';
			}
		}

		// If this is a dev environment then no index, no follow.
		if ( 'production' !== wp_get_environment_type() ) {
			$robots = 'noindex,nofollow';
		}

		return $robots;
	}

	/**
	 * Remove the Yoast SEO version number from the head.
	 *
	 * @hook wpseo_hide_version
	 */
	public function yoast_hide_version() {
		return true;
	}

	/**
	 * Default Twitter to the site's twitter handle rather than personal twitter handles.
	 *
	 * @hook wpseo_twitter_creator_account
	 * @param mixed $twitter The Twitter handle.
	 * @return mixed The Twitter handle.
	 */
	public function yoast_seo_default_twitter( $twitter ) {
		$twitter = WPSEO_Options::get( 'twitter_site' );
		return $twitter;
	}

	/**
	 * Remove the pipe and Pew Research Center from the social titles.
	 *
	 * @hook wpseo_opengraph_title
	 * @param string $title The title.
	 * @return string The title.
	 */
	public function remove_pipe_from_social_titles( $title ) {
		$title = str_replace( '| Pew Research Center', '', $title );
		return $title;
	}

	/**
	 * Remove numeric prefixes (e.g., "3. ") from SEO titles in child posts.
	 * This affects search results, social media sharing, and link sharing metadata
	 * but keeps prefixes for on-page display (H1 and TOC).
	 *
	 * @hook wpseo_title
	 * @hook wpseo_opengraph_title
	 * @hook wpseo_twitter_title
	 * @param string $title The SEO/social title.
	 * @return string The title with numeric prefixes removed for child posts.
	 */
	public function remove_numeric_prefix_from_child_post_titles( $title ) {
		// Only modify titles for child posts (posts with a parent)
		if ( is_singular() && 0 !== wp_get_post_parent_id( get_the_ID() ) ) {
			// Remove numeric prefixes like "1. ", "2. ", "3. ", etc.
			// Pattern matches: one or more digits, followed by a period and space
			$title = preg_replace( '/^\d+\.\s+/', '', $title );
		}
		return $title;
	}

	/**
	 * Disable Parsely JSON-LD.
	 *
	 * @hook wp_parsely_metadata
	 * @param array  $parsely_metadata The Parsely metadata.
	 * @param object $post The post object.
	 * @param array  $parsely_options The Parsely options.
	 * @return array The Parsely metadata.
	 */
	public function disable_parsely_json_ld( $parsely_metadata, $post, $parsely_options ) {
		return $parsely_metadata;
	}


	/**
	 * Adds our custom presenter to the array of presenters.
	 *
	 * @hook wpseo_frontend_presenters
	 *
	 * @param array $presenters The current array of presenters.
	 * @return array Presenters with our custom presenter added.
	 */
	public function add_parsely_meta( $presenters ) {
		if ( is_admin() ) {
			return $presenters;
		}
		global $post;
		if ( ! $post || ! is_object( $post ) ) {
			return $presenters;
		}

		// determine if is RLS template.
		if ( property_exists( $post, 'post_type' )
			&& defined( 'PRC_RLS_TEMPLATE_POST_TYPE' )
			&& PRC_RLS_TEMPLATE_POST_TYPE === $post->post_type ) {
			return $presenters;
		}

		if ( class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' ) && class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'class-parsely-meta.php';
			$presenters[] = new Parsely_Title();
			$presenters[] = new Parsely_Link();
			$presenters[] = new Parsely_Type();
			$presenters[] = new Parsely_Image_URL();
			$presenters[] = new Parsely_Section();
			$presenters[] = new Parsely_Tags();
			$presenters[] = new Parsely_Pub_Date();
			$presenters[] = new Parsely_Authors();
		}

		return $presenters;
	}

	/**
	 * Get the canonical link for attachment pages.
	 *
	 * @hook wpseo_canonical
	 * @param string $canonical The canonical link.
	 * @return string The canonical link.
	 */
	public function get_attachment_canonical_link_back_to_parent( $canonical ) {
		if ( is_attachment() ) {
			$canonical = get_permalink( wp_get_post_parent_id( get_the_ID() ) );
		}
		return $canonical;
	}

	/**
	 * Correct the schema graph searchaction.
	 *
	 * @hook wpseo_schema_graph
	 * @param array $graph The schema graph.
	 * @return array The schema graph.
	 */
	public function correct_schema_graph_searchaction( $graph ) {
		$graph = array_map(
			function ( $item ) {
				if ( isset( $item['@type'] ) && 'WebSite' === $item['@type'] ) {
					if ( isset( $item['potentialAction'] ) ) {
						$item['potentialAction'] = array_map(
							function ( $action ) {
								if ( isset( $action['@type'] ) && 'SearchAction' === $action['@type'] ) {
									$action['target']['urlTemplate'] = str_replace( '?s=', 'search/', $action['target']['urlTemplate'] );
								}
								return $action;
							},
							$item['potentialAction']
						);
					}
				}
				return $item;
			},
			$graph
		);
		return $graph;
	}
}
