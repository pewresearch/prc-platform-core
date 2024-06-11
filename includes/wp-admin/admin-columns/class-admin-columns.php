<?php
namespace PRC\Platform;

class Admin_Columns_Pro {
	public static $handle = 'prc-platform-admin-columns';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $loader ) {
		do_action('qm/debug', 'ADMIN COLUMNS');
		if ( PRC_PRIMARY_SITE_ID === get_current_blog_id() ) {
			$loader->add_filter( 'acp/storage/file/directory', $this, 'acp_load_via_files' );
		}
		$loader->add_action( 'ac/ready', $this, 'register_columns' );
	}

	/**
	 * Load and save Admin Columns Pro settings, columns, and sets via php config files.
	 * @return string
	 */
	public function acp_load_via_files() {
		$dir = plugin_dir_path( __FILE__ );
		return $dir . '/config';
	}

	public function register_columns() {
		add_action( 'ac/column_types', function ( \AC\ListScreen $list_screen ) {
			// require the acp-column.php file in this directory
			require_once( plugin_dir_path( __FILE__ ) . 'parent-post-filter/class-column.php' );
			require_once( plugin_dir_path( __FILE__ ) . 'parent-post-filter/class-filter.php' );
			if ( 'post' === $list_screen->get_key() ) {
				$list_screen->register_column_type( new Parent_Post_Column() );
			}
		} );
	}
}
