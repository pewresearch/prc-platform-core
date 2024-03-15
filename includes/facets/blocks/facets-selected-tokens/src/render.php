<?php
namespace PRC\Platform\Facets;

$selected_tokens_id = wp_unique_id('prc-platform-facets-selected-tokens-');

$clear_icon =  \PRC\Platform\Icons\Render('solid', 'circle-xmark');

$block_wrapper_attrs = get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'prc-platform/facets-selected-tokens'
	]),
	'id' => $selected_tokens_id,
	'data-wp-router-region' => $selected_tokens_id,
	'data-wp-watch--update-tokens' => 'callbacks.updateTokens',
	'data-wp-class--has-tokens' => 'callbacks.hasTokens',
]);

$token_template = wp_sprintf(
	'<li %1$s><span data-wp-text="context.token.label"></span>%2$s</li>',
	\PRC\Platform\Block_Utils\get_block_html_attributes( array(
		'class' => 'wp-block-prc-platform-facets-selected-tokens__token',
		'data-wp-bind--data-facet-slug' => 'context.token.slug',
		'data-wp-on--click' => 'actions.onTokenClick',
	) ),
	$clear_icon
);
$token_list = wp_sprintf(
	'<template data-wp-each--token="state.tokens" data-wp-each-key="context.token.slug">%1$s</template>',
	$token_template,
);

echo wp_sprintf(
	'<ul %1$s><li>Filtering by:</li>%2$s<li data-wp-on--click="actions.onReset">Reset %3$s</li></ul>',
	$block_wrapper_attrs,
	$token_list,
	$clear_icon,
);
