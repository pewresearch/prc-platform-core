<?php
namespace PRC\Platform\Facets;
// PHP file to use when rendering the block type on the server to show on the front end.
// The following variables are exposed to this file:

// $attributes (array): The block attributes.
// $content (string): The block default content.
// $block (WP_Block): The block instance.

$selections = $block->context['facetsContextProvider']['selected'];
$selections_keys = array_keys((array) $selections);

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array('namespace' => 'prc-platform/facets-context-provider')),
	'data-wp-navigation-id' => wp_unique_id('prc-platform-facets-selected-tokens-'),
));

$content = implode(' ', array_map(function($key) use ($selections) {
	$facet_name = $key;
	$facet_choice = $selections->$key;
	$facet_choice = implode(', ', $facet_choice);
	return wp_sprintf(
		'<span class="wp-block-prc-platform-selected-tokens__token" data-wp-on--click="actions.onFacetTokenClick" data-wp-key="%1$s">%1$s: %2$s</span>',
		$facet_name,
		$facet_choice,
	);
}, $selections_keys));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
