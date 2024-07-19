<?php
namespace PRC\Platform;
use WPCOM_VIP_CLI_Command;
use WP_CLI;
use WP_Error;
use wpcom_vip_get_page_by_title;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	/**
	 * Manage the migration of posts from one site to the new pewresearch-org.
	 */
	class Guest_Author_Commands extends WPCOM_VIP_CLI_Command {
		public function __construct() {

		}

		/**
		 * Create a new guest author.
		 * @subcommand create
		 * @synopsis --first=<first> --last=<last> [--middle=<middle>] [--dry-run]
		 */
		public function create_guest_author( $args, $assoc_args ) {
			$first_name = $assoc_args['first'];
			$middle_name = array_key_exists('middle', $assoc_args) ? ' '.$assoc_args['middle'] . ' ' : ' '; // If there is no middle name then we want to set it to a space.
			$last_name = $assoc_args['last'];
			if ( ! $first_name || ! $last_name ) {
				WP_CLI::error( '👤 🔴  First and last name are required.' );
			}
			$full_name = $first_name . $middle_name . $last_name;
			$slug = sanitize_title( $full_name );

			if ( isset( $assoc_args['dry-run'] ) ) {
				// Passing `--dry-run=false` to the command leads to the `false` value being set to string `'false'`, but casting `'false'` to bool produces `true`. Thus the special handling.
				if ( 'false' === $assoc_args['dry-run'] ) {
					$dry_run = false;
				} else {
					$dry_run = (bool) $assoc_args['dry-run'];
				}
			} else {
				$dry_run = true;
			}

			if ( $dry_run ) {
				WP_CLI::line( '👤 🛟  Running in dry-run mode, callback is disarmed.' );
			} else {
				WP_CLI::line( '👤 🔴  Callback armed and ready' );
			}

			// Check if the guest author already exists, look at the bylines taxonomy for the guest author slugified...
			$term = get_term_by( 'slug', $slug, 'bylines' );
			if ( is_a( $term, 'WP_Term' ) ) {
				WP_CLI::error( wp_sprintf('👤 🟡  Guest author "%s" already exists.', $term->name) );
			}

			if ( $dry_run ) {
				WP_CLI::line( wp_sprintf('👤 🛟  Running in dry-run mode, skipping guest author creation for "%s".', $full_name ) );
				return;
			}

			// Create the guest author...
			add_filter('tds_balancing_from_term', '__return_true');
			$term = wp_insert_term( $full_name, 'bylines', array( 'slug' => $slug ) );

			if ( !is_wp_error( $term ) ) {
				$new_term_id = $term['term_id'];
				update_term_meta( $new_term_id, 'is_guest_author', true);
				WP_CLI::success( wp_sprintf('👤 ✅  Guest author "%s" created.', $full_name ) );
				return;
			}

			WP_CLI::error( '👤 🔴  Failed to create guest author.' );
		}
	}

	WP_CLI::add_command( 'prc bylines guest-authors', '\PRC\Platform\Guest_Author_Commands' );
}
