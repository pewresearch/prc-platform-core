<?php
use \PRC\Platform\Art_Direction;

function prc_get_art( $post_id, $size = 'all' ) {
	$art_direction = new Art_Direction(
		'1.0.0',
		null,
	);
	return $art_direction->get_art( $post_id, $size );
}
