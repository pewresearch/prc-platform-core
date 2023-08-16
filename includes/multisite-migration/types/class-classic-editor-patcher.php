<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Tag_Processor;

class Classic_Editor_Patcher extends Multisite_Migration {
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

	protected function process_content() {
		if ( true !== $this->allow_processing ) {
			parent::log("UHOH: Classic_Editor_Patcher::process() called without all required arguments.");
			return new WP_Error( 'prc_classic_editor_patcher_missing_args', __( 'Missing arguments.', 'prc' ) );
		}

		// $content = get_post_field('post_content', $this->target_post_id);
		// if ( has_blocks($content) ) {
		// 	return;
		// }
		// $new_content = $content;

		// $new_content = $this->process_hispanic_stat_portrait_shortcodes($new_content);

		// $updated = wp_update_post(array(
		// 	'ID' => $this->target_post_id,
		// 	'post_content' => $new_content,
		// ), true);

		// if ( is_wp_error( $updated ) ) {
		// 	return $updated;
		// }

		return true;
	}

	protected function process_hispanic_stat_portrait_shortcodes($content) {
		$hispanic_site_id = 5;

		// look to see if there are any combination of [statisticalportrait], [statistical_portrait], [stat_portrait], or [portrait] shortcodes in use in the content.
		// if there are then we need to go into hispanic (site 4), get the individual stat portrait post using the 'id', or 'slug' from the shortcode and recreate them as attachments on the target site, then copy what info you need like id and img src and replace the shortcode with an <img> tag.

		if ( !has_shortcode($content, 'statisticalportrait') ) {
			return $content;
		}

		// find [statisticalportrait] shortcodes in the content, get their id and slug as variables and then go get their post featured image and title and create an array of that data...
		$stat_portrait_slug_attachments = array();
		$stat_portrait_shortcode_regex = get_shortcode_regex(array('statisticalportrait'));

		preg_match_all('/' . $stat_portrait_shortcode_regex . '/', $content, $matches);
		if ( !empty($matches[2]) ) {
			foreach($matches[2] as $shortcode) {
				$shortcode_atts = shortcode_parse_atts($shortcode);
				if ( !empty($shortcode_atts['slug']) ) {
					$slug = $shortcode_atts['slug'];
					$stat_portrait_slug_attachments[$slug] = $this->process_stat_portraits($slug);
				}
			}
		}

		// now that we have an array of attachments we need to go through the content and replace the shortcodes with <img> tags.
		$new_content = preg_replace_callback('/' . $stat_portrait_shortcode_regex . '/', function($matches) use ($stat_portrait_slug_attachments) {
			// replace with <img> tag
			$shortcode_atts = shortcode_parse_atts($matches[0]);
			if ( !empty($shortcode_atts['slug']) ) {
				$slug = $shortcode_atts['slug'];
				$attachment_ids = $stat_portrait_slug_attachments[$slug];
				$replacement_content = '';
				if ( !empty($attachment_ids) ) {
					foreach($attachment_ids as $attachment_id) {
						$replacement_content .= wp_get_attachment_image($attachment_id, 'full');
					}
				}
				echo esc_html($replacement_content);
			}
		}, $content);

		return $new_content;
	}

	/**
	 * Process the contents of this "stat portrait" and return an array of attachments.
	 * @param mixed $slug
	 * @param mixed $id
	 * @return false|void
	 */
	protected function process_stat_portraits($slug = null) {
		if ( null === $slug ) {
			return false;
		}
		$attachments = array();

		switch_to_blog(5);
		$post = false;
		if ( $slug ) {
			$post = \wpcom_vip_get_page_by_path( $slug, 'OBJECT', 'statistical-portrait' );
		} else {
			restore_current_blog();
			return false;
		}

		if ( ! $post || is_wp_error( $post ) ) {
			restore_current_blog();
			return false;
		}

		$args      = array(
			'post_type'   => 'statistical-portrait',
			'child_of'    => $post->ID,
			'sort_column' => 'menu_order',
		);
		$portraits = get_pages( $args );
		restore_current_blog();

		if ($portraits) {
			foreach($portraits as $portrait) {
				$attachment_id = $this->convert_portrait_to_attachment($portrait);
				if ( $attachment_id ) {
					$attachments[] = $attachment_id;
				}
			}
		}

		return $attachments;
	}

	protected function convert_portrait_to_attachment($portrait_post) {
		switch_to_blog(5);
		$post_title = $portrait_post->post_title;
		$featured_image_id = get_post_thumbnail_id( $portrait_post->ID );
		if ( ! $featured_image_id ) {
			restore_current_blog();
			return false;
		}
		$old_attachment = get_post( $featured_image_id );
		if ( ! $old_attachment ) {
			restore_current_blog();
			return false;
		}
		$attachment_date = $old_attachment->post_date; // Get attachment date
		$attachment_name = get_post_meta($featured_image_id, '_wp_attached_file', true);
		restore_current_blog();

		$upload_dir = wp_upload_dir($attachment_date); // Get upload directory
		$target_filename = $upload_dir['path'] . '/' . $attachment_name; // Set target path

		$new_attachment_args = array(
			'guid' => $upload_dir['url'] . '/' . $attachment_name,
			'post_mime_type' => $old_attachment['post_mime_type'],
			'post_title' => $post_title,
			'post_name' => $attachment_name,
			'post_content' => '',
			'post_date' => $attachment_date,
			'post_author' => $portrait_post->post_author,
			'meta_input' => array(
				'_prc_migration_origin_object_id' => $featured_image_id,
				'_prc_migration_origin_site_id' => 5,
			),
		);

		// Insert attachment into target site and set the post with the [statisticalportrait] shortcode as the parent.
		$new_attachment_id = wp_insert_attachment(
			$new_attachment_args,
			$target_filename,
			$this->target_post_id,
			true
		);

		return $new_attachment_id;
	}

}
