<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Tag_Processor;

class Block_Patcher extends Multisite_Migration {
	public $original_post_id = null;
	public $original_site_id = null;
	public $target_post_id = null;
	public $target_site_id = null;
	public $allow_processing = false;

	public function __construct( $original_post = array(
		'post_id' => null,
		'site_id' => null,
	), $target_post = array(
		'post_id' => null,
		'site_id' => null,
	) ) {
		$this->original_post_id = $original_post['post_id'];
		$this->original_site_id = $original_post['site_id'];
		$this->target_post_id = $target_post['post_id'];
		$this->target_site_id = $target_post['site_id'];

		// if all the values in the original_post array and $target_post array are integers then we can allow processing:
		if (
			is_int($this->original_post_id) &&
			is_int($this->original_site_id) &&
			is_int($this->target_post_id)   &&
			is_int($this->target_site_id)
		) {
			$this->allow_processing = true;
		}
	}

	protected function process_entities() {
		// Get new post content, parsed for new ids.
		$new_content = $this->parse_entities();
		$updated = wp_update_post(array(
			'ID' => $this->target_post_id,
			'post_content' => $new_content,
		), true);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return true;
	}

	protected function process_media($attachment_id_pairs) {
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

	/**
	 * Process the block content by callback.
	 * @param mixed $callback
	 * @return string
	 */
	protected function parse_entities() {
		// Ensure we get the latest SAVED post_content.
		$post_content = get_post( $this->target_post_id )->post_content;
		// If this isn't a block post then don't bother.
		if ( !has_blocks($post_content) ) {
			return $post_content;
		}
		// Parse the content for blocks.
		$original_blocks = parse_blocks( $post_content );
		// Run the callback on the blocks.
		$new_blocks = $this->parse_blocks_for_entity_blocks( $original_blocks );
		// Return serialized <!-- wp: --> blocks to be stored back in the post_content.
		return serialize_blocks( $new_blocks );
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
		return serialize_blocks( $new_blocks );
	}

	/**
	 * Parse "entity blocks" core/block, prc-block/chart, any block that references a post type as its content utilizing the 'ref' attribute.
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
		);
		$block_names = array_keys( $block_types );
		$block_post_types = array(
			'core/block' => 'wp_block',
			'prc-block/chart' => 'chart',
		);

		$new_blocks = array();

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

			$new_blocks[] = $block;
		}

		return $new_blocks;
	}

	protected function parse_chart_blocks() {
		// we need to update `pngUrl` and `pngId` attributes and data...
		// Maybe, or we need to strip them out and let the chart block regenerate them.
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
				$old_reference_id = $block['attrs'][ $block_types[ $block['blockName'] ] ];
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

					// We should check to see if the img src and new src have the same filename, if they don't then we should probably just leave it alone.
					$file_name_sanity_check = false;
					if ( $new_src ) {
						$old_src_check = explode('/', $block['attrs']['url']);
						$old_src_check = end($old_src_check);
						$new_src_check = explode('/', $new_src);
						$new_src_check = end($new_src_check);
						$file_name_sanity_check = $old_src_check === $new_src_check;
					}

					$tags = new WP_HTML_Tag_Processor($block['innerHTML']);

					// Go get the <a> tag and change its href to the new href.
					if ( $new_href && $tags->next_tag( 'a' ) && true === $file_name_sanity_check ) {
						$tags->set_attribute( 'href', $new_href );
					};

					// Go get the img tag, look at the src attribute and change it to the new src.
					if ( $new_src && $tags->next_tag( 'img' ) && true === $file_name_sanity_check ) {
						$tags->set_attribute( 'src', $new_src );

						// replace any wp-image-<old_id> with wp-image-<new_reference_id>
						$old_classname = $tags->get_attribute( 'class' );
						$new_classname = str_replace('wp-image-' . $old_reference_id, 'wp-image-' . $new_reference_id, $old_classname);

						$tags->set_attribute( 'class', $new_classname );
					}

					// Update the id attribute by looking it up by blockname.
					$block['attrs'][ $block_types[ $block['blockName'] ] ] = $new_reference_id;
					// Finally, update the innerHTML to this new content.
					$new_inner_html = $tags->get_updated_html();
					$block['innerHTML'] = $new_inner_html;
					$block['innerContent'][0] = $new_inner_html;
				}
			}

			$new_blocks[] = $block;
		}

		return $new_blocks;
	}

}
