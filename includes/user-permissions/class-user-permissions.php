<?php
namespace PRC\Platform;

/**
 * Manage user permissions within the PRC Platform on WordPress VIP.
 * @package
 */
class User_Permissions {
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
	}

	public function establish_user_roles() {
		if ( ! function_exists('wpcom_vip_add_role') ) {
			return;
		}
		$ver = $this->version;

		// Check if this has been run already.
		if ( $ver <= get_option( 'prc_platform_user_permissions' ) ) {
			return;
		}

		// // Add new role.
		// wpcom_vip_add_role( 'reader', 'Reader', array( 'read' => true ) );

		// // Remove publish_posts cap from authors.
		// wpcom_vip_merge_role_caps( 'author', array( 'publish_posts' => false ) );

		// // Duplicate an existing role and modify some caps.
		// wpcom_vip_duplicate_role(
		// 	'administrator',
		// 	'station-administrator',
		// 	'Station Administrator',
		// 	array( 'manage_categories' => false )
		// );

		// // Add custom cap to a role.
		// wpcom_vip_add_role_caps( 'administrator', array( 'my-custom-cap' ) );

		// // Remove cap from a role.
		// wpcom_vip_remove_role_caps( 'author', array( 'publish_posts' ) );

		// // Update the version to prevent this running again.
		// update_option( 'prc_platform_user_permissions', $ver );
	}
}
