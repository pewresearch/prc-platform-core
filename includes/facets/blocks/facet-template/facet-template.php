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

	protected function format_label($label) {
		$label_is_datetime = strtotime($label) !== false;
		$label = $label_is_datetime ? gmdate('Y', strtotime($label)) : $label;
		return $label;
	}

	protected function format_count($count) {
		return $count > 250 ? '250+' : $count;
	}

	public function render_dropdown_facet($facet, $inner_blocks) {
		$field = $inner_blocks[0];
		$facet_choices = $facet['choices'];
		if ( empty($facet_choices) ) {
			do_action('qm/debug', 'UHOH No Facet Values For:'.print_r($facet, true));
			return '';
		}
		$selected_choices = $facet['selected'];

		$field_value = null;
		$options = array();
		foreach ($facet_choices as $choice) {
			// Check if the label is a datetime string and if so format it as a year.
			$count = $this->format_count($choice['count']);
			$label = $this->format_label($choice['label']);
			$label = $label . ' (' . $count . ')';
			// If the count exceeds 250, show 250+ instead of the actual count.
			$opts = array(
				'value' => $choice['value'],
				'label' => $label,
				'isSelected' => false,
			);
			// If the choice is selected, set the field value to the selected choice.
			if ( in_array($choice['value'], $selected_choices) ) {
				$field_value = $choice['value'];
				$opts['isSelected'] = true;
			}
			// Add our option to the options array.
			$options[] = $opts;
		}
		$field['attrs']['defaultOptions'] = 'custom';
		$field['attrs']['options'] = $options;
		// If there is a matching value that's already selected in the facet, set the field value to that value.
		if (null !== $field_value) {
			$field['attrs']['value'] = $field_value;
		}
		// do_action('qm/debug', 'Facet Check:'.print_r($field, true));
		// do_action('qm/debug', 'Facet Values For:'.print_r($field, true));
		// Parse new form-input-select block with the updated options.
		$parsed = new WP_Block_Parser_Block(
			$field['blockName'],
			$field['attrs'],
			$field['innerBlocks'],
			$field['innerHTML'],
			$field['innerContent']
		);
		return (
			new WP_Block(
				(array) $parsed,
				array()
			)
		)->render();
	}

	public function render_checkbox_radio_facet($facet, $inner_blocks) {
		$facet_choices = $facet['choices'];
		$selected_choices = $facet['selected'];
		$field_template = $inner_blocks[0]; // The innerblocks should contain the template for how this block should be repeated for each value, or $fact_choices.
		$content = '';
		$expanded_content = '';
		// make sure $selected_choices are first in the $facet_choices array, for a better user experience
		$blocks_to_generate = [];
		foreach ($facet_choices as $choice) {
			$field = $field_template;
			$count = $this->format_count($choice['count']);
			$label = $this->format_label($choice['label']);
			$field['attrs']['label'] =  $label. ' (' . $count . ')';
			$field['attrs']['value'] = $choice['value'];
			$field['attrs']['defaultChecked'] = in_array($choice['value'], $selected_choices);
			$blocks_to_generate[] = $field;
		}
		// sort it such that the defaultChecked are first
		usort($blocks_to_generate, function($a, $b) {
			if ( $a['attrs']['defaultChecked'] === $b['attrs']['defaultChecked'] ) {
				return 0;
			}
			return $a['attrs']['defaultChecked'] ? -1 : 1;
		});

		$i = 1;
		foreach ($blocks_to_generate as $block) {
			$parsed = new WP_Block_Parser_Block(
				$block['blockName'],
				$block['attrs'],
				$block['innerBlocks'],
				$block['innerHTML'],
				$block['innerContent']
			);

			if ( $i > 5 ) {
				$expanded_content .= (
					new WP_Block(
						(array) $parsed,
						array()
					)
				)->render();
			} else {
				$content .= (
					new WP_Block(
						(array) $parsed,
						array()
					)
				)->render();
			}

			$i++;
		}
		return array(
			'content' => $content,
			'expanded_content' => $expanded_content,
		);
	}

	public function render_date_range_facet($facet, $inner_blocks) {
		// Minimum Range
		$min = array(
			'min' => gmdate('Y', strtotime($facet['settings']['range']['min']['minDate'])),
			'max' => gmdate('Y', strtotime($facet['settings']['range']['min']['maxDate'])),
		);
		$min_options = array();
		foreach (range($min['min'], $min['max']) as $year) {
			$min_options[] = array(
				'value' => $year,
				'label' => $this->format_label($year),
			);
		}
		$min_field = $inner_blocks[0];
		$min_field['attrs']['options'] = $min_options;
		$min_parsed = new WP_Block_Parser_Block(
			$min_field['blockName'],
			$min_field['attrs'],
			$min_field['innerBlocks'],
			$min_field['innerHTML'],
			$min_field['innerContent']
		);
		// Render the minimum range select
		$minimum_field = (
			new WP_Block(
				(array) $min_parsed,
				array()
			)
		)->render();

		// Maximum Range
		$max = array(
			'min' => gmdate('Y', strtotime($facet['settings']['range']['max']['minDate'])),
			'max' => gmdate('Y', strtotime($facet['settings']['range']['max']['maxDate'])),
		);
		$max_options = array();
		foreach (range($max['min'], $max['max']) as $year) {
			$max_options[] = array(
				'value' => $year,
				'label' => $this->format_label($year),
			);
		}
		$max_field = $inner_blocks[1];
		$max_field['attrs']['options'] = $max_options;
		$max_parsed = new WP_Block_Parser_Block(
			$max_field['blockName'],
			$max_field['attrs'],
			$max_field['innerBlocks'],
			$max_field['innerHTML'],
			$max_field['innerContent']
		);
		// Render the maximum range select
		$maximum_field = (
			new WP_Block(
				(array) $max_parsed,
				array()
			)
		)->render();

		return array(
			'minimum' => $minimum_field,
			'maximum' => $maximum_field,
		);
	}

	public function render_search_facet($facet, $inner_blocks) {
		return '<p>Search Facet Here</p>';
	}

	public function render_block_callback($attributes, $content, $block) {
		$facets = $block->context['facetsContextProvider']['data']['facets'];
		if ( empty($facets) ) {
			return '<!-- No facets data -->';
		}
		$facet_type = array_key_exists('facetType', $attributes) ? $attributes['facetType'] : 'checkbox';
		$facet_name = array_key_exists('facetName', $attributes) ? $attributes['facetName'] : null;
		$facet_slug = $facet_name;
		$facet = $facets[$facet_name];

		$new_content = '';
		$expanded_content = '';

		if ( in_array($facet_type, array('dropdown','yearly') ) ) {
			$new_content .= $this->render_dropdown_facet($facet, $block->parsed_block['innerBlocks']);
		} elseif ( in_array($facet_type, array('date_range') ) ) {
			$date_range_facet = $this->render_date_range_facet($facet, $block->parsed_block['innerBlocks']);
			$new_content .= $date_range_facet['minimum'];
			$new_content .= $date_range_facet['maximum'];
		} elseif( in_array($facet_type, ['search'] ) ) {
			$new_content .= $this->render_search_facet($facet, $block->parsed_block['innerBlocks']);
		} else {
			$checkbox_facet = $this->render_checkbox_radio_facet($facet, $block->parsed_block['innerBlocks']);
			$new_content .= $checkbox_facet['content'];
			$expanded_content .= $checkbox_facet['expanded_content'];
		}

		if ( empty($new_content) ) {
			return '';
		}

		$facet_router_region = md5(wp_json_encode([
			'slug' => $facet_slug,
			'type' => $facet_type,
		]));

		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'data-wp-interactive' => wp_json_encode(array(
				'namespace' => 'prc-platform/facet-template'
			)),
			'data-wp-router-region' => $facet_router_region,
			'data-wp-key' => $facet_slug,
			'data-wp-context' => wp_json_encode(array(
				'expanded' => false,
				'expandedLabel' => '+ More',
				'facetSlug' => $facet_slug,
			)),
			'data-wp-watch--on-expand' => 'callbacks.onExpand',
			'data-wp-class--is-expanded' => 'context.expanded',
			'data-wp-class--has-selections' => 'callbacks.isSelected',
			'data-wp-class--is-processing' => 'prc-platform/facets-context-provider::state.isProcessing',
			'style' => '--block-gap: ' . \PRC\Platform\Block_Utils\get_block_gap_support_value($attributes) . ';',
			'class' => \PRC\Platform\Block_Utils\classNames(array(
				'is-type-' . $facet_type,
			))
		));

		if ( in_array($facet_type, array('dropdown','yearly','date_range')) ) {
			$template = '<div %1$s>%2$s %3$s</div>';
		} else {
			$template = '<div %1$s>%2$s<div class="wp-block-prc-block-facet-template-list">%3$s</div>%4$s</div>';
		}

		$clear_icon =  \PRC\Platform\Icons\Render('solid', 'circle-xmark');

		$label = wp_sprintf(
			'<h5 class="wp-block-prc-platform-facet-template__label"><span>%1$s</span><span><button class="wp-block-prc-block-platform-facet-template__clear" data-wp-on--click="%2$s">%3$s</button></span></h5>',
			array_key_exists('facetLabel', $attributes) ? $attributes['facetLabel'] : '',
			'actions.onClear',
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
