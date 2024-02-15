<?php
namespace PRC\Platform\Datasets;

wp_enqueue_script('wp-url');
wp_enqueue_script('wp-api-fetch');

// we need to get the tt_id for the dataset term... or the post id if this is a singular dataset.
$dataset_id = get_the_ID();
if ( is_tax('datasets') ) {
	$dataset_term_id = get_queried_object_id();
	$dataset = \TDS\get_related_post($dataset_term_id, 'datasets');
	$dataset_id = $dataset->ID;
}
$is_atp = get_post_meta( $dataset_id, 'is_atp', true );

if ( $is_atp ) {
	?>
<!-- wp:prc-block/popup-controller {"className":"is-style-standard"} -->
<!-- wp:prc-block/popup-content -->
<?php echo $content;?>
<!-- /wp:prc-block/popup-content -->

<!-- wp:prc-block/popup-modal {"title":"Accept ATP","backgroundColor":"white"} -->
<!-- wp:paragraph -->
<p>ATP Acceptance Content Goes Here</p>
<!-- /wp:paragraph -->
<!-- /wp:prc-block/popup-modal -->
<!-- /wp:prc-block/popup-controller -->
	<?php
	$atp_modal = ob_get_clean();
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
));

echo wp_sprintf(
	'<div %1$s>%2$s</div>',
	$block_wrapper_attrs,
	$content,
);
