<?php
namespace PRC\Platform;
use WP_Block;
use WP_Block_Parser_Block;
use WP_HTML_Tag_Processor;

/**
 * Block Name:        Facet Template
 * Description:       Display a facet given its slug and type as a block
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Pew Research Center
 *
 * @package           prc-platform
 */

class Facet_Template {
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
	 * Returns the proper css value for a block's gap attribute.
	 * Remember to define styles.supports.spacing.blockGap in the block.json file AND
	 * define styles.spacing.blockGap in the block's attributes (along with margin and padding if enabled) AND
	 * lastly you'll also need to output the value manually like `style="gap: <?php echo Utils\get_block_gap_support_value($attributes); ?>;"` in the block's render_callback.
	 * @param mixed $attributes
	 * @return string
	 */
	public function get_block_gap_support_value($attributes, $dimension_to_return = false) {
		$block_gap = array_key_exists('style', $attributes) && array_key_exists('spacing', $attributes['style']) && array_key_exists('blockGap', $attributes['style']['spacing']) ? $attributes['style']['spacing']['blockGap'] : false;
		if ( false === $block_gap ) {
			return '';
		}

		if ( is_array($block_gap) && false !== $dimension_to_return ) {
			$check_key = 'horizontal' === $dimension_to_return ? 'left' : 'top';
			$block_gap = array_key_exists($check_key, $block_gap) ? $block_gap[$check_key] : '';
		} elseif (is_array($block_gap)) {
			$block_gap = '';
		}

		// if $block_gap is like var:preset|spacing|60 then it should be var(--wp--preset--spacing--60) otherwise just return the value like 1rem or whatever.
		return preg_match('/^var:preset\|spacing\|\d+$/', $block_gap) ? 'var(--wp--preset--spacing--' . substr($block_gap, strrpos($block_gap, '|') + 1) . ')' : $block_gap;
	}

	public function render_block_callback($attributes, $content, $block) {
		$block_instance = $block->parsed_block;

		$facet_name = array_key_exists('facetName', $attributes) ? $attributes['facetName'] : null;
		$facet = $block->context['facetsContextProvider']['data']['facets'][$facet_name];
		$facet_slug = $facet['name'];
		$facet_choices = $facet['choices'];
		$selected_choices = $facet['selected'];

		// Compile all the choices based on the template
		$field_template = $block_instance['innerBlocks'][0];
		$new_content = '';
		$expanded_content = '';
		$i = 1;
		foreach ($facet_choices as $choice) {
			$field = $field_template;
			$field['attrs']['label'] = $choice['label'] . ' (' . $choice['count'] . ')';
			$field['innerBlocks'][0]['attrs']['value'] = $choice['value'];
			$field['innerBlocks'][0]['attrs']['defaultChecked'] = in_array($choice['value'], $selected_choices);

			$parsed = new WP_Block_Parser_Block(
				$field['blockName'],
				$field['attrs'],
				$field['innerBlocks'],
				$field['innerHTML'],
				$field['innerContent']
			);

			if ( $i > 5 ) {
				$expanded_content .= (
					new WP_Block(
						(array) $parsed,
						array()
					)
				)->render();
			} else {
				$new_content .= (
					new WP_Block(
						(array) $parsed,
						array()
					)
				)->render();
			}

			$i++;
		}

		// Handle the soft limit and "show more". We may use the taxonomy list block or exapand it into some sort of tree block.

		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'data-wp-interactive' => true,
			'data-wp-navigation-id' => 'facet-template-'.md5(wp_json_encode($attributes)),
			'data-wp-context' => wp_json_encode(array('facetTemplate' => array(
				'facetSlug' => $facet_slug,
				'expanded' => false,
				'expandedLabel' => '+ More',
			))),
			'data-wp-effect--on-expand' => 'effects.facetTemplate.onExpand',
			'data-wp-class--is-expanded' => 'context.facetTemplate.expanded',
			'data-wp-class--is-processing' => 'state.facetsContextProvider.isProcessing',
			'style' => '--block-gap: ' . $this->get_block_gap_support_value($attributes) . ';',
		));

		return wp_sprintf(
			'<div %1$s><h5 class="wp-block-prc-platform-facet-template__label">%4$s</h5><div class="wp-block-prc-block-facet-template-list">%2$s</div>%3$s</div>',
			$block_wrapper_attrs,
			$new_content,
			!empty($expanded_content) ? '<button data-wp-on--click="actions.facetTemplate.onExpand" data-wp-text="context.facetTemplate.expandedLabel"></button><div class="wp-block-prc-platform-facet-template__list-expanded">' . $expanded_content . '</div>' : '',
			array_key_exists('facetLabel', $attributes) ? $attributes['facetLabel'] : '',
		);
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function block_init() {
		register_block_type( __DIR__ . '/build', array(
			'render_callback' => array( $this, 'render_block_callback' ),
		) );
	}
}
