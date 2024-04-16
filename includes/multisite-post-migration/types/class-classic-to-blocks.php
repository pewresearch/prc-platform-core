<?php
// FROM COMMIT: 311f612
namespace PRC\Platform;
use Exception;
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
		error_log("classic-to-blocks".print_r(array(
			'original_post' => $original_post,
			'target_post' => $target_post,
		), true));

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

	public function process() {
		if ( true !== $this->allow_processing ) {
			return new WP_Error( 'prc_classic_to_blocks_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		$content = get_post_field('post_content', $this->target_post_id);
		if ( has_blocks($content) ) {
			error_log('This post already has blocks, skipping.' . $this->target_post_id);
			return;
		}
		$new_content = $content;
		$new_content = $this->process_blocks($new_content);
		error_log('New Content: ' . print_r($new_content, true));

		$updated = wp_update_post(array(
			'ID' => $this->target_post_id,
			'post_content' => $new_content,
		), true);

		///
		$follow_up_action = 'prc_distributor_queue_block_entity_patching';
		$group = $this->original_site_id . '_' . $this->original_post_id . '_' . $this->target_post_id;
		$follow_up_group = $group;
		$follow_up_args = array(
			'post_id' => $this->target_post_id,
		);

		$is_scheduled = as_has_scheduled_action(
			$follow_up_action,
			$follow_up_args,
			$follow_up_group
		);
		if ( $is_scheduled ) {
			as_unschedule_action(
				$follow_up_action,
				$follow_up_args,
				$follow_up_group
			);
		}
		as_schedule_single_action(
			time() + 5 * MINUTE_IN_SECONDS,
			$follow_up_action,
			$follow_up_args,
			$follow_up_group,
		);
		///

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
		$tag_processor->set_bookmark('figure');
		// set $align to $tag_processor->get_attribute('class') but extract out only the names that contain align, like alignnone, or alignright, etc...
		// Actually... we may need to go deeper and look at the img tag directly... So can we check if align is null.
		$figure_classnames = $tag_processor->get_attribute('class');
		$align = '';
   		if ($figure_classnames) {
			$tmp_align = explode(' ', $figure_classnames);
			$tmp_align = array_filter($tmp_align, function($value) {
				return strpos($value, 'align') !== false;
			});
			$tmp_align = array_values($tmp_align);
			if ( !empty($tmp_align) ) {
				$align = array_pop($tmp_align);
			}
		} else {
			$align = '';
		}

		$tag_processor->remove_attribute('id');
		$tag_processor->remove_attribute('style');
		$tag_processor->remove_attribute('aria-describedby');

		// We should also check <a> for rel and check for the wp-att-{id} if its exists and use it for attachment_id
		$attachment_id = null;
		if ( $tag_processor->next_tag('a') ) {
			$tag_processor->set_bookmark('a');
			$rel = $tag_processor->get_attribute('rel');
			if ( $rel ) {
				$attachment_id = preg_replace('/[^0-9]/', '', $rel);
			}
		}

		// Get the image tag
		$tag_processor->next_tag('img');
		$class = $tag_processor->get_attribute('class');
   		if ($class && '' === $align) {
			$tmp_align = explode(' ', $class);
			$tmp_align = array_filter($tmp_align, function($value) {
				// check if value is alignright, alignnone, alignleft, aligncenter, or alignwide
				return strpos($value, 'align') !== false;
			});
			$tmp_align = array_values($tmp_align);
			if ( !empty($tmp_align) ) {
				$align = array_pop($tmp_align);
			}
		}
		// Go back to the figure
		$new_attachment_id = false;
		$width = $tag_processor->get_attribute('width');
		$width = intval($width);
		// check if img has wp-image- like class name
		if ( strpos($class, 'wp-image-') !== false ) {
			// Now that we're doing now so we can get it ouf the way then we'll go back to the img.
			$tag_processor->seek('figure');
			$tag_processor->set_attribute('class', 'wp-block-image ' . $align);
			// Go back to img...
			$tag_processor->next_tag('img');

			$tag_processor->remove_attribute('width');
			$tag_processor->remove_attribute('height');
			$tag_processor->remove_attribute('decoding');
			$tag_processor->remove_attribute('loading');
			$tag_processor->remove_attribute('srcset');
			$tag_processor->remove_attribute('sizes');

			if (null === $attachment_id)  {
				$attachment_id = preg_replace('/[^0-9]/', '', $class);
			}

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
					// ensure that the new src ends with the same filename as the old src.
					// just a little sanity check to make sure we're not updating the src to something that doesn't match the old src.
					if ( $old_src_check === $new_src_check ) {
						$tag_processor->set_attribute('src', $new_src);
					}
				}
			} else {
				// Do nothing, the block entity patcher will take care of this.
				$new_attachment_id = $attachment_id;
			}

			$tag_processor->set_attribute('class', 'wp-image-' . $new_attachment_id);

			if ( $tag_processor->next_tag('a') && null !== $new_attachment_id ) {
				$tag_processor->set_attribute('rel', 'attachment wp-att-' . $new_attachment_id);
				$tag_processor->set_attribute('href', get_attachment_link((int) $new_attachment_id));
			}

			if ( $tag_processor->next_tag('figcaption') ) {
				$tag_processor->remove_attribute('id');
				$tag_processor->set_attribute('class', 'wp-element-caption');
			}

			$content = $tag_processor->get_updated_html();
		}

		return (object) array(
			'content' => normalize_whitespace($content),
      		'id' => (int) $new_attachment_id,
			'width' => (string) $width,
			'align' => (string) $align,
		);
	}

	public function convert_figure_node($block, $search_for_tag = 'figure') {
		$block_markup = $block->content;
		// if $search_for_tag is not figure then we need to find the first instance of the search_for_tag provided and replace it with figure, same with the last instance.
		// this helps transform even older image markup like <div><a><img></a></div> into a figure block.
		if ( $search_for_tag !== 'figure' ) {
			$block_markup = preg_replace('/^<' . $search_for_tag . '[^>]*>/', '<figure>', $block_markup);
			$block_markup = preg_replace('/<\/' . $search_for_tag . '>$/i', '</figure>', $block_markup);
		}
		// Ensure $block_markup is wrapped in a figure tag, if it is not, then wrap it in one...
		// use wp_html_tag_processor to find the first tag and if it is not a figure tag then wrap the whole thing in a figure tag.
		$tag_processor = new WP_HTML_Tag_Processor($block_markup);
		if ( !$tag_processor->next_tag('figure') ) {
			$block_markup = '<figure>' . $block_markup . '</figure>';
		}

		$new_image = $this->seek_image($block_markup);

		if ( is_callable($this->log) ) {
			call_user_func($this->log, 'seek_image:' . print_r(array('in' => $block_markup, 'out' => $new_image), true));
		}

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

	/**
	 * HTML To Block Conversions:
	 */

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

	public function configure_aside_block($block, $block_content) {
		// remove the <div class="aside"> and </div> tags:
		$inner_blocks = $this->process_inner_blocks(preg_replace('/^<div[^>]*>/', '', $block_content));
		$block_content = '<div class="wp-block-group is-style-callout is-style-300-wide has-ui-beige-very-light-background-color has-background">' . $inner_blocks . '</div>';
		$block->content = $block_content;
		$block->block_name = 'core/group';
		$block->attributes = array(
			'className' => 'is-style-callout is-style-300-wide',
			'backgroundColor' => 'ui-beige-very-light',
		);
		return $block;
	}

	public function configure_collapsible_block($block, $block_content) {
		// Check $block_content for h4 tags and if found then we need to extract the text from the h4 and use it as the title for the collapsible block.
		if ( preg_match('/<h4[^>]*>(.*?)<\/h4>/', $block_content, $title_match) ) {
			$title = $title_match[1];
			$block_content = preg_replace('/<h4[^>]*>(.*?)<\/h4>/', '', $block_content);
		}
		if ( !empty($title) ) {
			$block->attributes = array(
				'title' => $title,
			);
		}

		$inner_blocks = $this->process_inner_blocks(preg_replace('/^<div[^>]*>/', '', $block_content));
		$block->content = $inner_blocks;
		$block->block_name = 'prc-block/collapsible';
		return $block;
	}

	public function check_html_blocks($block) {
		$block_content = $block->content;
		$tag_processor = new WP_HTML_Tag_Processor($block_content);

		// Process the inner contents of the html block by looking for divs with classes and converting them to blocks.
		if ( $tag_processor->next_tag('div') ) {
			$class = $tag_processor->get_attribute('class');
			if (!$class) {
				return $block;
			}
			if ( strpos($class, 'callout') !== false ) {
				$block = $this->configure_callout_block($block, $block_content);
			}
			if ( strpos($class, 'aside') !== false ) {
				$block = $this->configure_aside_block($block, $block_content);
			}
			if ( strpos($class, 'collapsible') !== false ) {
				$block = $this->configure_collapsible_block($block, $block_content);
			}
		}

		return $block;
	}

	/**
	 * Shortcode Conversions
	 */

	public function check_shortcodes($block) {
		if ( is_callable($this->log) ) {
			call_user_func($this->log, 'CHECK SHORTCODE:' . print_r($block, true));
		}

		// Originally I was doing a separate interactive loader and js loader check here but I'm allowing the block entity patcher to do that work now. The block entity patcher is launched as $followup_action in the process method.

		if ( strpos($block->content, '[chart') ) {
			$args = shortcode_parse_atts($block->content);
			if ( !array_key_exists('id', $args) ) {
				return $block;
			}
			$block->block_name = 'prc-block/chart';
			$block->attributes = array(
				'ref' => (int) $args['id'],
			);
		}
		if ( strpos($block->content, '[divider') !== false || strpos($block->content, '[line_divider') !== false ) {
			$block->block_name = 'core/separator';
			$block->content = '<hr class="wp-block-separator has-alpha-channel-opacity"/>';
		}
		if ( strpos($block->content, '[pullquote') !== false ) {
			$args = shortcode_parse_atts($block->content);
			// get the content inside the pullquote shortcode and set it as $quote_text
			$quote_text = preg_replace('/\[pullquote[^\]]*\]/', '', $block->content);

			$block->block_name = 'core/pullquote';
			$block->content = wp_sprintf(
				'<figure class="wp-block-pullquote"><blockquote>%1$s%2$s</blockquote></figure>',
				$quote_text,
				!!$args['cite'] ? '<cite>'.$args['cite'].'</cite>' : ''
			);
		}
		if ( strpos($block->content, '[subheading') !== false || strpos($block->content, '[sub_heading') !== false ) {
			// convert to the sub heading block.
			$block->block_name = 'prc-block/subtitle';
			$block->content = '';
		}

		if ( strpos($block->content, '[follow_us') !== false ) {
			// do nothing, for now.
		}
		if ( strpos($block->content, '[shareable') !== false ) {
			// do nothing, for now.
		}
		if ( strpos($block->content, '[embargo') !== false ) {
			// do nothing, for now.
		}
		if ( strpos($block->content, '[bignumber') !== false ) {
			// do nothing, for now.
		}
		if ( strpos($block->content, '[tweetable') !== false ) {
			// do nothing, for now.
		}

		return $block;
	}

	// [caption id="attachment_36884" align="alignnone" width="640"]<a class="image-box" href="https://prc-platform.vipdev.lndo.site/global/2016/11/14/in-key-african-nations-widespread-discontent-with-economy-corruption/pg_16-11-14_southafrica_featuredimage/" rel="attachment wp-att-36884"><img class="wp-photo wp-image-36884 size-full" src="https://prc-platform.vipdev.lndo.site/wp-content/uploads/sites/2/2016/11/PG_16.11.14_SouthAfrica_FeaturedImage.jpg" width="640" height="320" /></a> (Photo: MUJAHID SAFODIEN/AFP/Getty Images)[/caption]

	/**
	 * Paragraph Content Conversions
	 * For the most part, paragraphs go through no transformation. But we do need to check for p tags that only have another element in them to properly classify them as a block.
	 */
	public function check_paragraph_blocks_for_other_blocks($block) {
		$block_content = $block->content;

		if ( strpos($block_content, '[caption') !== false ) {
			// We want to generate the final markup, rather then deal with parsing the shortcode out...
			$image_content = apply_filters('the_content', $block_content);
			$block->content = $image_content;
			return $this->convert_figure_node($block, 'p');
		}

		// Look for [bignumber] and or [bignumber][/bignumber] in the paragraph content and if so remove it but apply the is-style-big-number class to the paragraph.
		if ( strpos($block_content, '[bignumber') !== false ) {
			// if $block_content, lets assume its <p>[bignumber][/bignumber]<strong>There is a big partisan divide over using changes in tax policy to help the poor</strong>.</p>, contains [bignumber] or [bignumber][/bignumber] then we need to remove it and apply the is-style-big-number class to the paragraph.
			$block_content = preg_replace('/\[bignumber[^\]]*\]/', '', $block_content);
			$block_content = preg_replace('/\[\/bignumber\]/', '', $block_content);
			$tag_processor = new WP_HTML_Tag_Processor($block_content);
			$tag_processor->next_tag('p');
			$tag_processor->set_attribute('class', 'is-style-has-big-number');
			$block_content = $tag_processor->get_updated_html();
			$block->content = $block_content;
			$block->attributes = array(
				'className' => 'is-style-has-big-number',
			);
			return $block;
		}

		// Check for shortcodes, exclude footnotes, and convert to core/shortcode blocks.
		preg_match_all('/\[(?!\d+\.\s).*?\]/', $block_content, $shortcode);
		if ( !empty($shortcode) && !empty($shortcode[0]) && !empty($shortcode[0][0]) ) {
			$shortcode = $shortcode[0];

			$new_block = new WP_Block_Parser_Block(
				'core/shortcode',
				array(),
				array(),
				$shortcode,
				array(
					$shortcode,
				)
			);
			$new_block = (array) $new_block;
			$block->content = $new_block['innerHTML'][0];
			$block->block_name = $new_block['blockName'];
			$block->attributes = $new_block['attrs'];
			$block = $this->check_shortcodes($block);
		}

		return $block;
	}

	/**
	 * @TODO Prepare legacy h2, h3 headings to core/heading with attributes of isChapter set to true.
	 * @return void
	 */
	public function prpare_headings() {
		// We need to determin if the heading should be a chapter chatper based on h2,h3 tags of the heading.
	}

	public function prepare_content_for_conversion($content) {
		// check for [collapsible] and [/collapsible] and if you find it then convert it to <div class="callout"> and </div>
		// Primitive wrap of [collapsible] and [/collapsible] shortcodes in a div to make collapsible block conversion easier.
		$content = preg_replace('/\[collapsible\]/', '<div class="collapsible">', $content);
		$content = preg_replace('/\[\/collapsible\]/', '</div>', $content);

		$content = preg_replace('/\[callout\]/', '<div class="callout">', $content);
		$content = preg_replace('/\[\/callout\]/', '</div>', $content);

		// Look for the "image inside a link inside a paragraph alone" pattern and unwrap the paragraph so its just the a tag with the image inside
		$content = preg_replace_callback('/<p[^>]*><a[^>]*><img[^>]*><\/a><\/p>/', function($matches) {
			return $matches[0];
		}, $content);
		// Look for images inside <a> tags that don't have a paragraph wrapping them or a figure wrapping them and wrap them in <figure> tags.
		// [caption id="attachment_36884" align="alignnone" width="640"]<a class="image-box" href="https://prc-platform.vipdev.lndo.site/global/2016/11/14/in-key-african-nations-widespread-discontent-with-economy-corruption/pg_16-11-14_southafrica_featuredimage/" rel="attachment wp-att-36884"><img class="wp-photo wp-image-36884 size-full" src="https://prc-platform.vipdev.lndo.site/wp-content/uploads/sites/2/2016/11/PG_16.11.14_SouthAfrica_FeaturedImage.jpg" width="640" height="320" /></a> (Photo: MUJAHID SAFODIEN/AFP/Getty Images)[/caption]
		// $content = preg_replace_callback('/<a[^>]*><img[^>]*><\/a>/', function($matches) {
		// 	error_log("Found an image inside a lone A tag. Wrapping in figure.");
		// 	return '<figure>'.$matches[0].'</figure>';
		// }, $content);

		$content = preg_replace_callback('/\[caption[^\]]*\](<a[^>]*>)?<img[^>]*>(<\/a>)?.*?\[\/caption\]|(<a[^>]*>)?<img[^>]*>(<\/a>)?/', function($matches) {
			if (strpos($matches[0], '[caption') !== false) {
				return $matches[0];
			} else {
				error_log("Found an image inside a lone A tag. Wrapping in figure.");
				return '<figure>'.$matches[0].'</figure>';
			}
		}, $content);

		// For good measure, we'll run wpautop on the content to ensure that it's properly formatted and so that the check_paragraph_blocks_for_other_blocks method can work with the content.
		$content = wpautop($content, false);

		return $content;
	}

	public function process_blocks($content) {
		$post_content = $this->prepare_content_for_conversion($content);

		$converter = new Block_Converter($post_content);

		/**
		 * Here, we transform markup or existing blocks into new blocks.
		 */
		add_filter( 'wp_block_converter_block', function ( Block $block, \DOMElement $node ): ?Block {
			$in = $block;
			// Process images inside <figure> tags.
			if ('html' === $block->block_name && $node->tagName === 'figure' ) {
				$block = $this->convert_figure_node($block);
			}

			// Here we're checking the default block conversions from wp_block_converter and adjusting where necessary.
			if ( $block->block_name === 'html' ) {
				$block = $this->check_html_blocks($block);
			}
			if ( $block->block_name === 'paragraph' ) {
				$block = $this->check_paragraph_blocks_for_other_blocks($block);
			}
			if ( $block->block_name === 'shortcode' ) {
				$block = $this->check_shortcodes($block);
			}
			// If the log is a callable function then we can log this action.
			if ( is_callable($this->log) ) {
				call_user_func($this->log, print_r($block, true));
			}
			return $block;
		}, 10, 2 );

		// Convert the blocks
		$blocks = $converter->convert();

		error_log("Final Blocks: " . print_r($blocks, true));

		return $blocks;
	}

}
