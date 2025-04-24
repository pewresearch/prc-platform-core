<?php
/**
 * PRC Platform Core Bootstrap
 *
 * @package    PRC_Platform
 * @subpackage PRC_Platform/includes
 *
 * Loads the plugin's dependencies.
 *
 * @link       https://github.com/pewresearch/prc-platform-core
 * @since      1.0.0
 */

namespace PRC\Platform;

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
		$this->init_modules();
	}

	/**
	 * Include a file from the plugin's includes directory.
	 *
	 * @param string $file_path The path to the file to include.
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
		$composer_autoload = PRC_PLATFORM_CORE_DIR . '/vendor/autoload.php';
		// If the composer autoload file exists and if this plugin is being used off platform or in a test case of the platform, load the autoload file.
		if ( file_exists( $composer_autoload ) && ( ! defined( 'PRC_PLATFORM' ) || ( defined( 'PRC_PLATFORM' ) && true !== PRC_PLATFORM ) ) ) {
			require_once $composer_autoload;
		}

		// Load VIP Cache Personalization class.
		if ( defined( 'WPMU_PLUGIN_DIR' ) && file_exists( WPMU_PLUGIN_DIR . '/cache/class-vary-cache.php' ) ) {
			require_once WPMU_PLUGIN_DIR . '/cache/class-vary-cache.php';
		}

		// Include plugin loading class.
		$this->include( 'class-loader.php' );
		// Include common utility functions.
		$this->include( 'utils.php' );

		/**
		 * Include the platform's various modules.
		 */
		$this->include( 'action-scheduler/class-action-scheduler.php' );
		$this->include( 'block-editor/class-block-editor.php' );
		$this->include( 'block-utils/class-block-utils.php' );
		$this->include( 'embeds/class-embeds.php' );
		$this->include( 'gutenberg/class-gutenberg.php' );
		$this->include( 'housekeeping/class-housekeeping.php' );
		$this->include( 'icon-loader/class-icon-loader.php' );
		$this->include( 'firebase/class-firebase.php' );
		$this->include( 'jetpack/class-jetpack.php' );
		$this->include( 'mailchimp/class-mailchimp.php' );
		$this->include( 'media/class-media.php' );
		$this->include( 'permalink-rewrites/class-permalink-rewrites.php' );
		$this->include( 'post-publish-pipeline/class-post-publish-pipeline.php' );
		$this->include( 'publication-listing/class-publication-listing.php' );
		$this->include( 'rest-api/class-rest-api.php' );
		$this->include( 'schema-meta/class-schema-meta.php' );
		$this->include( 'scripts/class-scripts.php' );
		$this->include( 'script-modules/class-script-modules.php' );
		$this->include( 'social/class-social.php' );
		$this->include( 'term-data-store/term-data-store.php' );
		$this->include( 'taxonomies/class-taxonomies.php' );
		$this->include( 'user-permissions/class-user-permissions.php' );
		$this->include( 'wp-admin/class-wp-admin.php' );
		$this->include( 'wp-html-sub-processors/index.php' );
		$this->include( 'upgrades/class-upgrades.php' );
		$this->include( 'revisions/class-revisions.php' );
		// Initialize the loader.
		$this->loader = new Loader();
	}

	/**
	 * Register the modules.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function init_modules() {
		new Action_Scheduler( $this->get_loader() );
		new Block_Editor( $this->get_loader() );
		new Block_Utils( $this->get_loader() );
		new Embeds( $this->get_loader() );
		new Gutenberg( $this->get_loader() );
		new Housekeeping( $this->get_loader() );
		new Icon_Loader( $this->get_loader() );
		new Firebase( $this->get_loader() );
		new Jetpack( $this->get_loader() );
		new Mailchimp( $this->get_loader() );
		new Media( $this->get_loader() );
		new Permalink_Rewrites( $this->get_loader() );
		new Post_Publish_Pipeline( $this->get_loader() );
		new Publication_Listing( $this->get_loader() );
		new Rest_API( $this->get_loader() );
		new Revisions( $this->get_loader() );
		new Schema_Meta( $this->get_loader() );
		new Scripts( $this->get_loader() );
		new Script_Modules( $this->get_loader() );
		new Social( $this->get_loader() );
		new Taxonomies( $this->get_loader() );
		new User_Permissions( $this->get_loader() );
		new WP_Admin( $this->get_loader() );
		new Upgrades( $this->get_loader() );

		// Platform general hooks.
		$this->loader->add_action( 'wp_head', $this, 'add_ascii_logo', 1 );
	}

	/**
	 * Add a ASCII logo to the head of the site.
	 *
	 * @hook wp_head, 1
	 *
	 * @return void
	 */
	public function add_ascii_logo() {
		$version      = defined( 'PRC_PLATFORM_VERSION' ) ? PRC_PLATFORM_VERSION : 'Unknown';
		$release_name = defined( 'PRC_PLATFORM_RELEASE_NAME' ) ? PRC_PLATFORM_RELEASE_NAME : 'Unknown';
		?>
	<!--
	#   Pew Research Center Digital Publishing Platform (PRC-Platform)
	#   Github: https://github.com/pewresearch/prc-platform-core
	#   Current Version: <?php echo esc_html( $version ); ?> "<?php echo esc_html( $release_name ); ?>"
	#
	#   Powered by WordPress VIP
	#
	-->
		<?php
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
