<?php
namespace PRC\Platform;
/**
 * Handle base level configuration of Gutenberg. For block-editor or site-editor specific functionality and configuration, see their respective classes.
 * @package
 */
class Gutenberg {
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

	protected static $internal_post_types = array(
		'post',
		'page',
		'wp_block',
	);

	protected static $third_party_post_types = array(
		'blockmeister_pattern',
		'newsletterglue',
		'ngl_template',
		'ngl_pattern',
		'ngl_automation',
	);

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
	 * Initialize the correct core post types and third party post types for Gutenberg.
	 * Also provides a filter for internal use to enable Gutenberg for other post types; 'prc_load_gutenberg'.
	 *
	 * @param mixed $can_edit
	 * @param mixed $post
	 * @return bool
	 */
	public function load_gutenberg( $use_block_editor, $post ) {
		$enable_for_post_types = array_merge( self::$internal_post_types, self::$third_party_post_types );
		$enable_for_post_types = apply_filters( 'prc_load_gutenberg', $enable_for_post_types );
		return in_array( $post->post_type, $enable_for_post_types );
	}

	public function add_revisions_to_reusable_blocks() {
		add_post_type_support( 'wp_block', 'revisions' );
	}

	public function group_admin_menus_together( $menu_order ) {
		$new_menu_order = array();

		$reorder = array(
			'edit.php?post_type=topic-page', // Legacy
			'edit.php?post_type=template-block', // Legacy
			'edit.php?post_type=block_module', // New
			'edit.php?post_type=wp_block', // Core Patterns
			'edit.php?post_type=blockmeister_pattern', // Block Meister Patterns
			'admin.php?page=blockmeister', // Block Meister Settings
		);

		foreach ( $menu_order as $index => $item ) {
			if ( ! in_array( $item, $reorder ) ) {
				$new_menu_order[] = $item;
			}
		}

		$move_to_position = array_search( 'themes.php', $new_menu_order );

		array_splice( $new_menu_order, $move_to_position, 0, $reorder );

		return $new_menu_order;
	}

	public function unregister_unused_blocks() {

	}
}
