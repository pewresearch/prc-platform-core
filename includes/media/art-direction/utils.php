<?php
use \PRC\Platform\Art_Direction;

function prc_get_art( $post_id, $size = 'all' ) {
	$art_direction = new Art_Direction(
		'prc-platform-media-util',
		'1.0.0'
	);
	return $art_direction->get_art( $post_id, $size );
}
