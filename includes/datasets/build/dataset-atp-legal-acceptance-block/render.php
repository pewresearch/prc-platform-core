<?php
namespace PRC\Platform\Datasets;

wp_enqueue_script( 'wp-url' );
wp_enqueue_script( 'wp-api-fetch' );

ob_start();
?>
<div class="wp-block-buttons has-sans-serif-font-family is-content-justification-space-between is-layout-flex wp-block-buttons-is-layout-flex">
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" data-wp-on--click="actions.cancel">Cancel</a></div>
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" data-wp-on--click="actions.accept">Accept</a></div>
</div>
<?php
$buttons = ob_get_clean();

$block_wrapper_attrs = get_block_wrapper_attributes(
	array(
		'data-wp-interactive' => 'prc-platform/dataset-download',
		'data-wp-context'     => wp_json_encode(
			array(
				'datasetId' => array_key_exists( 'datasetId', $attributes ) ? $attributes['datasetId'] : null,
				'NONCE'     => array_key_exists( 'nonce', $attributes ) ? $attributes['nonce'] : null,
			)
		),
	)
);

echo wp_sprintf(
	'<div %1$s>%2$s%3$s</div>',
	$block_wrapper_attrs,
	wp_sprintf(
		'<textarea class="wp-block-prc-platform-dataset-atp-legal-acceptance__textarea" readonly data-wp-text="state.atpLegalText"></textarea>',
	),
	$buttons
);
