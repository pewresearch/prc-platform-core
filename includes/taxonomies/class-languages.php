<?php
namespace PRC\Platform;

use InvalidArgumentException;
use LanguageDetector\LanguageDetector;
use TypeError;

class Languages extends Taxonomies {
	protected static $taxonomy = 'languages';

	public function __construct($loader) {
		$loader->add_action( 'init', $this, 'register' );
		$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoints' );
	}

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

		$post_types = apply_filters( "prc_taxonomy_{$taxonomy_name}_post_types", array(
			'post',
			'fact-sheets',
			'fact-sheet',
			'stub',
			'decoded'
		) );

		register_taxonomy( self::$taxonomy, $post_types, $args );
	}

	private function detect_language( string $text ) {
		$detector = new LanguageDetector();
		$language = $detector->evaluate( $text )->getLanguage();
		return $language;
	}

	public function set_language_from_content( $post_id, $content ) {
		$content = wp_strip_all_tags( strip_shortcodes( $content ) );
		$lang    = $this->detect_language( $content );
		wp_set_object_terms( $post_id, array( $lang ), self::$taxonomy, true );
	}

	/**
	 * @hook prc_core_on_publish
	 * @param mixed $post
	 * @return void
	 * @throws TypeError
	 * @throws InvalidArgumentException
	 */
	public function set_language_on_pub( $post ) {
		$this->set_language_from_content( $post->ID, $post->post_content );
	}

	/**
	 * @hook prc_api_endpoints
	 */
	public function register_endpoints($endpoints) {
		array_push($endpoints, array(
			'route' => 'utils/translate/(?P<post_id>\d+)',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_get_post_for_translation' ),
			'args'                => array(),
			'permission_callback' => function () {
				return true;
			},
		));
		return $endpoints;
	}

	protected function recursively_search_for_block_attrs_and_return($block, $attributes_to_return = []) {
		$inner_blocks = array_key_exists('innerBlocks', $block) ? $block['innerBlocks'] : null;
		$attributes = array_key_exists('attributes', $block) ? $block['attributes'] : null;

		// Return early if there are no attributes to parse.
		if (empty($attributes)) {
			return $block;
		}

		// go through the attributes and remove any that arent in the $attributes_to_return array
		foreach ($attributes as $key => $value) {
			if (!in_array($key, $attributes_to_return)) {
				unset($attributes[$key]);
			}
			// if the value is empty remove it as well
			if (empty($value)) {
				unset($attributes[$key]);
			}
		}

		// loop through the block's innerblocks and strip out the attributes that arent included in the $attributes_to_return array but keep everyything else intact
		if ( !empty($inner_blocks) ) {
			$i = 0;
			foreach ($inner_blocks as $inner_block) {
				$inner_blocks[$i] = $this->recursively_search_for_block_attrs_and_return($inner_block, $attributes_to_return);
				$i++;
			}
			$block['innerBlocks'] = $inner_blocks;
		}

		$block['attributes'] = $attributes;

		// for cleanliness, and because I'm sure we'll be charged for empty space, remove attribute if its empty in the end.
		if (empty($block['attributes'])) {
			unset($block['attributes']);
		}
		// we need to maintain at least the structure and block name to reimport so that has to remain even if the block isn't translated.

		return $block;
	}

	public function restfully_get_post_for_translation( \WP_REST_Request $request ) {
		$post_id = $request->get_param( 'post_id' );
		$blocks = $this->provide_object_for_translation($post_id);
		return $blocks;
	}

	public function provide_object_for_translation($post_id) {
		$rest_endpoint = '/vip-block-data-api/v1/posts/'.$post_id.'/blocks';
		$attributes_to_return = [
			'content',
			'alt',
			'caption',
			'label',
		];

		// Build FacetWP rest request.
		$request = new \WP_REST_Request( 'GET', $rest_endpoint );
		// Send request.
		$response = rest_do_request( $request );
		$server   = rest_get_server();
		$data     = $server->response_to_data( $response, false );
		if ( !array_key_exists('blocks', $data) ) {
			return [];
		}
		$blocks = $data['blocks'];
		$tmp = [];
		foreach ($blocks as $i => $block) {
			$tmp[$i] = $this->recursively_search_for_block_attrs_and_return($block, $attributes_to_return);
		}
		return $tmp;
	}

}
