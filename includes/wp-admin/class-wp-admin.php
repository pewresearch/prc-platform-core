<?php
/**
 * WP Admin management class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP_Error;
use WP_Term;

/**
 * WP Admin management class.
 */
class WP_Admin {
	/**
	 * The handle for the wp-admin script.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-wp-admin';

	/**
	 * The public post preview lifetime.
	 *
	 * @var int
	 */
	public static $public_post_preview_lifetime = 1209600; // 14 days in seconds

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'admin-columns/class-admin-columns.php';
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// This removes the "Public Preview" next to the draft label in the WordPress admin.

			remove_filter( 'display_post_states', array( 'DS_Public_Post_Preview', 'display_preview_state' ), 20 );

			// Actions.
			$loader->add_action( 'admin_enqueue_scripts', $this, 'enqueue_assets' );
			$loader->add_action( 'login_enqueue_scripts', $this, 'login_logo' );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_admin_bar', 100 );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_tools_menu', 101 );
			$loader->add_action( 'wp_before_admin_bar_render', $this, 'manage_edit_menu', 102 );
			$loader->add_action( 'admin_print_footer_scripts', $this, 'admin_footer' );
			$loader->add_action( 'admin_menu', $this, 'remove_links_menu', 10 );
			$loader->add_action( 'wp_dashboard_setup', $this, 'remove_dashboard_widgets', 99 );
			$loader->add_action( 'init', $this, 'disable_emojis' );
			// Filters.
			$loader->add_filter( 'get_user_option_admin_color', $this, 'default_admin_color_scheme' );
			$loader->add_filter( 'disable_cookiepro', $this, 'disable_cookie_banner_conditions', 10, 1 );
			$loader->add_filter( 'multisite_enhancements_status_label', $this, 'multisite_enhancement_plugin_sites_label', 10, 2 );
			$loader->add_filter( 'ppp_nonce_life', $this, 'define_public_post_preview_lifetime' );
			$loader->add_filter( 'the_excerpt', $this, 'remove_overview_from_excerpts' );
			$loader->add_filter( 'update_footer', $this, 'output_platform_version_in_wp_admin', 100 );
			$loader->add_filter( 'dashboard_recent_posts_query_args', $this, 'show_all_post_types_in_dashboard', 15 );
			$loader->add_filter( 'dashboard_recent_drafts_query_args', $this, 'show_all_post_types_in_dashboard', 15 );
			$loader->add_filter( 'the_password_form', $this, 'modify_the_password_form', 10, 3 );

			new Admin_Columns( $loader );
		}
	}

	/**
	 * Password protect embargo styling.
	 */
	public function password_protect_embargo_styling() {
		ob_start();
		?>
		<style>
		.post-password-form {
			position: fixed;
			z-index: 1000;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			padding: 1em;
			color: #000000;
			background: #ff00002e;
			backdrop-filter: blur(5px);
			border: none;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		.post-password-form input[type="submit"] {
			appearance: none;
			border: none;
			background: red;
			color: white;
			padding: 1em;
			cursor: pointer;
		}
		.post-password-form input {
			border: none;
			padding: 1em;
		}

		.post-password-form * {
			max-width: 680px;
		}
		.post-password-form h1 {
			font-family: var(--wp--preset--font-family--sans-serif);
			font-size: 2rem;
			font-weight: 700;
			margin-bottom: 1rem;
			text-transform: uppercase;
		}
		.post-password-form .ical-download {
			display: inline-block;
			font-size: 1rem;
			font-weight: 700;
			text-decoration: none;
			color: #000;
			background: #000;
			color: #fff;
			padding: 0.5rem 1rem;
			border-radius: 0.25rem;
		}
		.post-password-form p {
			font-family: var(--wp--preset--font-family--sans-serif);
			font-size: 1.25rem;
			font-weight: 400;
			margin-bottom: 1rem;
			text-transform: uppercase;
		}
		</style>
		<script>
			document.addEventListener( 'DOMContentLoaded', function() {
				// move the form.post-password-form to the start of the body
				document.body.insertBefore( document.querySelector( '.post-password-form' ), document.body.firstChild );
			} );
		</script>
		<?php
		return ob_get_clean();
	}

	/**
	 * Modify the password form language.
	 *
	 * @param int $post_id The post ID.
	 * @return string The modified output.
	 */
	public function password_protect_embargo_language( $post_id ) {
		// Check if the post status is scheduled.
		$post_status = get_post_status( $post_id );
		if ( 'future' === $post_status ) {
			$post_publish_date_time = get_post_field( 'post_date_gmt', $post_id );
			$embargo_end_date       = ' UNTIL ' . wp_date( 'g:i A T', strtotime( $post_publish_date_time ) ) . ' ON ' . wp_date( 'F j, Y', strtotime( $post_publish_date_time ) );
		} else {
			$embargo_end_date = '';
		}
		return wp_sprintf(
			'<h1>Embargoed</h1><p><strong>Not for release or publication%s.</strong></p>',
			$embargo_end_date
		);
	}

	/**
	 * Modify the password form to account for Post Public Preview.
	 *
	 * @hook the_password_form
	 *
	 * @param string  $output The output.
	 * @param WP_Post $post The post.
	 * @param bool    $invalid_password Whether the password is invalid.
	 * @return string The modified output.
	 */
	public function modify_the_password_form( $output, $post, $invalid_password ) {
		$tag_processor = new \WP_HTML_Tag_Processor( $output );
		while ( $tag_processor->next_tag(
			array(
				'tag_name' => 'input',
			)
		) ) {
			$type = $tag_processor->get_attribute( 'type' );
			$name = $tag_processor->get_attribute( 'name' );
			if ( 'hidden' === $type && 'redirect_to' === $name ) {
				$target_url = \PRC\Platform\get_current_url();
				$tag_processor->set_attribute( 'value', $target_url );
			}
		}
		$updated = $tag_processor->get_updated_html() . $this->password_protect_embargo_styling();
		// Updated embargo language.
		$updated = str_replace( '<p>This content is password protected. To view it please enter your password below:</p>', $this->password_protect_embargo_language( $post->ID ), $updated );
		return $updated;
	}

	/**
	 * Depending on the environment, set the default admin color scheme to modern or light.
	 * The user can not change the color scheme, we enforce this for a consistent experience and
	 * make it easier to provide support.
	 *
	 * @param mixed $result The result.
	 * @return string
	 */
	public function default_admin_color_scheme( $result ) {
		if ( 'production' === wp_get_environment_type() ) {
			$result = 'modern';
		} else {
			$result = 'light';
		}
		return $result;
	}

	/**
	 * Show all post types in the dashboard.
	 *
	 * @hook dashboard_recent_posts_query_args
	 * @param array $query_args The query arguments.
	 * @return array Modified query arguments.
	 */
	public function show_all_post_types_in_dashboard( array $query_args ) {
		$post_types = Publication_Listing::get_enabled_post_types();

		if ( is_array( $post_types ) ) {
			$query_args['post_type'] = $post_types;
		}

		return $query_args;
	}

	/**
	 * Change the login logo to the Pew Research Center logo.
	 *
	 * @hook login_enqueue_scripts
	 */
	public function login_logo() {
		?>
		<style type="text/css">
			#login h1 a, .login h1 a {
				background-image: url(<?php echo esc_url( get_bloginfo( 'url' ) ); ?>/wp-content/images/logo-login.svg);
				height: 48px;
				width: 320px;
				background-size: 320px 48px;
				background-repeat: no-repeat;
				padding-bottom: 30px;
			}
		</style>
		<?php
	}

	/**
	 * View on different environments tool.
	 *
	 * @return array
	 */
	public function view_on_diff_env_tool() {
		$domain    = \PRC\Platform\get_domain();
		$permalink = get_permalink();
		// Remove the domain including the preceeding https:// from the permalink.
		$permalink = preg_replace( '/https:\/\/[^\/]+\//', '', $permalink );
		// If the permalink contains /pewresearch-org/ then remove it.
		$permalink = str_replace( 'pewresearch-org/', '', $permalink );
		// Remove the domain from the permalink.
		$permalink = str_replace( $domain, '', $permalink );
		$urls      = array(
			'alpha'      => array(
				'url'   => 'https://alpha.pewresearch.org/pewresearch-org/' . $permalink,
				'label' => 'View on Alpha',
			),
			'beta'       => array(
				'url'   => 'https://beta.pewresearch.org/pewresearch-org/' . $permalink,
				'label' => 'View on Beta',
			),
			'local'      => array(
				'url'   => 'https://prc-platform.vipdev.lndo.site/pewresearch-org/' . $permalink,
				'label' => 'View on Local',
			),
			'production' => array(
				'url'   => 'https://www.pewresearch.org/' . $permalink,
				'label' => 'View on Production',
			),
		);

		// Remove the urls for the env we're on.
		if ( 'local' === wp_get_environment_type() ) {
			unset( $urls['local'] );
		}
		if ( strpos( $domain, 'alpha' ) ) {
			unset( $urls['alpha'] );
		} elseif ( strpos( $domain, 'beta' ) ) {
			unset( $urls['beta'] );
		} elseif ( 'production' === wp_get_environment_type() ) {
			unset( $urls['production'] );
		}
		return $urls;
	}

	/**
	 * Manage the Tools menu.
	 *
	 * @hook wp_before_admin_bar_render
	 */
	public function manage_tools_menu() {
		global $wp_admin_bar;

		$tools_id = 'tools';

		/**
		 * Tools Menu
		 */
		$vip_cache_tool = $wp_admin_bar->get_node( 'vip-purge-page' );
		if ( $vip_cache_tool ) {
			$vip_cache_tool->parent = $tools_id;
			$vip_cache_tool         = (array) $vip_cache_tool;
			$wp_admin_bar->remove_node( 'vip-purge-page' );

		}

		$bitly_tool = $wp_admin_bar->get_node( 'reset-bitly-link' );
		if ( $bitly_tool ) {
			$bitly_tool->parent = $tools_id;
			$bitly_tool         = (array) $bitly_tool;
			$wp_admin_bar->remove_node( 'reset-bitly-link' );
		}

		$parsely_tool = $wp_admin_bar->get_node( 'parsely-stats' );
		if ( $parsely_tool ) {
			$parsely_tool->parent = $tools_id;
			$parsely_tool         = (array) $parsely_tool;
			$wp_admin_bar->remove_node( 'parsely-stats' );
		}

		$yoast_redirect_tool = $wp_admin_bar->get_node( 'wpseo-premium-create-redirect' );
		if ( $yoast_redirect_tool ) {
			$yoast_redirect_tool->parent = $tools_id;
			$yoast_redirect_tool         = (array) $yoast_redirect_tool;
			$wp_admin_bar->remove_node( 'wpseo-premium-create-redirect' );
		}

		$duplicate_post = $wp_admin_bar->get_node( 'duplicate-post' );
		if ( $duplicate_post ) {
			$duplicate_post->parent = $tools_id;
			$duplicate_post         = (array) $duplicate_post;
			$wp_admin_bar->remove_node( 'duplicate-post' );
		}

		$attachments_tool = array(
			'id'     => 'attachments-report',
			'title'  => 'Attachments Report',
			'href'   => get_permalink() . '?attachmentsReport=true',
			'parent' => $tools_id,
			'meta'   => array(
				'title' => 'Attachments Report',
			),
		);

		if ( 'post' === get_post_type() ) {
			$print_tool = array(
				'id'     => 'print-engine-beta',
				'title'  => 'Print Engine (BETA)',
				'href'   => get_permalink() . '?printEngineBeta=true',
				'parent' => $tools_id,
				'meta'   => array(
					'title' => 'Print Engine (BETA)',
				),
			);
			$wp_admin_bar->add_node( $print_tool );

		}

		if ( is_singular() ) {
			$diff_env = $this->view_on_diff_env_tool();
			foreach ( $diff_env as $type => $tool ) {
				$wp_admin_bar->add_node(
					array(
						'id'     => 'view-on-' . $type,
						'title'  => $tool['label'],
						'href'   => $tool['url'],
						'parent' => $tools_id,
					)
				);
			}
		}

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

	/**
	 * Manage the Edit menu.
	 *
	 * @hook wp_before_admin_bar_render
	 */
	public function manage_edit_menu() {
		global $wp_admin_bar, $wp_query;
		$edit_id = 'edit';
		/**
		 * Edit Menu
		 */
		$queried_object = $wp_query->get_queried_object();
		$type           = '';
		// Check for the current post type...
		if ( $queried_object instanceof WP_Term ) {
			$type = $queried_object->taxonomy;
			$type = 'datasets' === $type ? 'dataset' : $type;
			$type = 'bylines' === $type ? 'staff' : $type;
		} elseif ( 'wp_post' === $type ) {
			$type = $queried_object->post_type;
		}
		$edit_node_name = 'post' === $type ? 'edit' : 'edit_' . $type;
		$edit           = $wp_admin_bar->get_node( $edit_node_name );
		if ( ! $edit ) {
			// Fallback to just edit.
			$edit_node_name = 'edit';
			$edit           = $wp_admin_bar->get_node( $edit_node_name );
		}
		if ( ! $edit && is_user_logged_in() ) {
			$wp_admin_bar->add_menu(
				array(
					'id'    => $edit_node_name,
					'title' => 'Edit',
					'href'  => '#',
				)
			);
		}

		if ( ( $wp_query->is_category() || $wp_query->is_tax( 'regions-countries' ) || $wp_query->is_tax( 'collection' ) ) && $wp_query->is_main_query() ) {
			$queried_object   = $wp_query->get_queried_object();
			$queried_taxonomy = $queried_object->taxonomy;

			$block_modules = get_posts(
				array(
					'post_type'      => 'block_module',
					'tax_query'      => array(
						array(
							'taxonomy'         => $queried_taxonomy,
							'field'            => 'slug',
							'terms'            => $queried_object->slug,
							'include_children' => false,
						),
					),
					'fields'         => 'ids',
					'posts_per_page' => 3,
				)
			);

			if ( $block_modules ) {
				foreach ( $block_modules as $block_module_id ) {
					$block_area = wp_get_object_terms( $block_module_id, 'block_area', array( 'fields' => 'names' ) );
					if ( ! empty( $block_area ) ) {
						$block_area = $block_area[0];
						$new_node   = array(
							'id'     => 'edit-block-module-' . $block_module_id,
							'title'  => 'Edit ' . $block_area,
							'href'   => get_edit_post_link( $block_module_id ),
							'parent' => $edit_id,
						);
						$wp_admin_bar->add_node( $new_node );
					}
				}
			}
		}

		$site_editor = $wp_admin_bar->get_node( 'site-editor' );
		if ( $site_editor ) {
			$wp_admin_bar->remove_node( 'site-editor' );
		}
	}

	/**
	 * Manage the Admin Bar.
	 *
	 * @hook wp_before_admin_bar_render
	 */
	public function manage_admin_bar() {
		global $wp_admin_bar;
		/**
		 * Other/Misc
		 */

		// Remove the "Howdy" in the Profile link.
		$my_account = $wp_admin_bar->get_node( 'my-account' );
		if ( $my_account ) {
			$my_account->title = str_replace( 'Howdy, ', '', $my_account->title );
			$wp_admin_bar->remove_node( 'my-account' );
			$wp_admin_bar->add_node( $my_account );
		}

		// Remove Search.
		$search = $wp_admin_bar->get_node( 'search' );
		if ( $search ) {
			$wp_admin_bar->remove_node( 'search' );
		}

		// Remove fwp cache, comments, notes, vip search dev tools, customize.
		$wp_admin_bar->remove_menu( 'fwp-cache' );
		$wp_admin_bar->remove_menu( 'comments' );
		$wp_admin_bar->remove_menu( 'notes' );
		if ( ! is_search() ) {
			$wp_admin_bar->remove_menu( 'vip-search-dev-tools' );
		}
		$wp_admin_bar->remove_menu( 'customize' );
	}

	/**
	 * Register the assets.
	 *
	 * @return WP_Error|void
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$asset_slug = self::$handle;
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';
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

	/**
	 * Enqueue the assets.
	 *
	 * @hook admin_enqueue_scripts
	 */
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
	 *
	 * @hook admin_footer
	 */
	public function admin_footer() {
		global $post_type;
		if ( isset( $post_type ) && is_string( $post_type ) ) {
			echo wp_sprintf( '<script>window.prcEditorPostType = "%s";</script>', esc_js( $post_type ) );
		}
	}

	/**
	 * Disables the cookie banner for logged in users and on non-production environments.
	 *
	 * @hook disable_cookiepro
	 * @param bool $disable Whether to disable the cookie banner.
	 * @return false|void
	 */
	public function disable_cookie_banner_conditions( $disable = false ) {
		$env = wp_get_environment_type();
		if ( is_user_logged_in() || 'production' !== $env || is_iframe() ) {
			return true;
		}
		return $disable;
	}

	/**
	 * Remove the Links menu.
	 *
	 * @hook admin_menu
	 */
	public function remove_links_menu() {
		if ( PRC_PRIMARY_SITE_ID === get_current_blog_id() ) {
			global $menu;
			unset( $menu[15] ); // 15 = Links menu.
		}
	}

	/**
	 * Remove useless widgets from the dashboard.
	 *
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
	 * Remove the multisite enhancements plugin sites label.
	 *
	 * @hook multisite_enhancements_status_label
	 * @param mixed $blogname The blog name.
	 * @param mixed $blog The blog object.
	 * @return string The blog name.
	 */
	public function multisite_enhancement_plugin_sites_label( $blogname, $blog ) {
		return $blog->blogname;
	}

	/**
	 * This is a serious place, no emojis here.
	 *
	 * @hook init
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
	 * Output the platform version in the admin footer.
	 *
	 * @hook update_footer
	 * @param mixed $content The content of the footer.
	 * @return string
	 */
	public function output_platform_version_in_wp_admin( $content ) {
		$version      = defined( 'PRC_PLATFORM_VERSION' ) ? PRC_PLATFORM_VERSION : 'Unknown';
		$release_name = defined( 'PRC_PLATFORM_RELEASE_NAME' ) ? PRC_PLATFORM_RELEASE_NAME : 'Unknown';
		$environment  = '<span style="color:red;">Production</span>';
		if ( 'production' !== wp_get_environment_type() ) {
			$environment = '<span style="color:green;">Development</span>';
		}
		return '<strong>' . $environment . ' | PRC Platform Core: ' . $version . ' "' . $release_name . '"</strong>';
	}

	/**
	 * Change the Public Post Preview plugins default lifetime to 14 days.
	 *
	 * @hook ppp_nonce_life
	 * @return int|float
	 */
	public function define_public_post_preview_lifetime() {
		return self::$public_post_preview_lifetime;
	}

	/**
	 * Removes the "Overview" text from the beginning of excerpts.
	 *
	 * @hook the_excerpt
	 * @param mixed $excerpt The excerpt.
	 * @return string|string[]|null The modified excerpt.
	 */
	public function remove_overview_from_excerpts( $excerpt ) {
		$excerpt = preg_replace( '/^<p>(\s+|&nbsp;\s+)?Overview\s/', '<p>', $excerpt );
		return $excerpt;
	}
}
