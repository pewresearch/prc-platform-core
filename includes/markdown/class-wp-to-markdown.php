<?php
/**
 * Markdown conversion functions.
 */

namespace PRC\Platform;

/**
 * Convert HTML content to Markdown
 *
 * @param string $html The HTML content to convert.
 * @return string The converted Markdown content.
 */
function markdown_maker_html_to_markdown( $html ) {
	// Validate input
	if ( ! is_string( $html ) ) {
		return '';
	}

	// Remove WordPress shortcodes
	$html = strip_shortcodes( $html );

	// Decode HTML entities
	$html = html_entity_decode( $html, ENT_QUOTES | ENT_HTML5, 'UTF-8' );

	// Clean up whitespace before processing
	$html = preg_replace( '/\s+/', ' ', trim( $html ) );

	// Convert <br> tags to placeholder markers
	$html = preg_replace( '/<br\s*\/?>/i', '{{LINEBREAK}}', $html );

	// Convert headings
	for ( $i = 6; $i >= 1; $i-- ) {
		$hashes = str_repeat( '#', $i );
		$html   = preg_replace( '/<h' . $i . '[^>]*>(.*?)<\/h' . $i . '>/is', '{{DOUBLEBREAK}}' . $hashes . ' $1' . '{{DOUBLEBREAK}}', $html );
	}

	// Convert bold
	$html = preg_replace( '/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/is', '**$2**', $html );

	// Convert italic
	$html = preg_replace( '/<(em|i)[^>]*>(.*?)<\/(em|i)>/is', '*$2*', $html );

	// Convert code blocks
	$html = preg_replace( '/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/is', "{{DOUBLEBREAK}}```\n$1\n```{{DOUBLEBREAK}}", $html );

	// Convert inline code
	$html = preg_replace( '/<code[^>]*>(.*?)<\/code>/is', '`$1`', $html );

	// Convert links
	$html = preg_replace_callback(
		'/<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is',
		function ( $matches ) {
			$url  = $matches[1];
			$text = strip_tags( $matches[2] );
			return '[' . $text . '](' . $url . ')';
		},
		$html
	);

	// Convert images
	$html = preg_replace_callback(
		'/<img[^>]+src=["\']([^"\']+)["\']([^>]+alt=["\']([^"\']+)["\'])?[^>]*>/is',
		function ( $matches ) {
			$src = $matches[1];
			$alt = isset( $matches[3] ) ? $matches[3] : 'Image';
			return '![' . $alt . '](' . $src . ')';
		},
		$html
	);

	// Convert unordered lists
	$html = preg_replace_callback(
		'/<ul[^>]*>(.*?)<\/ul>/is',
		function ( $matches ) {
			$items = preg_replace( '/<li[^>]*>(.*?)<\/li>/is', '- $1', $matches[1] );
			return '{{DOUBLEBREAK}}' . trim( $items ) . '{{DOUBLEBREAK}}';
		},
		$html
	);

	// Convert ordered lists
	$html = preg_replace_callback(
		'/<ol[^>]*>(.*?)<\/ol>/is',
		function ( $matches ) {
			$items   = preg_split( '/<li[^>]*>/i', $matches[1] );
			$result  = '';
			$counter = 0;
			foreach ( $items as $item ) {
				if ( trim( $item ) ) {
					$counter++;
					$item    = preg_replace( '/<\/li>/i', '', $item );
					$result .= $counter . '. ' . trim( $item ) . "\n";
				}
			}
			return '{{DOUBLEBREAK}}' . trim( $result ) . '{{DOUBLEBREAK}}';
		},
		$html
	);

	// Convert blockquotes
	$html = preg_replace( '/<blockquote[^>]*>(.*?)<\/blockquote>/is', '{{DOUBLEBREAK}}> $1{{DOUBLEBREAK}}', $html );

	// Convert paragraphs
	$html = preg_replace( '/<p[^>]*>(.*?)<\/p>/is', '{{DOUBLEBREAK}}$1{{DOUBLEBREAK}}', $html );

	// Convert horizontal rules
	$html = preg_replace( '/<hr[^>]*>/i', '{{DOUBLEBREAK}}---{{DOUBLEBREAK}}', $html );

	// Strip remaining HTML tags
	$markdown = strip_tags( $html );

	// Replace placeholders with actual line breaks
	$markdown = str_replace( '{{DOUBLEBREAK}}', "\n\n", $markdown );
	$markdown = str_replace( '{{LINEBREAK}}', "\n", $markdown );

	// Clean up excessive whitespace and newlines
	$markdown = preg_replace( "/\n{3,}/", "\n\n", $markdown );
	$markdown = preg_replace( "/[ \t]+/", ' ', $markdown );

	// Clean up spaces around line breaks
	$markdown = preg_replace( "/[ \t]*\n[ \t]*/", "\n", $markdown );

	// Trim whitespace from the beginning and end
	$markdown = trim( $markdown );

	return $markdown;
}

/**
 * Get post content as Markdown with LLM-friendly context
 *
 * @param int|null $post_id The ID of the post to convert. Defaults to current post if null.
 * @return string The post content in Markdown format with metadata header and footer.
 */
function markdown_maker_get_post_markdown( $post_id = null ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	// Validate post ID
	if ( ! $post_id || $post_id <= 0 ) {
		return '';
	}

	$post = get_post( $post_id );

	if ( ! $post ) {
		return '';
	}

	// Build metadata header
	$markdown  = "---\n";
	$markdown .= 'Title: ' . get_the_title( $post ) . "\n";
	$markdown .= 'Type: ' . ucfirst( $post->post_type ) . "\n";
	$markdown .= 'Author: ' . get_the_author_meta( 'display_name', $post->post_author ) . "\n";
	$markdown .= 'Date Published: ' . get_the_date( 'Y-m-d H:i:s', $post ) . "\n";
	$markdown .= 'Last Modified: ' . get_the_modified_date( 'Y-m-d H:i:s', $post ) . "\n";
	$markdown .= 'URL: ' . get_permalink( $post ) . "\n";

	// Add categories if it's a post
	if ( $post->post_type === 'post' ) {
		$categories = get_the_category( $post_id );
		if ( $categories ) {
			$cat_names = wp_list_pluck( $categories, 'name' );
			$markdown .= 'Categories: ' . implode( ', ', $cat_names ) . "\n";
		}

		// Add tags
		$tags = get_the_tags( $post_id );
		if ( $tags ) {
			$tag_names = wp_list_pluck( $tags, 'name' );
			$markdown .= 'Tags: ' . implode( ', ', $tag_names ) . "\n";
		}
	}

	// Add excerpt if available
	if ( has_excerpt( $post_id ) ) {
		$markdown .= 'Excerpt: ' . get_the_excerpt( $post ) . "\n";
	}

	$markdown .= "---\n\n";

	// Add main title
	$markdown .= '# ' . get_the_title( $post ) . "\n\n";

	// Convert content to Markdown
	$content          = apply_filters( 'the_content', $post->post_content );
	$content_markdown = markdown_maker_html_to_markdown( $content );

	// Ensure clean connection between title and content
	if ( ! empty( $content_markdown ) ) {
		$markdown .= $content_markdown;
	}

	// Add attribution footer with clean spacing
	$markdown .= "\n\n---\n\n";
	$markdown .= "*This content was extracted from WordPress and converted to Markdown format.*\n";
	$markdown .= '*Original source: ' . get_permalink( $post ) . "*\n";
	$markdown .= '*Retrieved: ' . current_time( 'Y-m-d H:i:s' ) . '*';

	// Final cleanup - remove any remaining excessive line breaks
	$markdown = preg_replace( "/\n{3,}/", "\n\n", $markdown );
	$markdown = trim( $markdown );

	return $markdown;
}

/**
 * Generate a clean filename for the Markdown file
 *
 * @param int|null $post_id The ID of the post. Defaults to current post if null.
 * @return string The generated filename.
 */
function markdown_maker_get_filename( $post_id = null ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	// Validate post ID
	if ( ! $post_id || $post_id <= 0 ) {
		return 'markdown-export.md';
	}

	$title = get_the_title( $post_id );

	// Convert to lowercase and replace spaces with hyphens
	$filename = strtolower( $title );
	$filename = preg_replace( '/[^a-z0-9]+/', '-', $filename );
	$filename = trim( $filename, '-' );

	// Limit length
	if ( strlen( $filename ) > 50 ) {
		$filename = substr( $filename, 0, 50 );
		$filename = trim( $filename, '-' );
	}

	// Add date prefix for uniqueness
	$filename = date( 'Y-m-d' ) . '-' . $filename . '.md';

	return $filename;
}

/**
 * Generate copy to clipboard link
 *
 * @param int|null $post_id The ID of the post. Defaults to current post if null.
 * @param string   $text The link text.
 * @param string   $subtitle Optional subtitle text.
 * @param string   $class Optional additional CSS class for styling
 * @return string The HTML for the copy link
 */
function markdown_maker_copy_link( $post_id = null, $text = 'Copy as Markdown', $subtitle = '', $class = '' ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	// Validate post ID
	if ( ! $post_id || $post_id <= 0 ) {
		return '';
	}

	// Sanitize input parameters
	$text     = sanitize_text_field( $text );
	$subtitle = sanitize_text_field( $subtitle );
	$class    = sanitize_html_class( $class );

	$markdown         = markdown_maker_get_post_markdown( $post_id );
	$markdown_escaped = esc_attr( $markdown );

	// Add inline JavaScript for copy functionality
	static $script_added = false;
	$output              = '';

	if ( ! $script_added ) {
		$output      .= '<script>
        function markdownMakerCopy(postId) {
            var textarea = document.getElementById("markdown-maker-content-" + postId);
            var content = textarea.value;

            // Try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(content).then(function() {
                    alert("Markdown content copied to clipboard!");
                }).catch(function() {
                    fallbackCopy(content);
                });
            } else {
                fallbackCopy(content);
            }

            function fallbackCopy(text) {
                var tempTextarea = document.createElement("textarea");
                tempTextarea.value = text;
                tempTextarea.style.position = "fixed";
                tempTextarea.style.opacity = "0";
                document.body.appendChild(tempTextarea);
                tempTextarea.select();
                try {
                    document.execCommand("copy");
                    alert("Markdown content copied to clipboard!");
                } catch (err) {
                    alert("Failed to copy. Please try selecting and copying manually.");
                }
                document.body.removeChild(tempTextarea);
            }
        }
        </script>';
		$script_added = true;
	}

	$output .= '<textarea id="markdown-maker-content-' . esc_attr( $post_id ) . '" style="position: absolute; left: -9999px;" aria-hidden="true">' . esc_textarea( $markdown ) . '</textarea>';
	$output .= '<a href="#" onclick="markdownMakerCopy(' . esc_attr( $post_id ) . '); return false;" class="markdown-maker-copy ' . esc_attr( $class ) . '"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M140-241.54v-64.61h64.62v64.61H140Zm0-141.54v-64.61h64.62v64.61H140Zm0-141.54v-64.61h64.62v64.61H140ZM281.54-100v-64.62h64.61V-100h-64.61Zm84.61-153.85q-30.3 0-51.3-21-21-21-21-51.3v-461.54q0-30.31 21-51.31 21-21 51.3-21h341.54Q738-860 759-839q21 21 21 51.31v461.54q0 30.3-21 51.3-21 21-51.31 21H366.15Zm0-60h341.54q4.62 0 8.46-3.84 3.85-3.85 3.85-8.46v-461.54q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H366.15q-4.61 0-8.46 3.85-3.84 3.84-3.84 8.46v461.54q0 4.61 3.84 8.46 3.85 3.84 8.46 3.84ZM423.08-100v-64.62h64.61V-100h-64.61Zm-218.46 0q-26.66 0-45.64-18.98T140-164.62h64.62V-100Zm360 0v-64.62h64.61q0 26.85-18.98 45.73Q591.27-100 564.62-100ZM140-666.16q0-26.65 18.98-45.63 18.98-18.98 45.64-18.98v64.61H140Zm396.92 109.24Z"/></svg>' . esc_html( $text );
	if ( ! empty( $subtitle ) ) {
		$output .= '<span class="markdown-maker-subtitle">' . esc_html( $subtitle ) . '</span>';
	}

	$output .= '</a>';
	return $output;
}

/**
 * Generate download link
 *
 * @param int|null $post_id The ID of the post. Defaults to current post if null.
 * @param string   $text The link text.
 * @param string   $subtitle Optional subtitle text.
 * @param string   $class Optional additional CSS class for styling
 * @return string The HTML for the download link
 */
function markdown_maker_download_link( $post_id = null, $text = 'Download as Markdown', $subtitle = '', $class = '' ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	// Validate post ID
	if ( ! $post_id || $post_id <= 0 ) {
		return '';
	}

	// Sanitize input parameters
	$text     = sanitize_text_field( $text );
	$subtitle = sanitize_text_field( $subtitle );
	$class    = sanitize_html_class( $class );

	$nonce        = wp_create_nonce( 'markdown_maker_download_' . $post_id );
	$download_url = add_query_arg(
		array(
			'markdown_maker_download' => $post_id,
			'nonce'                   => $nonce,
		),
		home_url()
	);
	$output       = '<a href="' . esc_url( $download_url ) . '" class="markdown-maker-download ' . esc_attr( $class ) . '"><svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#ffffff"><path d="M480-328.46 309.23-499.23l42.16-43.38L450-444v-336h60v336l98.61-98.61 42.16 43.38L480-328.46ZM252.31-180Q222-180 201-201q-21-21-21-51.31v-108.46h60v108.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-108.46h60v108.46Q780-222 759-201q-21 21-51.31 21H252.31Z"/></svg>' . esc_html( $text );
	if ( ! empty( $subtitle ) ) {
		$output .= '<span class="markdown-maker-subtitle">' . esc_html( $subtitle ) . '</span>';
	}

	$output .= '</a>';
	return $output;
}

/**
 * Handle download requests
 *
 * @hook init
 */
function markdown_maker_handle_download() {
	if ( ! isset( $_GET['markdown_maker_download'] ) ) {
		return;
	}

	$post_id = intval( $_GET['markdown_maker_download'] );
	$nonce   = isset( $_GET['nonce'] ) ? sanitize_text_field( $_GET['nonce'] ) : '';

	// Verify nonce
	if ( ! wp_verify_nonce( $nonce, 'markdown_maker_download_' . $post_id ) ) {
		wp_die( esc_html__( 'Security check failed. Please try again.', 'markdown-maker' ) );
	}

	// Validate post ID
	if ( $post_id <= 0 ) {
		wp_die( esc_html__( 'Invalid post ID.', 'markdown-maker' ) );
	}

	// Get post
	$post = get_post( $post_id );
	if ( ! $post ) {
		wp_die( esc_html__( 'Post not found.', 'markdown-maker' ) );
	}

	// Check if post is publicly viewable
	if ( ! is_post_publicly_viewable( $post ) && ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to download this content.', 'markdown-maker' ) );
	}

	// Get markdown content
	$markdown = markdown_maker_get_post_markdown( $post_id );
	$filename = markdown_maker_get_filename( $post_id );

	// Send download headers
	header( 'Content-Type: text/markdown; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="' . sanitize_file_name( $filename ) . '"' );
	header( 'Content-Length: ' . strlen( $markdown ) );
	header( 'Cache-Control: no-cache, must-revalidate' );
	header( 'Expires: Sat, 26 Jul 1997 05:00:00 GMT' );

	// Output the markdown content - it's plain text so we can output directly
	echo $markdown;
	exit;
}
