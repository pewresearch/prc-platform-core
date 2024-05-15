<?php
namespace PRC\Platform\Datasets;

// we need to get the tt_id for the dataset term... or the post id if this is a singular dataset.
$dataset_id = get_the_ID();
if ( is_tax('datasets') ) {
	$dataset_term_id = get_queried_object_id();
	$dataset = \TDS\get_related_post($dataset_term_id, 'datasets');
	$dataset_id = $dataset->ID;
}
$dataset_content = get_post_field('post_content', $dataset_id);
$content = apply_filters('the_content', $dataset_content);

$block_wrapper_attrs = get_block_wrapper_attributes();

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
