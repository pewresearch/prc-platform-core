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
	'<div %1$s>%2$s %3$s %4$s</div>',
	$block_wrapper_attrs,
	wp_sprintf(
		'<textarea class="atp-legal-text" readonly>%1$s</textarea>',
		'This is a legal agreement (this “Agreement”) between you, the end user (“you” or “User”), and Pew Research Center (the “Center”). By downloading the American Trends Panel survey data made available on this web site (“Data”) you are agreeing to be bound by the terms and conditions of this Agreement. If you do not agree to be bound by these terms, do not download or use the Data.',
	),
	'<button class="atp-agree" data-wp-on--click="actions.atpModalAgree">Agree</button>',
	'<button class="atp-disagree" data-wp-on--click="actions.atpModalDisagree">Disagree</button>',
);
