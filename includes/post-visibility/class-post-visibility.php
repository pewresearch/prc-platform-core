<?php
namespace PRC\Platform;
use WP_Error;

class Post_Visibility {
	public static $enabled_post_types = array(
		'post',
		'page',
		'short-read',
		'fact-sheets',
		'fact-sheet',
		'interactive',
		'interactives',
		'quiz'
	);

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

	public static $handle = 'prc-platform-post-visibility';

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

	/**
	 * Register custom visibilty statuses that are present on origin posts but only used on stubs to determine their visibility in the index and search.
	 * The interface for setting these statuses is in plugins/prc-block-plugins.
	 * @return void
	 */
	public function register_custom_visibility_statuses() {
		register_post_meta(
			'',
			'_postVisibility',
			array(
				'show_in_rest'  => array(
					'schema' => array(
						'type' => 'string',
						'default' => 'public',
						'description' => 'The visibility of the post in the index and search. Defaults to public. **Private and password protected posts are not affected by this setting and this respects their statuses.**',
						'enum' => array(
							'public',
							'hidden_from_search',
							'hidden_from_index',
						),
					),
				),
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_status(
			'hidden_from_search',
			array(
				'label'               => __( 'Hidden from Search', 'wp-statuses' ),
				'label_count'         => _n_noop( 'Hidden from Search (but not index) <span class="count">(%s)</span>', 'Hidden from Search <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => true,
				'public'              => true,
				'publicly_queryable'  => true,
			)
		);

		register_post_status(
			'hidden_from_index',
			array(
				'label'               => __( 'Hidden from Index', 'wp-statuses' ),
				'label_count'         => _n_noop( 'Hidden from Index (but not search) <span class="count">(%s)</span>', 'Hidden from Index <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => false,
				'public'              => true,
				'publicly_queryable'  => false,
			)
		);
	}

	public function add_custom_visibility_statuses_to_rest() {
		register_rest_field(
			'',
			'postVisibility',
			array(
				'get_callback'    => function( $object ) {
					return get_post_meta( $object['id'], '_postVisibility', true );
				},
				'update_callback' => function( $value, $object ) {
					return update_post_meta( $object->ID, '_postVisibility', $value );
				},
				'schema'          => array(
					'description' => __( 'Post visibility', 'wp-statuses' ),
					'type'        => 'string',
					'context'     => array( 'edit' ),
					'enum'        => array(
						'public',
						'hidden_from_search',
						'hidden_from_index',
					),
				),
			)
		);
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
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( ! in_array( get_wp_admin_current_post_type(), self::$enabled_post_types, true ) ) {
			return;
		}
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}
}
