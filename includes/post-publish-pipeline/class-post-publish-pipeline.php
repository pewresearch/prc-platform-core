<?php
namespace PRC\Platform;
use WP_Error;

/**
 * This class provides standardized hooks for the publishing pipeline, tracking posts from init, to updates, to publish, to trash. This handy class will check for the usual caveats, like is Rest or is CLI, and will only run when it should. As a note, these hooks will not work via WP_CLI, intentionally.
 *
 * @uses prc_platform_on_post_init
 * @uses prc_platform_on_incremental_save
 * @uses prc_platform_on_publish
 * @uses prc_platform_on_rest_publish
 * @uses prc_platform_on_update
 * @uses prc_platform_on_rest_update
 * @uses prc_platform_on_unpublish
 * @uses prc_platform_on_trash
 * @uses prc_platform_on_untrash
 *
 * @package PRC\Platform
 */
class Post_Publish_Pipeline {
	public $is_cli = false;
	/**
	 * Enabled Statuses
	 *
	 * @var array
	 */
	protected $published_statuses = array( 'publish', 'hidden_from_search', 'hidden_from_index' );

	/**
	 * Post types that should be used in the global data model.
	 * @TODO we should expand this? Or maybe just make this an exclude list rather than opt in.
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
		'decoded',
		'newsletterglue',
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-post-publish-pipeline';

	/**
	 * Initialize the class and set its properties.
	 * @param mixed $version
	 * @param mixed $loader
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->is_cli = defined( 'WP_CLI' ) && \WP_CLI;
		if ( true !== $this->is_cli ) {
			// This is just an internal hook to this class, it allows us to setup and scaffold these fields and fill the data in later, allowing for a more performant API. Other parts of the platform can hook into this and add their own data but should not be used for anything other than the platform.
			add_filter( 'prc_platform_wp_post_object', array( $this, 'apply_extra_wp_post_object_fields' ), 1, 1 );
		}
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'rest_post_query', $this, 'add_post_parent_request_to_rest_api', 10, 2 );
			/**
			 * @uses prc_platform_on_incremental_save
			 */
			$loader->add_action( 'save_post', $this, 'restful_post_incremental_save_hook', 10, 3 );
			/**
			 * @uses prc_platform_on_post_init
			 */
			$loader->add_action( 'transition_post_status', $this, 'post_init_hook', 0, 3 );
			/**
			 * @uses prc_platform_on_update
			 */
			$loader->add_action( 'transition_post_status', $this, 'post_updating_hook', 99, 3 );
			/**
			 * @uses prc_platform_on_publish
			 * @uses prc_platform_on_unpublish
			 */
			$loader->add_action( 'transition_post_status', $this, 'post_saving_hook', 100, 3 );
			/**
			 * @uses prc_platform_on_trash
			 */
			$loader->add_action( 'trashed_post', $this, 'post_trashed_hook', 100, 1 );
			/**
			 * @uses prc_platform_on_untrash
			 */
			$loader->add_action( 'untrashed_post', $this, 'post_trashed_hook', 100, 2 );
			/**
			 * REST API HOOKS:
			 * @TODO: more of our functionality should be designed to work with the restful hooks as they'll be more performant and less likely to run into issues with the WP Admin as more and more of WP Admin is subsumed by the block and site editors.
			 */
			/**
			 * @uses prc_platform_on_rest_update
			 */
			$loader->add_action( 'transition_post_status', $this, 'restful_post_updating_hook', 101, 3 );
			/**
			 * @uses prc_platform_on_rest_publish
			 */
			$loader->add_action( 'transition_post_status', $this, 'restful_post_publishing_hook', 102, 3 );
		}
	}

	public function restfully_get_label($object) {
		$post_id = (int) ( array_key_exists('id', $object) ? $object['id'] : $object['ID'] );
		$post_type = get_post_type( $post_id );
		$site_id = get_current_blog_id();
		$taxonomy = 19 === $site_id ? 'category' : 'formats';

		$label = 'Report';

		$terms = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'names' ) );

		if ( ! is_wp_error( $terms ) && ! empty( $terms ) ) {
			$term_name = array_shift( $terms );
			if (is_object($term_name)) {
				$term_name = $term_name->name;
			}
			$label = ucwords( str_replace( "-", " ", $term_name ) );
		}

		// Defaults fallbacks
		if ( 'fact-sheets' === $post_type ) {
			$label = "Fact Sheet";
		} elseif ( 'interactives' === $post_type ) {
			$label = "Feature";
		} elseif ( 'quiz' === $post_type ) {
			$label = "Quiz";
		} elseif ( 'short-read' === $post_type ) {
			$label = "Short Read";
		} elseif ( 'events' === $post_type ) {
			$label = "Event";
		} elseif ( 'dataset' === $post_type ) {
			$label = "Dataset";
		} elseif ( 'newsletterglue' === $post_type ) {
			$label = "Newsletter";
		} elseif ( 'press-release' === $post_type ) {
			$label = "Press Release";
		} elseif ( 'decoded' === $post_type ) {
			$label = "Decoded";
		}

		return $label;
	}

	/**
	 * Add post_parent to rest objects.
	 * @param mixed $object
	 * @return int|false
	 */
	public function restfully_get_post_parent( $object ) {
		$post_id = (int) ( array_key_exists('id', $object) ? $object['id'] : $object['ID'] );
		return wp_get_post_parent_id( $post_id );
	}

	/**
	 * Supports querying by post_parent for "post" types in the rest api.
	 * @hook rest_post_query
	 * @param mixed $args
	 * @param mixed $request
	 * @return mixed
	 */
	public function add_post_parent_request_to_rest_api($args, $request) {
		if ( $request->get_param( 'post_parent' ) ) {
			$args['post_parent'] = $request->get_param( 'post_parent' );
		}
		return $args;
	}

	/**
	 * Get the word count for a post.
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
	 * @param mixed $object The post object.
	 * @return string $url The canonical URL for the post.
	 */
	public function restfully_get_canonical_url( $object ) {
		$post_id = (int) ( array_key_exists('id', $object) ? $object['id'] : $object['ID'] );
		$url = get_post_meta( $post_id, '_redirect', true );
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
	 * @hook rest_api_init
	 */
	public function register_rest_fields() {
		// Add label to object.
		register_rest_field(
			$this->allowed_post_types,
			'label',
			array(
				'get_callback' => array( $this, 'restfully_get_label' ),
			)
		);

		// Add post parent to object.
		register_rest_field(
			$this->allowed_post_types,
			'post_parent',
			array(
				'get_callback' => array( $this, 'restfully_get_post_parent' ),
			)
		);

		// Add word count to object.
		register_rest_field(
			$this->allowed_post_types,
			'word_count',
			array(
				'get_callback' => array( $this, 'restfully_get_word_count' ),
			)
		);

		// Add canonical url to object.
		register_rest_field(
			$this->allowed_post_types,
			'canonical_url',
			array(
				'get_callback' => array( $this, 'restfully_get_canonical_url' ),
			)
		);
	}

	/**
	 * Exposes the rest fields above ^ via PHP WP_Post objects on our internal hooks.
	 * Sometimes its best to do it (whatever that thing is) server side, this allows you the same functionality
	 * as client side operations but with the added benefit of not having to make a request to the API.
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

		if ( empty($ref_post) ) {
			return new WP_Error( 'empty_post_object', 'The $ref_post passed to apply_extra_wp_post_object_fields is empty', $ref_post );
		}

		// Return post data back as object.
		return (object) $ref_post;
	}

	public function apply_extra_wp_post_object_fields( $ref_post ) {
		$ref_post['canonical_url'] = $this->restfully_get_canonical_url( $ref_post );
		$ref_post['label']         = $this->restfully_get_label( $ref_post );

		// $art = function_exists('prc_get_art') ? prc_get_art( $ref_post['ID'] ) : false;
		// if ( ! empty( $art ) ) {
		// 	$ref_post['art'] = $art;
		// }

		$visibility = get_post_meta( $ref_post['ID'], '_postVisibility', true );
		if ( ! empty( $visibility ) ) {
			$ref_post['visibility'] = $visibility;
		}

		return $ref_post;
	}

	/**
	 * Runs often, whenever a post is saved. Ensure payloads are valid and small before sending to the API.
	 *
	 * @hook save_post
	 * @uses prc_platform_on_incremental_save
	 *
	 * @param mixed $post_id
	 * @param mixed $post
	 * @param mixed $update
	 * @return void
	 */
	public function restful_post_incremental_save_hook( $post_id, $post, $update ) {
		if ( true === $this->is_cli ) {
			return;
		}
		if ( true !== $update ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( !defined( 'REST_REQUEST' ) || true !== REST_REQUEST ) {
			return;
		}
		if ( ! in_array( $post->post_status, array( 'draft', 'publish' ) ) ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}
		if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
			return;
		}
		if ( doing_action( 'prc_platform_on_incremental_save' ) || doing_action( 'prc_platform_on_rest_publish' ) || doing_action( 'prc_platform_on_rest_update' )) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error( $ref_post ) ) {
			do_action( 'prc_platform_on_incremental_save', $ref_post );
		}
	}

	/**
	 * Runs once, when the post changes from auto-draft to draft.
	 * @hook transition_post_status
	 * @uses prc_platform_on_post_init
	 * @param [type] $new_status
	 * @param [type] $old_status
	 * @param [type] $post
	 * @return object $ref_post
	 * @uses hook/post_transition_status
	 */
	public function post_init_hook( $new_status, $old_status, $post ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( defined( 'REST_REQUEST' ) && true !== REST_REQUEST ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		if ( wp_is_post_revision( $post ) ) {
			return;
		}
		if ( doing_action( 'prc_platform_on_post_init' ) ) {
			return;
		}
		if ( true !== ('auto-draft' === $old_status && 'draft' === $new_status) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( ! is_wp_error( $ref_post ) ) {
			do_action( 'prc_platform_on_post_init', $ref_post );
		}
	}

	/**
	 * transition_post_status
	 * @param mixed $post_id
	 * @param mixed $post
	 * @param mixed $update
	 * @return void
	 */
	public function restful_post_updating_hook( $new_status, $old_status, $post ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( !defined( 'REST_REQUEST' ) || true !== REST_REQUEST ) {
			return;
		}

		if ( 'draft' === $old_status ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		// Make sure the new status IS publish and the old  IS NOT publish. We want only first time published posts.
		if ( ! in_array( $new_status, $this->published_statuses ) || wp_is_post_revision( $post ) ) {
			return;
		}
		// If we're doing a save_post action then exit early, we don't want to run this twice.
		if ( doing_action( 'save_post' ) || doing_action( 'prc_platform_on_publish' ) || doing_action( 'prc_platform_on_update' ) ) {
			return;
		}

		// If the status before or after is not in the approved statuses then exit early.
		if ( ! in_array( $new_status, $this->published_statuses ) && ! in_array( $old_status, $this->published_statuses ) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error($ref_post) ) {
			do_action( 'prc_platform_on_rest_update', $ref_post, has_blocks( $post ) );
		}
	}

	/**
	 * Runs once, when the post changes from draft to publish.
	 * @hook transition_post_status
	 */
	public function restful_post_publishing_hook( $new_status, $old_status, $post ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( !defined( 'REST_REQUEST' ) || true !== REST_REQUEST ) {
			return;
		}
		if ( 'draft' !== $old_status ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		// Make sure the new status IS publish and the old  IS NOT publish. We want only first time published posts.
		if ( ! in_array( $new_status, $this->published_statuses ) || wp_is_post_revision( $post ) ) {
			return;
		}
		// If we're doing a save_post action then exit early, we don't want to run this twice.
		if ( doing_action( 'save_post' ) || doing_action( 'prc_platform_on_publish' ) || doing_action( 'prc_platform_on_update' ) ) {
			return;
		}

		// If the status before or after is not in the approved statuses then exit early.
		if ( ! in_array( $new_status, $this->published_statuses ) && ! in_array( $old_status, $this->published_statuses ) ) {
			return;
		}
		error_log('restful_post_publishing_hook:::'.print_r(['new_status' => $new_status, 'old_status' => $old_status, 'published_statuses' => $this->published_statuses], true));

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error($ref_post) ) {
			do_action( 'prc_platform_on_rest_publish', $ref_post, has_blocks( $post ) );
		}
	}


	/**
	 * Runs often, when a post is already published and is updated.
	 * @hook transition_post_status
	 * @uses prc_platform_on_update
	 * @param [type] $new_status
	 * @param [type] $old_status
	 * @param [type] $post
	 * @return object $ref_post
	 */
	public function post_updating_hook( $new_status, $old_status, $post ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
			return;
		}
		if ( 'draft' === $old_status ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		// Make sure the new status IS publish and the old  IS NOT publish. We want only first time published posts.
		if ( ! in_array( $new_status, $this->published_statuses ) || wp_is_post_revision( $post ) ) {
			return;
		}
		// If we're doing a save_post action then exit early, we don't want to run this twice.
		if ( doing_action( 'save_post' ) || doing_action( 'prc_platform_on_publish' ) || doing_action( 'prc_platform_on_update' ) ) {
			return;
		}

		// If the status before or after is not in the approved statuses then exit early.
		if ( ! in_array( $new_status, $this->published_statuses ) && ! in_array( $old_status, $this->published_statuses ) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error($ref_post) ) {
			do_action( 'prc_platform_on_update', $ref_post, has_blocks( $post ) );
		}
	}

	/**
	 * Exposes two hooks for use across the PRC Platform.
	 * @hook transition_post_status
	 * @uses prc_platform_on_publish: Runs once, when the post status changes from draft to publish.
	 * @uses prc_platform_on_unpublish Runs once, when the post status changes from publish back to draft.
	 * @param [type] $new_status
	 * @param [type] $old_status
	 * @param [type] $post
	 * @return object $ref_post
	 * @uses hook/post_transition_status
	 */
	public function post_saving_hook( $new_status, $old_status, $post ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
			return;
		}
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}
		if ( wp_is_post_revision( $post ) ) {
			return;
		}

		if ( doing_action( 'prc_platform_on_publish' ) || doing_action( 'prc_platform_on_unpublish' ) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		// if publish is new status and none of the $this->published_statuses in array was the old status then do the action
		if ( in_array( $new_status, $this->published_statuses ) && ! in_array( $old_status, $this->published_statuses ) ) {
			if ( ! is_wp_error( $ref_post ) ) {
				do_action( 'prc_platform_on_publish', $ref_post, has_blocks( $post ) );
			}
		} else if ( in_array( $new_status, array('draft') ) && in_array( $old_status, array('publish') ) ) {
			if ( ! is_wp_error( $ref_post ) ) {
				do_action( 'prc_platform_on_unpublish', $ref_post, has_blocks( $post ) );
			}
		}
	}

	/**
	 * Runs once, when the post is trashed, very late.
	 * @hook trashed_post
	 * @uses prc_platform_on_trash
	 * @param mixed $post_id
	 * @uses hook/post_updated
	 */
	public function post_trashed_hook( $post_id ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
			return;
		}
		$post = get_post( $post_id );
		// Ensure the post is not of type stub, we don't want to run into recursion issues.
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error( $ref_post ) ) {
			do_action( 'prc_platform_on_trash', $ref_post, has_blocks( $post ) );
		}
	}

	/**
	 * Runs once, when the post is untrashed, restored from the trash.
	 * @hook untrashed_post
	 * @uses prc_platform_on_untrash
	 * @param mixed $post_id
	 * @param mixed $previous_state
	 * @uses hook/post_updated
	 */
	public function post_untrashed_hook( $post_id, $previous_state ) {
		if ( true === $this->is_cli ) {
			return;
		}
		// This will make sure this doesnt run twice on Gutenberg editor.
		if ( defined( 'REST_REQUEST' ) && true === REST_REQUEST ) {
			return;
		}
		$post = get_post( $post_id );
		// Ensure the post is not of type stub, we don't want to run into recursion issues.
		if ( ! in_array( $post->post_type, $this->allowed_post_types ) ) {
			return;
		}

		$ref_post = $this->setup_extra_wp_post_object_fields( $post );

		if ( !is_wp_error( $ref_post ) ) {
			do_action( 'prc_platform_on_untrash', $ref_post, has_blocks( $post ) );
		}
	}
}
