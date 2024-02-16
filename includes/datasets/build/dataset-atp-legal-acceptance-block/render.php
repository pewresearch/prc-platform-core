<?php
namespace PRC\Platform\Datasets;

wp_enqueue_script('wp-url');
wp_enqueue_script('wp-api-fetch');

$block_wrapper_attrs = get_block_wrapper_attributes(array(
	'data-wp-interactive' => wp_json_encode(array(
		'namespace' => 'prc-platform/dataset-download'
	)),
));

echo wp_sprintf(
	'<div %1$s>%2$s<div class="wp-block-prc-platform-dataset-atp-legal-acceptance__buttons">%3$s %4$s</div></div>',
	$block_wrapper_attrs,
	wp_sprintf(
		'<textarea class="wp-block-prc-platform-dataset-atp-legal-acceptance__textarea" readonly data-wp-text="state.atpLegalText"></textarea>',
	),
	'<button class="wp-element-button" data-wp-on--click="actions.accept">Accept</button>',
	'<button class="wp-element-button" data-wp-on--click="actions.cancel">Cancel</button>',
);
