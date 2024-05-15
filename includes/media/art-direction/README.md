# Art Direction

This system is a replacement for "featured image" that allows for multiple images to be used for a post and for those images to be used in different viewports/templates/contexts.

Post types are opt-in to this system and once added the featured image inspector panel will be replaced with the art direction panel. 

## Helper Functions

`prc_get_art( $post_id, $size = 'all' )` - Returns an array of art objects for a given post. If `$size` is set to a specific size, only art objects for that size will be returned.

## Art Object Example

```php
<?php

array(
	'A1' => array(
		'id'       => '',
		'rawUrl'   => '',
		'url'      => '',
		'width'    => 500,
		'height'   => 500,
		'chartArt' => false,
	),
	'A2' => ...,
	'A3' => ...,
	'A4' => ...,
	'XL' => ...,
	'twitter' => ...,
	'facebook' => ...,
)

```
