<?php
/**
 * Taxonomies class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Taxonomies class.
 *
 * @package PRC\Platform
 */
class Taxonomies {
	/**
	 * This is the primary taxonomy for the site.
	 * This is used for the main permalink structure.
	 *
	 * @var string
	 */
	public static $primary_taxonomy = 'research-teams';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function __construct( $loader = null ) {
		require_once plugin_dir_path( __FILE__ ) . 'topic-category/class-topic-category.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-decoded-category.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-formats.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-fund-pools.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-languages.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-mode-of-analysis.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-regions-countries.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-research-teams.php';

		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'disable_term_description_filtering' );
			$loader->add_filter( 'get_terms', $this, 'replace_commas_in_term_names', 10, 1 );
			$loader->add_filter( 'global_terms_enabled', $this, 'disable_global_terms', 10, 1 );
			$loader->add_filter( 'wpseo_premium_term_redirect_slug_change', $this, 'yoast_enable_term_redirect_slug_change' );

			// Disable "Post Tag" from appearing in the admin UI.
			$loader->add_filter( 'register_taxonomy_args', $this, 'modify_post_tag_taxonomy_args', 10, 2 );

			// Activity Trail.
			$loader->add_action( 'init', $this, 'register_activity_trail_meta' );
			$loader->add_action( 'create_term', $this, 'hook_on_to_term_update', 10, 4 );
			$loader->add_action( 'edit_term', $this, 'hook_on_to_term_update', 10, 4 );

			// Register the taxonomies.
			new Topic_Category( $loader );
			new Decoded_Category( $loader );
			new Formats( $loader );
			new Fund_Pools( $loader );
			new Languages( $loader );
			new Mode_Of_Analysis( $loader );
			new Regions_Countries( $loader );
			new Research_Teams( $loader );
		}
	}

	/**
	 * Disable term description filtering, allowing any content inside the term description.
	 *
	 * @hook disable_term_description_filtering
	 */
	public function disable_term_description_filtering() {
		// Remove HTML Filtering on term description.
		remove_filter( 'pre_term_description', 'wp_filter_kses' );
		remove_filter( 'pre_user_description', 'wp_filter_kses' );
		remove_filter( 'term_description', 'wp_kses_data' );
	}

	/**
	 * Filter to replace underscore with comma to get around WordPress' filtering of commas in term names.
	 *
	 * @hook get_terms
	 *
	 * @param  WP_Term[] $terms Array of terms.
	 * @return WP_Term[] $terms Array of terms.
	 */
	public function replace_commas_in_term_names( $terms ) {
		foreach ( $terms as $term ) {
			if ( is_object( $term ) ) {
				$term->name = preg_replace( '/_/i', ',', $term->name );
			}
		}
		return $terms;
	}

	/**
	 * Disable 'Global Terms Enabled', this causes issues with shared term slugs.
	 * Resolves a long standing historical PRC taxonomy issue.
	 *
	 * @hook global_terms_enabled
	 * @return false
	 */
	public function disable_global_terms() {
		return false;
	}

	/**
	 * Enable term slug change, this allows us to change the slug of a term without breaking the site.
	 *
	 * @hook wpseo_premium_term_redirect_slug_change
	 * @return true
	 */
	public function yoast_enable_term_redirect_slug_change() {
		return true;
	}

	/**
	 * Modify the arguments of the post_tag taxonomy here
	 * For example, you can set 'public' to false to hide it from the admin UI
	 *
	 * @hook modify_post_tag_taxonomy_args
	 * @param array  $args Arguments.
	 * @param string $taxonomy Taxonomy.
	 */
	public function modify_post_tag_taxonomy_args( $args, $taxonomy ) {
		if ( 'post_tag' === $taxonomy ) {
			$args['show_ui'] = false;
		}
		return $args;
	}

	/**
	 * Register the activity trail meta for the taxonomy.
	 *
	 * @hook init
	 * @param mixed $taxonomy Taxonomy.
	 */
	public function register_activity_trail_meta( $taxonomy = null ) {
		if ( ! $taxonomy ) {
			return;
		}
		register_term_meta(
			$taxonomy,
			'_last_updated_by',
			array(
				'type' => 'string',
			)
		);

		register_term_meta(
			$taxonomy,
			'_last_updated_at',
			array(
				'type' => 'string',
			)
		);
	}

	/**
	 * Whenever a term is created this will log when it was created and what user made that change.
	 *
	 * @hook create_term edit_term
	 * @param int    $term_id Term ID.
	 * @param int    $tt_id Term Taxonomy ID.
	 * @param string $taxonomy Taxonomy.
	 * @param array  $args Arguments.
	 */
	public function hook_on_to_term_update( int $term_id, int $tt_id, string $taxonomy, array $args ) {
		$this->log_activity_trail( $term_id, $tt_id, $taxonomy );
	}

	/**
	 * Whenever a term is updated this will log when it was updated and what user made that change.
	 *
	 * @param int    $term_id Term ID.
	 * @param int    $tt_id Term Taxonomy ID.
	 * @param string $taxonomy Taxonomy.
	 */
	public function log_activity_trail( $term_id, $tt_id, $taxonomy ) {
		// Get currently logged in user id.
		$user_id = get_current_user_id();
		// Update the _created_by term meta to the user id.
		update_term_meta( $term_id, '_last_updated_by', $user_id );
		// Update the _created_at term meta to the current time.
		update_term_meta( $term_id, '_last_updated_at', current_time( 'mysql' ) );
	}
}

/**
 * Get the primary term id.
 *
 * @param string $taxonomy
 * @param int    $post_id
 * @return int|false
 */
//phpcs:ignore
function get_primary_term_id( $taxonomy, $post_id ) {
	if ( ! function_exists( 'yoast_get_primary_term_id' ) ) {
		return false;
	} else {
		return yoast_get_primary_term_id( $taxonomy, $post_id );
	}
}
