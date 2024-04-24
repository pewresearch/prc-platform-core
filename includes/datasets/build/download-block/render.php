<?php
namespace PRC\Platform\Datasets;

wp_enqueue_script('wp-url');
wp_enqueue_script('wp-api-fetch');

// Assume this is a singular dataset post
$dataset_id = get_the_ID();
// But, usually, we're going to be viewing these from the perspective of the datasets taxonomy archive, so use that to get the dataset id.
if ( is_tax('datasets') ) {
	$dataset_term_id = get_queried_object_id();
	$dataset = \TDS\get_related_post($dataset_term_id, 'datasets');
	$dataset_id = $dataset->ID;
}
$nonce = wp_create_nonce('prc_platform_dataset_download');
$is_atp = get_post_meta( $dataset_id, 'is_atp', true );
// If this dataset is in the ATP then it needs a modal to accept the ATP legal terms. Here we're manually adding the content from the download block... usually a core/button into the trigger of the poopup. Now, the button is still wired to the download block but the download block can handle opening the modal by accessing the modals' action store when running core/button::onButtonClick.
if ( $is_atp ) {
	$modal = \PRC\Platform\Blocks\Popup_Controller\create_modal([
		'title' => 'Accept ATP',
		'content' => '<!-- wp:prc-platform/dataset-atp-legal-acceptance {"datasetId": "'.$dataset_id.'", "nonce": "'.$nonce.'"} -->',
		'backgroundColor' => 'ui-white',
		'trigger' => $content,
	]);
	$content = null !== $modal ? render_block($modal) : $content;
}

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array(
		'namespace' => 'prc-platform/dataset-download'
	)),
	'data-wp-context' => wp_json_encode(array(
		'datasetId' => $dataset_id,
		'isATP' => $is_atp,
		'NONCE' => $nonce,
	)),
	'data-wp-bind--data-dataset-id' => 'context.datasetId',
));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content, // If this is ATP then this will be a modal
);
