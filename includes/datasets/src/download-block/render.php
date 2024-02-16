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
$is_atp = get_post_meta( $dataset_id, 'is_atp', true );
// If this dataset is in the ATP then it needs a modal to accept the ATP legal terms. Here we're manually adding the content from the download block... usually a core/button into the trigger of the poopup. Now, the button is still wired to the download block but the download block can handle opening the modal by accessing the modals' action store when running core/button::onButtonClick.
if ( $is_atp ) {
	?>
<!-- wp:prc-block/popup-controller {"className":"is-style-standard"} -->
<!-- wp:prc-block/popup-content {"disengageClickHandler": true} -->
<?php echo $content;?>
<!-- /wp:prc-block/popup-content -->

<!-- wp:prc-block/popup-modal {"title":"Accept ATP","backgroundColor":"white"} -->
<!-- wp:prc-platform/dataset-atp-legal-acceptance -->
<!-- /wp:prc-block/popup-modal -->
<!-- /wp:prc-block/popup-controller -->
	<?php
	$atp_modal = ob_get_clean();
	// Run the content through the_content filter to apply any other block filters that might be in use and pre-pre-render the content.
	$content = apply_filters('the_content', $atp_modal);
}

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array(
		'namespace' => 'prc-platform/dataset-download'
	)),
	'data-wp-context' => wp_json_encode(array(
		'datasetId' => $dataset_id,
		'isATP' => $is_atp,
	)),
	'data-wp-bind--data-dataset-id' => 'context.datasetId',
));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content, // If this is ATP then this will be a modal
);
