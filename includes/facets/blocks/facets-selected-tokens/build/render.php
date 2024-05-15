<?php
namespace PRC\Platform\Facets;

$selected_tokens_id = wp_unique_id('prc-platform-facets-selected-tokens-');
$token_border_color     = array_key_exists('tokenBorderColor', $attributes) ? $attributes['tokenBorderColor'] : false;
$token_background_color = array_key_exists('tokenBackgroundColor', $attributes) ? $attributes['tokenBackgroundColor'] : false;
$clear_icon =  \PRC\Platform\Icons\Render('solid', 'circle-xmark');

$block_wrapper_attrs = get_block_wrapper_attributes([
	'data-wp-interactive' => wp_json_encode([
		'namespace' => 'prc-platform/facets-selected-tokens'
	]),
	'id' => $selected_tokens_id,
	'data-wp-class--has-tokens' => 'callbacks.hasTokens',
	'data-wp-watch--on-token-update' => 'callbacks.onTokenUpdate',
	'style' => '--token-border-color: var(--wp--preset--color--' . $token_border_color . '); --token-background-color: var(--wp--preset--color--' . $token_background_color . ');',
]);

$reset_all = wp_sprintf(
	'<div class="wp-block-prc-platform-facets-selected-tokens__token" data-wp-on--click="actions.onReset" data-wp-key="select-tokens-reset-all"><span>Reset</span> %s</div>',
	$clear_icon,
);

$token_template = wp_sprintf(
	'<div %1$s><span data-wp-text="context.token.label"></span> %2$s</div>',
	\PRC\Platform\Block_Utils\get_block_html_attributes([
		'class'	=> 'wp-block-prc-platform-facets-selected-tokens__token',
		'data-wp-bind--data-facet-slug' => 'context.token.slug',
		'data-wp-bind--data-facet-value' => 'context.token.value',
		'data-wp-on--click' => 'actions.onTokenClick',
		'style' => 'border-color: var(--token-border-color); background-color: var(--token-background-color);',
	]),
	$clear_icon
);

$tokens_list_template = wp_sprintf(
	'<template data-wp-each--token="state.tokens" data-wp-each-key="context.token.value">%1$s</template>',
	$token_template
);

echo wp_sprintf(
	'<div %1$s><div class="wp-block-prc-platform-facets-selected-tokens__label"><span>Filtering by:</span></div><div class="wp-block-prc-platform-facets-selected-tokens__reset">%2$s</div><div class="wp-block-prc-platform-facets-selected-tokens__tokens-list">%3$s</div></div>',
	$block_wrapper_attrs,
	$reset_all,
	$tokens_list_template,
);
