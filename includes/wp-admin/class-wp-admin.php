<?php
namespace PRC\Platform;
use WP_Error;
use WP_Query;
use WP_Term;

// For admin notices see https://github.com/Automattic/vip-go-mu-plugins/tree/develop/admin-notice
// AND https://github.com/Automattic/vip-go-mu-plugins/blob/develop/async-publish-actions.php

class WP_Admin {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-wp-admin';

	public static $public_post_preview_lifetime = 1209600; // 14 days in seconds

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . 'admin-columns/class-admin-columns.php';
		$this->init($loader);
	}

	public function init($loader = null) {
		if (null !== $loader) {
			// This removes the "Public Preview" next to the draft label in the WordPress admin.

			remove_filter( 'display_post_states', array( 'DS_Public_Post_Preview', 'display_preview_state' ), 20 );
			// This disables the VIP restriction for usernames when on local environments. Good for testing and automation.
			if ( defined('PRC_PLATFORM_TESTING_MODE') && true === PRC_PLATFORM_TESTING_MODE ) {
				remove_filter( 'authenticate', 'wpcom_vip_limit_logins_for_restricted_usernames', 30 );
			}

			// Actions
			$loader->add_action( 'admin_enqueue_scripts', $this, 'enqueue_assets' );
			$loader->add_action( 'login_enqueue_scripts', $this, 'login_logo' );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_admin_bar', 100 );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_tools_menu', 101 );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_edit_menu', 102 );
			$loader->add_action( 'admin_print_footer_scripts', $this, 'admin_footer' );
			$loader->add_action( 'admin_menu', $this, 'modify_menu', 10 );
			$loader->add_action( 'wp_dashboard_setup' , $this, 'remove_dashboard_widgets', 99 );
			$loader->add_action( 'init', $this, 'disable_emojis' );
			// Filters
			$loader->add_filter( 'get_user_option_admin_color', $this, 'default_admin_color_scheme' );
			$loader->add_filter( 'disable_cookiepro', $this, 'disable_cookie_banner_conditions', 10, 1 );
			$loader->add_filter( 'multisite_enhancements_status_label', $this, 'multisite_enhancement_plugin_sites_label', 10, 2 );
			$loader->add_filter( 'ppp_nonce_life', $this, 'define_public_post_preview_lifetime' ) ;
			$loader->add_filter( 'the_excerpt', $this, 'remove_overview_from_excerpts' );
			$loader->add_filter( 'update_footer', $this, 'output_platform_version_in_wp_admin', 100 );
			$loader->add_filter( 'dashboard_recent_posts_query_args', $this, 'show_all_post_types_in_dashboard', 15 );
			$loader->add_filter( 'dashboard_recent_drafts_query_args', $this, 'show_all_post_types_in_dashboard', 15 );

			new Admin_Columns_Pro($loader);
		}
	}

	/**
	 * Change the default admin color scheme to modern and don't allow users to change it.
	 * @param mixed $result
	 * @return string
	 */
	public function default_admin_color_scheme( $result ) {
		$result = 'modern';
		return $result;
	}

	/**
	 * @hook dashboard_recent_posts_query_args
	 */
	public function show_all_post_types_in_dashboard(array $query_args) {
		$post_types = ['post', 'short-read', 'fact-sheet', 'feature', 'quiz'];

		if (is_array($post_types)) {
			$query_args['post_type'] = $post_types;
		}

		return $query_args;
	}

	/**
	 * Change the login logo to the Pew Research Center logo.

	 * @return <style> tag with the new logo
	 */
	public function login_logo() {
		?>
		<style type="text/css">
			#login h1 a, .login h1 a {
				background-image: url(<?php echo get_bloginfo('url'); ?>/wp-content/images/logo-login.svg);
				height: 48px;
				width: 320px;
				background-size: 320px 48px;
				background-repeat: no-repeat;
				padding-bottom: 30px;
			}
		</style>
		<?php
	}

	public function manage_tools_menu() {
		global $wp_admin_bar;

		$tools_id = 'tools';

		/**
		 * Tools Menu
		 */
		$vip_cache_tool = $wp_admin_bar->get_node('vip-purge-page');
		if ( $vip_cache_tool ) {
			$vip_cache_tool->parent = $tools_id;
			$vip_cache_tool = (array) $vip_cache_tool;
			$wp_admin_bar->remove_node('vip-purge-page');

		}

		$bitly_tool = $wp_admin_bar->get_node('reset-bitly-link');
		if ( $bitly_tool ) {
			$bitly_tool->parent = $tools_id;
			$bitly_tool = (array) $bitly_tool;
			$wp_admin_bar->remove_node('reset-bitly-link');
		}

		$parsely_tool = $wp_admin_bar->get_node('parsely-stats');
		if ( $parsely_tool ) {
			$parsely_tool->parent = $tools_id;
			$parsely_tool = (array) $parsely_tool;
			$wp_admin_bar->remove_node('parsely-stats');
		}

		$yoast_redirect_tool = $wp_admin_bar->get_node('wpseo-premium-create-redirect');
		if ( $yoast_redirect_tool ) {
			$yoast_redirect_tool->parent = $tools_id;
			$yoast_redirect_tool = (array) $yoast_redirect_tool;
			$wp_admin_bar->remove_node('wpseo-premium-create-redirect');
		}

		$duplicate_post = $wp_admin_bar->get_node('duplicate-post');
		if ( $duplicate_post ) {
			$duplicate_post->parent = $tools_id;
			$duplicate_post = (array) $duplicate_post;
			$wp_admin_bar->remove_node('duplicate-post');
		}

		// Create the new Attachment Report tool
		$attachments_tool = array(
			'id'    => 'attachments-report',
			'title' => 'Attachments Report',
			'href'  => get_permalink() . '?attachmentsReport=true',
			'parent' => $tools_id,
			'meta'  => array(
				'title' => 'Attachments Report',
			),
		);

		if ( $vip_cache_tool || $bitly_tool || $parsely_tool || $attachments_tool || $yoast_redirect_tool || $duplicate_post ) {
			$wp_admin_bar->add_menu(
				array(
					'id'    => $tools_id,
					'title' => 'Tools',
					'href'  => '#',
				)
			);
			if ( $vip_cache_tool ) {
				$wp_admin_bar->add_node( $vip_cache_tool );
			}
			if ( $bitly_tool ) {
				$wp_admin_bar->add_node( $bitly_tool );
			}
			if ( $parsely_tool ) {
				$wp_admin_bar->add_node( $parsely_tool );
			}
			if ( $attachments_tool ) {
				$wp_admin_bar->add_node( $attachments_tool );
			}
			if ( $yoast_redirect_tool ) {
				$wp_admin_bar->add_node( $yoast_redirect_tool );
			}
			if ( $duplicate_post ) {
				$wp_admin_bar->add_node( $duplicate_post );
			}
		}
	}

	public function manage_edit_menu() {
		global $wp_admin_bar, $wp_query;
		$edit_id = 'edit';
		/**
		 * Edit Menu
		 */
		$queried_object = $wp_query->get_queried_object();
		$type = '';
		// Check for the current post type...
		if ( $queried_object instanceof WP_Term ) {
			$type = $queried_object->taxonomy;
			$type = 'datasets' === $type ? 'dataset' : $type;
			$type = 'bylines' === $type ? 'staff' : $type;
		} elseif ( 'wp_post' === $type ) {
			$type = $queried_object->post_type;
		}
		$edit_node_name = 'post' === $type ? 'edit' : 'edit_' . $type;
		$edit = $wp_admin_bar->get_node($edit_node_name);
		if ( !$edit ) {
			// Fallback to just edit.
			$edit_node_name = 'edit';
			$edit = $wp_admin_bar->get_node($edit_node_name);
		}
		if ( !$edit && is_user_logged_in() ) {
			$wp_admin_bar->add_menu(
				array(
					'id'    => $edit_node_name,
					'title' => 'Edit',
					'href'  => '#',
				)
			);
		}

		if ( ($wp_query->is_category() || $wp_query->is_tax('regions-countries') || $wp_query->is_tax('collection')) && $wp_query->is_main_query() ) {
			$queried_object = $wp_query->get_queried_object();
			$queried_taxonomy = $queried_object->taxonomy;

			$block_modules = get_posts(array(
				'post_type' => 'block_module',
				'tax_query' => array(
					array(
						'taxonomy' => $queried_taxonomy,
						'field' => 'slug',
						'terms' => $queried_object->slug,
						'include_children' => false,
					),
				),
				'fields' => 'ids',
				'posts_per_page' => 3,
			));

			if ( $block_modules ) {
				foreach ( $block_modules as $block_module_id ) {
					$block_area = wp_get_object_terms( $block_module_id, 'block_area', array( 'fields' => 'names' ));
					if ( ! empty( $block_area ) ) {
						$block_area = $block_area[0];
						$new_node = array(
							'id' => 'edit-block-module-' . $block_module_id,
							'title' => 'Edit ' . $block_area,
							'href' => get_edit_post_link( $block_module_id ),
							'parent' => $edit_id,
						);
						$wp_admin_bar->add_node( $new_node );
					}
				}
			}
		}

		$site_editor = $wp_admin_bar->get_node('site-editor');
		if ( $site_editor ) {
			$site_editor->title = 'Edit Template';
			// now remove the existing node and then add it back again with the updated title
			$site_editor->parent = $edit_node_name;
			$wp_admin_bar->remove_node('site-editor');
			$wp_admin_bar->add_node($site_editor);
		}
	}

	public function manage_admin_bar() {
		global $wp_admin_bar;
		/**
		 * Other/Misc
		 */

		// Get rid of the "Howdy" in the Profile link
		$my_account = $wp_admin_bar->get_node('my-account');
		if ( $my_account ) {
			// I actualy just want to remove the "Howdy" part of the greeting, make it just the username.
			$my_account->title = str_replace('Howdy, ', '', $my_account->title);
			// now remove the existing node and then add it back again with the updated title
			$wp_admin_bar->remove_node('my-account');
			$wp_admin_bar->add_node($my_account);
		}

		// Remove Search
		$search = $wp_admin_bar->get_node('search');
		if ( $search ) {
			$wp_admin_bar->remove_node('search');
		}

		// Remove fwp cache, comments
		$wp_admin_bar->remove_menu( 'fwp-cache' );
		$wp_admin_bar->remove_menu( 'comments' );
		$wp_admin_bar->remove_menu( 'notes' );
		if ( ! is_search() ) {
			$wp_admin_bar->remove_menu( 'vip-search-dev-tools' );
		}
		$wp_admin_bar->remove_menu( 'customize' );
	}

	public function register_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';


		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( 'prc-platform-wp-admin', 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	/**
	 * Sometimes you need a quick foolproof way to get the current post type in the admin screen. This is it.
	 * It's not fancy, it's not clever, but it works.
	 * @return void
	 */
	public function admin_footer() {
		// get current post type in admin screen
		global $post_type;
		if ( isset( $post_type ) && is_string( $post_type ) ) {
			// add the post type to the javascript global object window.prcEditorPostType
			echo wp_sprintf( '<script>window.prcEditorPostType = "%s";</script>', esc_js($post_type) );
		}
	}

	/**
	 * Disables the cookie banner for logged in users and on non-production environments.
	 * @hook disable_cookiepro
	 * @return false|void
	 */
	public function disable_cookie_banner_conditions($disable = false) {
		$env = wp_get_environment_type();
		if ( is_user_logged_in() || 'production' !== $env || is_iframe() ) {
			return true;
		}
		// Check if is iframe and if so disable.
		return $disable;
	}

	/**
	 * @hook admin_menu
	 * @param mixed $menu
	 * @return void
	 */
	public function modify_menu() {
		global $menu;
		unset( $menu[15] ); // 15 = Links menu
	}

	/**
	 * Remove useless widgets from the dashboard.
	 * @hook wp_dashboard_setup
	 */
	public function remove_dashboard_widgets() {
		global $wp_meta_boxes;
		unset( $wp_meta_boxes['dashboard']['normal']['core']['dashboard_recent_comments'] );
		unset( $wp_meta_boxes['dashboard']['side']['core']['dashboard_primary'] );
		unset( $wp_meta_boxes['dashboard']['side']['core']['dashboard_secondary'] );
		unset( $wp_meta_boxes['dashboard']['side']['core']['dashboard_quick_press'] );
	}

	/**
	 * @hook multisite_enhancements_status_label
	 * @param mixed $blogname
	 * @param mixed $blog
	 * @return void
	 */
	public function multisite_enhancement_plugin_sites_label($blogname, $blog) {
		return $blog->blogname;
	}

	/**
	 * This is a serious place, no emojis here.
	 * @hook init
	 * @return void
	 */
	public function disable_emojis() {
		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );
		remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
		remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
		remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	}

	/**
	 * @hook update_footer
	 * @param mixed $content
	 * @return string
	 */
	public function output_platform_version_in_wp_admin( $content ) {
		$environment = '<span style="color:red;">Production</span>';
		if ( 'production' !== wp_get_environment_type() ) {
			$environment = '<span style="color:green;">Development</span>';
		}
		return '<strong>' . $environment . ' | PRC Platform Core: ' . $this->version . '</strong>';
	}

	/**
	 * Change the Public Post Preview plugins default lifetime to 14 days.
	 * @hook ppp_nonce_life
	 * @return int|float
	 */
	public function define_public_post_preview_lifetime() {
		return self::$public_post_preview_lifetime;
	}

	/**
	 * Removes the "Overview" text from the beginning of excerpts.
	 * @hook the_excerpt
	 * @param mixed $excerpt
	 * @return string|string[]|null
	 */
	public function remove_overview_from_excerpts( $excerpt ) {
		$excerpt = preg_replace( '/^<p>(\s+|&nbsp;\s+)?Overview\s/', '<p>', $excerpt );
		return $excerpt;
	}

}
