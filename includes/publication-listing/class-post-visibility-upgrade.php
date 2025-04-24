<?php
/**
 * Post Visibility Upgrade
 *
 * This class handles the migration from meta-based post visibility to taxonomy-based post visibility.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Post Visibility Upgrade
 *
 * @package PRC\Platform
 */
class Post_Visibility_Upgrade {
	/**
	 * The meta key for the old post visibility status.
	 *
	 * @var string
	 */
	private const OLD_META_KEY = '_postVisibility';

	/**
	 * The taxonomy key for the new post visibility status.
	 *
	 * @var string
	 */
	private const NEW_TAXONOMY_KEY = '_post_visibility';

	/**
	 * The post types that are enabled for post visibility.
	 *
	 * @var array
	 */
	private const ENABLED_POST_TYPES = array(
		'post',
		'short-read',
		'fact-sheet',
		'feature',
		'quiz',
		'collections',
	);

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param \PRC\Platform\Loader $loader The loader instance.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the upgrade process.
	 *
	 * @param \PRC\Platform\Loader|null $loader The loader instance.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'admin_init', $this, 'maybe_run_upgrade', 10 );
			$loader->add_action( 'init', $this, 'register_old_visibility_statuses', 10 );
		}
	}

	/**
	 * Register the old visibility statuses temporarily for the upgrade process.
	 */
	public function register_old_visibility_statuses() {
		register_post_status(
			'hidden_from_search',
			array(
				'label'               => __( 'Hidden from Search', 'wp-statuses' ),
				/* translators: %s: Number of posts. */
				'label_count'         => _n_noop( 'Hidden from Search (but not index) <span class="count">(%s)</span>', 'Hidden from Search <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => true,
				'public'              => true,
				'publicly_queryable'  => true,
			)
		);

		register_post_status(
			'hidden_from_index',
			array(
				'label'               => __( 'Hidden from Index', 'wp-statuses' ),
				/* translators: %s: Number of posts. */
				'label_count'         => _n_noop( 'Hidden from Index (but not search) <span class="count">(%s)</span>', 'Hidden from Index <span class="count">(%s)</span>', 'wp-statuses' ),
				'exclude_from_search' => false,
				'public'              => true,
				'publicly_queryable'  => true,
			)
		);
	}

	/**
	 * Check if we need to run the upgrade and run it if necessary.
	 */
	public function maybe_run_upgrade() {
		$upgrade_complete = get_option( 'prc_platform_post_visibility_upgrade_complete', false );
		if ( ! $upgrade_complete ) {
			error_log( 'Running post visibility upgrade' );
			$this->run_upgrade();
			update_option( 'prc_platform_post_visibility_upgrade_complete', true );
		}
	}

	/**
	 * Run the upgrade process to migrate from meta to taxonomy.
	 */
	private function run_upgrade() {
		// Get all posts that have the old meta key.
		$args = array(
			'post_type'      => self::ENABLED_POST_TYPES,
			'posts_per_page' => -1,
			'meta_query'     => array(
				array(
					'key'     => self::OLD_META_KEY,
					'compare' => 'EXISTS',
				),
			),
		);

		$query = new \WP_Query( $args );

		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$post_id        = get_the_ID();
				$old_visibility = get_post_meta( $post_id, self::OLD_META_KEY, true );

				// Map old meta values to new taxonomy terms.
				$term_slug = $this->map_old_visibility_to_term( $old_visibility );

				if ( $term_slug ) {
					// Set the new taxonomy term.
					wp_set_object_terms( $post_id, $term_slug, self::NEW_TAXONOMY_KEY );

					// Clean up old meta.
					delete_post_meta( $post_id, self::OLD_META_KEY );
				}

				// Update the post status to published.
				wp_update_post(
					array(
						'ID'          => $post_id,
						'post_status' => 'publish',
					)
				);
			}
			wp_reset_postdata();
		}
	}

	/**
	 * Map old visibility meta values to new taxonomy terms.
	 *
	 * @param string $old_visibility The old visibility value.
	 * @return string|null The new taxonomy term slug or null if no mapping exists or if the post was public.
	 */
	private function map_old_visibility_to_term( $old_visibility ) {
		// Skip if the post was public or had no visibility setting.
		if ( empty( $old_visibility ) || 'public' === $old_visibility ) {
			return null;
		}

		$mapping = array(
			'hidden_from_search' => 'hidden-on-search',
			'hidden_from_index'  => 'hidden-on-index',
		);

		return isset( $mapping[ $old_visibility ] ) ? $mapping[ $old_visibility ] : null;
	}
}
