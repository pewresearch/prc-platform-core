<?php
namespace PRC\Platform;

/**
 * Manage user permissions within the PRC Platform on WordPress VIP.
 * @package
 */
class User_Permissions {
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
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'wpcom_vip_enable_two_factor', $this, 'enforce_two_factor', 10, 1 );
			$loader->add_action( 'admin_init', $this, 'autoload_user_roles' );
		}
	}

	/**
	 * This function uses a json file to manage user roles and capabilities. When a version in the json file is greater than the version stored in the database, the user roles are updated.
	 * @hook init
	 */
	public function autoload_user_roles() {
		if ( ! function_exists('wpcom_vip_add_role') ) {
			return;
		}
		// get the user-roles.json file as a php multidimensional array
		$user_roles = json_decode( file_get_contents( plugin_dir_path( __FILE__ ) . 'user-roles.json' ), true );

		// get the "version" property from the json file
		$ver = $user_roles['version'];

		// Check if this has been run already.
		if ( $ver <= get_option( 'prc_platform_user_permissions' ) ) {
			return;
		}

		foreach ( $user_roles['roles'] as $role_slug => $role ) {
			if ( array_key_exists('inherits', $role) ) {
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
	 * @hook wpcom_vip_enable_two_factor
	 * @param bool $value
	 * @return bool
	 */
	public function enforce_two_factor($value) {
		return defined('VIP_GO_APP_ENVIRONMENT') && 'production' === \VIP_GO_APP_ENVIRONMENT;
	}
}
