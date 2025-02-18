<?php
namespace PRC\Platform;

/**
 * Loads the plugin's dependencies.
 *
 * @link       https://github.com/pewresearch/prc-platform-core
 * @since      1.0.0
 *
 * @package    PRC_Platform
 * @subpackage PRC_Platform/includes
 */

use WP_Error;

/**
 * The core plugin class, responsible for loading all dependencies, defining
 * the plugin version, and registering the hooks that define the plugin.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    PRC_Platform
 * @subpackage PRC_Platform/includes
 * @author     Seth Rubenstein <srubenstein@pewresearch.org>
 */
class Platform_Bootstrap {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the platform as initialized by hooks.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {
		if ( defined( 'PRC_PLATFORM_VERSION' ) ) {
			$this->version = PRC_PLATFORM_VERSION;
		} else {
			$this->version = '1.0.0';
		}
		$this->plugin_name = 'prc-platform-core';

		// Initialize the plugin and include the required modules dependencies.
		$this->load_dependencies();

		// Initialize and register the modules.
		$this->register_modules();
	}

	/**
	 * Include a file from the plugin's includes directory.
	 *
	 * @param mixed $file_path
	 * @return WP_Error|void
	 */
	public function include( $file_path ) {
		if ( file_exists( plugin_dir_path( __DIR__ ) . 'includes/' . $file_path ) ) {
			require_once plugin_dir_path( __DIR__ ) . 'includes/' . $file_path;
		} else {
			return new WP_Error( 'prc_platform_missing_dependency', __( 'Missing dependency.', 'prc' ) );
		}
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {
		// Load VIP Cache Personalization class.
		require_once WPMU_PLUGIN_DIR . '/cache/class-vary-cache.php';

		// Include plugin loading class.
		$this->include( 'class-loader.php' );
		// Include common utility functions.
		$this->include( 'utils.php' );

		/**
		 * Include the platform's various modules.
		 */
		$this->include( 'action-scheduler/class-action-scheduler.php' );
		$this->include( 'apple-news/class-apple-news.php' );
		$this->include( 'block-area-modules/class-block-area-modules.php' );
		$this->include( 'block-editor/class-block-editor.php' );
		$this->include( 'block-utils/index.php' );
		$this->include( 'convert-to-block/class-convert-to-block.php' );
		$this->include( 'collections/class-collections.php' );
		$this->include( 'copilot/class-copilot.php' );
		$this->include( 'courses/class-courses.php' );
		$this->include( 'datasets/class-datasets.php' );
		$this->include( 'embeds/class-embeds.php' );
		$this->include( 'events/class-events.php' );
		$this->include( 'facets/class-facets.php' );
		$this->include( 'fact-sheets/class-fact-sheets.php' );
		$this->include( 'flash-briefings/class-flash-briefings.php' );
		$this->include( 'footnotes/class-footnotes.php' );
		$this->include( 'gutenberg/class-gutenberg.php' );
    $this->include('help-center/class-help-center.php');
		$this->include( 'homepages/class-homepages.php' );
		$this->include( 'housekeeping/class-housekeeping.php' );
		$this->include( 'icon-loader/class-icon-loader.php' );
		$this->include( 'features/class-features.php' );
		$this->include( 'firebase/class-firebase.php' );
		$this->include( 'jetpack/class-jetpack.php' );
		$this->include( 'mailchimp/class-mailchimp.php' );
		$this->include( 'media/class-media.php' );
		$this->include( 'newrelic/class-newrelic.php' );
		$this->include( 'newsletter/class-newsletter.php' );
		$this->include( 'permalink-rewrites/class-permalink-rewrites.php' );
		$this->include( 'post-publish-pipeline/class-post-publish-pipeline.php' );
		$this->include( 'post-report-package/class-post-report-package.php' );
		$this->include( 'post-visibility/class-post-visibility.php' );
		$this->include( 'press-releases/class-press-releases.php' );
		$this->include( 'decoded/class-decoded.php' );
		$this->include( 'related-posts/class-related-posts.php' );
		$this->include( 'rest-api/class-rest-api.php' );
		$this->include( 'rss/class-rss.php' );
		$this->include( 'schema-meta/class-schema-meta.php' );
		$this->include( 'search/class-search.php' );
		$this->include( 'short-reads/class-short-reads.php' );
		$this->include( 'slack-bot/class-slack-bot.php' );
		$this->include( 'social/class-social.php' );
		$this->include( 'staff-bylines/class-staff-bylines.php' );
		$this->include( 'term-data-store/term-data-store.php' );
		$this->include( 'taxonomies/class-taxonomies.php' );
		$this->include( 'user-permissions/class-user-permissions.php' );
		$this->include( 'wp-admin/class-wp-admin.php' );
		$this->include( 'upgrades/class-upgrades.php' );

		// Initialize the loader.
		$this->loader = new Loader();
	}

	private function register_modules() {
		new Action_Scheduler( $this->get_version(), $this->get_loader() );
		new Apple_News( $this->get_version(), $this->get_loader() );
		new Block_Area_Modules( $this->get_version(), $this->get_loader() );
		new Block_Editor( $this->get_version(), $this->get_loader() );
		new Block_Utils\JS_Utils_Loader( $this->get_version(), $this->get_loader() );
		new Copilot( $this->get_version(), $this->get_loader() );
		new Convert_To_Blocks( $this->get_version(), $this->get_loader() );
		new Courses( $this->get_version(), $this->get_loader() );
		new Collections( $this->get_version(), $this->get_loader() );
		new Datasets( $this->get_version(), $this->get_loader() );
		new Embeds( $this->get_version(), $this->get_loader() );
		new Events( $this->get_version(), $this->get_loader() );
		new Facets( $this->get_version(), $this->get_loader() );
		new Fact_Sheets( $this->get_version(), $this->get_loader() );
		new Flash_Briefings( $this->get_version(), $this->get_loader() );
		new Footnotes( $this->get_version(), $this->get_loader() );
		new Gutenberg( $this->get_version(), $this->get_loader() );
		new Help_Center( $this->get_version(), $this->get_loader() );
		new Homepages( $this->get_version(), $this->get_loader() );
		new Housekeeping( $this->get_version(), $this->get_loader() );
		new Icon_Loader( $this->get_version(), $this->get_loader() );
		new Features( $this->get_version(), $this->get_loader() );
		new Firebase( $this->get_loader() );
		new Jetpack( $this->get_version(), $this->get_loader() );
		new Mailchimp( $this->get_version(), $this->get_loader() );
		new Media( $this->get_version(), $this->get_loader() );
		// Add "Custom Fields" to the "page" object type.
		add_action(
			'init',
			function () {
				add_post_type_support( 'page', 'custom-fields' );
			}
		);
		new Newrelic( $this->get_version(), $this->get_loader() );
		new Newsletter( $this->get_version(), $this->get_loader() );
		new Permalink_Rewrites( $this->version, $this->get_loader() );
		new Post_Publish_Pipeline( $this->get_loader() );
		new Post_Report_Package( $this->get_version(), $this->get_loader() );
		new Post_Visibility( $this->get_version(), $this->get_loader() );
		new Press_Releases( $this->get_version(), $this->get_loader() );
		new Decoded( $this->get_version(), $this->get_loader() );
		new Related_Posts( $this->get_version(), $this->get_loader() );
		new Rest_API( $this->get_version(), $this->get_loader() );
		new RSS_Feeds( $this->get_version(), $this->get_loader() );
		new Schema_Meta( $this->get_version(), $this->get_loader() );
		new Search( $this->get_version(), $this->get_loader() );
		new Short_Reads( $this->get_version(), $this->get_loader() );
		new Slack_Bot( $this->get_version(), $this->get_loader() );
		new Social( $this->get_version(), $this->get_loader() );
		new Staff_Bylines( $this->get_version(), $this->get_loader() );
		new Taxonomies( $this->get_version(), $this->get_loader() );
		new User_Permissions( $this->get_version(), $this->get_loader() );
		new WP_Admin( $this->get_version(), $this->get_loader() );
		new Upgrades( $this->get_loader() );
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    PRC_Platform_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}
}
