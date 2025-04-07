<?php
/**
 * Manage user permissions within the PRC Platform on WordPress VIP.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Manage user permissions within the PRC Platform on WordPress VIP.
 */
class User_Permissions {
	/**
	 * The ID of the PRC WP Bot user
	 *
	 * @var int|null
	 */
	public $bot_user_id = null;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'generate_wp_bot_user' );
			$loader->add_action( 'init', $this, 'register_common_user_meta' );
			$loader->add_filter( 'wpcom_vip_enable_two_factor', $this, 'enforce_two_factor', 10, 1 );
			$loader->add_action( 'admin_init', $this, 'autoload_user_roles' );
			$loader->add_action( 'register_new_user', $this, 'set_default_meta_on_new_user_creation', 10, 1 );
		}
	}

	/**
	 * This function uses a json file to manage user roles and capabilities. When a version in the json file is greater than the version stored in the database, the user roles are updated.
	 *
	 * @hook init
	 */
	public function autoload_user_roles() {
		if ( ! function_exists( 'wpcom_vip_add_role' ) ) {
			return;
		}
		$user_roles = json_decode( file_get_contents( plugin_dir_path( __FILE__ ) . 'user-roles.json' ), true );
		$ver        = $user_roles['version'];
		// Check if this has been run already.
		if ( $ver <= get_option( 'prc_platform_user_permissions' ) ) {
			return;
		}

		foreach ( $user_roles['roles'] as $role_slug => $role ) {
			if ( array_key_exists( 'inherits', $role ) ) {
				\wpcom_vip_duplicate_role(
					$role['inherits'],
					$role_slug,
					$role['name'],
					$role['capabilities'],
				);
			} else {
				\wpcom_vip_add_role( $role_slug, $role['name'], $role['capabilities'] );
			}
		}

		update_option( 'prc_platform_user_permissions', $ver );
	}

	/**
	 * Force two factor authentication on production.
	 *
	 * @hook wpcom_vip_enable_two_factor
	 * @param bool $value Whether two factor authentication is enabled.
	 * @return bool Whether two factor authentication is enabled.
	 */
	public function enforce_two_factor( $value ) {
		return defined( 'VIP_GO_APP_ENVIRONMENT' ) && 'production' === \VIP_GO_APP_ENVIRONMENT;
	}

	/**
	 * Register common user meta.
	 *
	 * @hook init
	 */
	public function register_common_user_meta() {
		register_meta(
			'user',
			'prc_copilot_settings',
			array(
				'type'         => 'object',
				'description'  => 'Settings for PRC Copilot plugin',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
		register_meta(
			'user',
			'prc_staff_id',
			array(
				'type'         => 'number',
				'description'  => 'Links a staff record to a user record. When a name is updated for a user the staff name is updated as well and vice versa.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
		register_meta(
			'user',
			'prc_user_beneficiary_id',
			array(
				'type'         => 'number',
				'description'  => 'When a user is deleted this user is the benefeciary of their db records',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
	}

	/**
	 * Fires after a new user has been registered, checks for the existence of default meta and if none
	 * sets accordingly.
	 *
	 * @hook register_new_user
	 * @param int $user_id The user ID.
	 */
	public function set_default_meta_on_new_user_creation( $user_id ) {
		if ( ! $user_id ) {
			return;
		}
		$copilot_defaults = array(
			'allowed'     => true,
			'tokenBudget' => 1000,
			'allowances'  => array(
				'excerpt' => true,
				'title'   => true,
				'content' => false,
			),
		);
		if ( ! get_user_meta( $user_id, 'prc_copilot_settings', true ) ) {
			add_user_meta( $user_id, 'prc_copilot_settings', $copilot_defaults, true );
		}
	}

	/**
	 * Generate PRC WP BOT user, who will have editor capabilities. This bot will generate documentation, etc.
	 * This function is called on plugin activation.
	 *
	 * @hook init
	 */
	public function generate_wp_bot_user() {
		$bot_user = get_site_option( 'prc_wp_bot_user_id' );
		if ( ! $bot_user ) {
			$existing_user = get_user_by( 'login', 'prc_wp_bot' );
			if ( ! $existing_user ) {
				$bot_user_id = wp_insert_user(
					array(
						'user_login'   => 'prc_wp_bot',
						'user_pass'    => wp_generate_password(),
						'user_email'   => 'bot@pewresearch.org',
						'display_name' => 'PRC WP Bot',
						'role'         => 'editor',
					)
				);
				if ( ! is_wp_error( $bot_user_id ) ) {
					$bot_user          = new \WP_User( $bot_user_id );
					$this->bot_user_id = $bot_user->ID;
					update_site_option( 'prc_wp_bot_user_id', $this->bot_user_id );
				} else {
					// phpcs:ignore
					do_action( 'qm/debug', 'Failed to create bot user' );
				}
			} else {
				update_site_option( 'prc_wp_bot_user_id', $existing_user->ID );
			}
		} else {
			$this->bot_user_id = $bot_user;
		}
	}

	/**
	 * Get the bot user ID
	 *
	 * @return int|null The bot user ID or null if not set
	 */
	public function get_bot_user_id() {
		return $this->bot_user_id;
	}
}
