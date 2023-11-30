<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Tag_Processor;
use WP_Query;
use WP_Block_Parser_Block;
use Alley\WP\Block_Converter\Block_Converter;
use Alley\WP\Block_Converter\Block;

class Classic_To_Blocks {
	public $original_post_id = null;
	public $original_site_id = null;
	public $target_post_id = null;
	public $target_site_id = null;
	public $allow_processing = false;
	public $log = null;

	public function __construct( $original_post = array(
		'post_id' => null,
		'site_id' => null,
	), $target_post = array(
		'post_id' => null,
		'site_id' => null,
	), $log = null ) {
		$this->original_post_id = $original_post['post_id'];
		$this->original_site_id = $original_post['site_id'];
		$this->target_post_id = $target_post['post_id'];
		$this->target_site_id = $target_post['site_id'];
		$this->log = $log;

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

	protected function process() {
		if ( true !== $this->allow_processing ) {
			return new WP_Error( 'prc_classic_to_blocks_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		$content = get_post_field('post_content', $this->target_post_id);
		if ( has_blocks($content) ) {
			return;
		}
		$new_content = $content;

		$new_content = $this->process_blocks($new_content);

		$updated = wp_update_post(array(
			'ID' => $this->target_post_id,
			'post_content' => $new_content,
		), true);

		if ( is_wp_error( $updated ) ) {
			return $updated;
		}

		return true;
	}

	public function seek_image($content) {
		// Get only the img tag from the content:
		$tag_processor = new WP_HTML_Tag_Processor($content);
		// If there is a figure tag lets get that attachment id and also drop a bookmark...
		$tag_processor->next_tag('figure');
		// set $align to $tag_processor->get_attribute('class') but extract out only the names that contain align, like alignnone, or alignright, etc...
		$align = $tag_processor->get_attribute('class');
		$align = explode(' ', $align);
		$align = array_filter($align, function($value) {
			return strpos($value, 'align') !== false;
		});
		$align = array_values($align);
		$align = array_pop($align);
		$tag_processor->remove_attribute('id');
		$tag_processor->remove_attribute('style');
		$tag_processor->remove_attribute('aria-describedby');
		$tag_processor->set_bookmark('figure');

		// Get the image tag
		$tag_processor->next_tag('img');
		$class = $tag_processor->get_attribute('class');
		$new_attachment_id = false;
		$width = $tag_processor->get_attribute('width');
		$width = intval($width);
		// check if img has wp-image- like class name
		if ( strpos($class, 'wp-image-') !== false ) {
			$tag_processor->remove_attribute('width');
			$tag_processor->remove_attribute('height');
			$tag_processor->remove_attribute('decoding');
			$tag_processor->remove_attribute('loading');
			$tag_processor->remove_attribute('srcset');
			$tag_processor->remove_attribute('sizes');

			$attachment_id = preg_replace('/[^0-9]/', '', $class);
			$src = $tag_processor->get_attribute('src');
			// Now we would go check the media library for the existence of this image by querying by dt_original_post_id and dt_original_blog_id. Then we get the new id, and the new src and we check that the ends are the same. If they are then we can update the img tag with the new id and src.
			$query = new WP_Query(
				array(
					'post_type' => 'attachment',
					'post_status' => 'any',
					'meta_query' => array(
						array(
							'key' => '_prc_migration_origin_object_id',
							'value' => $attachment_id,
						),
						array(
							'key' => '_prc_migration_origin_site_id',
							'value' => $this->original_site_id,
						),
					),
					'posts_per_page' => 1,
				)
			);
			if ($query->have_posts()) {
				while ( $query->have_posts() ) {
					$query->the_post();

					$new_attachment_id = get_the_ID();
					$new_src = wp_get_attachment_image_src($new_attachment_id, 'full');
					$new_src = $new_src[0];

					// check that new src ends with the same filename as the old src:
					$old_src_check = explode('/', $src);
					$old_src_check = end($old_src_check);
					$new_src_check = explode('/', $new_src);
					$new_src_check = end($new_src_check);
					if ( $old_src_check !== $new_src_check ) {
						// We may want to leave a post meta tag on this post notifying of the error or push to an errors array so we can report all of them later.
						return false;
					}

					$tag_processor->set_attribute('src', $new_src);
					$tag_processor->set_attribute('class', 'wp-image-' . $new_attachment_id);

					// Go back to the figure
					$tag_processor->seek('figure');
					$tag_processor->set_attribute('class', 'wp-block-image ' . $align);

					if ( $tag_processor->next_tag('a') ) {
						$tag_processor->set_attribute('rel', 'attachment wp-att-' . $new_attachment_id);
						$tag_processor->set_attribute('href', get_attachment_link($new_attachment_id));
					}

					if ( $tag_processor->next_tag('figcaption') ) {
						$tag_processor->remove_attribute('id');
						$tag_processor->set_attribute('class', 'wp-element-caption');
					}
				}

			} else {
				// if we dont' then we need to go back into the original site and find the attachment and copy it over to the new site and then update the img tag with the new id and src.
				switch_to_blog($this->original_site_id);
				$attachment = get_post($attachment_id);
				// Do processing to bring over to new site and give me the new id and new src and then go set those things...
				restore_current_blog();
			}

			$content = $tag_processor->get_updated_html();
		}

		return (object) array(
			'content' => normalize_whitespace($content),
			'id' => $new_attachment_id,
			'width' => $width,
			'align' => $align,
		);
	}

	public function convert_figure_node($block, $create_figure = false) {
		$block_markup = $block->content;
		if ( $create_figure ) {
			$block_markup = '<figure>' . $block_markup . '</figure>';
		}

		$new_image = $this->seek_image($block_markup);

		$new_block = new WP_Block_Parser_Block(
			'core/image',
			array(
				'align' => str_replace('align', '', $new_image->align),
				'id' => $new_image->id,
			),
			array(),
			$new_image->content,
			array(
				$new_image->content,
			)
		);
		$new_block = (array) $new_block;

		$block->content = $new_block['innerHTML'];
		$block->block_name = $new_block['blockName'];
		$block->attributes = $new_block['attrs'];

		return $block;
	}

	public function process_inner_blocks($inner_blocks_content) {
		$converter = new Block_Converter($inner_blocks_content);
		return $converter->convert();
	}

	public function configure_callout_block($block, $block_content) {
		// remove the <div class="callout"> and </div> tags:
		$inner_blocks = $this->process_inner_blocks(preg_replace('/^<div[^>]*>/', '', $block_content));
		$block_content = '<div class="wp-block-group is-style-callout has-ui-beige-very-light-background-color has-background">' . $inner_blocks . '</div>';
		$block->content = $block_content;
		$block->block_name = 'core/group';
		$block->attributes = array(
			'className' => 'is-style-callout',
			'backgroundColor' => 'ui-beige-very-light',
		);
		return $block;
	}

	public function configure_collapsible_block($block, $block_content) {
		// extract any <h4> tags and use them as the title attribute for the collapsible block
		$title = preg_match('/<h4[^>]*>[^<]*<\/h4>/', $block_content, $matches);
		$title = $matches[0];
		// be sure to clean any html out of the title
		$title = strip_tags($title);
		// remove the h4 tags from the block_content
		$block_content = preg_replace('/<h4[^>]*>[^<]*<\/h4>/', '', $block_content);
		$inner_blocks = $this->process_inner_blocks(preg_replace('/^<div[^>]*>/', '', $block_content));
		$block_content = $inner_blocks;
		$block->content = $block_content;
		$block->block_name = 'prc-block/collapsible';
		$block->attributes = array(
			'title' => $title,
		);
		return $block;
	}

	public function configure_interactive_loader_block($block, $block_content) {
		$block->block_name = 'prc-platform/interactive-loader';
		// get the slug, appName, path, and deps from the extracted attributes out of the shortcode text.
		$block->attributes = array(
			'slug' => '',
			'legacyWpackIo' => array(
				'appName' => '',
				'path' => '',
				'deps' => '',
			)
		);
	}

	public function check_html_blocks($block) {
		$block_content = $block->content;
		if ( is_callable($this->log) ) {
			call_user_func($this->log, 'CHECK_ITA:: '. print_r($block_content, true));
		}
		$tag_processor = new WP_HTML_Tag_Processor($block_content);
		if ( $tag_processor->next_tag('div') ) {
			$class = $tag_processor->get_attribute('class');
			// if $class contains "callout"
			if ( strpos($class, 'callout') !== false ) {
				// process the callout into a callout group block...
				$block = $this->configure_callout_block($block, $block_content);
			}
			if ( strpos($class, 'wp-block-prc-block-collapsible--to-convert') !== false ) {
				if ( is_callable($this->log) ) {
					call_user_func($this->log, 'GOT_IT:: '. print_r($block, true));
				}
				// process the callout into a callout group block...
				$block = $this->configure_collapsible_block($block, $block_content);
			}
		}

		return $block;
	}

	public function check_lone_image_paragraph_blocks($block) {
		$block_content = $block->content;
		//using regex check for an a tag with an img inside that has a class of wp-image-* and extract that image out of the $block_content into a new variable
		$extracted_image = preg_match('/<a[^>]*><img[^>]*class="wp-image-[^>]*>[^<]*<\/a>/', $block_content, $matches);
		if ( $extracted_image ) {
			$block_content = $matches[0];
			if ( is_callable($this->log) ) {
				call_user_func($this->log, 'FOUND IMAGE INSIDE P' . print_r($block_content, true));
			}
			// $block = $this->convert_figure_node($block, true);
		}

		return $block;
	}

	public function reconfigure_footnotes($content) {
		// If there are no classic foonotes then return early.
		if ( ! preg_match('/\[[0-9]*\.[^\]]*\]/', $content) ) {
			return $content;
		}
		$footnotes = $this->store_footnotes($content);
		
		// given that $footnotes is an array structured liked so array( 1 => array('id'=> 'xyz', 'content' => 'Something...', 'template' => '<sup>Something</sup>')...) where 1 is the index number go through the $content variable and find any instance of [1. xyz] and replace it with the matching template from the footnotes array, use preg_replace_callback() to do this.
		$content = preg_replace_callback('/\[[0-9]*\.[^\]]*\]/', function($matches) use ($footnotes) {
			$index = preg_replace('/[^0-9]/', '', $matches[0]);
			$index = intval($index);
			$index = $index - 1;
			$index = $index < 0 ? 0 : $index;
			$index = $index > count($footnotes) ? count($footnotes) : $index;
			$index = $index + 1;
			return $footnotes[$index]['template'];
		}, $content);

		// remove all the 'template' keys from the footnotes array
		foreach ( $footnotes as $index => $footnote ) {
			unset($footnotes[$index]['template']);
		}

		// reset the index numbers on footnotes so it begins with 0
		$footnotes = array_values($footnotes);

		// now store it
		update_post_meta($this->target_post_id, 'footnotes', wp_json_encode($footnotes));

		return $content;
	}

	public function store_footnotes($content) {
		// Grab all the [1. xyz] footnotes from the $content and store them in an array.
		$footnotes = array();
		$footnote_regex = '/\[[0-9]*\.[^\]]*\]/';
		preg_match_all($footnote_regex, $content, $matches);

		if ( ! empty($matches) && ! empty($matches[0]) ) {
			$matches = $matches[0];
		}
		if ( ! empty($matches)) {
			foreach ( $matches as $index => $match ) {
				$index = $index + 1;
				$content = preg_replace('/\[[0-9]*\. /', '', $match);
				$uuid = wp_generate_uuid4();
				$template = wp_sprintf('<sup data-fn="%1$s" class="fn"><a id="%1$s-link" href="#%1$s">%2$s</a></sup>', $uuid, $index);
				$footnotes[$index] = array(
					'id' => $uuid,
					'content' => $content,
					'template' => $template, // We'll strip this in reconfigure_footnotes()
				);
			}
		}

		return $footnotes;
	}

	public function process_blocks($content) {
		$post_content = apply_filters('the_content', $content);
		if ( is_callable($this->log) ) {
			call_user_func($this->log, 'CHECK POST_CONTENT:: '. print_r($post_content, true));
		}

		// Check for footnotes early.
		$post_content = $this->reconfigure_footnotes($post_content);

		$converter = new Block_Converter($post_content);

		add_filter( 'wp_block_converter_block', function ( Block $block, \DOMElement $node ): ?Block {
			if ( $node->tagName === 'figure' ) {
				$block = $this->convert_figure_node($block, $node);
			}
			if ( $block->block_name === 'html' ) {
				$block = $this->check_html_blocks($block);
			}
			if ( $block->block_name === 'paragraph' ) {
				$block = $this->check_lone_image_paragraph_blocks($block);
			}
			if ( is_callable($this->log) ) {
				call_user_func($this->log, 'CHECK_END:: '. print_r($block, true));
			}
			return $block;
		}, 10, 2 );

		$blocks = $converter->convert();

		if ( is_callable($this->log) ) {
			call_user_func($this->log, print_r($blocks, true));
		}

		return $blocks;
	}

}
