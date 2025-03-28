<?php
namespace PRC\Platform;

/**
 * Handle base level configuration of Gutenberg. For block-editor or site-editor specific functionality and configuration, see their respective classes.
 *
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
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init( $loader );
	}

	/**
	 * Initialize the module.
	 *
	 * @param mixed $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_filter( 'use_block_editor_for_post', $this, 'load_gutenberg' );
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
	 * Enable Gutenberg for ALL post types.
	 *
	 * @hook use_block_editor_for_post
	 *
	 * @param bool $use_block_editor Whether to use the block editor.
	 * @return bool
	 */
	public function load_gutenberg( $use_block_editor ) {
		$use_block_editor = true;
		return $use_block_editor;
	}

	/**
	 * Group the admin menus for Gutenberg together.
	 *
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
				if ( strpos( $pattern_properties['name'], 'prc-' ) === false ) {
					unregister_block_pattern( $pattern_properties['name'] );
				}
			}
		}
	}
}
