<?php
/**
 * Admin Columns
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Admin Columns
 *
 * @package PRC\Platform
 */
class Admin_Columns {
	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		if ( PRC_PRIMARY_SITE_ID === get_current_blog_id() ) {
			$loader->add_filter( 'acp/storage/file/directory', $this, 'acp_load_via_files' );
		}
		$loader->add_action( 'ac/ready', $this, 'register_columns' );
	}

	/**
	 * Load and save Admin Columns Pro settings, columns, and sets via php config files.
	 *
	 * @return string
	 */
	public function acp_load_via_files() {
		$dir = plugin_dir_path( __FILE__ );
		return $dir . '/config';
	}

	/**
	 * Register the custom columns
	 */
	public function register_columns() {
		add_action(
			'ac/column_types',
			function ( \AC\ListScreen $list_screen ) {
				require_once plugin_dir_path( __FILE__ ) . 'parent-post-filter/class-column.php';
				require_once plugin_dir_path( __FILE__ ) . 'parent-post-filter/class-filter.php';
				if ( 'post' === $list_screen->get_key() ) {
					$list_screen->register_column_type( new Parent_Post_Column() );
				}
			} 
		);
	}
}
