<?php
namespace PRC\Platform\Facets;

$block_wrapper_attrs = get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'prc-platform/facets-pager'
	]),
	'id' => wp_unique_id('prc-platform-facets-pager-'),
]);

echo wp_sprintf(
	'<div %1$s><span data-wp-text="state.pagerText">Displaying 1-10 of ? results</span></div>',
	$block_wrapper_attrs,
);
