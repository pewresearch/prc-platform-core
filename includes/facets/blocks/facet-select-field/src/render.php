<?php
namespace PRC\Platform\Blocks;

if ( is_admin() ) {
	return;
}

$input_name = sanitize_title(array_key_exists('metadata', $attributes) && array_key_exists('name', $attributes['metadata']) ? $attributes['metadata']['name'] : 'prc-platform/facet-select-field');
$input_id = wp_unique_id('prc-platform/facet-select-field-');
$input_disabled = array_key_exists( 'disabled', $attributes ) ? $attributes['disabled'] : false;

/**
 * MARKUP: Render the block.
 */

$input_template = wp_sprintf(
	/* html */
	'<input %1$s />',
	\PRC\Platform\Block_Utils\get_block_html_attributes( [
		'id' 					    => $input_id.'-input',
		'role' 					    => 'combobox',
		'type' 					    => 'text', // we should make this "search" but how do we get rid of the "x" clear button?
		'aria-controls' 		    => $input_id.'-input',
		'data-wp-bind--placeholder' => 'state.placeholder',
		'data-wp-bind--value' 	    => 'state.label',
		'data-wp-on--keyup' 	    => 'actions.onSelectKeyUp',
		'data-wp-on-async--focus' 	=> 'actions.onExpand',
		'data-wp-on-async--blur' 	=> 'actions.onCollapse',
		'data-1p-ignore'            => 'true', // Hide from 1password
		'data-lpignore'             => 'true', // Hide from lastpass
	] )
);

$option_li_template = wp_sprintf(
	/* html */'<li %1$s></li>',
	\PRC\Platform\Block_Utils\get_block_html_attributes( [
		'role' => 'option',
		'aria-controls' => $input_id,
		'class' => 'wp-block-prc-platform-facet-select-field__list-item',
		'data-wp-bind--aria-selected' => 'state.isSelected',
		'data-wp-bind--data-ref-value' => 'state.value',
		'data-wp-text' => 'state.label',
		'data-wp-on--click' => 'actions.onSelectClick',
	] )
);
$options_template = wp_sprintf(
	/* html */'<template data-wp-each--choice="%s" data-wp-each-key="context.choice.value">%s</template>',
	'state.filterableFacetChoices',
	$option_li_template,
);
$block_wrapper_attrs = get_block_wrapper_attributes([
	'id' => $input_id,
	'data-wp-class--is-open' => 'context.expanded',
	'data-wp-class--is-processing' => 'state.isProcessing',
	'style' => '--block-gap:' . \PRC\Platform\Block_Utils\get_block_gap_support_value($attributes, 'horizontal') . ';',
]);

$caret_up = \PRC\Platform\Icons\Render('solid', 'caret-up');
$caret_down = \PRC\Platform\Icons\Render('solid', 'caret-down');
$icon_set = $caret_up . $caret_down;

$template = /* html */'<div %1$s><div class="wp-block-prc-platform-facet-select-field__close-toggle" data-wp-on--click="actions.onExpand">%5$s</div><div class="wp-block-prc-platform-facet-select-field__input">%2$s</div><ul class="wp-block-prc-platform-facet-select-field__list" role="listbox" id="%3$s-listbox" aria-autocomplete="list">%4$s</ul></div>';

echo wp_sprintf(
	$template,
	$block_wrapper_attrs,
	$input_template,
	$input_id,
	$options_template,
	$icon_set,
);
