<?php
use \PRC\Platform\Iframe_Embeds;

function prc_the_iframe_code( $post_id ) {
	$prc_embeds = new Iframe_Embeds(
		'pewresearch-org-embed',
		1.0
	);
	echo $prc_embeds->get_iframe_code( $post_id );
}

function is_iframe() {
	if ( get_query_var( 'iframe' ) ) {
		return true;
	}
	return false;
}
