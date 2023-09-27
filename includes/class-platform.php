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

use AC\Message\Plugin;
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

		// Initialize the plugin and its various systems.
		$this->load_dependencies();
		$this->define_wp_admin_hooks();
		$this->define_user_permissions_hooks();
		$this->define_post_publish_pipeline_hooks();
		$this->define_rss_feed_hooks();
		$this->define_media_hooks();
		$this->define_gutenberg_hooks();
		$this->define_block_editor_hooks();
		$this->define_post_visibility_hooks();
		$this->define_social_hooks();
		$this->define_embed_hooks();
		$this->define_schema_meta_hooks();
		$this->define_distributor_hooks();
		$this->define_action_scheduler_hooks();
		$this->define_multisite_migration_hooks();
		$this->define_housekeeping_hooks();
		$this->define_jetpack_integration_hooks();
		$this->define_convert_to_blocks();
		$this->define_search_hooks();
		$this->define_related_posts_hook();
		$this->define_post_report_package_hooks();
		$this->define_slack_bot_hooks();
		$this->define_apple_news_hooks();
		$this->define_icon_loader_hooks();

		// Initialize all taxonomy types:
		$this->define_taxonomy_hooks();

		// Initialize all object types:
		$this->define_event_post_type_hooks();
		$this->define_block_area_module_hooks();
		$this->define_fact_sheet_post_type_hooks();
		$this->define_staff_bylines_hooks();
		$this->define_datasets_hooks();
		$this->define_interactive_post_type_hooks();
		$this->define_homepage_post_type_hooks();
		$this->define_short_read_post_type_hooks();
		$this->define_course_post_type_hooks();
		$this->define_press_release_post_type_hooks();
		$this->define_page_type_hooks();
	}

	/**
	 * Include a file from the plugin's includes directory.
	 * @param mixed $file_path
	 * @return WP_Error|void
	 */
	public function include($file_path) {
		if ( file_exists( plugin_dir_path( dirname(__FILE__) ) . 'includes/' . $file_path ) ) {
			require_once plugin_dir_path( dirname(__FILE__) ) . 'includes/' . $file_path;
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
		// Load composer dependencies.
		require_once plugin_dir_path(dirname(__FILE__)) . 'vendor/autoload.php';

		// Load plugin loading class.
		$this->include('class-loader.php');
		// Load common utility functions.
		$this->include('utils.php');
		// Load term data store class, connect taxonomy to post type.
		$this->include('term-data-store/term-data-store.php');
		// Load the action scheduler integration.
		$this->include('action-scheduler/class-action-scheduler.php');
		// Load the distributor integration.
		$this->include('distributor/class-distributor.php');
		// Load media/attachment system settings.
		$this->include('media/class-media-settings.php');
		// Load attachment downloader. /{attachment}/download url schema
		$this->include('media/class-attachment-downloader.php');
		// Load art direction system (replaces featured images).
		$this->include('media/art-direction/class-art-direction.php');
		// Load the attachment report functionality.
		$this->include('media/attachment-report/class-attachment-report.php');
		// Load wp-admin modifications and ui additions.
		$this->include('wp-admin/class-wp-admin.php');
		// Load RSS Feed customizations
		$this->include('rss/class-rss.php');
		// Load user permissions
		$this->include('user-permissions/class-user-permissions.php');
		// Load /iframe embed system.
		$this->include('embeds/class-embeds.php');
		// Load schema meta system. (Yoast/Parsely/Schema JSON-LD)
		$this->include('schema-meta/class-schema-meta.php');
		// Load taxonomy system.
		$this->include('taxonomies/class-taxonomies.php');
		// Load staff bylines system.
		$this->include('staff-bylines/class-staff-bylines.php');
		// Load datasets system.
		$this->include('datasets/class-datasets.php');
		// Load gutenberg integration.
		$this->include('gutenberg/class-gutenberg.php');
		// Load custom post visibility statuses system.
		$this->include('post-visibility/class-post-visibility.php');
		// Load "block area module" post type and taxonomy pair.
		$this->include('block-area-modules/class-block-area-modules.php');
		// Load "event" post type
		$this->include('events/class-events.php');
		// Load "fact-sheet" post type
		$this->include('fact-sheets/class-fact-sheets.php');
		// Load "interactive" post type
		$this->include('interactives/class-interactives.php');
		// Load "homepages" post type
		$this->include('homepages/class-homepages.php');
		// Load "mini-courses" post type
		$this->include('courses/class-courses.php');
		// Load "press-release" post type
		$this->include('press-releases/class-press-releases.php');
		// Load "short-read" post type
		$this->include('short-reads/class-short-reads.php');
		// Load "social" system and tools.
		$this->include('social/class-bitly.php');
		// Load asynchronous multisite migration system.
		$this->include('multisite-migration/class-multisite-migration.php');
		// Load housekeeping system.
		$this->include('housekeeping/class-housekeeping.php');
		// Load Jetpack integration.
		$this->include('jetpack/class-jetpack.php');
		// Load Convert To Block transforms and integration.
		$this->include('convert-to-block/class-convert-to-block.php');
		// Load Search customizations
		$this->include('search/class-search.php');
		// Load Block Editor customizations
		$this->include('block-editor/class-block-editor.php');
		// Load post publish pipeline hooks
		$this->include('post-publish-pipeline/class-post-publish-pipeline.php');
		// Load Related Posts system
		$this->include('related-posts/class-related-posts.php');
		// Load Post Report Package system
		$this->include('post-report-package/class-post-report-package.php');
		// Slack Bot
		$this->include('slack-bot/class-slack-bot.php');
		// Apple News
		$this->include('apple-news/class-apple-news.php');
		// Icon Loader
		$this->include('icon-loader/class-icon-loader.php');

		// Initialize the loader.
		$this->loader = new Loader();
	}

	/**
	 * Register all of the hooks related to wp-admin.
	 * @return void
	 */
	private function define_wp_admin_hooks() {
		$admin = new WP_Admin( $this->get_plugin_name(), $this->get_version() );
		$admin_columns = new Admin_Columns_Pro( $this->get_plugin_name(), $this->get_version() );

		// This removes the "Public Preview" next to the draft label in the WordPress admin.
		remove_filter( 'display_post_states', array( 'DS_Public_Post_Preview', 'display_preview_state' ), 20 );

		$this->loader->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_assets' );
		$this->loader->add_action( 'login_enqueue_scripts', $admin, 'login_logo' );
		$this->loader->add_action( 'wp_before_admin_bar_render', $admin, 'admin_bar_tweaks' );
		$this->loader->add_filter( 'get_user_option_admin_color', $admin, 'default_admin_color_scheme' );
		$this->loader->add_action( 'admin_print_footer_scripts', $admin, 'admin_footer' );
		$this->loader->add_filter( 'disabled_cookiepro', $admin, 'disable_cookie_banner_conditions', 10, 1 );
		$this->loader->add_action( 'admin_menu', $admin, 'modify_menu', 10 );
		$this->loader->add_action( 'wp_dashboard_setup' , $admin, 'remove_dashboard_widgets', 99 );
		$this->loader->add_filter( 'multisite_enhancements_status_label', $admin, 'multisite_enhancement_plugin_sites_label', 10, 2 );
		$this->loader->add_action( 'init', $admin, 'disable_emojis' );
		$this->loader->add_filter( 'ppp_nonce_life', $admin, 'define_public_post_preview_lifetime' ) ;
		$this->loader->add_filter( 'the_excerpt', $admin, 'remove_overview_from_excerpts' );
		$this->loader->add_filter( 'update_footer', $admin, 'output_platform_version_in_wp_admin', 100 );

		if ( get_current_blog_id() === PRC_MIGRATION_SITE ) {
			$this->loader->add_filter( 'acp/storage/file/directory', $admin_columns, 'acp_load_via_files' );
		}
		$this->loader->add_action( 'ac/ready', $admin_columns, 'register_columns' );
	}

	private function define_user_permissions_hooks() {
		$user_permissions = new User_Permissions(
			$this->get_plugin_name(),
			$this->get_version()
		);
		$this->loader->add_filter('wpcom_vip_enable_two_factor', $user_permissions, 'enforce_two_factor', 10, 1);
		$this->loader->add_action('admin_init', $user_permissions, 'autoload_user_roles');
	}

	private function define_rss_feed_hooks() {
		$rss_feeds = new RSS_Feeds(
			$this->get_plugin_name(),
			$this->get_version()
		);
		$this->loader->add_filter('the_excerpt_rss', $rss_feeds, 'remove_iframe');
		$this->loader->add_filter('the_content_feed', $rss_feeds, 'remove_iframe');
		$this->loader->add_action('wp_feed_cache_transient_lifetime', $rss_feeds, 'adjust_feed_cache_transient_lifetime');
		$this->loader->add_action('wp_head', $rss_feeds, 'add_to_head', 10);
	}

	/**
	 * Register all of the hooks related to the post visibility status system.
	 * @return void
	 */
	private function define_post_visibility_hooks() {
		$post_visibility = new Post_Visibility( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('init', $post_visibility, 'register_custom_visibility_statuses', 9);
		$this->loader->add_action('enqueue_block_editor_assets', $post_visibility, 'enqueue_assets');
	}

	/**
	 * Register all of the hooks related to the post visibility status system.
	 * @return void
	 */
	private function define_block_editor_hooks() {
		$block_editor = new Block_Editor( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('enqueue_block_editor_assets', $block_editor, 'enqueue_assets');
		$this->loader->add_action('enqueue_block_assets', $block_editor, 'post_type_template_css_defaults');
	}

	/**
	 * Register all of the hooks related to the post visibility status system.
	 * @return void
	 */
	private function define_site_editor_hooks() {
		$site_editor = new Site_Editor( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action('enqueue_block_editor_assets', $site_editor, 'enqueue_assets');
	}

	/**
	 * Register all of the hooks related to Gutenberg plugin integration.
	 * @return void
	 */
	private function define_gutenberg_hooks() {
		$gutenberg = new Gutenberg(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_filter( 'use_block_editor_for_post', $gutenberg, 'load_gutenberg', 15, 2 );
		$this->loader->add_action( 'init', $gutenberg, 'add_revisions_to_reusable_blocks' );
		$this->loader->add_action( 'menu_order', $gutenberg, 'group_admin_menus_together', 101 );
	}

	private function define_post_publish_pipeline_hooks() {
		$post_publish_pipeline = new Post_Publish_Pipeline(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_action( 'rest_api_init', $post_publish_pipeline, 'register_rest_fields' );
		$this->loader->add_filter('rest_post_query', $post_publish_pipeline, 'merge_post_parent_into_rest_queries', 10, 2);

		/**
		 * @uses prc_platform_on_incremental_save
		 */
		$this->loader->add_action( 'save_post', $post_publish_pipeline, 'post_incremental_save_hook', 10, 3 );
		/**
		 * @uses prc_platform_on_post_init
		 */
		$this->loader->add_action( 'transition_post_status', $post_publish_pipeline, 'post_init_hook', 0, 3 );
		/**
		 * @uses prc_platform_on_update
		 */
		$this->loader->add_action( 'transition_post_status', $post_publish_pipeline, 'post_updating_hook', 99, 3 );
		/**
		 * @uses prc_platform_on_publish
		 * @uses prc_platform_on_unpublish
		 */
		$this->loader->add_action( 'transition_post_status', $post_publish_pipeline, 'post_saving_hook', 100, 3 );
		/**
		 * @uses prc_platform_on_trash
		 */
		$this->loader->add_action( 'trashed_post', $post_publish_pipeline, 'post_trashed_hook', 100, 1 );
		/**
		 * @uses prc_platform_on_untrash
		 */
		$this->loader->add_action( 'untrashed_post', $post_publish_pipeline, 'post_trashed_hook', 100, 2 );
	}

	/**
	 * Register all of the hooks, settings, and custom functionality for the media/attachments system.
	 * @return void
	 */
	private function define_media_hooks() {
		$media_settings = new Media_Settings( $this->get_plugin_name(), $this->get_version() );
		$attachment_downloads = new Attachment_Downloader( $this->get_plugin_name(), $this->get_version() );
		$art_direction = new Art_Direction( $this->get_plugin_name(), $this->get_version() );
		$attachment_report = new Attachment_Report( $this->get_plugin_name(), $this->get_version() );

		// Media Settings
		$this->loader->add_filter( 'upload_size_limit', $media_settings, 'enforce_maximum_file_size_limit' );
		$this->loader->add_action( 'admin_init', $media_settings, 'enforce_image_defaults' );
		$this->loader->add_action( 'init', $media_settings, 'register_image_sizes' );
		$this->loader->add_action( 'enable-media-replace-upload-done', $media_settings, 'replace_media_clear_cdn', 100, 3 );
		$this->loader->add_filter( 'image_size_names_choose', $media_settings, 'filter_image_sizes_dropdown' );
		$this->loader->add_filter( 'vip_go_srcset_enabled', $media_settings, 'enable_srcset' );
		$this->loader->add_filter(
			'default_site_option_ms_files_rewriting', $media_settings,'handle_legacy_multisite_files_rewrites', 1000
		);
		$this->loader->add_filter('oembed_dataparse', $media_settings, 'youtube_remove_related', 10, 3);

		// Attachment Download URL Rewrite Handler
		$this->loader->add_action( 'init', $attachment_downloads, 'attachment_download_rewrite' );
		$this->loader->add_filter( 'query_vars', $attachment_downloads, 'download_attachment_query_vars' );
		$this->loader->add_filter( 'template_include', $attachment_downloads, 'download_attachment_template' );

		// Art Direction
		$this->loader->add_action( 'init', $art_direction, 'init_art_direction' );
		$this->loader->add_action( 'rest_api_init', $art_direction, 'register_art_direction_rest_field' );
		$this->loader->add_action( 'enqueue_block_editor_assets', $art_direction, 'enqueue_block_plugin_assets' );
		$this->loader->add_action( 'rest_api_init', $art_direction, 'register_rest_endpoint' );
		$this->loader->add_filter( 'register_post_type_args', $art_direction, 'change_featured_image_label', 100, 2 );
		$this->loader->add_filter( 'wpseo_opengraph_image', $art_direction, 'filter_facebook_image', 10, 1 );
		$this->loader->add_filter( 'wpseo_twitter_image', $art_direction, 'filter_twitter_image', 10, 1 );

		// Attachments Report
		$this->loader->add_filter( 'query_vars', $attachment_report, 'register_query_vars' );
		$this->loader->add_action( 'wp_enqueue_scripts', $attachment_report, 'enqueue_frontend_assets' );
		$this->loader->add_filter( 'the_content', $attachment_report, 'add_report_to_content' );
		$this->loader->add_action( 'admin_enqueue_scripts', $attachment_report, 'register_assets' );
		$this->loader->add_action( 'rest_api_init', $attachment_report, 'register_rest_endpoint' );
		$this->loader->add_action( 'ac/ready', $attachment_report, 'register_column' );
	}

	/**
	 * Register all of the hooks related to the iframe/embed system.
	 * @return void
	 */
	private function define_embed_hooks() {
		$embed = new Iframe_Embeds( $this->get_plugin_name(), $this->get_version() );

		// Embed Init
		$this->loader->add_filter( 'query_vars', $embed, 'iframe_qvar', 10, 1 );
		$this->loader->add_action( 'init', $embed, 'iframe_endpoint', 10 );
		// $this->loader->add_filter( 'request', $embed, 'filter_request', 10, 1 );
		$this->loader->add_filter( 'the_title', $embed, 'filter_title', 10, 1 );
		$this->loader->add_filter( 'the_content', $embed, 'filter_content', 10, 1 );
		$this->loader->add_action( 'rest_api_init', $embed, 'register_rest_fields' );
		$this->loader->add_action( 'init', $embed, 'register_assets', 10, 1 );
		$this->loader->add_filter( 'show_admin_bar', $embed, 'disable_admin_bar_on_iframes', 10, 1 );

		// Block Modifications
		$this->loader->add_filter( 'block_type_metadata', $embed, 'add_attributes', 100, 1 );
		$this->loader->add_filter( 'block_type_metadata_settings', $embed, 'add_settings', 100, 2 );
		$this->loader->add_filter( 'render_block', $embed, 'render', 105, 2 );
		// Block Controls
		$this->loader->add_action( 'enqueue_block_editor_assets', $embed, 'enqueue_editor_controls' );

		// Iframe Template
		$this->loader->add_filter('body_class', $embed, 'body_class', 99, 1);
		$this->loader->add_action( 'template_include', $embed, 'template_include', 99, 1 );
		$this->loader->add_action( 'template_redirect', $embed, 'template_default', 10, 1 );
		$this->loader->add_action( 'wp_head', $embed, 'head', 10, 1 );
		$this->loader->add_action( 'wp_footer', $embed, 'footer', 10, 1 );
		$this->loader->add_action( 'wp_enqueue_scripts', $embed, 'iframe_resizer_script', 20, 1 );
	}

	/**
	 * Register all of the hooks related to the schema/meta system, including parsely.
	 *
	 * @TODO: Was there a reason these arent using the plugin's own loader?
	 */
	private function define_schema_meta_hooks() {
		$schema_meta = new Schema_Meta( $this->get_plugin_name(), $this->get_version() );
		add_filter( 'wpseo_robots', array( $schema_meta, 'yoast_seo_no_index' ) );
		add_action( 'wp_head', array( $schema_meta, 'force_search_engines_to_use_meta' ) );
		add_filter( 'wpseo_title', array( $schema_meta, 'yoast_seo_legacy_title_fix' ), 10, 1 );
		add_filter( 'wpseo_opengraph_title', array( $schema_meta, 'remove_pipe_from_social_titles' ), 10, 1 );
		add_action( 'wp_head', array( $schema_meta, 'taxonomy_head_meta' ) );
		add_filter( 'wpseo_frontend_presenters', array( $schema_meta, 'add_parsely_meta' ) );
		add_filter( 'wp_parsely_metadata', array( $schema_meta, 'disable_parsely_json_ld'), 10, 3 );

		$this->loader->add_filter( 'wpvip_parsely_load_mu', $schema_meta, 'enable_parsely_mu_on_vip' );
		$this->loader->add_action( 'wp_head', $schema_meta, 'ascii', 1 );
		$this->loader->add_filter( 'wpseo_twitter_creator_account', $schema_meta, 'yoast_seo_default_twitter' );
		$this->loader->add_filter( 'wpseo_hide_version', $schema_meta, 'yoast_hide_version' );
	}

	/**
	 * Register all of the hooks related to taxonomies.
	 * @return void
	 */
	private function define_taxonomy_hooks() {
		$taxonomies = new Taxonomies( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $taxonomies, 'disable_term_description_filtering' );
		$this->loader->add_filter( 'get_terms', $taxonomies, 'replace_commas_in_term_names', 10, 1 );
		$this->loader->add_filter( 'global_terms_enabled', $taxonomies, 'disable_global_terms', 10, 1 );
		$this->loader->add_filter( 'wpseo_premium_term_redirect_slug_change', $taxonomies, 'yoast_enable_term_redirect_slug_change' );
		$this->loader->add_filter( 'register_taxonomy_args', $taxonomies, 'modify_post_tag_taxonomy_args', 10, 2 );

		$this->loader->add_action( 'init', $taxonomies, 'register_activity_trail_meta' );
		$this->loader->add_action( 'create_term', $taxonomies, 'hook_on_to_term_update', 10, 4 );
		$this->loader->add_action( 'edit_term', $taxonomies, 'hook_on_to_term_update', 10, 4 );

		// "Topic" Category
		// Begining with 5.0 we will be migrating away from the "Topic" taxonomy to the "Category" taxonomy.
		// This will net us immediate functionality gains in the block editor, and php helper functions built into the core of WordPress.
		// This is WordPress' core taxonomy, and we are simply renaming it's labels to "Topic" and adding a few customizations.
		$category = new Topic_Category();
		$this->loader->add_filter( 'register_taxonomy_args', $category, 'change_category_labels_to_topic', 10, 2 );
		$this->loader->add_action( 'enqueue_block_editor_assets', $category, 'enqueue_category_name_change_script' );

		// Collections
		$collections = new Collections();
		$this->loader->add_action( 'init', $collections, 'register' );

		// Formats
		$formats = new Formats();
		$this->loader->add_action( 'init', $formats, 'register' );

		// Languages
		$languages = new Languages();
		$this->loader->add_action( 'init', $languages, 'register' );

		// Mode of Analysis
		$mode_of_analysis = new Mode_Of_Analysis();
		$this->loader->add_action( 'init', $mode_of_analysis, 'register' );

		// Regions and Countries
		$regions_and_countries = new Regions_Countries();
		$this->loader->add_action( 'init', $regions_and_countries, 'register' );

		// Research Teams
		$research_teams = new Research_Teams();
		$this->loader->add_action( 'init', $research_teams, 'register' );
		if ( get_current_blog_id() === PRC_MIGRATION_SITE ) {
			$this->loader->add_filter( 'post_link', $research_teams, 'modify_post_permalinks', 10, 2 );
			$this->loader->add_filter( 'post_type_link', $research_teams, 'modify_post_permalinks', 10, 2 );
			$this->loader->add_filter( 'rewrite_rules_array', $research_teams, 'add_rewrite_rules', 10, 1 );
		}
	}

	private function define_slack_bot_hooks() {
		$slack = new Slack_Bot( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'transition_post_status', $slack, 'post_publish_notification', 10, 3 );
		$this->loader->add_action( 'created_category', $slack, 'category_created_notification', 10, 2 );
	}

	/**
	 * Register all of the hooks related to the 10up Distributor integration.
	 * @return void
	 */
	private function define_distributor_hooks() {
		$distributor = new Distributor();
		$this->loader->add_filter( 'dt_excluded_meta', $distributor, 'exclude_meta_list', 10, 1 );
		$this->loader->add_filter( 'dt_create_missing_terms', $distributor, 'disable_taxonomy_operations_on_category', 10, 2 );
		$this->loader->add_filter( 'dt_update_term_hierarchy', $distributor, 'disable_taxonomy_operations_on_category', 10, 2 );
		$this->loader->add_filter( 'dt_sync_meta', $distributor, 'exclude_meta_by_key', 10, 2 );
		$this->loader->add_filter( 'dt_distributable_post_statuses', $distributor, 'determine_distributable_post_statuses', 10, 1 );
		$this->loader->add_filter( 'dt_prepared_taxonomy_terms', $distributor, 'prepare_terms', 10, 2 );
		$this->loader->add_filter( 'dt_prepared_meta', $distributor, 'prepare_meta', 10, 2 );
		$this->loader->add_filter( 'dt_push_post_args', $distributor, 'prepare_pushed_post', 10, 4 );
		$this->loader->add_filter( 'dt_push_post_media', $distributor, 'allow_media_push', 10, 6, );
		$this->loader->add_action( 'dt_after_set_meta', $distributor, 'process_meta_asyncronously', 10, 3 );
		$this->loader->add_action( 'dt_push_network_post', $distributor, 'after_push', 10, 4 );
	}

	/**
	 * Register all the hooks related to the Action Scheduler integration.
	 * @return void
	 */
	private function define_action_scheduler_hooks() {
		$action_scheduler = new Action_Scheduler(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_action('init', $action_scheduler, 'register_schedules');
		// Registers WP CLI commands for Action Scheduler.
		$this->loader->add_action('action_scheduler_pre_init', $action_scheduler, 'pre_init');
		$this->loader->add_filter('action_scheduler_retention_period', $action_scheduler, 'modify_retention_period');
	}

	/**
	 * Register all the hooks related to the asynchronous Multisite Migration system.
	 * @return void
	 */
	private function define_multisite_migration_hooks() {
		$multisite_migration = new Multisite_Migration();
		$multisite_migration_tools = new Multisite_Migration_Tools();
		/**
		 * For now these are being structured explicitly to support the multisite migration but many
		 * of these distributor workflows that handle media and re-attaching media/posts will be re-tooled for post-launch distributor support of /decoded and /producers.
		 */
		$this->loader->add_action(
			'prc_distributor_queue_push',
			$multisite_migration,
			'scheduled_distributor_push',
			10, 2
		);
		$this->loader->add_action(
			'prc_run_at_end_of_day',
			$multisite_migration,
			'schedule_midnight_distributor_push'
		);
		$this->loader->add_action(
			'prc_distributor_queue_attachment_migration',
			$multisite_migration,
			'scheduled_distributor_attachments_push',
			10, 2
		);
		$this->loader->add_action(
			'prc_distributor_queue_attachment_meta_migration',
			$multisite_migration,
			'scheduled_distributor_attachments_meta_mapping',
			10, 3
		);
		$this->loader->add_action(
			'prc_distributor_queue_multisection_migration',
			$multisite_migration,
			'scheduled_distributor_multisection_report_meta_mapping',
			10, 2
		);
		$this->loader->add_action(
			'prc_distributor_queue_related_posts_migration',
			$multisite_migration,
			'scheduled_distributor_related_posts_meta_mapping',
			10, 2
		);
		$this->loader->add_action(
			'prc_distributor_queue_bylines_migration',
			$multisite_migration,
			'scheduled_distributor_bylines_mapping',
			10, 2
		);
		$this->loader->add_action(
			'prc_distributor_queue_block_entity_patching',
			$multisite_migration,
			'scheduled_distributor_block_entity_mapping',
			10, 1
		);
		$this->loader->add_action(
			'prc_distributor_queue_classic_editor_patching',
			$multisite_migration,
			'scheduled_distributor_classic_editor_mapping',
			10, 1
		);
		$this->loader->add_action(
			'prc_distributor_queue_block_media_patching',
			$multisite_migration,
			'scheduled_distributor_block_media_mapping',
			10, 2
		);
		$this->loader->add_action(
			'prc_distributor_queue_page_migration',
			$multisite_migration,
			'scheduled_distributor_page_mapping',
			10, 1
		);
		$this->loader->add_action(
			'prc_distributor_queue_primary_category_migration',
			$multisite_migration,
			'scheduled_distributor_primary_category_mapping',
			10, 2
		);

		if ( get_current_blog_id() === PRC_MIGRATION_SITE ) {
			// Register "Migration Tools" REST API and interface.
			$this->loader->add_action(
				'rest_api_init',
				$multisite_migration_tools,
				'register_rest_endpoints'
			);
			$this->loader->add_action(
				'enqueue_block_editor_assets',
				$multisite_migration_tools,
				'enqueue_assets'
			);
		}
	}

	/**
	 * Define all the hooks related to the Event content type.
	 * @return void
	 */
	private function define_event_post_type_hooks() {
		$events = new Events( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $events, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $events, 'enable_gutenberg_ramp' );
	}

	/**
	 * Define all the hooks related to the Block Areas (Taxonomy) and Block Modules (Post Type)
	 * A editorialized system for block template parts essentially.
	 * @return void
	 */
	private function define_block_area_module_hooks() {
		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			return;
		}
		$block_area_modules = new Block_Area_Modules( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $block_area_modules, 'register_block_areas' );
		$this->loader->add_action( 'init', $block_area_modules, 'register_block_modules' );
		$this->loader->add_action( 'init', $block_area_modules, 'block_init' );
		$this->loader->add_filter( 'prc_load_gutenberg', $block_area_modules, 'enable_gutenberg_ramp' );
		$this->loader->add_filter( 'the_content', $block_area_modules, 'collect_story_item_post_ids', 10, 1 );
		$this->loader->add_filter( 'the_content', $block_area_modules, 'de_duplicate_story_items_in_query_block', 10, 1 );
	}

	/**
	 * Define all the hooks related to the Fact Sheet content type.
	 * @return void
	 */
	private function define_fact_sheet_post_type_hooks() {
		$fact_sheets = new Fact_Sheets( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $fact_sheets, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $fact_sheets, 'enable_gutenberg_ramp' );
	}

	/**
	 * Define all the hooks related to the Interactive content type.
	 * @return void
	 */
	private function define_interactive_post_type_hooks() {
		$interactives = new Interactives( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $interactives, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $interactives, 'enable_gutenberg_ramp' );
	}

	/**
	 * Define all the hooks related to the Interactive content type.
	 * @return void
	 */
	private function define_homepage_post_type_hooks() {
		$homepages = new Homepages( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $homepages, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $homepages, 'enable_gutenberg_ramp' );
		$this->loader->add_action( 'admin_bar_menu', $homepages, 'add_front_page_quick_edit', 999 );
		$this->loader->add_filter( 'admin_menu_order', $homepages, 'admin_menu_order', 999 );
		$this->loader->add_filter( 'post_type_link', $homepages, 'modify_homepage_permalink', 10, 2 );
	}

	/**
	 * Define all the hooks related to the Courses content type.
	 * @return void
	 */
	private function define_course_post_type_hooks() {
		$courses = new Courses( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $courses, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $courses, 'enable_gutenberg_ramp' );
	}

	/**
	 * Define all the hooks related to the Press Release content type.
	 * @return void
	 */
	private function define_press_release_post_type_hooks() {
		$press_releases = new Press_Releases( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'init', $press_releases, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $press_releases, 'enable_gutenberg_ramp' );
		$this->loader->add_filter( 'post_type_link', $press_releases, 'get_press_release_permalink', 10, 3);
	}

	private function define_page_type_hooks() {
		add_action(
			'init',
			function() {
				add_post_type_support( 'page', 'custom-fields' );
			}
		);
	}

	/**
	 * Register all the hooks related to the Short Reads content type.
	 * @return void
	 */
	private function define_short_read_post_type_hooks() {
		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			return;
		}
		$short_reads = new Short_Reads( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'init', $short_reads, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $short_reads, 'enable_gutenberg_ramp' );
		$this->loader->add_action( 'init', $short_reads, 'register_permalink_structure' );
		$this->loader->add_filter( 'post_type_link', $short_reads, 'get_short_read_permalink', 10, 3 );
	}

	private function define_alexa_daily_briefing_hooks() {
		$alexa_daily_briefing = new Alexa_Daily_Briefing( $this->get_plugin_name(), $this->get_version() );
		$this->loader->add_action( 'init', $alexa_daily_briefing, 'register_type' );
		$this->loader->add_filter( 'prc_load_gutenberg', $alexa_daily_briefing, 'enable_gutenberg_ramp' );
	}

	/**
	 * Register all the hooks related to the Staff Bylines system.
	 * @return void
	 */
	private function define_staff_bylines_hooks() {
		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			return;
		}
		$staff_bylines = new Staff_Bylines(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$staff_info_panel = new Staff_Info_Panel();

		$bylines_acknowledgements_panel = new Bylines_Acknowledgements_Panel(
			$this->get_plugin_name(),
			$this->get_version()
		);

		// Establish a bi-directional relationship between the "staff" post type and the "byline" taxonomy.
		$this->loader->add_action( 'init', $staff_bylines, 'register_term_data_store' );
		$this->loader->add_filter( 'prc_load_gutenberg', $staff_bylines, 'enable_gutenberg_ramp' );
		$this->loader->add_filter( 'rest_staff_collection_params', $staff_bylines, 'filter_add_rest_orderby_params', 10, 1);
		$this->loader->add_filter( 'posts_orderby', $staff_bylines, 'orderby_last_name', PHP_INT_MAX, 2 );

		$this->loader->add_action( 'pre_get_posts', $staff_bylines, 'hide_former_staff', 10, 1 );
		$this->loader->add_filter( 'the_title', $staff_bylines, 'indicate_former_staff', 10, 1 );

		$this->loader->add_filter( 'post_type_link', $staff_bylines, 'modify_staff_permalink', 20, 2 );
		$this->loader->add_action( 'admin_bar_menu', $staff_bylines, 'modify_admin_bar_edit_link', 100 );

		$this->loader->add_action( 'rest_api_init', $staff_bylines, 'add_staff_info_term' );
		$this->loader->add_filter( 'wpseo_enhanced_slack_data', $staff_bylines, 'generate_yoast_slack_data', 10, 2 );
		$this->loader->add_filter( 'wpseo_meta_author', $staff_bylines, 'generate_yoast_author_data', 10, 2 );
		$this->loader->add_filter( 'wpseo_opengraph_author_facebook', $staff_bylines, 'generate_yoast_author_data', 10, 2 );

		$this->loader->add_action('enqueue_block_editor_assets', $staff_info_panel, 'enqueue_assets');
		$this->loader->add_action('enqueue_block_editor_assets', $bylines_acknowledgements_panel, 'enqueue_assets');
	}

	/**
	 * Register all the hooks related to the Datasets system.
	 * @return void
	 */
	private function define_datasets_hooks() {
		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			return;
		}
		$datasets = new Datasets(
			$this->get_plugin_name(),
			$this->get_version()
		);

		// Establish a bi-directional relationship between the "dataset" post type and the "datasets" taxonomy.
		$this->loader->add_action( 'init', $datasets, 'register_term_data_store' );
		$this->loader->add_filter( 'prc_load_gutenberg', $datasets, 'enable_gutenberg_ramp' );
	}

	/**
	 * Register all the hooks related to the housekeeping system.
	 * Clean up old drafts, etc.
	 */
	public function define_housekeeping_hooks() {
		$housekeeping = new Housekeeping(
			$this->get_plugin_name(),
			$this->get_version()
		);
		// Clean up old drafts on a rolling 30 day basis, weekly. Move them to the trash.
		// Let WordPress handle the trash.
		$this->loader->add_action( 'prc_run_weekly', $housekeeping, 'weekly_drafts_cleanup' );
		// Clean up quiz archetypes with less than 100 hits.
		$this->loader->add_action( 'prc_run_monthly', $housekeeping, 'monthly_quiz_cleanup' );
	}

	private function define_jetpack_integration_hooks() {
		$jetpack = new Jetpack(
			$this->get_plugin_name(),
			$this->get_version()
		);

		// Restrict what Jetpack modules are available.
		$this->loader->add_action( 'jetpack_set_available_extensions', $jetpack, 'set_available_jetpack_extensions' );
		$this->loader->add_filter( 'option_jetpack_active_modules', $jetpack, 'set_available_jetpack_modules' );
		$this->loader->add_action( 'jetpack_register_gutenberg_extensions', $jetpack, 'set_available_jetpack_blocks', 99 );
	}

	private function define_convert_to_blocks() {
		$convert_to_blocks = new Convert_To_Blocks(
			$this->get_plugin_name(),
			$this->get_version()
		);

		// Enqueue the transform functions to convert shortcodes to their respective blocks.
		$this->loader->add_action( 'enqueue_block_editor_assets', $convert_to_blocks, 'enqueue_assets' );
		$this->loader->add_action( 'init', $convert_to_blocks, 'register_legacy_shortcodes' );
	}

	private function define_social_hooks() {
		$bitly = new Bitly(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_action( 'wp_head', $bitly, 'flush_shortlink' );
		$this->loader->add_action( 'prc_platform_on_publish', $bitly, 'update_post_with_shortlink', 10, 1 );
		$this->loader->add_action( 'admin_bar_menu', $bitly, 'add_quick_edit', 100 );
		$this->loader->add_filter( 'get_shortlink', $bitly, 'filter_get_shortlink', 100, 2 );
	}

	private function define_search_hooks() {
		$search = new Search(
			$this->get_plugin_name(),
			$this->get_version()
		);
		$this->loader->add_filter( 'facetwp_use_search_relevancy', $search, 'facetwp_disable_search_relevancy' );
		$this->loader->add_filter( 'pre_get_posts', $search, 'sanitize_search_term', 1, 1 );
		$this->loader->add_filter( 'ep_set_sort', $search, 'ep_sort_by_date', 10, 2 );
		$this->loader->add_filter( 'ep_highlight_should_add_clause', $search, 'ep_enable_highlighting', 10, 4);
	}

	private function define_related_posts_hook() {
		$related_posts = new Related_Posts(
			$this->get_plugin_name(),
			$this->get_version()
		);
		$this->loader->add_action( 'init', $related_posts, 'register_meta_fields' );
		$this->loader->add_action( 'enqueue_block_editor_assets', $related_posts, 'enqueue_assets' );
		$this->loader->add_action( 'wpcom_vip_cache_pre_execute_purges', $related_posts, 'clear_cache_on_purge' );
		$this->loader->add_action( 'prc_platform_on_update', $related_posts, 'clear_cache_on_update' );
		$this->loader->add_filter( 'prc_related_posts', $related_posts, 'process', 10, 2 );
	}

	private function define_post_report_package_hooks() {
		$post_report_package = new Post_Report_Package(
			$this->get_plugin_name(),
			$this->get_version()
		);

		$this->loader->add_action( 'init', $post_report_package, 'register_meta_fields' );
		$this->loader->add_action( 'rest_api_init', $post_report_package, 'register_rest_fields' );
		$this->loader->add_action( 'enqueue_block_editor_assets', $post_report_package, 'enqueue_panel_assets' );

		$this->loader->add_action( 'prc_platform_on_incremental_save', $post_report_package, 'set_child_posts', 10, 1 );
		$this->loader->add_action( 'prc_platform_on_update', $post_report_package, 'update_child_state', 10, 1 );
		$this->loader->add_action( 'pre_get_posts', $post_report_package, 'hide_back_chapter_posts', 10, 1 );
		$this->loader->add_filter( 'the_title', $post_report_package, 'indicate_back_chapter_post', 10, 2 );
		$this->loader->add_filter( 'wpseo_disable_adjacent_rel_links', $post_report_package, 'disable_yoast_adjacent_rel_links_on_report_package' );
		$this->loader->add_filter( 'query_vars', $post_report_package, 'register_query_var', 10, 1 );
	}

	private function define_apple_news_hooks() {
		$apple_news = new Apple_News(
			$this->get_plugin_name(),
			$this->get_version()
		);
		$this->loader->add_filter('apple_news_exporter_byline', $apple_news,  'get_bylines', 10, 2);
		$this->loader->add_filter('apple_news_skip_push', $apple_news, 'skip_push', 10, 1);
	}

	private function define_icon_loader_hooks() {
		$icon_loader = new Icon_Loader(
			$this->get_plugin_name(),
			$this->get_version()
		);
		// Load the loader late so that theres a change for an icon library to be registered.
		$this->loader->add_action( 'enqueue_block_assets', $icon_loader, 'enqueue_icon_loader', 99 );
		// Load fallback prc-icons if needed
		$this->loader->add_action( 'enqueue_block_editor_assets', $icon_loader, 'enqueue_icon_library_fallback', 10 );
		// Determine if icon loader should be enqueued in frontend
		$this->loader->add_filter( 'render_block', $icon_loader, 'tree_shaker', 100, 3 );
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
