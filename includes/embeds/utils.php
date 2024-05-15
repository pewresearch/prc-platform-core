<?php
use \PRC\Platform\Embeds;

function prc_get_post_as_iframe( $post_id, $src = null, $enqueue_view_embed = true ) {
	$prc_embeds = new Embeds(
		'pewresearch-org-embed',
		1.0
	);
	$iframe_code = $prc_embeds->get_iframe_code( $post_id, $src, array(
		'output_as_iframe' => true,
		'enqueue_view_embed' => $enqueue_view_embed,
	) );
	return $iframe_code;
}

function prc_get_the_iframe_code( $post_id ) {
	$prc_embeds = new Embeds(
		1.0,
		null
	);
	return $prc_embeds->get_iframe_code( $post_id, null );
}

function is_iframe() {
	if ( get_query_var( 'iframe' ) ) {
		return true;
	}
	return false;
}
