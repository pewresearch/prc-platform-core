<?php
namespace PRC\Platform\Facets;
// PHP file to use when rendering the block type on the server to show on the front end.
// The following variables are exposed to this file:

// $attributes (array): The block attributes.
// $content (string): The block default content.
// $block (WP_Block): The block instance.

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array(
		'namespace' => 'prc-platform/facets-update-button',
	)),
	'data-wp-watch--for-disabled-state' => 'callbacks.watchDisabledState',
));

$clear_icon =  \PRC\Platform\Icons\Render('solid', 'circle-xmark');

echo wp_sprintf(
	'<div %1$s>%2$s<button data-wp-on--click="actions.onClear" data-wp-class--is-hidden="state.update-results.isDisabled" class="wp-block-prc-platform-facets-update-button__clear-all" type="button">%3$s</button></div>',
	$block_wrapper_attrs,
	$content,
	'Clear All ' . $clear_icon,
);
