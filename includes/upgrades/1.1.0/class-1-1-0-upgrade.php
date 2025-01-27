<?php
namespace PRC\Platform;

class Upgrade_To_1_1_0 {
	protected $report = array();

	public function __construct() {
		$this->run();
	}

	public function identify_posts_with_popup_controller_blocks() {
		global $wpdb;
		$query = $wpdb->prepare( "SELECT ID, post_title FROM $wpdb->posts WHERE post_type != %s AND post_content LIKE %s", 'revision', '%wp:prc-block/popup-controller%' );
		$posts = $wpdb->get_results( $query, ARRAY_A );
		foreach ( $posts as $post ) {
			// We can use this to manually query later:
			update_post_meta( $post['ID'], '_prc_platform_upgrade__deprecated_blocks', 'prc-block/popup-controller' );
		}
		$reports = array_map(
			function ( $post ) {
				return $post['ID'] . ' - ' . $post['post_title'];
			},
			$posts
		);
		$this->log_report( 'prc-block/dialog', $reports );
	}

	/**
	 * This identifies all posts that currently contain a prc-block/tabs block.
	 */
	public function identify_posts_with_tabs_blocks() {
		global $wpdb;
		$query = $wpdb->prepare( "SELECT ID, post_title FROM $wpdb->posts WHERE post_type != %s AND post_content LIKE %s", 'revision', '%wp:prc-block/tabs%' );
		$posts = $wpdb->get_results( $query, ARRAY_A );
		foreach ( $posts as $post ) {
			// We can use this to manually query later:
			update_post_meta( $post['ID'], '_prc_platform_upgrade__deprecated_blocks', 'prc-block/tabs' );
		}
		$reports = array_map(
			function ( $post ) {
				return $post['ID'] . ' - ' . $post['post_title'];
			},
			$posts
		);
		$this->log_report( 'prc-block/tabs', $reports );
	}


	/**
	 * This upgrades existing collections terms to the new collection hybrid data model.
	 */
	public function upgrade_collections_terms() {
		// We need to run a blind update for every collection term, this will generate a matching collection post. We should set the date to...
		$taxonomy = 'collection';
		$terms    = get_terms(
			array(
				'taxonomy'   => $taxonomy,
				'hide_empty' => false,
			)
		);
		$report   = array();
		foreach ( $terms as $term ) {
			$term_id        = $term->term_id;
			$term_taxonomy  = $term->taxonomy;
			$parent_term_id = $term->parent;
			// Extra sanity check.
			if ( $taxonomy !== $term_taxonomy ) {
				continue;
			}
			WP_CLI::line( 'Upgrading term: ' . $term->slug );
			// Do a "blind update", this basically is an update with no changes just to trigger the save hook.
			wp_update_term(
				$term_id,
				$taxonomy,
				array(
					'description' => $term->description,
				)
			);
			update_term_meta(
				$term_id,
				'_prc_last_upgraded',
				'1.1.0'
			);
			// After the term has generated the post... let's set the post's post_status to hidden_from_index.
			$term_post = \TDS\get_related_post( $term_id, $term_taxonomy );
			if ( $term_post ) {
				$term_post->post_status = 'hidden_from_index';
				// Check if $Parent_term_id exists, and if it does, check get_related_posts for that parent term id and set the parent post id.
				if ( $parent_term_id ) {
					$parent_post = \TDS\get_related_post( $parent_term_id, $term_taxonomy );
					if ( $parent_post ) {
						$term_post->post_parent = $parent_post->ID;
					}
				}
				wp_update_post( $term_post );
			}

			$report[] = $term->slug;
		}
		$this->log_report( 'prc-platform/taxonomies/collection', $report );
	}

	public function add_new_collection_format() {
		// Add a new 'collection' term to the formats taxonomy
		wp_insert_term(
			'collection',
			'formats',
			array(
				'description' => 'A collection of related content',
				'slug'        => 'collection',
			)
		);
	}

	// Add more operations here as needed
	public function before() {
		error_log( 'Starting PRC Platform 1.1.0 upgrade' );
	}

	public function during() {
		// Update collections to the new data model.
		$this->add_new_collection_format();
		$this->upgrade_collections_terms();
		// Identify posts with deprecated blocks.
		$this->identify_posts_with_popup_controller_blocks();
		$this->identify_posts_with_tabs_blocks();
	}

	public function after() {
		update_option( 'prc_platform_version', '1.1.0' );
		$this->after_action_report();
		error_log( 'Done Running PRC Platform 1.1.0 upgrade!' );
	}

	/**
	 * A helper function to store reports of the actions taken. This will be used to generate a report at the end of the upgrade.
	 */
	public function log_report( $report_key, $report_value ) {
		$this->report[ $report_key ] = $report_value;
	}

	/**
	 * Sends an email after everything is completed to the DEFAULT_TECHINCAL_CONTACT.
	 */
	public function after_action_report() {
		$subject = 'PRC Platform 1.1 Upgrade Post-Action-Report';
		$message = 'The 1.1 upgrade has been completed. Here are the action items that need to be completed:\n\n';
		foreach ( $this->report as $report_key => $report_value ) {
			if ( 'prc-block/tabs' === $report_key ) {
				$message .= 'Block (prc-block/tabs):\n';
				$message .= implode( "\n", $report_value );
			} elseif ( 'prc-block/dialog' === $report_key ) {
				$message .= 'Block (prc-block/dialog):\n';
				$message .= $report_value;
			} elseif ( 'prc-platform/taxonomies/collections' === $report_key ) {
				$message .= 'Collections Terms Upgraded:\n';
				$message .= implode( "\n", $report_value );
			}
		}
		$to   = 'srubenstein@pewresearch.org';
		$sent = wp_mail( $to, $subject, $message );
	}

	public function run() {
		$this->before();
		$this->during();
		$this->after();
	}
}
