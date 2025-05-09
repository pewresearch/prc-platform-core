<?php
/**
 * Housekeeping class for managing automated cleanup tasks.
 *
 * @package PRC\Platform
 * @since   1.0.0
 */

namespace PRC\Platform;

use WP_Error;
use DEFAULT_TECHNICAL_CONTACT;

/**
 * Class Housekeeping
 *
 * Handles automated cleanup tasks for the platform.
 *
 * @package PRC\Platform
 * @since   1.0.0
 */
class Housekeeping {
	/**
	 * Email address for technical contact.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $email_contact = DEFAULT_TECHNICAL_CONTACT;

	/**
	 * Number of drafts to clean up per batch.
	 *
	 * @since 1.0.0
	 * @var int
	 */
	protected static $drafts_cleanup_count = 50;

	/**
	 * The handle for this class.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	public static $handle = 'prc-platform-housekeeping';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since 1.0.0
	 * @param mixed $loader The loader instance.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class.
	 *
	 * @since 1.0.0
	 * @param mixed $loader The loader instance.
	 * @return void
	 */
	public function init( $loader = null ): void {
		if ( null !== $loader ) {
			// Clean up old drafts on a rolling 30 day basis, weekly. Move them to the trash.
			// Let WordPress handle the trash.
			$loader->add_action( 'prc_run_monthly', $this, 'monthly_drafts_cleanup' );
		}
	}

	/**
	 * Send notification about cleanup results.
	 *
	 * @since 1.0.0
	 * @return void
	 */
	public function send_notification(): void {
	}

	/**
	 * Every month we'll clean up any drafts that have not been modified in 30 days.
	 *
	 * @since 1.0.0
	 * @hook prc_run_monthly
	 * @return array{posts_cleaned: array<int>, posts_not_cleaned: array<int>} Results of the cleanup operation.
	 */
	public function monthly_drafts_cleanup(): array {
		$posts_cleaned     = array();
		$posts_not_cleaned = array();
		$sitename          = get_bloginfo( 'name' );

		$paged = 1;
		// Get all posts that are a draft and have not had their post modified 30 days from today.
		// We're going to loop through 50 of these at a time, if all is going well and the schedule and editors are doing their part we'll never have more than a dozen or so to clean up.
		do {
			$posts = get_posts(
				array(
					'post_type'      => 'any',
					'posts_per_page' => self::$drafts_cleanup_count,
					'paged'          => $paged,
					'post_status'    => array( 'draft', 'auto-draft' ),
					'fields'         => 'ids',
					'date_query'     => array(
						array(
							'column' => 'post_modified_gmt',
							'before' => '30 days ago',
						),
					),
				)
			);

			$posts_count = count( $posts );
			foreach ( $posts as $post_id ) {
				// Trash, do not delete, the post.
				$trashed_post = wp_trash_post( $post_id );
				if ( $trashed_post ) {
					$posts_cleaned[] = $trashed_post->ID;
				} else {
					$posts_not_cleaned[] = $post_id;
				}
			}
			++$paged;
		} while ( $posts_count > 0 );

		$success_list = array_map(
			function ( $post_id ) {
				return wp_sprintf(
					'<span>%s (%s)</span>',
					get_the_title( $post_id ),
					$post_id
				);
			},
			$posts_cleaned
		);

		if ( function_exists( '\PRC\Platform\Slack\send_notification' ) ) {
			$attachments = array();
			if ( ! empty( $posts_cleaned ) ) {
				$markdown_formatted_success_list = implode(
					"\n",
					array_map(
						fn( $item ) => ' - ' . $item,
						$success_list
					)
				);
				$attachments[]                   = '🗑️ The following posts were trashed: \n' . $markdown_formatted_success_list;
			}
			if ( ! empty( $posts_not_cleaned ) ) {
				$posts_not_cleaned_mesage = array_map(
					function ( $post_id ) {
						return wp_sprintf( '<a href="%s">%s (%s)</a>', get_permalink( $post_id ), get_the_title( $post_id ), (string) $post_id );
					},
					$posts_not_cleaned
				);
				$posts_not_cleaned_mesage = implode(
					"\n",
					array_map(
						fn( $item ) => ' - ' . $item,
						$posts_not_cleaned_mesage
					)
				);
				$attachments[]            = '🗑️ Failed to trash the following posts: \n' . $posts_not_cleaned_mesage;
			}
			if ( empty( $posts_cleaned ) && empty( $posts_not_cleaned ) ) {
				$attachments[] = '👍 No posts were found to be trashed 🙂. This is a good thing everyone is doing their part to keep the platform clean!';
			}
			\PRC\Platform\Slack\send_notification(
				array(
					'text'        => '🧹 PRC Platform System Notice: Monthly Draft Cleanup Results:',
					'attachments' => $attachments,
				)
			);
		}

		return array(
			'posts_cleaned'     => $posts_cleaned,
			'posts_not_cleaned' => $posts_not_cleaned,
		);
	}
}
