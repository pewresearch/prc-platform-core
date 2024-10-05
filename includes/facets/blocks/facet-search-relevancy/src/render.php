<?php
namespace PRC\Platform\Facets;

wp_enqueue_script('wp-url');
// PHP file to use when rendering the block type on the server to show on the front end.
// The following variables are exposed to this file:

// $attributes (array): The block attributes.
// $content (string): The block default content.
// $block (WP_Block): The block instance.

wp_interactivity_state('prc-platform/facets-search-relevancy', [
	'epSortByDate' => get_query_var('ep_sort__by_date', false),
]);

$block_wrapper_attrs = get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'prc-platform/facets-search-relevancy',
	]),
	'data-wp-init' => 'callbacks.onInit',
]);

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
