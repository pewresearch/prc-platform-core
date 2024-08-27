# Art Direction

This system is a replacement for "featured image" that allows for multiple images to be used for a post and for those images to be used in different viewports/templates/contexts.

Post types are opt-in to this system and once added the featured image inspector panel will be replaced with the art direction panel.

### Vernacular

- "Art Direction" is the system that allows for multiple images to be used for a post.
- "Art" is a single image in the art direction system.
- "Image Slot" is a specific size of art that can be used in a template (A1, A2, A3...)
- "Art Object" is an array of art objects for a given post.
- "Chart Art" is an internal term used to denote when an art image should have a border applied to it.

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
