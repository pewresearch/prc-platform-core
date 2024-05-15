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
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			// Clean up old drafts on a rolling 30 day basis, weekly. Move them to the trash.
			// Let WordPress handle the trash.
			$loader->add_action( 'prc_run_monthly', $this, 'monthly_drafts_cleanup' );
			// Clean up quiz archetypes with less than 100 hits.
			$loader->add_action( 'prc_run_monthly', $this, 'monthly_quiz_cleanup' );
		}
	}

	/**
	 * Every month we'll clean up any drafts that have not been modified in 30 days.
	 * @hook prc_run_monthly
	 */
	public function monthly_drafts_cleanup() {
		$posts_cleaned = array();
		$posts_not_cleaned = array();
		$sitename = get_bloginfo('name');

		$paged = 1;
		// Get all posts that are a draft and have not had their post modified 30 days from today.
		// We're going to loop through 50 of these at a time, if all is going well and the schedule and editors are doing their part we'll never have more than a dozen or so to clean up.
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
				$trashed_post = wp_trash_post( $post_id );
				if ( $trashed_post ) {
					$posts_cleaned[] = $trashed_post->ID;
				} else {
					$posts_not_cleaned[] = $post_id;
				}
			}
			$paged++;
		} while ( count( $posts ) );

		$success_list = array_map(function($post_id){
			return wp_sprintf(
				'<span>%s (%s)</span>',
				get_the_title($post_id),
				$post_id
			);
		}, $posts_cleaned);
		$success_list = implode( '<br>', $success_list );

		$failure_list = array_map(function($post_id){
			return wp_sprintf(
				'<span>%s (%s)</span>',
				get_the_title($post_id),
				$post_id
			);
		}, $posts_not_cleaned);
		$failure_list = implode( '<br>', $failure_list );

		wp_mail(
			$this->email_contact,
			'🧹 PRC Platform System Notice: Weekly Draft Cleanup Results for: ' . $sitename,
			!empty($posts_cleaned) ? 'The following posts were trashed 🗑️: ' . $success_list : 'No posts were found to be trashed 🙂. This is a good thing everyone is doing their part!'
		);

		if ( !empty($posts_not_cleaned) ) {
			$posts_not_cleaned_mesage = array_map(function($post_id) { return wp_sprintf('<a href="%s">%s (%s)</a>', get_permalink($post_id), get_the_title($post_id), (string) $post_id);}, $posts_not_cleaned);
			$posts_not_cleaned_mesage = implode(', ', $posts_not_cleaned_mesage);
			wp_mail(
				$this->email_contact,
				'🧹 PRC Platform System Notice: Weekly Draft Cleanup Failures for: ' . $sitename,
				'The following posts were NOT trashed and require further inspection: ' . $failure_list
			);
		}

		return array(
			'posts_cleaned' => $posts_cleaned,
			'posts_not_cleaned' => $posts_not_cleaned,
		);
	}

	/**
	 * Every month we'll clean up any quizzes that have not been surpased 100 hits.
	 * @hook prc_run_monthly
	 * @return void
	 */
	public function monthly_quiz_cleanup() {
		$hits_threshold = apply_filters( 'prc_quiz_reset_threshold', 100, null );

		global $wpdb;
		$quiz_db_prefix = $wpdb->prefix . 'prc_quiz_';
		$table_name = $quiz_db_prefix . 'archetype';
		$query = $wpdb->query( $wpdb->prepare(
			"DELETE FROM %s WHERE hits < %d",
			$table_name,
			(int) $hits_threshold
		) );

		$query_message = is_bool($query) && $query ? 'Quiz cleanup successful.' : 'Quiz cleanup failed.';

		wp_mail(
			$this->email_contact,
			'🧹 (🎓 Quizzes) PRC Platform System Notice: Monthly Quiz Cleanup '. is_bool($query) && $query ? 'Success' : 'Failure',
			$query_message
		);
	}
}
