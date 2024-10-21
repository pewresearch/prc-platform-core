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
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
		}
	}

	/**
	 * This function takes the innerblocks provided, renders the first bock as a template, and then modifies specific html attributes to render a dropdown facet.
	 */
	public function render_dropdown_facet($facet, $inner_blocks) {
		$field_template = $inner_blocks[0]; // The innerblocks should contain the template for this block, we will render out the html for a default value and then use it as a template for the rest.
		$parsed_template = new WP_Block_Parser_Block(
			$field_template['blockName'],
			$field_template['attrs'],
			$field_template['innerBlocks'],
			$field_template['innerHTML'],
			$field_template['innerContent']
		);
		$rendered_template = (
			new WP_Block(
				(array) $parsed_template,
				array()
			)
		)->render();
		return $rendered_template;
	}

	/**
	 * This function takes the innerblocks provided, renders the first bock as a template, and then modifies specific html attributes
	 * for ingestiong by the interactivity api, converting them to wp-directives.
	 * @param array $inner_blocks
	 * @return array
	 */
	public function render_checkbox_radio_facet_template($inner_blocks, $template_data_src) {
		$field_template = $inner_blocks[0]; // The innerblocks should contain the template for this block, we will render out the html for a default value and then use it as a template for the rest.
		$parsed_template = new WP_Block_Parser_Block(
			$field_template['blockName'],
			$field_template['attrs'],
			$field_template['innerBlocks'],
			$field_template['innerHTML'],
			$field_template['innerContent']
		);
		$rendered_template = (
			new WP_Block(
				(array) $parsed_template,
				array()
			)
		)->render();

		return wp_sprintf(
			/* html */'<template data-wp-each--choice="%s" data-wp-each-key="context.choice.value">%s</template>',
			$template_data_src,
			$rendered_template,
		);
	}

	public function render_block_callback($attributes, $content, $block) {
		$target_namespace = 'prc-platform/facets-context-provider';
		$facets = $block->context[$target_namespace]['facets'];
		if ( empty($facets) ) {
			return '<!-- No facets data -->';
		}

		$facet_type = array_key_exists('facetType', $attributes) ? $attributes['facetType'] : 'checkbox';
		$facet_limit = array_key_exists('facetLimit', $attributes) ? $attributes['facetLimit'] : 10;
		$facet_name = array_key_exists('facetName', $attributes) ? $attributes['facetName'] : null;
		$facet_label = array_key_exists('facetLabel', $attributes) ? $attributes['facetLabel'] : '';
		$facet_placeholder = wp_strip_all_tags($facet_label);
		$facet_slug = $facet_name;

		$facet = $facets[$facet_slug];
		$facet_data = $facet['choices'];
		$selected = (array) $facet['selected'];

		if (empty($facet_data)) {
			return '<!-- No choices for this facet -->';
		}

		// For now, lets restrict this sorting to only lists.
		if ( $facet_type !== 'dropdown' ) {
			usort($facet_data, function($a, $b) {
				if ($a['count'] === $b['count']) {
					return 0;
				}
				return $a['count'] > $b['count'] ? -1 : 1;
			});
		}


		$choices = $facet_data;
		// If the $choices exceeds the limit, we need to remove the excess choices and store them in a separate array, $expanded_choices.
		$expanded_choices = [];
		if ( $facet_limit < count($choices) && $facet_type !== 'dropdown' ) {
			$expanded_choices = array_slice($choices, $facet_limit);
			$choices = array_slice($choices, 0, $facet_limit);
		}

		$new_content = '';
		$expanded_content = '';

		if ( in_array($facet_type, ['dropdown'] ) ) {
			$new_content .= $this->render_dropdown_facet($facet, $block->parsed_block['innerBlocks']);
		} elseif ( in_array($facet_type, ['range'] ) ) {
			$new_content .= '<!-- Range facets are not yet supported. -->';
		} else {
			$new_content = $this->render_checkbox_radio_facet_template(
				$block->parsed_block['innerBlocks'],
				'state.facetChoices',
			);
			$expanded_content = $this->render_checkbox_radio_facet_template(
				$block->parsed_block['innerBlocks'],
				'state.facetExpandedChoices',
			);
		}

		if ( empty($new_content) ) {
			return '<!-- Could not render this facet -->';
		}

		$block_wrapper_attrs = get_block_wrapper_attributes([
			'data-wp-interactive' => wp_json_encode([
				'namespace' => $target_namespace,
			]),
			'data-wp-key' => $facet_slug,
			'data-wp-context' => wp_json_encode([
				'placeholder' => $facet_placeholder,
				'expanded' => false,
				'expandedLabel' => '+ More',
				'limit' => $facet_limit,
				'facetSlug' => $facet_slug,
				'facetType' => $facet_type,
				'data' => $facet_data,
				'selected' => $selected,
				'choices' => $choices,
				'expandedChoices' => $expanded_choices,
				'activeIndex' => 0,
				'searchValue' => '',
			]),
			'data-wp-watch--on-updates' => 'callbacks.onUpdates',
			'data-wp-watch--on-expand' => 'callbacks.onExpand',
			'data-wp-class--has-expanded-choices' => 'state.hasExpandedChoices',
			'data-wp-class--has-selections' => 'state.hasSelections',
			'data-wp-class--is-expanded' => 'context.expanded',
			'data-wp-class--is-processing' => 'state.isProcessing',
			'style' => '--block-gap: ' . \PRC\Platform\Block_Utils\get_block_gap_support_value($attributes) . ';',
			'class' => \PRC\Platform\Block_Utils\classNames([
				'is-type-' . $facet_type,
			])
		]);

		if ( in_array($facet_type, ['dropdown','range']) ) {
			$template = '<div %1$s>%2$s %3$s</div>';
		} else {
			$template = '<div %1$s>%2$s<div class="wp-block-prc-block-facet-template-list">%3$s</div>%4$s</div>';
		}

		$clear_icon =  \PRC\Platform\Icons\Render('solid', 'circle-xmark');

		$label = wp_sprintf(
			'<h5 class="wp-block-prc-platform-facet-template__label"><span>%1$s</span><span><button class="wp-block-prc-block-platform-facet-template__clear" data-wp-on--click="%2$s">%3$s</button></span></h5>',
			$facet_label,
			'actions.clearFacet',
			$clear_icon,
		);

		$expanded_content = !empty($expanded_content) ? wp_sprintf(
			'<button class="wp-block-prc-platform-facet-template__list-expanded-button" data-wp-on--click="%1$s" data-wp-text="%2$s"></button><div class="wp-block-prc-platform-facet-template__list-expanded">%3$s</div>',
			'actions.onExpand',
			'context.expandedLabel',
			$expanded_content
		) : '';

		return wp_sprintf(
			$template,
			$block_wrapper_attrs,
			$label,
			$new_content,
			$expanded_content,
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
