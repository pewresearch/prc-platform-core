<?php
/**
 * Publication context for AI title and excerpt prompts.
 *
 * @package PRC\Platform
 */

declare( strict_types=1 );

namespace PRC\Platform;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build additional context fields from post publication timing (for LLM prompts).
 *
 * @param \WP_Post $post Post object.
 * @return array<string, string> Keyed lines merged into get_post_context-style arrays.
 */
function prc_ai_publication_context_lines( \WP_Post $post ): array {
	$draft_last_modified = get_post_modified_time( 'Y-m-d', false, $post );
	if ( ! is_string( $draft_last_modified ) ) {
		$draft_last_modified = '';
	}

	$status = $post->post_status;
	if ( 'future' === $status ) {
		$scheduled_local = get_post_time( 'Y-m-d H:i', false, $post );
		if ( ! is_string( $scheduled_local ) || '' === $scheduled_local ) {
			$scheduled_local = $post->post_date;
		}
		$scheduled_or_published = 'Scheduled for: ' . $scheduled_local;
	} elseif ( 'publish' === $status ) {
		$pub_date = get_post_time( 'Y-m-d', false, $post );
		if ( ! is_string( $pub_date ) || '' === $pub_date ) {
			$pub_date = $post->post_date;
		}
		$scheduled_or_published = 'Published: ' . $pub_date;
	} else {
		$scheduled_or_published = 'Not scheduled (draft or pending)';
	}

	$lines = array(
		'draft_last_modified'    => $draft_last_modified,
		'scheduled_or_published' => $scheduled_or_published,
	);

	/**
	 * Filters publication context lines appended to AI title/excerpt prompts.
	 *
	 * @param array<string, string> $lines Keyed context values.
	 * @param \WP_Post              $post  Post object.
	 */
	return apply_filters( 'prc_ai_publication_context_lines', $lines, $post );
}
