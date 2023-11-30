<?php
/**
 *
 * @link              https://github.com/pewresearch/prc-platform-core
 * @since             1.0.0
 * @package           PRC_Platform
 *
 * @wordpress-plugin
 * Plugin Name:       PRC Platform Core
 * Plugin URI:        https://github.com/pewresearch/prc-platform-core
 * Description:       pewresearch.org data model and shared functionality, built for use on WordPress VIP's platform.
 * Version:           1.0.0
 * Author:            Seth Rubenstein
 * Author URI:        https://sethrubenstein.info
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       prc-platform

 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

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
require plugin_dir_path( __FILE__ ) . 'includes/class-platform.php';

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

