<?php


use \WPackio as WPackio;

class Staff extends PRC_Block_Editor_Plugins {
	protected static $enabled_post_types = array( 'staff' );
	public static $version = '3.0.0';

	/**
	 * Constructor, adds actions, sets up rest api and post meta.
	 *
	 * @param bool $init
	 * @return void
	 */
	public function __construct( $init = false ) {
		// We will need a rest api to fetch this?? Or can we just do this with post meta??
		if ( true !== $init ) {
			return;
		}
		add_action( 'enqueue_block_editor_assets', array( $this, 'register_plugin' ) );
	}


	/**
	 * Register block plugin assets
	 *
	 * @return void
	 * @throws LogicException
	 */
	public function register_plugin() {
		if ( ! in_array( parent::get_wp_admin_current_post_type(), self::$enabled_post_types, true ) ) {
			return;
		}
		$enqueue = new WPackio( 'prcBlockPlugins', 'dist', self::$version, 'plugin', parent::$plugin_dir );
		$enqueue->enqueue(
			'plugins',
			'staff',
			array(
				'js'        => true,
				'css'       => true,
				'js_dep'    => array(),
				'css_dep'   => array(),
				'in_footer' => true,
				'media'     => 'all',
			)
		);
	}


}

new Staff( true );
