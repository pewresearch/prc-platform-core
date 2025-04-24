<?php
/**
 * PRC Platform Core
 *
 * @wordpress-plugin
 * Plugin Name:       PRC Platform Core
 * Plugin URI:        https://github.com/pewresearch/prc-platform-core
 * Description:       The foundational core for all PRC Platform plugins. This plugin contains helper functions, hooks, utilities, cross-platform shared taxonomies and content types (like Staff Bylines), and high-level WordPress VIP configuration.
 * Version:           1.0.0
 * Author:            Pew Research Center
 * Author URI:        https://pewresearch.org
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       prc-platform-core
 *
 * @package PRC_Platform
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'PRC_PLATFORM_CORE_DIR', plugin_dir_path( __DIR__ ) );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-prc-platform-activator.php
 */
function activate_prc_platform() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-prc-platform-activator.php';
	PRC_Platform_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-prc-platform-deactivator.php
 */
function deactivate_prc_platform() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-prc-platform-deactivator.php';
	PRC_Platform_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_prc_platform' );
register_deactivation_hook( __FILE__, 'deactivate_prc_platform' );

/**
 * The core plugin class that is used to define the hooks that initialize the various platform components.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-platform-bootstrap.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_prc_platform() {
	$plugin = new \PRC\Platform\Platform_Bootstrap();
	$plugin->run();
}
run_prc_platform();
