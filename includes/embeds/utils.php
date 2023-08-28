<?php
use \PRC\Platform\Iframe_Embeds;

function prc_the_iframe_code( $post_id, $src = null, $echo = true ) {
	$prc_embeds = new Iframe_Embeds(
		'pewresearch-org-embed',
		1.0
	);
	$iframe_code = $prc_embeds->get_iframe_code( $post_id, $src, true );
	if ( $echo ) {
		echo $iframe_code;
	} else {
		return $iframe_code;
	}
}

function prc_get_the_iframe_code( $post_id ) {
	$prc_embeds = new Iframe_Embeds(
		'pewresearch-org-embed',
		1.0
	);
	return $prc_embeds->get_iframe_code( $post_id, null, false );
}

function is_iframe() {
	if ( get_query_var( 'iframe' ) ) {
		return true;
	}
	return false;
}
