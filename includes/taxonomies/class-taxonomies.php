<?php
namespace PRC\Platform;

class Taxonomies {
	/**
	 * This is the primary taxonomy for the site. This is used for the main permalink structure.
	 * @var string
	 */
	public static $primary_taxonomy = 'research-teams';

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		require_once( plugin_dir_path( __FILE__ ) . 'topic-category/class-topic-category.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-collections.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-formats.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-languages.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-mode-of-analysis.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-regions-countries.php' );
		require_once( plugin_dir_path( __FILE__ ) . 'class-research-teams.php' );
	}

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
	 * @param  [type] $term [description]
	 * @return [type]       [description]
	 */
	public function replace_commas_in_term_names( $term ) {
		foreach ( $term as $t ) {
			if ( is_object( $t ) ) {
				$t->name = preg_replace( '/_/i', ',', $t->name );
			}
		}
		return $term;
	}

	/**
	 * Disable 'Global Terms Enabled', this causes issues with shared term slugs. Resolves a long standing taxonomy issue.
	 * @return false
	 */
	public function disable_global_terms() {
		return false;
	}

	/**
	 * Enable term slug change, this allows us to change the slug of a term without breaking the site.
	 * @return true
	 */
	public function yoast_enable_term_redirect_slug_change() {
		return true;
	}

	public function modify_post_tag_taxonomy_args($args, $taxonomy) {
		if ($taxonomy === 'post_tag') {
			// Modify the arguments of the post_tag taxonomy here
			// For example, you can set 'public' to false to hide it from the admin UI
			$args['show_ui'] = false;
		}
		return $args;
	}

	public function register_activity_trail_meta($taxonomy = null) {
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
	 * @hook create_term edit_term
	 * @return void
	 */
	public function hook_on_to_term_update( int $term_id, int $tt_id, string $taxonomy, array $args ) {
		$this->log_activity_trail( $term_id, $tt_id, $taxonomy );
	}

	/**
	 * Whenever a term is updated this will log when it was updated and what user made that change.
	 * @param mixed $term_id
	 * @param mixed $tt_id
	 * @param mixed $taxonomy
	 * @return void
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

