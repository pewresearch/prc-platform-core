<?php
/**
 * Languages Taxonomy
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use InvalidArgumentException;
use LanguageDetector\LanguageDetector;
use TypeError;

/**
 * Languages Taxonomy
 *
 * @package PRC\Platform
 */
class Languages extends Taxonomies {
	/**
	 * Taxonomy name.
	 *
	 * @var string
	 */
	protected static $taxonomy = 'languages';

	/**
	 * Constructor.
	 *
	 * @param mixed $loader The loader.
	 */
	public function __construct( $loader ) {
		$loader->add_action( 'init', $this, 'register' );
		$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
	}

	/**
	 * Register the taxonomy.
	 *
	 * @hook init
	 */
	public function register() {
		$taxonomy_name = self::$taxonomy;

		$labels = array(
			'name'                       => _x( 'Languages', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Language', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Languages', 'text_domain' ),
			'all_items'                  => __( 'All Languages', 'text_domain' ),
			'parent_item'                => __( 'Parent Language', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Language:', 'text_domain' ),
			'new_item_name'              => __( 'New Language', 'text_domain' ),
			'add_new_item'               => __( 'Add New Language', 'text_domain' ),
			'edit_item'                  => __( 'Edit Languages', 'text_domain' ),
			'update_item'                => __( 'Update Language', 'text_domain' ),
			'view_item'                  => __( 'View Language', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate Languages with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove Languages', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular Languages', 'text_domain' ),
			'search_items'               => __( 'Search Languages', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No Languages', 'text_domain' ),
			'items_list'                 => __( 'Languages list', 'text_domain' ),
			'items_list_navigation'      => __( 'Languages list navigation', 'text_domain' ),
		);
		$args   = array(
			'labels'            => $labels,
			'hierarchical'      => false,
			'public'            => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => false,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		// @TODO: Add filters into modules to signal support for language taxonomy.
		$post_types = apply_filters(
			"prc_taxonomy_{$taxonomy_name}_post_types",
			array(
				'post',
				'fact-sheets',
				'fact-sheet',
				'stub',
				'decoded',
				'short-read',
			)
		);

		register_taxonomy( self::$taxonomy, $post_types, $args );
	}

	/**
	 * Detect the language of the text.
	 *
	 * @param string $text The text to detect the language of.
	 * @return string The language of the text.
	 */
	private function detect_language( string $text ) {
		$detector = new LanguageDetector();
		$language = $detector->evaluate( $text )->getLanguage();
		return $language;
	}

	/**
	 * Set the language of the post.
	 *
	 * @param int    $post_id The ID of the post.
	 * @param string $content The content of the post.
	 * @return void
	 */
	public function set_language_from_content( $post_id, $content ) {
		$content = wp_strip_all_tags( strip_shortcodes( $content ) );
		$lang    = $this->detect_language( $content );
		wp_set_object_terms( $post_id, array( $lang ), self::$taxonomy, true );
	}

	/**
	 * Schedule the language analysis.
	 *
	 * @hook prc_core_on_publish
	 * @param mixed $post The post.
	 */
	public function schedule_langauge_analysis( $post ) {
		as_enqueue_async_action( 'prc_language_analysis', array( 'post_id' => $post->ID ) );
	}

	/**
	 * Handle the scheduled language analysis.
	 *
	 * @param mixed $args The arguments.
	 */
	public function handle_scheduled_language_analysis( $args ) {
		$post_id      = $args['post_id'];
		$post_content = get_the_content( $post_id );
		if ( empty( $post_content ) ) {
			return;
		}
		return $this->set_language_from_content( $post_id, $post_content );
	}

	/**
	 * Register the endpoints.
	 *
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints The endpoints.
	 * @return mixed The endpoints.
	 */
	public function register_endpoints( $endpoints ) {
		array_push(
			$endpoints,
			array(
				'route'               => 'utils/translate/(?P<post_id>\d+)',
				'methods'             => 'GET',
				'callback'            => array( $this, 'restfully_get_post_for_translation' ),
				'args'                => array(),
				'permission_callback' => function () {
					return true;
				},
			)
		);
		return $endpoints;
	}

	/**
	 * Recursively search for block attributes and return them.
	 *
	 * @param mixed $block The block.
	 * @param array $attributes_to_return The attributes to return.
	 * @return mixed The block.
	 */
	protected function recursively_search_for_block_attrs_and_return( $block, $attributes_to_return = array() ) {
		$inner_blocks = array_key_exists( 'innerBlocks', $block ) ? $block['innerBlocks'] : null;
		$attributes   = array_key_exists( 'attributes', $block ) ? $block['attributes'] : null;

		// Return early if there are no attributes to parse.
		if ( empty( $attributes ) ) {
			return $block;
		}

		// Go through the attributes and remove any that arent in the $attributes_to_return array.
		foreach ( $attributes as $key => $value ) {
			if ( ! in_array( $key, $attributes_to_return ) ) {
				unset( $attributes[ $key ] );
			}
			// If the value is empty remove it as well.
			if ( empty( $value ) ) {
				unset( $attributes[ $key ] );
			}
		}

		// Loop through the block's innerblocks and strip out the attributes that arent included in the $attributes_to_return array but keep everything else intact.
		if ( ! empty( $inner_blocks ) ) {
			$i = 0;
			foreach ( $inner_blocks as $inner_block ) {
				$inner_blocks[ $i ] = $this->recursively_search_for_block_attrs_and_return( $inner_block, $attributes_to_return );
				++$i;
			}
			$block['innerBlocks'] = $inner_blocks;
		}

		$block['attributes'] = $attributes;

		// For cleanliness, and because I'm sure we'll be charged for empty space, remove attribute if its empty in the end.
		if ( empty( $block['attributes'] ) ) {
			unset( $block['attributes'] );
		}
		// We need to maintain at least the structure and block name to reimport so that has to remain even if the block isn't translated.

		return $block;
	}

	/**
	 * Get the post for translation.
	 *
	 * @param \WP_REST_Request $request The request.
	 * @return array The post for translation.
	 */
	public function restfully_get_post_for_translation( \WP_REST_Request $request ) {
		$post_id                          = $request->get_param( 'post_id' );
		$to_return                        = array();
		$to_return['entityId']            = $post_id;
		$to_return['entityType']          = get_post_type( $post_id );
		$to_return['entityTranslatables'] = array(
			'title'   => get_the_title( $post_id ),
			'excerpt' => get_the_excerpt( $post_id ),
			'blocks'  => $this->provide_object_for_translation( $post_id ),
		);
		return $to_return;
	}

	/**
	 * Provide the object for translation.
	 *
	 * @param int $post_id The ID of the post.
	 * @return array The object for translation.
	 */
	public function provide_object_for_translation( $post_id ) {
		$rest_endpoint        = '/vip-block-data-api/v1/posts/' . $post_id . '/blocks';
		$attributes_to_return = array(
			'content',
			'alt',
			'caption',
			'label',
		);

		// Build FacetWP rest request.
		$request = new \WP_REST_Request( 'GET', $rest_endpoint );
		// Send request.
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );
		if ( ! array_key_exists( 'blocks', $data ) ) {
			return array();
		}
		$blocks = $data['blocks'];
		$tmp    = array();
		foreach ( $blocks as $i => $block ) {
			$tmp[ $i ] = $this->recursively_search_for_block_attrs_and_return( $block, $attributes_to_return );
		}
		return $tmp;
	}
}
