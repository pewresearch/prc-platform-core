<?php
/**
 * Edit Template Toolbar
 *
 * Adds an "Edit Template" button to the admin toolbar for block themes.
 *
 * @package PRC\Platform
 */
namespace PRC\Platform;

/**
 * Main plugin class that handles the Edit Template toolbar functionality
 */
class Edit_Template_Toolbar {

	/**
	 * Initialize the plugin
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader = null ) {
		if ( null === $loader ) {
			return;
		}
		$this->init( $loader );
	}

	/**
	 * Initialize template toolbar functionality
	 * 
	 * @param object $loader The loader object.
	 */
	public function init( $loader ) {
		$loader->add_action( 'admin_bar_menu', $this, 'add_edit_template_button', 50 );
		$loader->add_action( 'admin_head', $this, 'add_styles' );
		$loader->add_action( 'wp_head', $this, 'add_styles' );
	}

	/**
	 * Add edit template button to the admin bar
	 *
	 * @param WP_Admin_Bar $wp_admin_bar The admin bar object.
	 * @return void
	 */
	public function add_edit_template_button( $wp_admin_bar ) {
		if ( ! is_admin() && current_user_can( 'edit_theme_options' ) ) {
			// Get all available block templates.
			$templates = get_block_templates( array(), 'wp_template' );

			// Get current template.
			$current_template = $this->get_current_template();

			// Add the main Edit Template button.
			$wp_admin_bar->add_node(
				array(
					'id'    => 'edit-template',
					'title' => '<span class="ab-icon dashicons dashicons-screenoptions"></span>' . esc_html__( 'Edit Template', 'humaniti-edit-template-toolbar' ),
					'href'  => esc_url( $this->get_template_editor_url( $current_template ) ),
				)
			);

			// Add each template as a submenu item.
			if ( ! empty( $templates ) ) {
				foreach ( $templates as $template ) {
					$wp_admin_bar->add_node(
						array(
							'id'     => 'edit-template-' . esc_attr( $template->slug ),
							'parent' => 'edit-template',
							'title'  => esc_html( $template->title->rendered ?? $template->slug ),
							'href'   => esc_url( $this->get_template_editor_url( $template->slug ) ),
							'meta'   => array(
								'class' => $template->slug === $current_template ? 'current-template' : '',
							),
						)
					);
				}
			}
		}
	}

	/**
	 * Add required CSS styles
	 */
	public function add_styles() {
		if ( ! current_user_can( 'edit_theme_options' ) ) {
			return;
		}
		?>
		<style>
			#wpadminbar .current-template,
			#wpadminbar .current-template .ab-item {
				background-color: #1d2327 !important;
			}
			
			#wpadminbar .current-template .ab-item,
			#wpadminbar .current-template:hover .ab-item {
				color: #FFBF00 !important;
			}
			
			#wpadminbar .current-template:hover,
			#wpadminbar .current-template:hover .ab-item {
				background-color: #FFBF00 !important;
				color: #1d2327 !important;
			}
		</style>
		<?php
	}

	/**
	 * Get the current template being used
	 *
	 * @return string Template slug
	 */
	private function get_current_template() {
		global $_wp_current_template_id;
		
		if ( $_wp_current_template_id ) {
			$parts = explode( '//', $_wp_current_template_id );
			if ( isset( $parts[1] ) ) {
				return $parts[1];
			}
		}
		
		return 'index';
	}

	/**
	 * Get the editor URL for a specific template
	 *
	 * @param string $template_slug The template slug.
	 * @return string The editor URL
	 */
	private function get_template_editor_url( $template_slug ) {
		$template_id = get_stylesheet() . '//' . $template_slug;
		
		return add_query_arg(
			array(
				'canvas'   => 'edit',
				'postId'   => $template_id,
				'postType' => 'wp_template',
			),
			admin_url( 'site-editor.php' )
		);
	}
}
