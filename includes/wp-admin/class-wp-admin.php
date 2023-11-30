<?php
namespace PRC\Platform;
use WP_Error;
// For admin notices see https://github.com/Automattic/vip-go-mu-plugins/tree/develop/admin-notice
// AND https://github.com/Automattic/vip-go-mu-plugins/blob/develop/async-publish-actions.php

class WP_Admin {
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

	public static $handle = 'prc-platform-wp-admin';

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

		require_once plugin_dir_path( __FILE__ ) . 'admin-columns/class-admin-columns.php';
	}

	public function default_admin_color_scheme( $result ) {
		$result = 'modern';
		return $result;
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

	public function admin_bar_tweaks() {
		global $wp_admin_bar;

		$tools_id = 'prc-tools';

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

		// create a new wp_admin bar node for my Attachments Report tool
		$attachments_tool = array(
			'id'    => 'attachments-report',
			'title' => 'Attachments Report',
			'href'  => get_permalink() . '?attachmentsReport=true',
			'parent' => $tools_id,
			'meta'  => array(
				'title' => 'Attachments Report',
			),
		);

		if ( $vip_cache_tool || $bitly_tool || $parsely_tool || $attachments_tool ) {
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
		}

		// Remove fwp cache, comments
		$wp_admin_bar->remove_menu( 'fwp-cache' );
		$wp_admin_bar->remove_menu( 'comments' );
		$wp_admin_bar->remove_menu( 'notes' );
		if ( ! is_search() ) {
			$wp_admin_bar->remove_menu( 'vip-search-dev-tools' );
		}
		if ( ! is_user_admin() ) {
			$wp_admin_bar->remove_menu( 'customize' );
		}
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
			echo '<script>window.prcEditorPostType = "' . $post_type . '";</script>';
		}
	}

	/**
	 * Disables the cookie banner for logged in users and on non-production environments.
	 * @hook disable_cookiepro
	 * @return false|void
	 */
	public function disable_cookie_banner_conditions($disable = false) {
		$env = wp_get_environment_type();
		if ( is_user_logged_in() || 'production' !== $env ) {
			return true;
		}
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
	 * This is a serious place no emojis here.
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
		return 14 * DAY_IN_SECONDS;
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
