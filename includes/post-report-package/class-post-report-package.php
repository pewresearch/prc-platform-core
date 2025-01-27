<?php
namespace PRC\Platform;

use WP_Error;
use WP_HTML_Heading_Processor;
use WP_HTML_Tag_Processor;

/**
 * Post Report Package is an all encompasing class for accessing the constructed report materials, the constructed table of contents, and the combination the report_package object.
 *
 * To access the table of contents it's recommended to use \PRC\Platform\Post_Report_Package(null, null)->get_package_chapters( $post_id );
 *
 * For the report materials it's recommended to use \PRC\Platform\Post_Report_Package(null, null)->get_report_materials( $post_id );
 *
 * @package PRC\Platform
 */
class Post_Report_Package {
	/**
	 * The post ID.
	 *
	 * @var int|null
	 */
	public $post_id = null;

	/**
	 * The handle for the post report package.
	 *
	 * @var string
	 */
	public static $handle = 'prc-platform-post-report-package';

	/**
	 * The enabled post types for the "report package".
	 *
	 * @var array
	 */
	public static $enabled_post_types = array( 'post' );

	/**
	 * The meta key for report materials.
	 *
	 * @var string
	 */
	public static $package_materials_meta_key = 'reportMaterials';
	// @TODO: change these to snake case
	// Change this to package_materials. This is more generic, as this system could be used more broadly for "attachments" or "materials" in the future for other post types, like Fact Sheet, and Press Release.

	/**
	 * The meta key for chapters.
	 *
	 * @var string
	 */
	public static $package_chapters_meta_key = 'multiSectionReport';
	// @TODO: change these to snake case to `package_chapters` * when we do this, we should also adopt the Design and larger Center-wide schema for what we call "internal" or just "chapters" to be "sections". This would require changing our current core/heading language to reflect this and mass-update the existing `isChapter` attribute to `isSection`. This should be considered before finishing the lgeacy-self-healing-system @sethrubenstein

	/**
	 * The meta key for table of contents parts.
	 *
	 * @var string
	 */
	public static $package_parts_meta_key = 'package_parts';

	/**
	 * The report materials schema properties.
	 *
	 * @var array
	 */
	public static $package_materials_schema_properties = array(
		'key'          => array(
			'type'     => 'string',
			'required' => false,
		),
		'type'         => array(
			'type'     => 'string',
			'required' => false,
		),
		'url'          => array(
			'type'     => 'string',
			'required' => false,
		),
		'label'        => array(
			'type'     => 'string',
			'required' => false,
		),
		'attachmentId' => array(
			'type'     => 'integer',
			'required' => false,
		),
		'icon'         => array(
			'type'     => 'string',
			'required' => false,
		),
	);

	/**
	 * The package chapters schema properties.
	 *
	 * @var array
	 */
	public static $chapters_schema_properties = array(
		'key'    => array(
			'type' => 'string',
		),
		'postId' => array(
			'type' => 'integer',
		),
	);

	/**
	 * The package parts schema properties.
	 *
	 * @var array
	 */
	public static $toc_parts_schema_properties = array(
		'key'   => array(
			'type'     => 'string',
			'required' => false,
		),
		'items' => array(
			'type'     => 'array',
			'required' => false,
		),
		'label' => array(
			'type'     => 'string',
			'required' => false,
		),
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Construct the "report package" class.
	 *
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		if ( ! class_exists( 'WP_HTML_Heading_Processor' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'class-wp-html-heading-processor.php';
		}
		require_once plugin_dir_path( __FILE__ ) . 'class-pagination.php';
		$this->init( $loader );
	}

	/**
	 * Initialize the hooks.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_meta_fields' );
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_panel_assets' );
			$loader->add_action( 'prc_platform_on_incremental_save', $this, 'set_child_posts', 10, 1 );
			$loader->add_action( 'prc_platform_on_update', $this, 'update_children', 10, 1 );
			$loader->add_filter( 'rest_post_query', $this, 'hide_chapter_posts_restfully', 10, 2 );
			$loader->add_filter( 'prc_platform_rewrite_query_vars', $this, 'register_query_var' );
			$loader->add_action( 'pre_get_posts', $this, 'filter_pre_get_posts', 10, 1 );
			$loader->add_filter( 'prc_platform_pub_listing_default_args', $this, 'hide_back_chapter_on_non_inherited_query_loops', 9, 1 );
			$loader->add_filter( 'the_title', $this, 'indicate_chapter_post', 10, 2 );
			$loader->add_filter(
				'get_next_post_where',
				$this,
				'filter_next_post',
				10,
				5
			);
			$loader->add_filter(
				'get_previous_post_where',
				$this,
				'filter_prev_post',
				10,
				5
			);
		}
	}

	/**
	 * Register the UI panel assets for this block editor plugin.
	 *
	 * @hook enqueue_block_editor_assets
	 * @return WP_Error|true
	 */
	public function register_panel_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$asset_slug = self::$handle;
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register all assets' );
		}

		return true;
	}

	/**
	 * Enqueue the assets for this block editor plugin.
	 *
	 * @hook enqueue_block_editor_assets
	 * @return void
	 */
	public function enqueue_panel_assets() {
		$registered = $this->register_panel_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			$screen = get_current_screen();
			if ( in_array( $screen->post_type, self::$enabled_post_types ) ) {
				wp_enqueue_script( self::$handle );
			}
		}
	}

	/**
	 * Given a post_id, return parent's ID if this post is a child.
	 *
	 * @param int $post_id
	 * @return int
	 */
	public function get_package_post_id( int $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( 0 !== $parent_id && is_int( $parent_id ) ) {
			$post_id = $parent_id;
		}
		return $post_id;
	}

	/**
	 * Determine if this post is in a post-package.
	 *
	 * @param int $post_id The post ID to check if it is considered a chapter of a post-package.
	 * @return bool
	 */
	public function is_chapter_of_post_package( int $post_id ) {
		$post_id = $this->get_package_post_id( $post_id );
		if ( ! empty( get_post_meta( $post_id, self::$package_chapters_meta_key, true ) ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Determine if this post is the parent, the package post.
	 *
	 * @param int $post_id The post ID to check if it is considered the main package post.
	 * @return bool
	 */
	public function is_post_package( int $post_id ) {
		$parent_id    = wp_get_post_parent_id( $post_id );
		$package_data = get_post_meta( $post_id, self::$package_chapters_meta_key, true );
		if ( 0 === $parent_id && ! empty( $package_data ) ) {
			return true;
		}
		return false;
	}


	/**
	 * Register URL query var to show package "chapter" posts in a publication listing query.
	 *
	 * @hook prc_platform_rewrite_query_vars
	 *
	 * @param mixed $query_vars The query vars.
	 * @return mixed
	 */
	public function register_query_var( $query_vars ) {
		$query_vars[] = 'showPackageChapterPosts';
		return $query_vars;
	}

	/**
	 * Add appropriate post_status arguments to restful queries on the backend.
	 *
	 * @hook rest_post_query
	 * @param mixed $args
	 * @param mixed $request
	 * @return void
	 */
	public function hide_chapter_posts_restfully( $args, $request ) {
		$referer = $request->get_header( 'referer' );
		// Break up the referer into its url params.
		$referer       = wp_parse_url( $referer );
		$referer_query = array_key_exists( 'query', $referer ) ? $referer['query'] : '';
		$referer_query = wp_parse_args( $referer_query );
		$post_type     = array_key_exists( 'postType', $referer_query ) ? $referer_query['postType'] : '';
		$post_id       = array_key_exists( 'postId', $referer_query ) ? $referer_query['postId'] : '';

		$is_publication_listing = $request->get_param( 'isPubListingQuery' );

		// @TODO: Inspect.
		$allowed_ids = array(
			'prc-block-theme//index',
			'prc-block-theme//home',
			'prc-block-theme//category',
		);

		if ( ( 'wp_template' === $post_type && in_array( $post_id, $allowed_ids ) ) || $is_publication_listing ) {
			$args['post_parent'] = 0;
		}

		return $args;
	}

	/**
	 * This is a simple filter that ensures queries with no search term do not exceed past the post_parent. This is to ensure that chapters are not shown in queries, by default.
	 *
	 * @hook prc_platform_pub_listing_default_args
	 *
	 * @param mixed $query The query args.
	 * @return array
	 */
	public function hide_back_chapter_on_non_inherited_query_loops( $query ) {
		if ( empty( $query['s'] ) ) {
			$query['post_parent'] = 0;
		}
		return $query;
	}

	/**
	 * Hide "Chapters" posts from our publication listing queries. (set post_parent to 0)
	 * Can be overridden by setting ?showPackageChapterPosts query var to truthy value.
	 * Runs on these queries:
	 * - archive
	 * - taxonomy
	 * - homepage/frontpage
	 *
	 * @hook pre_get_posts
	 */
	public function filter_pre_get_posts( $query ) {
		if ( is_admin() ) {
			return;
		}
		$show_chapters_in_query = get_query_var( 'showPackageChapterPosts', false );
		$show_chapters_in_query = rest_sanitize_boolean( $show_chapters_in_query );
		if ( true === $query->get( 'isPubListingQuery' ) && false === $show_chapters_in_query ) {
			$query->set( 'post_parent', 0 );
		}
	}

	/**
	 * Modify the post title to include an em dash before the title if this post is a child and part of a post-package.
	 *
	 * @hook the_title
	 *
	 * @param title The title.
	 * @param post_id The post ID.
	 * @return string The modified title.
	 */
	public function indicate_chapter_post( $title, $post_id = null ) {
		// Sanity check.
		if ( ! function_exists( 'get_current_screen' ) ) {
			return $title;
		}

		// If we're not in admin or if our post_id isn't set return title.
		if ( ! is_admin() || null === $post_id ) {
			return $title;
		}

		$screen = get_current_screen();
		if ( ! $screen || 'edit' !== $screen->parent_base ) {
			return $title;
		}

		if ( ! in_array( get_post_type( $post_id ), self::$enabled_post_types ) ) {
			return $title;
		}

		// Add an em dash to the title if this post is a child and part of a post-package.
		if ( 0 !== wp_get_post_parent_id( $post_id ) && true === $this->is_chapter_of_post_package( $post_id ) ) {
			$title = '&mdash; ' . $title;
		}

		return $title;
	}

	/**
	 * When this post changes the children should also change to match for specific items (namely taxonomy, post_date, post_status)
	 *
	 * @hook prc_platform_on_update
	 * @return void
	 */
	public function update_children( $post ) {
		if ( ! in_array( $post->post_type, self::$enabled_post_types ) ) {
			return;
		}
		$parent_post_id = wp_get_post_parent_id( $post->ID );
		// If this is a child post, return early.
		if ( 0 !== $parent_post_id ) {
			return;
		}
		$post_id  = $post->ID;
		$children = $this->get_child_ids( $post_id );
		// If there are no children, return early.
		if ( empty( $children ) ) {
			return;
		}

		$available_taxonomies       = get_object_taxonomies( $post->post_type );
		$parent_post_taxonomy_terms = array();
		foreach ( $available_taxonomies as $taxonomy ) {
			$parent_post_taxonomy_terms[ $taxonomy ] = wp_get_post_terms( $post_id, $taxonomy, array( 'fields' => 'ids' ) );
		}
		$parent_post_status = get_post_status( $post_id );
		$parent_post_date   = get_post_field( 'post_date', $post_id );

		$errors  = array();
		$success = array();

		foreach ( $children as $child_id ) {
			$new_updates = array(
				'ID'          => $child_id,
				'post_status' => $parent_post_status,
				'post_date'   => $parent_post_date,
			);

			// Update the child post to match the parent post.
			$child_updated = wp_update_post( $new_updates, true );

			$terms_updated = false;
			if ( ! is_wp_error( $child_updated ) ) {
				foreach ( $parent_post_taxonomy_terms  as $taxonomy => $terms ) {
					$terms_updated = wp_set_post_terms( $child_updated, $terms, $taxonomy );
				}
			}

			if ( is_wp_error( $child_updated ) ) {
				$errors[] = new WP_Error( 'post-report-package::failed-to-update-child-post-state', 'Failed to update child post state.', $child_updated );
			} else {
				$success[] = $child_updated;
			}
			if ( is_wp_error( $terms_updated ) ) {
				$errors[] = new WP_Error( 'post-report-package::failed-to-update-child-post-terms', 'Failed to update child post terms.', $terms_updated );
			}
		}

		$to_return = array(
			'success' => $success,
			'errors'  => $errors,
		);

		return $to_return;
	}

	/**
	 * Assigns a child post to a parent post.
	 *
	 * @param int $child_post_id
	 * @param int $parent_post_id
	 *
	 * @return int|WP_Error
	 */
	public function assign_child_to_parent( $child_post_id, $parent_post_id ) {
		$updated = wp_update_post(
			array(
				'ID'          => $child_post_id,
				'post_parent' => $parent_post_id,
			),
			true
		);
		if ( is_wp_error( $updated ) ) {
			return new WP_Error( 'post-report-package::failed-to-assign-child', 'Failed to assign child post to parent.', $updated );
		}
		return $updated;
	}

	/**
	 * On incremental saves assigns the child posts to the parent.
	 *
	 * @hook prc_platform_on_incremental_save
	 * @param mixed $post
	 * @return void
	 */
	public function set_child_posts( $post ) {
		if ( 'post' !== $post->post_type && 0 !== wp_get_post_parent_id( $post->ID ) ) {
			return;
		}
		$errors   = array();
		$success  = array();
		$chapters = get_post_meta( $post->ID, self::$package_chapters_meta_key, true );
		if ( empty( $chapters ) ) {
			return;
		}
		foreach ( $chapters as $chapter ) {
			$assigned = $this->assign_child_to_parent( $chapter['postId'], $post->ID );
			if ( is_wp_error( $assigned ) ) {
				$errors[] = $assigned;
			} else {
				$success[] = $assigned;
			}
		}
		// we should run through successes and do the updates then...
		return array(
			'success' => $success,
			'errors'  => $errors,
		);
	}

	/**
	 * Get the children for a given post.
	 *
	 * @param int $post_id
	 * @return array
	 */
	public function get_child_ids( $post_id ) {
		$child_posts = get_post_meta( $post_id, self::$package_chapters_meta_key, true );
		if ( empty( $child_posts ) ) {
			return array();
		}
		return array_map(
			function ( $child ) {
				return $child['postId'];
			},
			$child_posts
		);
	}

	/**
	 * Register the rest fields for the post report package constiuent parts (report materials, report pagination, toc, parent info).
	 * This is used in the interface and wherever useEntityProp is referencing report package data.
	 */
	public function register_rest_fields() {
		// Register the quick Table of Contents field for all public posts types.
		$public_post_types = get_post_types(
			array(
				'public' => true,
			)
		);
		foreach ( $public_post_types as $post_type ) {
			register_rest_field(
				$post_type,
				'table_of_contents',
				array(
					'get_callback' => array( $this, 'get_table_of_contents_field' ),
					'description'  => 'The table of contents for this post.',
				)
			);
		}

		// Register the other constiuent fields for the report package.
		register_rest_field(
			'post',
			'report_materials',
			array(
				'get_callback' => array( $this, 'get_report_materials_field' ),
				'description'  => 'The full report package; materials and chapters.',
			)
		);

		register_rest_field(
			'post',
			'report_pagination',
			array(
				'get_callback' => array( $this, 'get_report_pagination_field' ),
				'description'  => 'Pagination for report packages.',
			)
		);

		/**
		 * @TODO: We should move this somewhere more genreal...
		 */
		register_rest_field(
			'post',
			'parent_info',
			array(
				'get_callback' => array( $this, 'get_parent_info_field' ),
				'description'  => 'Parent info for a child post',
			)
		);
	}

	/**
	 * Register the meta fields for the post report package constiuent parts (report materials, back chapters, and TOC parts).
	 */
	public function register_meta_fields() {
		// Report Materials.
		register_post_meta(
			'post',
			self::$package_materials_meta_key,
			array(
				'single'            => true,
				'type'              => 'array',
				'description'       => 'Array of package materials.',
				'show_in_rest'      => array(
					// This sanitizes the data, making sure empty keys are removed.
					'prepare_callback' => function ( $value, $rest_request ) {
						$procssed = array();
						foreach ( $value as $obj ) {
							$keys = array_keys( $obj );
							foreach ( $keys as $key ) {
								if ( empty( $obj[ $key ] ) ) {
									unset( $obj[ $key ] );
								}
							}
							$procssed[] = $obj;
						}
						return $procssed;
					},
					'schema'           => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$package_materials_schema_properties,
						),
					),
				),
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);

		// Chapters.
		register_post_meta(
			'post',
			self::$package_chapters_meta_key,
			array(
				'single'            => true,
				'type'              => 'array',
				'description'       => 'Array of chapter objects.',
				'show_in_rest'      => array(
					'schema' => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$chapters_schema_properties,
						),
					),
				),
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);

		// TOC "Parts".
		register_post_meta(
			'post',
			self::$package_parts_meta_key . '__enabled',
			array(
				'single'            => true,
				'type'              => 'boolean',
				'description'       => 'Whether the TOC parts are enabled.',
				'show_in_rest'      => true,
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);
		register_post_meta(
			'post',
			self::$package_parts_meta_key,
			array(
				'single'            => true,
				'type'              => 'array',
				'description'       => 'Array of TOC parts.',
				'show_in_rest'      => array(
					'schema' => array(
						'items' => array(
							'type'       => 'object',
							'properties' => self::$toc_parts_schema_properties,
						),
					),
				),
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
				'revisions_enabled' => true,
			)
		);
	}

	/**
	 * Gets the dataset terms for the given post and then constructs an array of dataset objects for inclusion in report materials.
	 *
	 * @param int $post_id
	 * @return array
	 */
	public function get_datasets_for_post( $post_id ) {
		// get the dataset terms for this post...
		$datasets = wp_get_post_terms( $post_id, 'datasets' );
		return array_map(
			function ( $dataset ) {
				return array(
					'type'  => 'dataset',
					'id'    => $dataset->term_id,
					'label' => $dataset->name,
					'url'   => get_term_link( $dataset ),
				);
			},
			$datasets
		);
	}

	/**
	 * Get the report materials for a given post.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_report_materials( $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( 0 != $parent_id ) {
			$post_id = $parent_id;
		}

		$datasets = $this->get_datasets_for_post( $post_id );

		$materials = get_post_meta( $post_id, self::$package_materials_meta_key, true );

		if ( ! empty( $datasets ) && ! empty( $materials ) && is_array( $materials ) ) {
			$materials = array_merge( $materials, $datasets );
		}

		if ( true == get_query_var( 'printEngineBeta', false ) ) {
			$materials = array_merge(
				$materials,
				array(
					array(
						'type'  => 'printEngineBeta',
						'label' => 'Print Engine (Beta)',
						'url'   => get_permalink( $post_id ) . '?print=true&printEngineBeta=true',
					),
				)
			);
		}

		return $materials;
	}

	/**
	 * Helper function to construct a chapter.
	 *
	 * @param int $chapter_id
	 * @return array
	 */
	protected function construct_chapter( $chapter_id, $requesting_id ) {
		return array(
			'id'        => $chapter_id,
			'title'     => html_entity_decode( get_the_title( $chapter_id ) ),
			'slug'      => get_post_field( 'post_name', $chapter_id ),
			'link'      => get_permalink( $chapter_id ),
			'is_active' => $chapter_id === $requesting_id,
		);
	}

	/**
	 * This function structures raw multiSectionReport and package_parts data.
	 * First it checks for if we have package parts or not. If not then it assumes this is a simple report and returns the chapters.
	 *
	 * @param int $parent_id The parent post id.
	 * @param int $current_post_id The current post id.
	 * @return array
	 */
	protected function parse_toc( $parent_id, $current_post_id ) {
		$package_parts        = get_post_meta( $parent_id, 'package_parts', true );
		$chapters             = get_post_meta( $parent_id, 'multiSectionReport', true );
		$chapters_not_in_part = array();
		// We need to get all the chapters by their postId value and put them in the parts on the items array if the existign parts items array of postIds contains the chapter postId.
		// If there are no package_parts, just return the chapters with their titles.
		$toc_items = array();
		if ( empty( $package_parts ) && ! empty( $chapters ) ) {
			$toc_items = array_map(
				function ( $chapter ) use ( $current_post_id ) {
					$chapter['label']     = html_entity_decode( get_the_title( $chapter['postId'] ) );
					$chapter['url']       = get_permalink( $chapter['postId'] );
					$chapter['is_active'] = $chapter['postId'] === $current_post_id;
					$chapter['sections']  = array();
					return $chapter;
				},
				$chapters
			);
		} elseif ( ! empty( $package_parts ) && ! empty( $chapters ) ) {
			// Start the toc_items array with the package_parts.
			// Add the selected chapters from part.items to part.chapters.
			$toc_items = array_map(
				function ( $part ) use ( $chapters ) {
					$part['sections'] = array();
					$part['chapters'] = array_values(
						array_filter(
							$chapters,
							function ( $chapter ) use ( $part ) {
								return array_key_exists( 'items', $part ) && in_array( $chapter['postId'], $part['items'] );
							}
						)
					);
					return $part;
				},
				$package_parts
			);
			// Add a label to each chapter in a part. Uses the postId of the chapter to get the title.
			$toc_items = array_map(
				function ( $part ) use ( $current_post_id ) {
					$part['chapters'] = array_map(
						function ( $chapter ) use ( $current_post_id ) {
							$chapter['label']     = html_entity_decode( get_the_title( $chapter['postId'] ) );
							$chapter['url']       = get_permalink( $chapter['postId'] );
							$chapter['is_active'] = $chapter['postId'] === $current_post_id;
							$chapter['sections']  = array();
							return $chapter;
						},
						$part['chapters']
					);
					return $part;
				},
				$toc_items
			);
			// Make the $parts add a 'url' property and make it point to the first chapter in the part.
			$toc_items = array_map(
				function ( $part ) {
					// Make the url point to the first chapter.
					$part['url'] = $part['chapters'][0]['url'];
					// This part is active if any of the chapters are active.
					$part['is_active'] = array_reduce(
						$part['chapters'],
						function ( $carry, $chapter ) {
							return $carry || $chapter['is_active'];
						},
						false
					);
					return $part;
				},
				$toc_items
			);

			// Now we need to find all the chapters that are "unattached" to a package part.
			$chapters_not_in_part = array_values(
				array_filter(
					$chapters,
					function ( $chapter ) use ( $toc_items ) {
							$chapter_in_part = array_reduce(
								$toc_items,
								function ( $carry, $part ) use ( $chapter ) {
									return $carry || in_array( $chapter['postId'], $part['items'] );
								},
								false
							);
							return ! $chapter_in_part;
					}
				)
			);
			// Remap the unattached chapter so each item matches the structure of the package parts (label, url, is_active, sections, items, chapters)...
			$chapters_not_in_part = array_map(
				function ( $chapter ) use ( $current_post_id ) {
					$chapter['key']       = 'unattachedPackagePart_' . $chapter['postId'];
					$chapter['label']     = html_entity_decode( get_the_title( $chapter['postId'] ) );
					$chapter['url']       = get_permalink( $chapter['postId'] );
					$chapter['is_active'] = $chapter['postId'] === $current_post_id;
					$chapter['sections']  = array();
					$chapter['items']     = array();
					$chapter['chapters']  = array();
					return $chapter;
				},
				$chapters_not_in_part
			);
		}

		// Finally, we always add the package root to the toc_items array.
		$package_root        = array(
			'key'       => 'unattachedPackagePart_' . $parent_id,
			'label'     => html_entity_decode( get_the_title( $parent_id ) ),
			'url'       => get_permalink( $parent_id ),
			'postId'    => $parent_id,
			'is_active' => $parent_id === $current_post_id,
			'items'     => array(),
			'chapters'  => array(),
			'sections'  => array(),
		);
		$unattached_chapters = array(
			$package_root,
			...$chapters_not_in_part,
		);
		// Sanity Check: Ensure our inputs are arrays.
		if ( ! is_array( $unattached_chapters ) ) {
			$unattached_chapters = array();
		}
		if ( ! is_array( $toc_items ) ) {
			$toc_items = array();
		}
		// Add unattached_chapters to the beginning of the toc_items array.
		$toc_items = array_merge( $unattached_chapters, $toc_items );
		// Reset the indexes of the array.
		$toc_items = array_values( $toc_items );

		return $toc_items;
	}

	/**
	 * Get the chapters for a given post package.
	 * If a child id is given, the package will be referenced from the parent.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_chapters( $parent_id, $post_id ) {
		$chapters = get_post_meta( $parent_id, self::$package_chapters_meta_key, true );

		if ( empty( $chapters ) ) {
			return array();
		}

		$formatted_chapters = array();

		foreach ( $chapters as $chapter ) {
			$chapter_id           = $chapter['postId'];
			$formatted_chapters[] = $this->construct_chapter( $chapter_id, $post_id );
		}

		return $formatted_chapters;
	}

	/**
	 * Gets the full list of chapters for a given post-package.
	 * This includes chapters as well as the parent post.
	 *
	 * @param mixed $post_id The post ID to get the chapters for.
	 * @return array
	 */
	public function get_package_chapters( $post_id ) {
		$parent_id = $this->get_package_post_id( $post_id );
		$chapters  = $this->get_chapters( $parent_id, $post_id );

		if ( empty( $chapters ) ) {
			return array();
		}

		$package_root = $this->construct_chapter( $parent_id, $post_id );

		$constructed_toc = array_merge(
			array(
				$package_root,
			),
			$chapters
		);

		return $constructed_toc;
	}

	/**
	 * Get the post-package pagination for a given post.
	 * The pagination walker/class is in the block library.
	 *
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_pagination( $post_id ) {
		$items      = $this->get_package_chapters( $post_id );
		$pagination = new \PRC\Platform\Blocks\Pagination( $items );
		$to_return  = array(
			'current_post'     => $pagination->get_current_item(),
			'next_post'        => $pagination->get_next_item(),
			'previous_post'    => $pagination->get_previous_item(),
			'pagination_items' => $pagination->get_items(),
		);
		return $to_return;
	}

	/**
	 * Get the table of contents for a given post.
	 *
	 * @param $object
	 * @return array
	 */
	public function get_table_of_contents_field( $object ) {
		$post_id = $object['id'];
		return $this->get_package_chapters( $post_id );
	}

	/**
	 * Get the report materials for a given post.
	 *
	 * @param $object
	 * @return array
	 */
	public function get_report_materials_field( $object ) {
		$post_id = $object['id'];
		return $this->get_report_materials( $post_id );
	}

	/**
	 * Get the report pagination for a given post.
	 *
	 * @param $object
	 * @return array
	 */
	public function get_report_pagination_field( $object ) {
		$post_id = $object['id'];
		return $this->get_pagination( $post_id );
	}

	/**
	 * Get the parent info for a given post.
	 *
	 * @param $object
	 * @return array
	 */
	public function get_parent_info_field( $object ) {
		$post_id   = $object['id'];
		$parent_id = $this->get_package_post_id( $post_id );
		return array(
			'parent_title' => get_the_title( $parent_id ),
			'parent_id'    => $parent_id,
		);
	}

	/**
	 * Helper function for getting the "adjacent" post in a post-package.
	 *
	 * @param mixed  $where
	 * @param mixed  $post
	 * @param string $adjacent
	 * @return mixed
	 */
	private function filter_adjacent_post( $where, $post, $adjacent = 'next_post' ) {
		$is_post_report_package = $this->is_chapter_of_post_package( $post->ID );
		if ( ! $is_post_report_package ) {
			return $where;
		}

		$pagination = $this->get_pagination( $post->ID );
		$next_post  = $pagination[ $adjacent ];

		if ( ! $next_post ) {
			return $where;
		}
		global $wpdb;
		$where = $wpdb->prepare( 'WHERE p.ID = %s AND p.post_type = %s', $next_post['id'], $post->post_type );
		return $where;
	}

	/**
	 * @hook get_next_post_where
	 * @param mixed $where
	 * @param mixed $in_same_term
	 * @param mixed $excluded_terms
	 * @param mixed $taxonomy
	 * @param mixed $post
	 * @return mixed
	 */
	public function filter_next_post( $where, $in_same_term, $excluded_terms, $taxonomy, $post ) {
		return $this->filter_adjacent_post( $where, $post, 'next_post' );
	}

	/**
	 * @hook get_previous_post_where
	 * @param mixed $where
	 * @param mixed $in_same_term
	 * @param mixed $excluded_terms
	 * @param mixed $taxonomy
	 * @param mixed $post
	 * @return mixed
	 */
	public function filter_prev_post( $where, $in_same_term, $excluded_terms, $taxonomy, $post ) {
		return $this->filter_adjacent_post( $where, $post, 'previous_post' );
	}

	public function generate_json_schema_of_toc( $post_id ) {
		// Get the toc items for the $post_id and provide the json/ld schema.json for the toc.
		$toc       = $this->get_package_chapters( $post_id );
		$items     = array_map(
			function ( $item ) {
				return array(
					'@type'    => 'ListItem',
					'position' => 1,
					'item'     => array(
						'@id'  => $item['link'],
						'name' => $item['title'],
					),
				);
			},
			$toc
		);
		$to_return = array(
			'@context'        => 'https://schema.org',
			'@type'           => 'BreadcrumbList',
			'itemListElement' => $items,
		);
		return $to_return;
	}
}
