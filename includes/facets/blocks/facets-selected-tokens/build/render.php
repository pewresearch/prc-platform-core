<?php
namespace PRC\Platform\Facets;

$token_border_color     = array_key_exists('tokenBorderColor', $attributes) ? $attributes['tokenBorderColor'] : false;
$token_background_color = array_key_exists('tokenBackgroundColor', $attributes) ? $attributes['tokenBackgroundColor'] : false;
$clear_icon =  \PRC\Platform\Icons\render('solid', 'circle-xmark');

$block_wrapper_attrs = get_block_wrapper_attributes([
	'id' => wp_unique_id('prc-platform-facets-selected-tokens-'),
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'prc-platform/facets-context-provider'
	]),
	'data-wp-class--has-tokens' => 'callbacks.hasTokens',
	'style' => '--token-border-color: var(--wp--preset--color--' . $token_border_color . '); --token-background-color: var(--wp--preset--color--' . $token_background_color . ');',
]);

$token_template = wp_sprintf(
	'<div %1$s><span data-wp-text="context.token.label"></span> %2$s</div>',
	\PRC\Platform\Block_Utils\get_block_html_attributes([
		'class'	=> 'wp-block-prc-platform-facets-selected-tokens__token',
		'style' => 'border-color: var(--token-border-color); background-color: var(--token-background-color);',
		'data-wp-on--click' => 'actions.onTokenClick',
		'data-wp-bind--data-key' => 'context.token.value',
	]),
	$clear_icon
);

$tokens_list_template = wp_sprintf(
	'<template data-wp-each--token="state.tokens" data-wp-each-key="context.token.value">%1$s</template>',
	$token_template
);

$reset_all = wp_sprintf(
	'<div class="wp-block-prc-platform-facets-selected-tokens__token" data-wp-on--click="actions.resetAllTokens" data-wp-key="select-tokens-reset-all"><span>Reset</span> %s</div>',
	$clear_icon,
);

echo wp_sprintf(
	'<div %1$s><div class="wp-block-prc-platform-facets-selected-tokens__label"><span>Filtering by:</span></div><div class="wp-block-prc-platform-facets-selected-tokens__reset">%2$s</div><div class="wp-block-prc-platform-facets-selected-tokens__tokens-list">%3$s</div></div>',
	$block_wrapper_attrs,
	$reset_all,
	$tokens_list_template,
);
