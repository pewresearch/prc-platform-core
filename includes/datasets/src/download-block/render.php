<?php
namespace PRC\Platform\Facets;
// PHP file to use when rendering the block type on the server to show on the front end.
// The following variables are exposed to this file:

// $attributes (array): The block attributes.
// $content (string): The block default content.
// $block (WP_Block): The block instance.

$dataset_term_id = $attributes['termId'];
// We need to get some term meta... like if this is atp or not.
$is_atp		= false;

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array('namespace' => 'prc-platform/dataset-download')),
	'data-wp-context' => wp_json_encode(array(
		'datasetTermId' => $dataset_term_id,
		'isATP' => $is_atp,
	)),
));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
