<?php
namespace PRC\Platform;
use WP_Error;
use DEFAULT_TECHNICAL_CONTACT;

/**
 * Let's keep things tidy! We're all working together here, right? Clealiness is next to... and all that.
 * @package PRC\Platform
 */
class Housekeeping {
	protected $email_contact = DEFAULT_TECHNICAL_CONTACT;
	protected static $drafts_cleanup_count = 50;

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-housekeeping';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	/**
	 * @hook prc_run_weekly
	 * @return void
	 */
	public function weekly_drafts_cleanup() {
		$posts_cleaned = array();
		$posts_not_cleaned = array();
		$sitename = get_bloginfo('name');

		$paged = 1;
		// Get all posts that are a draft and have not had their post modified 30 days from today.
		// We're going to loop through 50 of these at a time, if all is going well and the schedule and editors are doing there part we'll never have more than a dozen or so to clean up.
		do {
			$posts = get_posts(array(
				'post_type' => 'any',
				'posts_per_page' => self::$drafts_cleanup_count,
				'paged' => $paged,
				'post_status' => array('draft', 'auto-draft'),
				'fields' => 'ids',
				'date_query' => array(
					array(
						'column' => 'post_modified_gmt',
						'before' => '30 days ago',
					),
				),
			));
			foreach( $posts as $post_id ) {
				// Trash, do not delete, the post.
				$trashed_post = wp_delete_post( $post_id, false );
				if ( $trashed_post ) {
					$posts_cleaned[] = $trashed_post->ID;
				} else {
					$posts_not_cleaned[] = $post_id;
				}
			}
			$paged++;
		} while ( count( $posts ) );

		wp_mail(
			$this->email_contact,
			'🧹 PRC Platform System Notice: Weekly Draft Cleanup Results for: ' . $sitename,
			!empty($posts_cleaned) ? 'The following posts were trashed 🗑️: ' . array_map(function($post_id) { return wp_sprintf('<a href="%s">%s</a>', get_permalink($post_id), $post_id);}, $posts_cleaned) : 'No posts were found to be trashed 🙂. This is a good thing everyone is doing their part!'
		);

		if ( !empty($posts_not_cleaned) ) {
			wp_mail(
				$this->email_contact,
				'🧹 PRC Platform System Notice: Weekly Draft Cleanup Failures for: ' . $sitename,
				'The following posts were NOT trashed and require further inspection: ' . array_map(function($post_id) { return wp_sprintf('<a href="%s">%s</a>', get_permalink($post_id), $post_id);}, $posts_not_cleaned)
			);
		}

		return array(
			'posts_cleaned' => $posts_cleaned,
			'posts_not_cleaned' => $posts_not_cleaned,
		);
	}

	/**
	 * @hook prc_run_monthly
	 * @return void
	 */
	public function monthly_quiz_cleanup() {
		$hits_threshold = apply_filters( 'prc_quiz_reset_threshold', 100, null );

		global $wpdb;
		$table_name = $wpdb->prefix . 'prc_quiz_archetype';
		$query = $wpdb->prepare(
			"DELETE FROM $table_name WHERE hits < %d",
			(int) $hits_threshold
		);
		$result = $wpdb->query($query);
	}
}
