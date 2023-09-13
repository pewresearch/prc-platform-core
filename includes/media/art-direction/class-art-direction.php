<?php
namespace PRC\Platform;
use WP_Error;
use WP_REST_Request;

/**
 * Art Direction subsumes "Featured Image" functionality on post-like objects and
 * provides a way to store multiple "featured images" for different display contexts.
 *
 * @package
 */
class Art_Direction {
	public static $field_properties = array(
		'id'       => array(
			'type' => 'integer',
		),
		'rawUrl'   => array(
			'type' => 'string',
		),
		'url'      => array(
			'type' => 'string',
		),
		'width'    => array(
			'type' => 'integer',
		),
		'height'   => array(
			'type' => 'integer',
		),
		// "Chart Art" is a special case where we want art to have a border around it, usually a chart with a white background.
		// @TODO: look into a programattic way to determine contrast ratio when setting the image and then set this to true if the contrast ratio is too low, also, perhaps rename this to "hasBorder" or something a little more descriptive.
		'chartArt' => array(
			'type' => 'boolean',
			'default' => false,
		),
		'caption'  => array(
			'type' => 'string',
		),
	);
	/**
	 * Schema for pewresearch.org art direction.
	 * A1, A2, A3, A4, XL, facebook, and twitter are all specific contexts that appear in our blocks and themes. They are not arbitrary. Your mileage may vary.
	 * @var (string|(string|null)[][])[]|(string|(string|null)[][]|(string[]|(string|false)[])[][][])[]
	 */
	public static $field_schema = array(
		'type'       => 'object',
		'properties' => array(
			'A1'    => array(
				'type' => 'object',
				'properties' => null,
			),
			'A2'    => array(
				'type' => 'object',
				'properties' => null,
			),
			'A3'    => array(
				'type' => 'object',
				'properties' => null,
			),
			'A4'   => array(
				'type' => 'object',
				'properties' => null,
			),
			'XL'  => array(
				'type' => 'object',
				'properties' => null,
			),
			'facebook' => array(
				'type' => 'object',
				'properties' => null,
			),
			'twitter' => array(
				'type' => 'object',
				'properties' => null,
			),
		),
	);

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

	/**
	 * Handle for this plugin's assets.
	 * @var string
	 */
	protected static $handle = 'prc-platform-art-direction';

	/**
	 * Post types that will have art direction enabled.
	 * @var string[]
	 */
	public $enabled_post_types = array(
		'short-read',
		'stub',
		'post',
		'interactives',
		'interactive',
		'chart',
		'fact-sheets',
		'fact-sheet',
		'quiz',
		'mini-course'
	);

	/**
	 * Post meta key for art direction data.
	 * @var string
	 */
	protected static $post_meta_key = 'artDirection';
	/**
	 * Legacy post meta key for art direction data. (pre 2019-10-01)
	 * @var string
	 */
	protected static $legacy_post_meta_key = '_art';


	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$constructed_schema = self::$field_schema;
		foreach( $constructed_schema['properties'] as $image_size => $schema) {
			$constructed_schema['properties'][$image_size]['properties'] = self::$field_properties;
		}
		self::$field_schema = $constructed_schema;

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'art-direction/utils.php';
	}

	public function init_art_direction() {
		$this->register_art_direction_meta();
	}

	public function change_featured_image_label( $args, $post_type ) {
		if ( ! in_array( $post_type, $this->enabled_post_types, true ) ) {
			return $args;
		}
		$new_labels = array();
		if ( array_key_exists( 'labels', $args ) ) {
			$labels = $args['labels'];
			$new_labels['featured_image'] = 'Art Direction';
			$new_labels['set_featured_image'] = 'Set art image';
			$new_labels['remove_featured_image'] = 'Remove art image';
			$new_labels['use_featured_image'] = 'Use as art image';
		}
		if ( ! empty( $new_labels ) ) {
			$args['labels'] = array_merge( $labels, $new_labels );
		}
		return $args;
	}

	public function register_art_direction_meta() {
		foreach ( $this->enabled_post_types as $post_type ) {
			// New Meta
			register_post_meta(
				$post_type,
				self::$post_meta_key,
				array(
					'single'        => true,
					'type'          => 'object',
					'show_in_rest'  => array(
						'schema' => self::$field_schema,
					),
					'auth_callback' => function() {
						return current_user_can( 'edit_posts' );
					},
				)
			);

			// Legacy Meta
			register_post_meta(
				$post_type,
				self::$legacy_post_meta_key,
				array(
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'string',
					'auth_callback' => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	public function register_art_direction_rest_field() {
		foreach ( $this->enabled_post_types as $post_type ) {
			register_rest_field(
				$post_type,
				'artDirection',
				array(
					'get_callback' => array( $this, 'get_art_for_api' ),
					'schema'       => null,
				)
			);
		}
	}

	//@TODO: I'm actually torn here if this should be an endpoint or a field in the normal WP_Post request. Something to noodle on later.
	public function register_rest_endpoint() {
		register_rest_route(
			'prc-api/v2',
			'/get-art',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'restfully_get_art' ),
				'args'                => array(
					'postId' => array(
						'validate_callback' => function( $param, $request, $key ) {
							return is_string( $param );
						},
					),
				),
				'permission_callback' => function () {
					return true;
				},
			)
		);

		$this->register_art_direction_rest_field();
	}

	public function restfully_get_art( WP_REST_Request $request ) {
		$post_id = $request->get_param( 'postId' );
		$data = $this->get_art( (int) $post_id );
		return $data;
	}

	public function get_art_for_api( $object ) {
		// get the id of the post object array
		$post_id = $object['id'];
		return $this->get_art( $post_id, 'all' );
	}

	public function register_block_plugin_assets() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$asset_slug = self::$handle;
		$script_src  = plugin_dir_url( __FILE__ ) . 'build/index.js';
		$style_src  = plugin_dir_url( __FILE__ ) . 'build/style-index.css';

		$script = wp_register_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$asset_slug,
			$style_src,
			array(),
			$asset_file['version']
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( 'prc-platform-art-direction', 'Failed to register all assets' );
		}

		return true;
	}

	public function enqueue_block_plugin_assets() {
		$registered = $this->register_block_plugin_assets();
		// get the current wp admin screen and post type and ensure it is of the $this->enabled_post_types post type..
		$screen = get_current_screen();
		if ( ! $screen || ! in_array( $screen->post_type, $this->enabled_post_types, true ) ) {
			return;
		}
		if ( is_admin() && ! is_wp_error( $registered ) ) {
			wp_enqueue_script( self::$handle );
			wp_enqueue_style( self::$handle );
		}
	}

	private function get_stub_info( $stub_post_id, $needle = false ) {
		$meta = get_post_meta( $stub_post_id, '_stub_info', true );
		if ( ! $meta ) {
			return false;
		}
		if ( false !== $needle ) {
			if ( array_key_exists( $needle, $meta ) ) {
				return $meta[ $needle ];
			} else {
				return false;
			}
		} else {
			return $meta;
		}
	}

	public function filter_facebook_image( $img ) {
		if ( ! is_singular() ) {
			return $img;
		}
		global $post;
		$art = $this->get_art( $post->ID, 'facebook' );
		if ( false === $art ) {
			return $img;
		}
		return $art['url'];
	}

	public function filter_twitter_image( $img ) {
		if ( ! is_singular() ) {
			return $img;
		}
		global $post;
		$art = $this->get_art( $post->ID, 'twitter' );
		if ( false === $art ) {
			return $img;
		}
		return $art['url'];
	}

	/** Get Art and its Sub Functions */
	/** Constructs a image array based off the art direction data schema for featured images (fallback) */
	private function get_fallback_img( $post_thumbnail_id, $image_size, $full ) {
		$img = wp_get_attachment_image_src( $post_thumbnail_id, $image_size );
		return array(
			'id'       => $post_thumbnail_id,
			'rawUrl'   => $full[0],
			'url'      => $img[0],
			'width'    => $img[1],
			'height'   => $img[2],
			'chartArt' => false,
		);
	}

	private function get_fallback_art( $post_id ) {
		$post_thumbnail_id = get_post_meta( $post_id, '_thumbnail_id', true );
		if ( ! $post_thumbnail_id ) {
			return false;
		}
		$full = wp_get_attachment_image_src( $post_thumbnail_id, 'full' );
		return array(
			'A1'       => $this->get_fallback_img( $post_thumbnail_id, 'A1', $full ),
			'A2'       => $this->get_fallback_img( $post_thumbnail_id, 'A2', $full ),
			'A3'       => $this->get_fallback_img( $post_thumbnail_id, 'A3', $full ),
			'A4'       => $this->get_fallback_img( $post_thumbnail_id, 'A4', $full ),
			'XL'       => $this->get_fallback_img( $post_thumbnail_id, 'XL', $full ),
			'facebook' => $this->get_fallback_img( $post_thumbnail_id, 'facebook', $full ),
			'twitter'  => $this->get_fallback_img( $post_thumbnail_id, 'twitter', $full ),
		);
	}

	private function get_fallback_featured_image( $post_id ) {
		$post_type = get_post_type( $post_id );

		if ( 'stub' === $post_type ) {
			$stub_info = $this->get_stub_info( $post_id );
			if ( false === $stub_info ) {
				return false;
			}
			$origin_post_id = (int) $stub_info['post_id'];
			$site_id        = (int) $stub_info['site_id'];

			switch_to_blog( $site_id );
			$fallback_art = $this->get_fallback_art( $origin_post_id );
			restore_current_blog();
		} else {
			$fallback_art = $this->get_fallback_art( $post_id );
		}

		return $fallback_art;
	}

	/**
	 * Gets art direction asset(s) for a post.
	 *
	 * @param int    $post_id post id
	 * @param string $size either 'all', 'A1', 'A2', 'A3', 'A4', 'XL', 'facebook', or 'twitter'
	 * @return array
	 */
	public function get_art( $post_id, $size = 'all' ) {
		if ( ! is_int( $post_id ) ) {
			return false;
		}
		// Check the size being retrieved is allowed.
		if ( ! in_array( $size, array( 'all', 'A1', 'A2', 'A3', 'A4', 'XL', 'facebook', 'twitter' ) ) ) {
			return false;
		}
		$post_type = get_post_type( $post_id );
		// Quick check to make sure we're only utilizing this on allowed post types.
		if ( ! in_array( $post_type, $this->enabled_post_types ) ) {
			return false;
		}

		// Check if this is a child post...
		$parent_post_id = wp_get_post_parent_id( $post_id );
		if ( 0 === $parent_post_id ) {
			$parent_post_id = $post_id;
		}

		// For stub posts we need to fetch from _stub_info['_art'] for everything else we can just fetch from _art
		// Check for new post meta key artDirection.
		$all_art = get_post_meta( $parent_post_id, self::$post_meta_key, true );
		// Fallback to _art if not found.
		if ( false === $all_art || ! is_array( $all_art ) ) {
			$all_art = get_post_meta( $parent_post_id, '_art', true );
		}

		// Double checks the object data is cast as an array.
		if ( is_object( $all_art ) ) {
			$all_art = (array) $all_art;
			foreach ( $all_art as $key => $value ) {
				if ( is_object( $value ) ) {
					$all_art[ $key ] = (array) $value;
				}
			}
		}
		// Legacy data is stored asstringified JSON, check for that and decode it.
		$all_art = is_array( $all_art ) ? $all_art : json_decode( $all_art, true );
		if ( ! is_array( $all_art ) ) {
			// Check for fallback image, fallback_to_featured_image will return false explicitly.
			$all_art = $this->get_fallback_featured_image( $post_id );
		}

		if ( false === $all_art ) {
			return false;
		}

		if ( 'all' === $size ) {
			return $all_art;
		} elseif ( array_key_exists( $size, $all_art ) ) {
			return $all_art[ $size ];
		} else {
			return false;
		}
	}
}
