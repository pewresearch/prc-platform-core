<?php
namespace PRC\Platform\Facets;
// PHP file to use when rendering the block type on the server to show on the front end.
// The following variables are exposed to this file:

// $attributes (array): The block attributes.
// $content (string): The block default content.
// $block (WP_Block): The block instance.

$selections = $block->context['facetsContextProvider']['selected'];

// map over selections and build the new content with a template of '<span class="facet-token">[facet name]: [facet choice]</span>'
// get the keys from the selections object
$selections_keys = array_keys((array) $selections);
// map over the keys and build the new content
$content = implode(' ', array_map(function($key) use ($selections) {
	$facet_name = $key;
	$facet_choice = $selections->$key;
	$facet_choice = implode(', ', $facet_choice);
	return '<span class="facet-token">' . $facet_name . ': ' . $facet_choice . '</span>';
}, $selections_keys));

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => true,
	'data-wp-navigation-id' => 'selected-tokens-'.md5(wp_json_encode($attributes)),
	'data-wp-context' => wp_json_encode(array('selectedTokens' => array(
		'selected' => $selections,
	))),
));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
