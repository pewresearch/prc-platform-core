<?php
namespace PRC\Platform;
/**
 * Handle base level configuration of Gutenberg. For block-editor or site-editor specific functionality and configuration, see their respective classes.
 * @package
 */
class Gutenberg {
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
		'block_pattern',
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
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ){
			$loader->add_filter( 'use_block_editor_for_post', $this, 'load_gutenberg', 15, 2 );
			// $loader->add_action( 'init', $this, 'add_revisions_to_reusable_blocks' );
			$loader->add_action( 'menu_order', $this, 'group_admin_menus_together', 101 );
			// Remove the "Block Directory" from the block inserter.
			remove_action( 'enqueue_block_editor_assets', 'wp_enqueue_editor_block_directory_assets' );
			// Remove the "Core Block Patterns" from the pattern directory.
			$loader->add_action( 'after_setup_theme', $this, 'unregister_core_block_patterns', 999 );
			// Disable loading remote block patterns, we only want local or DB sourced block patterns.
			add_filter(
				'should_load_remote_block_patterns',
				'__return_false',
				10,
				1
			);
		}
	}

	/**
	 * Initialize the correct core post types and third party post types for Gutenberg.
	 * Also provides a filter for internal use to enable Gutenberg for other post types; 'prc_load_gutenberg'.
	 *
	 * @hook use_block_editor_for_post
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

	/**
	 * Enable revisions for reusable blocks.
	 * @hook init
	 * @TODO: Look into this, I'm pretty sure a recent Gutenberg release defaulted to this.
	 */
	public function add_revisions_to_reusable_blocks() {
		add_post_type_support( 'wp_block', 'revisions' );
	}

	/**
	 * Group the admin menus for Gutenberg together.
	 * @hook menu_order
	 * @param array $menu_order
	 * @return array
	 */
	public function group_admin_menus_together( $menu_order ) {
		$new_menu_order = array();

		$reorder = array(
			'edit.php?post_type=block_module',
			'edit.php?post_type=wp_block',
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

	/**
	 * Unregister all core and third-party block patterns.
	 */
	public function unregister_core_block_patterns() {
		remove_theme_support( 'core-block-patterns' );
		$registered_patterns = \WP_Block_Patterns_Registry::get_instance()->get_all_registered();
		if ( $registered_patterns ) {
			foreach ( $registered_patterns as $pattern_properties ) {
				// if the registered pattern's name does not include `prc-` in the namespace then unregister it.
				if ( strpos($pattern_properties['name'], 'prc-') === false ) {
					unregister_block_pattern( $pattern_properties['name'] );
				}
			}
		}
	}
}
