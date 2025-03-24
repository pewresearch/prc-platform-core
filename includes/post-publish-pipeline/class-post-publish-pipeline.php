<?php
namespace PRC\Platform;

use WP_Error;
use WP_Post;
use WP_Term;

/**
 * This class provides standardized hooks for the publishing pipeline, tracking posts from init, to updates, to publish, to trash. This handy class will check for the usual caveats, like is Rest or is CLI, and will only run when it should. As a note, these hooks will not work via WP_CLI, intentionally.
 *
 * @uses prc_platform_on_post_init
 * @uses prc_platform_on_incremental_save
 * @uses prc_platform_on_publish
 * @uses prc_platform_on_update
 * @uses prc_platform_on_unpublish
 * @uses prc_platform_on_trash
 * @uses prc_platform_on_untrash
 *
 * @package PRC\Platform
 */
class Post_Publish_Pipeline {
	/**
	 * Is this a WP CLI request
	 */
	public $is_cli = false;

	/**
	 * Is this a REST API request
	 */
	public $is_rest = false;

	/**
	 * Enabled Statuses
	 *
	 * @var array
	 */
	protected $published_statuses = array( 'publish', 'hidden_from_search', 'hidden_from_index' );

	/**
	 * Post tpyes that are allowed to be tracked by the pipeline.
	 *
	 * @var string[]
	 */
	protected $allowed_post_types = array(
		'post',
		'feature',
		'quiz',
		'fact-sheet',
		'short-read',
		'events',
		'mini-course',
		'press-release',
		'block_module',
		'collections',
	);

	/**
	 * The handle for the JS version of the pipeline.
	 */
	public static $handle = 'prc-platform-post-publish-pipeline';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $version
	 * @param mixed $loader
	 */
	public function __construct( $loader ) {
		$this->is_cli  = defined( 'WP_CLI' ) && \WP_CLI;
		$this->is_rest = defined( 'REST_REQUEST' ) && REST_REQUEST;
		if ( true !== $this->is_cli ) {
			// This is just an internal hook to this class, it allows us to setup and scaffold these fields and fill the data in later, allowing for a more performant API. Other parts of the platform can hook into this and add their own data but should not be used for anything other than the platform.
			add_filter( 'prc_platform_wp_post_object', array( $this, 'apply_extra_wp_post_object_fields' ), 1, 1 );
		}
		$this->init( $loader );
	}

	public function get_allowed_post_types() {
		$allowed_post_types = apply_filters( 'prc_platform_post_publish_pipeline_post_types', $this->allowed_post_types );
		return $allowed_post_types;
	}

	/**
	 * Initialize the class.
	 *
	 * @param mixed $loader The loader that will be used to register hooks.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_assets' );
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'rest_post_query', $this, 'add_post_parent_request_to_rest_api', 10, 2 );
			$loader->add_action( 'wp_after_insert_post', $this, 'process_post_publish_pipeline', 10, 4 );
		}
	}

	/**
	 * Fallbacks for post types that don't have a category or format.
	 *
	 * @param string $post_type
	 * @return string|false $label
	 */
	protected function label_fallbacks( $post_type = 'post' ) {
		$label = false;
		switch ( $post_type ) {
			case 'fact-sheets':
				$label = 'Fact Sheet';
				break;
			case 'interactives':
				$label = 'Feature';
				break;
			case 'quiz':
				$label = 'Quiz';
				break;
			case 'short-read':
				$label = 'Short Read';
				break;
			case 'events':
				$label = 'Event';
				break;
			case 'dataset':
				$label = 'Dataset';
				break;
			case 'newsletterglue':
				$label = 'Newsletter';
				break;
			case 'press-release':
				$label = 'Press Release';
				break;
			case 'decoded':
				$label = 'Decoded';
				break;
			case 'collections':
				$label = 'Collection';
				break;
		}
		return $label;
	}

	/**
	 * Add a label to rest objects.
	 *
	 * @param mixed $object
	 * @return string $label
	 */
	public function restfully_get_label( $object ) {
		$label = 'Report';

		$post_id   = (int) ( array_key_exists( 'id', $object ) ? $object['id'] : $object['ID'] );
		$post_type = get_post_type( $post_id );

		$taxonomy = PRC_PRIMARY_SITE_ID === get_current_blog_id() ? 'formats' : 'category';
		$terms    = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'names' ) );

		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			$term_name = array_shift( $terms );
			if ( is_object( $term_name ) ) {
				$term_name = $term_name->name;
			}
			$label = ucwords( str_replace( '-', ' ', $term_name ) );
		}

		$label = $this->label_fallbacks( $post_type ) ?? $label;

		return $label;
	}

	/**
	 * Add post_parent to rest objects.
	 *
	 * @param mixed $object
	 * @return int|false
	 */
	public function restfully_get_post_parent( $object ) {
		$post_id = (int) ( array_key_exists( 'id', $object ) ? $object['id'] : $object['ID'] );
		return wp_get_post_parent_id( $post_id );
	}

	/**
	 * Supports querying by post_parent for "post" types in the rest api.
	 *
	 * @hook rest_post_query
	 * @param mixed $args
	 * @param mixed $request
	 * @return mixed
	 */
	public function add_post_parent_request_to_rest_api( $args, $request ) {
		if ( $request->get_param( 'post_parent' ) ) {
			$args['post_parent'] = $request->get_param( 'post_parent' );
		}
		return $args;
	}

	/**
	 * Get the word count for a post.
	 *
	 * @param mixed $object
	 * @return string[]|int
	 */
	public function restfully_get_word_count( $object ) {
		$content = $object['content']['rendered'];
		$content = wp_strip_all_tags( strip_shortcodes( $content ), true );
		return str_word_count( $content );
	}

	/**
	 * Get the canonical URL for a post.
	 * If a redirect exists then return that instead, otherwise return the permalink.
	 *
	 * @param mixed $object The post object.
	 * @return string $url The canonical URL for the post.
	 */
	public function restfully_get_canonical_url( $object ) {
		$post_id = (int) ( array_key_exists( 'id', $object ) ? $object['id'] : $object['ID'] );
		$url     = get_post_meta( $post_id, '_redirect', true );
		if ( ! empty( $url ) ) {
			return $url;
		}
		return get_permalink( $post_id );
	}

	/**
	 * Register rest fields for objects.
	 * - label
	 * - post_parent
	 * - word_count
	 * - canonical_url
	 *
	 * @hook rest_api_init
	 */
	public function register_rest_fields() {
		$allowed_post_types = array_merge(
			$this->get_allowed_post_types(),
			array( 'newsletterglue' )
		);
		// Add label to object.
		register_rest_field(
			$allowed_post_types,
			'label',
			array(
				'get_callback' => array( $this, 'restfully_get_label' ),
			)
		);

		// Add post parent to object.
		register_rest_field(
			$allowed_post_types,
			'post_parent',
			array(
				'get_callback' => array( $this, 'restfully_get_post_parent' ),
			)
		);

		// Add word count to object.
		register_rest_field(
			$allowed_post_types,
			'word_count',
			array(
				'get_callback' => array( $this, 'restfully_get_word_count' ),
			)
		);

		// Add canonical url to object.
		register_rest_field(
			$allowed_post_types,
			'canonical_url',
			array(
				'get_callback' => array( $this, 'restfully_get_canonical_url' ),
			)
		);
	}

	/**
	 * Register the JS assets for the post publish pipeline:
	 */
	public function register_assets() {
		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
		$script_src = plugin_dir_url( __FILE__ ) . 'build/index.js';

		$script = wp_register_script(
			self::$handle,
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
	 * @hook enqueue_block_editor_assets
	 */
	public function enqueue_assets() {
		$registered = $this->register_assets();
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
		}
	}

	/**
	 * Exposes the rest fields above ^ via PHP WP_Post objects on our internal hooks.
	 * Sometimes its best to do it (whatever that thing is) server side, this allows you the same functionality
	 * as client side operations but with the added benefit of not having to make a request to the API.
	 *
	 * @param mixed $post_object
	 * @return object $ref_post WP_Post modified with extra fields to match the rest fields above.
	 */
	public function setup_extra_wp_post_object_fields( $post_object ) {
		if ( ! is_object( $post_object ) ) {
			return new WP_Error( 'get_post_object_extra_fields', 'The $post_object passed to get_post_object_extra_fields is not a object', $post_object );
		}

		// Transform post object into an array for safer manipulation and add additional data.
		$ref_post = (array) $post_object;

		// These are placeholders, data is loaded later using a filter, see: apply_extra_wp_post_object_fields().
		$ref_post['canonical_url'] = false;
		$ref_post['label']         = null;
		$ref_post['visibility']    = false;
		// Data is actually loaded here with the opportunity for other platform plugins to hook in and add their own data. @see post-report-package
		$ref_post = apply_filters( 'prc_platform_wp_post_object', $ref_post );

		if ( is_wp_error( $ref_post ) ) {
			return $ref_post;
		}

		if ( empty( $ref_post ) ) {
			return new WP_Error( 'empty_post_object', 'The $ref_post passed to apply_extra_wp_post_object_fields is empty', $ref_post );
		}

		// Return post data back as object.
		return (object) $ref_post;
	}

	/**
	 * Apply the extra fields to the WP_Post object for server side implementations.
	 *
	 * @param mixed $ref_post
	 * @return mixed $ref_post
	 */
	public function apply_extra_wp_post_object_fields( $ref_post ) {
		$ref_post['canonical_url'] = $this->restfully_get_canonical_url( $ref_post );
		$ref_post['label']         = $this->restfully_get_label( $ref_post );
		$visibility                = get_post_meta( $ref_post['ID'], '_postVisibility', true );
		if ( ! empty( $visibility ) ) {
			$ref_post['visibility'] = $visibility;
		}
		return $ref_post;
	}

	/**
	 * @hook wp_after_insert_post
	 */
	public function process_post_publish_pipeline( $post_id, $post_obj_now, $is_update, $post_obj_before ) {
		// Some sanity checks, we're going to make sure we're not doing an autosave, an ajax request (we don't do those), or that this post itself is an autosave, a revision, or not in the allowed post types.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) || ! in_array( $post_obj_now->post_type, $this->get_allowed_post_types() ) ) {
			return;
		}

		$prior_status   = is_object( $post_obj_before ) && property_exists( $post_obj_before, 'post_status' ) ? $post_obj_before->post_status : null;
		$current_status = $post_obj_now->post_status;

		$ref_post = $this->setup_extra_wp_post_object_fields( $post_obj_now );

		if ( ! is_wp_error( $ref_post ) ) {
			if ( false === $is_update && 'auto-draft' === $current_status && empty( $prior_status ) ) {
				// When using post_init hooks be aware all that will be returned of value is the post_id.
				do_action( 'prc_platform_on_post_init', $ref_post );
				do_action( "prc_platform_on_{$post_obj_now->post_type}_init", $ref_post );
			}
			// This runs often, after every save when a post is in draft status or in publish state.
			if ( in_array( $current_status, array( 'publish', 'draft' ) ) && in_array( $prior_status, array( 'publish', 'draft' ) ) ) {
				do_action( 'prc_platform_on_incremental_save', $ref_post );
				do_action( "prc_platform_on_{$post_obj_now->post_type}_incremental_save", $ref_post );
			}
			switch ( $current_status ) {
				case 'publish':
					if ( 'draft' === $prior_status ) {
						do_action( 'prc_platform_on_publish', $ref_post, has_blocks( $post_obj_now ) );
						do_action( "prc_platform_on_{$post_obj_now->post_type}_publish", $ref_post, has_blocks( $post_obj_now ) );
					} elseif ( 'trash' === $prior_status ) {
						do_action( 'prc_platform_on_untrash', $ref_post, has_blocks( $post_obj_now ) );
						do_action( "prc_platform_on_{$post_obj_now->post_type}_untrash", $ref_post, has_blocks( $post_obj_now ) );
					} else {
						do_action( 'prc_platform_on_update', $ref_post, has_blocks( $post_obj_now ) );
						do_action( "prc_platform_on_{$post_obj_now->post_type}_update", $ref_post, has_blocks( $post_obj_now ) );
					}
					break;
				case 'draft':
					if ( 'publish' === $prior_status ) {
						do_action( 'prc_platform_on_unpublish', $ref_post, has_blocks( $post_obj_now ) );
						do_action( "prc_platform_on_{$post_obj_now->post_type}_unpublish", $ref_post, has_blocks( $post_obj_now ) );
					} elseif ( 'trash' === $prior_status ) {
						do_action( 'prc_platform_on_untrash', $ref_post, has_blocks( $post_obj_now ) );
						do_action( "prc_platform_on_{$post_obj_now->post_type}_untrash", $ref_post, has_blocks( $post_obj_now ) );
					}
					break;
				case 'trash':
					do_action( 'prc_platform_on_trash', $ref_post, has_blocks( $post_obj_now ) );
					do_action( "prc_platform_on_{$post_obj_now->post_type}_trash", $ref_post, has_blocks( $post_obj_now ) );
					break;
			}
		}
	}
}
