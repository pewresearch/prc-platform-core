<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Tag_Processor;

class Block_Patcher extends Multisite_Migration {
	public $original_post_id = null;
	public $original_site_id = null;
	public $target_post_id = null;
	public $target_site_id = null;
	public $post_type = null;
	public $allow_processing = false;
	public $log = null;

	public function __construct( $original_post = array(
		'post_id' => null,
		'site_id' => null,
	), $target_post = array(
		'post_id' => null,
		'site_id' => null,
	), $log = null  ) {
		$this->original_post_id = $original_post['post_id'];
		$this->original_site_id = $original_post['site_id'];
		$this->target_post_id = $target_post['post_id'];
		$this->target_site_id = $target_post['site_id'];
		$this->log = $log;

		$this->post_type = get_post_type($this->target_post_id);

		// if all the values in the original_post array and $target_post array are integers then we can allow processing:
		if (
			is_int($this->original_post_id) &&
			is_int($this->original_site_id) &&
			is_int($this->target_post_id)   &&
			is_int($this->target_site_id)   &&
			!in_array($this->post_type, ['chart', 'quiz'])
		) {
			$this->allow_processing = true;
		}
	}

	protected function process_entities() {
		// We dont need to do this on homepages it causes the system to hang.Far too much data to process.
		if ( 'homepage' === $this->post_type ) {
			return null;
		}
		// Get new post content, parsed for new ids.
		$new_content = $this->process_blocks();
		$updated = wp_update_post(array(
			'ID' => $this->target_post_id,
			'post_content' => $new_content,
			false
		), true);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return true;
	}

	protected function process_media($attachment_id_pairs) {
		if ( 'homepage' === $this->post_type ) {
			return null;
		}
		$new_content = $this->parse_media($attachment_id_pairs);
		$updated = wp_update_post(array(
			'ID' => $this->target_post_id,
			'post_content' => $new_content,
		), true);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return true;
	}

	public function clean_post_content($post_content) {
		// Remove and <!-- wp:prc-block/row {"divided":false} --> and <!-- wp:prc-block/row {"divided":true} --> and <!-- wp:prc-block/row --> and lastly <!-- /wp:prc-block/row --> instances from $post_content...
		$post_content = preg_replace('/<!--\s*\/?wp:prc-block\/row[^>]*-->/i', '', $post_content);
		// $post_content = preg_replace('/<!--\s*wp:group[^>]*is-style-card-alt is-style-200-wide[^>]*-->(.*?)<!--\s*\/wp:group[^>]*-->/i', '', $post_content);

		return $post_content;
	}

	protected function cleanse_escaping($content) {
		// find all instances of u00 without a backslash in front of it and replace with \u00
		$content = preg_replace('/(?<!\\\\)u00/', '\\u00', $content);
		// Now lets convert these to utf-8 characters.
		$content = preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/', function($matches) {
			$converted = mb_convert_encoding(pack('H*', $matches[1]), 'UTF-8', 'UCS-2BE');
			return $converted;
		}, $content);
		// this should find all improperly escaped unicode characters and replace them with the properly escaped version.
		return $content;
	}

	/**
	 * Process the block content by callback.
	 * @param mixed $callback
	 * @return string
	 */
	protected function process_blocks() {
		// Ensure we get the latest SAVED post_content.
		$post_content = get_post( $this->target_post_id )->post_content;
		// If this isn't a block post then don't bother.
		if ( !has_blocks($post_content) ) {
			return $post_content;
		}
		// Clean content...
		$post_content = $this->clean_post_content($post_content);
		// Parse the content for blocks.
		$original_blocks = parse_blocks( $post_content );
		// Run the callback on the blocks.
		$new_blocks = $this->check_for_classic_block_and_convert( $original_blocks );
		// We should also convert any shortcodes to blocks that we want to do right now.
		$new_blocks = $this->check_for_shortcodes_and_convert( $new_blocks );
		$new_blocks = $this->update_legacy_blocks_to_new_blocks( $new_blocks );
		$new_blocks = $this->parse_blocks_for_entity_blocks( $new_blocks );
		// Return serialized <!-- wp: --> blocks to be stored back in the post_content.
		$post_content = serialize_blocks( $new_blocks );
		$post_content = $this->cleanse_escaping($post_content);
		return $post_content;
	}

	/**
	 * Process the block content by callback.
	 * @param mixed $callback
	 * @return string
	 */
	protected function parse_media($attachment_id_pairs) {
		// Ensure we get the latest SAVED post_content.
		$post_content = get_post( $this->target_post_id )->post_content;
		// If this isn't a block post then don't bother.
		if ( !has_blocks($post_content) ) {
			return $post_content;
		}
		// Parse the content for blocks.
		$original_blocks = parse_blocks( $post_content );
		// Run the callback on the blocks.
		$new_blocks = $this->parse_blocks_for_media( $original_blocks, $attachment_id_pairs );
		// Return serialized <!-- wp: --> blocks to be stored back in the post_content.
		$new_blocks = serialize_blocks($new_blocks);
		$post_content = $this->cleanse_escaping($post_content);
		return $new_blocks;
	}

	protected function parse_classic_blocks($block_content) {
		$converter = new Classic_To_Blocks(array(
			'post_id' => $this->original_post_id,
			'site_id' => $this->original_site_id
		), array(
			'post_id' => $this->target_post_id,
			'site_id' => $this->target_site_id
		), function($msg) {
      if ( is_callable($this->log) ) {
				call_user_func($this->log, $msg);
			}
		});
		$blocks = $converter->process_blocks($block_content);
		return parse_blocks($blocks);
	}

	protected function check_for_classic_block_and_convert($blocks) {
		$updated_blocks = array();
		foreach($blocks as $index => $block) {
			// If this is a classic block then we want to use the classic converter to parse out blocks...
			if ( empty($block['blockName']) && !empty($block['innerHTML']) ) {
				$classic_content = $block['innerHTML'];
				$converted_blocks = $this->parse_classic_blocks($classic_content);
				if ( !empty($converted_blocks) ) {
					$updated_blocks[] = array(
						'targetIndex' => $index,
						'blocks' => $converted_blocks,
					);
				}
			}
		}
		// if we have updated_blocks then we need to loop through them, take their index number and replace the original block with the new blocks.
		if ( !empty($updated_blocks) ) {
			foreach($updated_blocks as $new_blocks) {
				$target_index = $new_blocks['targetIndex'];
				// remove the original block.
				unset($blocks[$target_index]);
				// insert the new blocks at the same index.
				array_splice($blocks, $target_index, 1, $new_blocks['blocks']);
			}
		}
		return $blocks;
	}

	protected function parse_load_interactive_shortcode($content) {
		// extract all the key value pairs out of the $content string... as an array without using shortcode_parse_atts
		$key_value_pairs = array_reduce(
			explode(' ', str_replace(array('[load_interactive', ']'), '', $content)),
			function($result, $pair) {
				$pair = explode('=', $pair);
				$key = trim($pair[0]);
				$value = trim(str_replace('"', '', $pair[1]));
				$value = trim(str_replace("'", '', $value));
				$key = strtolower($key);
				$result[$key] = $value;
				return $result;
			},
			array()
		);
		$shortcode_args = wp_parse_args(
			$key_value_pairs,
			array(
				'id' => '',
				'appname' => '',
				'path' => '',
				'deps' => '',
				'version' => '1.0',
				'usewpscripts' => false,
				'usenew' => false,
			)
		);
		$id = $shortcode_args['id'];
		$use_wpackio = true !== rest_sanitize_boolean($shortcode_args['usewpscripts']);

		$block_attrs = array(
			'slug' => $id,
		);

		if ($use_wpackio) {
			$block_attrs['legacyWpackIo'] = array(
				'appName' => $shortcode_args['appname'],
				'path' =>  $shortcode_args['path'],
				'deps' => $shortcode_args['deps'],
			);
		}
		return $block_attrs;
	}

	protected function parse_js_interactive_shortcode($content) {
		error_log('parse_js_interactive_shortcode');
		error_log(print_r($content, true));
		// extract all the key value pairs out of the $content string... as an array without using shortcode_parse_atts
		$key_value_pairs = array_reduce(
			explode(' ', str_replace(array('[js_interactive', ']'), '', $content)),
			function($result, $pair) {
				$pair = explode('=', $pair);
				$key = trim($pair[0]);
				$value = trim(str_replace('"', '', $pair[1]));
				$value = trim(str_replace("'", '', $value));
				$key = strtolower($key);
				$result[$key] = $value;
				return $result;
			},
			array()
		);
		$shortcode_args = wp_parse_args(
			$key_value_pairs,
			array(
				'id' => '',
				'path' => '',
				'libraries' => '',
				'styles' => '',
				'react' => false,
			)
		);
		$id = $shortcode_args['id'];

		$block_attrs = array(
			'slug' => $id,
			'legacyS3' => [
				'path' =>  $shortcode_args['path'],
				'libraries' => $shortcode_args['libraries'],
				'styles' => $shortcode_args['styles'],
				'react' => rest_sanitize_boolean($shortcode_args['react']),
			],
		);
		return $block_attrs;
	}

	protected function parse_shortcodes($content) {
		// remove any <p> </p> tags from $content
		$content = shortcode_unautop($content);
		$blocks = array();

		$has_load_interactive_shortcode = strpos($content, '[load_interactive') !== false;
		$has_js_interactive_shortcode = strpos($content, '[js_interactive') !== false;
		if ($has_load_interactive_shortcode || $has_js_interactive_shortcode) {
			if ($has_load_interactive_shortcode) {
				$block_attrs = $this->parse_load_interactive_shortcode($content);
			}
			if ($has_js_interactive_shortcode) {
				$block_attrs = $this->parse_js_interactive_shortcode($content);
			}
			$block = new \WP_Block_Parser_Block(
				'prc-platform/feature-loader',
				$block_attrs,
				array(),
				'',
				array()
			);
			$block = (array) $block;
			$blocks[] = $block;
		}

		return $blocks;
	}

	protected function patch_taxonomy_menu_link($block) {
		// wp:prc-block/taxonomy-menu-link
		// get the id, look for the distributored id, then get the new id and the new link and update that.
		$old_id = $block['attrs']['id'];
		$new_id = null;
		$new_link = null;
		// do a wp_term_query and look for terms with the term meta of _prc_original_term_id and the value of $old_id
		$terms = get_terms(array(
			'taxonomy' => 'category', // These are categories now, not topics.
			'hide_empty' => false,
			'meta_query' => array(
				array(
					'key' => '_prc_original_term_id',
					'value' => $old_id,
					'compare' => '=',
				),
			),
		));
		if ( !empty($terms) ) {
			$new_id = $terms[0]->term_id;
			$new_link = get_term_link($new_id);
			$block['attrs']['id'] = $new_id;
			$block['attrs']['link'] = $new_link;
		}
		$block['blockName'] = 'prc-block/taxonomy-list-link';
		return $block;
	}

	protected function patch_core_navigation_link($block) {
		$old_id = $block['attrs']['id'];
		$new_id = null;
		$new_link = null;
		// do a wp_term_query and look for terms with the term meta of _prc_original_term_id and the value of $old_id
		$terms = get_terms(array(
			'taxonomy' => 'category', // These are categories now, not topics.
			'hide_empty' => false,
			'meta_query' => array(
				array(
					'key' => '_prc_original_term_id',
					'value' => $old_id,
					'compare' => '=',
				),
			),
		));
		if ( !empty($terms) ) {
			$new_id = $terms[0]->term_id;
			$new_link = get_term_link($new_id);
			$block['attrs']['id'] = $new_id;
			$block['attrs']['link'] = $new_link;
			$block['attrs'] = array(
				'id' => $new_id,
				'label' => $block['attrs']['label'],
				'url' => $new_link,
			);
		}
		$block['blockName'] = 'core/navigation-link';

		return $block;
	}

	protected function update_legacy_blocks_to_new_blocks($blocks) {
		$blocks_in = $blocks;
		// we want to look for prc-block/post-bylines and change to prc-block/bylines-display.
		// also, we want to look for prc-block/menu and convert to core/navigation
		foreach($blocks as $index => $block) {
			// check for innerBlocks and if so we want to run this function on the innerBlocks.
			if ( !empty($block['innerBlocks']) ) {
				$blocks[$index]['innerBlocks'] = $this->update_legacy_blocks_to_new_blocks($block['innerBlocks']);
			}
			if ( 'prc-block/post-bylines' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'prc-block/bylines-display';
			}
			if ( 'prc-block/menu' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'core/navigation';
				$blocks[$index]['attrs']['className'] = 'is-style-pills';
				$blocks[$index]['attrs']['style'] = array(
					'spacing' => array(
						'blockGap' => 'var:preset|spacing|20',
					),
					'typography' => array(
						'fontSize' => '14px',
					),
					'overlayMenu' => 'never',
					'fontFamily' => 'sans-serif',
				);
			}
			if ( 'prc-block/menu-link' === $block['blockName'] ) {
				$blocks[$index] = $this->patch_core_navigation_link($blocks[$index]);
			}
			if ( 'prc-block/chapter' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'core/heading';
				$blocks[$index]['attrs']['chapter'] = true;
			}
			if ( 'prc-block/grid' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'prc-block/grid-controller';
				static $grid_index = 1;
			}
			if ( 'prc-block/column' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'prc-block/grid-column';
				// @TODO these spans need to be recalculated based on the number of columns in the grid.
				$desktop_span = $blocks[$index]['attrs']['width'];
				// Lets convert the old 16 column grid to the new 12 column grid.
				// first lets approximate what percentage of the 16 column grid the old column was.
				$old_percent = round($desktop_span / 16);
				// next lets approximate what the new column span would be in the 12 column grid.
				$new_span = round(12 * $old_percent);
				$desktop_span = (int) $new_span;

				$tablet_span = array_key_exists('tabletWidth', $blocks[$index]['attrs']) ? $blocks[$index]['attrs']['tabletWidth'] : $desktop_span;
				$mobile_span = array_key_exists('mobileWidth', $blocks[$index]['attrs']) ? $blocks[$index]['attrs']['mobileWidth'] : 4;
				$blocks[$index]['attrs']['gridLayout'] = array(
					'index' => $grid_index,
					'desktopSpan' => $desktop_span,
					'tabletSpan' => $tablet_span,
					'mobileSpan' => $mobile_span,
				);
				$grid_index++;
			}
			if ( 'prc-block/post-publish-date' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'core/post-date';
			}
			if ( 'prc-block/post-title' === $block['blockName'] ) {
				$blocks[$index]['blockName'] = 'core/post-title';
			}
			if ( 'prc-block/taxonomy-menu-link' === $block['blockName'] ) {
				$blocks[$index] = $this->patch_taxonomy_menu_link($blocks[$index]);
			}
			if ( 'prc-block/tabs-menu-item' === $block['blockName'] ) {
				// Actually, we're not going to respect your bad BR tag...
				// $blocks[$index]['attrs']['title'] = preg_replace('/u003cbru003e/', '', $blocks[$index]['attrs']['title']);
				// // We're also not going to respect your ampersands...
				// $blocks[$index]['attrs']['title'] = preg_replace('/u0026amp;/', '&', $blocks[$index]['attrs']['title']);
			}



			$color_pairs = [
				'white' => 'ui-white',
				'black' => 'ui-black',
				'link-color' => 'ui-link-color',
				'text-color' => 'ui-text-color',
				'slate' => 'ui-slate',
				'gray-darkest' => 'ui-gray-very-dark',
				'gray-dark' => 'ui-gray-dark',
				'gray-medium' => 'ui-gray-light',
				'gray-light' => 'ui-gray-very-light',
				'gray' => 'gray-light',
				'beige-dark' => 'ui-beige-dark',
				'beige-medium' => 'ui-beige-medium',
				'beige' => 'ui-beige-very-light',
				'oatmeal-text' => 'ui-beige-very-dark',
				'oatmeal-dark' => 'ui-beige-very-dark',
				'oatmeal-light' => 'ui-beige-very-light',
				'oatmeal' => 'ui-beige-light',
			];
			// Set background colors to new names.
			if ( array_key_exists($blocks[$index]['attrs']['backgroundColor'], $color_pairs) ) {
				$blocks[$index]['attrs']['backgroundColor'] = $color_pairs[$blocks[$index]['attrs']['backgroundColor']];
			}
		}
		if ( is_callable($this->log) ) {
			call_user_func($this->log, 'update_legacy_blocks_to_new_blocks in>:' . print_r(array('in' => $blocks_in), true));
			call_user_func($this->log, 'update_legacy_blocks_to_new_blocks out>:' . print_r(array('out' => $blocks), true));
		}
		return $blocks;
	}

	protected function check_for_shortcodes_and_convert($blocks) {
		$updated_blocks = array();
		foreach($blocks as $index => $block) {
			// check if the blockName is core/paragraph and if the innerHTML contains a shortcode and only a shortcode
			$continue = false;
			// Check for shortcodes inside a lone paragraph block
			error_log('check_for_shortcodes_and_convert:'.print_r($block, true));
			if ( 'core/paragraph' === $block['blockName'] && strpos($block['innerHTML'], '[') !== false && strpos($block['innerHTML'], ']') !== false ) {
				$continue = true;
			}
			// Check for classic blocks that dont have a blockName but do have innerHTML
			if ( empty($block['blockName']) && !empty($block['innerHTML']) ) {
				$continue = true;
			}
			$is_shortcode_block = false;
			if ( 'core/shortcode' === $block['blockName'] ) {
				$continue = true;
				$is_shortcode_block = true;
			}
			// If this is a classic block then we want to use the classic converter to parse out blocks...
			if ( true === $continue ) {
				$inner_content = $block['innerHTML'];
				$converted_blocks = $this->parse_shortcodes($inner_content);
				if ( !empty($converted_blocks) ) {
					$updated_blocks[] = array(
						'targetIndex' => $index,
						'blocks' => $converted_blocks,
					);
				}
			}
		}
		error_log('updated_blocks::'.print_r($updated_blocks, true));
		// if we have updated_blocks then we need to loop through them, take their index number and replace the original block with the new blocks.
		if ( !empty($updated_blocks) ) {
			foreach($updated_blocks as $new_blocks) {
				$target_index = $new_blocks['targetIndex'];
				// insert the new blocks at the same index.
				$extracted = \array_splice($blocks, $target_index, 1, $new_blocks['blocks']);
				error_log("_extracted:".print_r($extracted, true));
				error_log('_new_blocks:'.print_r($new_blocks['blocks'], true));

				error_log('updated_blocks::'.print_r($blocks[$target_index], true));
			}
		}
		return $blocks;
	}

	/**
	 * Parse "entity blocks" core/block, prc-block/chart, prc-quiz/embed, any block that references a post type as its content utilizing the 'ref' attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param array $blocks Unserialized blocks to parse.
	 * @return array $blocks with new ids.
	 */
	protected function parse_blocks_for_entity_blocks( $blocks ) {
		$block_types = array(
			'core/block' => 'ref',
			'core/pattern' => 'ref',
			'prc-block/chart' => 'ref',
			'prc-quiz/embed' => 'ref',
		);
		$block_names = array_keys( $block_types );
		$block_post_types = array(
			'core/block' => 'wp_block',
			'prc-block/chart' => 'chart',
			'prc-quiz/embed' => 'quiz',
		);

		$updated_blocks = array();

		foreach($blocks as $block) {
			if ( ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->parse_blocks_for_entity_blocks( $block['innerBlocks'] );
			}

			if ( in_array( $block['blockName'], $block_names, true ) ) {
				$old_reference_id = $block['attrs'][ $block_types[ $block['blockName'] ] ];
				$new_reference_id = null;
				// Go seek using get_posts to find the new reference id:
				$posts = get_posts(array(
					'post_type' => $block_post_types[ $block['blockName'] ],
					'posts_per_page' => 1,
					'fields' => 'ids',
					'meta_query' => array(
						array(
							'key' => 'dt_original_post_id',
							'value' => $old_reference_id,
							'compare' => '=',
						),
						array(
							'key' => 'dt_original_blog_id',
							'value' => $this->original_site_id,
							'compare' => '=',
						),
					),
				));
				if ( !empty($posts) ) {
					$new_reference_id = $posts[0];
					$block['attrs'][ $block_types[ $block['blockName'] ] ] = $new_reference_id;
				}
			}

			$updated_blocks[] = $block;
		}

		return $updated_blocks;
	}

	/**
	 * Parse "entity blocks" core/block, prc-block/chart, any block that references a post type as its content utilizing the 'ref' attribute.
	 *
	 * @since 1.0.0
	 *
	 * @param array $blocks Unserialized blocks to parse.
	 * @return array $blocks with new ids and update media sources.
	 */
	protected function parse_blocks_for_media( $blocks, $attachment_id_pairs = array() ) {
		$block_types = array(
			'core/image' => 'id',
		);
		$block_names = array_keys( $block_types );

		$new_blocks = array();

		foreach($blocks as $block) {
			if ( ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->parse_blocks_for_media( $block['innerBlocks'], $attachment_id_pairs );
			}

			if ( in_array( $block['blockName'], $block_names, true ) ) {
				// We may want to see what attachments have already been brought over here...
				$old_reference_id = $block['attrs']['id'];
				$new_reference_id = null;

				// check $attachment_id_pairs has a key with the old_reference_id
				if ( isset( $attachment_id_pairs[ $old_reference_id ] ) ) {
					$new_reference_id = $attachment_id_pairs[ $old_reference_id ];
				} else {
					// Go seek using get_posts to find the new reference id:
					$posts = get_posts(array(
						'post_type' => 'attachment',
						'posts_per_page' => 1,
						'fields' => 'ids',
						'meta_query' => array(
							array(
								'key' => 'dt_original_post_id',
								'value' => $old_reference_id,
								'compare' => '=',
							),
							array(
								'key' => 'dt_original_blog_id',
								'value' => $this->original_site_id,
								'compare' => '=',
							),
						),
					));
					if ( !empty($posts) ) {
						$new_reference_id = $posts[0];
					}
				}

				// If we can find something well change it, otherwise we'll just leave it alone.
				if ( null !== $new_reference_id ) {
					$new_href = get_attachment_link( $new_reference_id );

					$size_slug = isset($block['attrs']['sizeSlug']) ? $block['attrs']['sizeSlug'] : 'full';
					$img_src = wp_get_attachment_image_src( $new_reference_id, $size_slug );
					$new_src = isset($img_src[0]) ? $img_src[0] : null;

					$tags = new WP_HTML_Tag_Processor($block['innerHTML']);

					// Go get the <a> tag and change its href to the new href.
					if ( $new_href && $tags->next_tag( 'a' ) ) {
						$tags->set_attribute('rel', 'attachment wp-att-' . $new_reference_id);
						$tags->set_attribute( 'href', $new_href );
					};

					// Go get the img tag, look at the src attribute and change it to the new src.
					if ( $new_src && $tags->next_tag( 'img' ) ) {
						$img_src_updated = $tags->set_attribute( 'src', $new_src );

						// replace any wp-image-<old_id> with wp-image-<new_reference_id>
						$old_classname = $tags->get_attribute( 'class' );
						$new_classname = str_replace('wp-image-' . $old_reference_id, 'wp-image-' . $new_reference_id, $old_classname);
						$tags->set_attribute( 'class', $new_classname );
					}

					// Update the id attribute by looking it up by blockname.
					$block['attrs']['id'] = $new_reference_id;
					// Finally, update the innerHTML to this new content.
					$new_inner_html = $tags->get_updated_html();
					$block['innerHTML'] = $new_inner_html;
					$block['innerContent'][0] = $new_inner_html;
				} else {
					$block['attrs']['unmigrated'] = true;
				}
			}

			$new_blocks[] = $block;
		}

		return $new_blocks;
	}

}
