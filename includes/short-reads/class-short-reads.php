<?php
namespace PRC\Platform;

use WP_Error;

class Short_Reads {
	/**
	 * The post type slug for the short reads.
	 */
	public static $post_type = 'short-read';

	/**
	 * The handle for the short reads.
	 */
	public static $handle = 'prc-platform-short-reads';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function __construct( $loader = null ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $loader The loader.
	 */
	public function init( $loader = null ) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_filter( 'post_type_link', $this, 'get_short_read_permalink', 10, 3 );
		}
	}

	public function register_type() {
		$labels = array(
			'name'               => 'Short Reads',
			'singular_name'      => 'Short Read',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New Short Read',
			'edit_item'          => 'Edit Short Read',
			'new_item'           => 'New Short Read',
			'all_items'          => 'All Short Reads',
			'view_item'          => 'View Short Read',
			'search_items'       => 'Search Short Reads',
			'not_found'          => 'No short reads found',
			'not_found_in_trash' => 'No short reads found in trash',
			'parent_item_colon'  => '',
			'menu_name'          => 'Short Reads',
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true,
			'query_var'          => true,
			'rewrite'            => array(
				'slug'       => 'short-reads/%year%/%monthnum%/%day%',
				'with_front' => true,
				'pages'      => true,
				'feeds'      => true,
			),
			'capability_type'    => 'post',
			'has_archive'        => 'short-reads',
			'hierarchical'       => false,
			'menu_position'      => 6,
			'supports'           => array( 'title', 'editor', 'author', 'excerpt', 'revisions', 'thumbnail', 'custom-fields', 'comments' ),
			'taxonomies'         => array( 'category' ),
		);

		register_post_type( self::$post_type, $args );
	}

	/**
	 * Convert the %year%, %monthnum%, and %day% placeholders in the post type's rewrite slug to the actual datettime.
	 *
	 * @hook post_type_link
	 * @param mixed $url
	 * @param mixed $post
	 * @param mixed $leavename
	 * @return mixed
	 */
	public function get_short_read_permalink( $url, $post, $leavename ) {
		if ( self::$post_type == get_post_type( $post ) ) {
			$url = str_replace( '%year%', get_the_date( 'Y', $post ), $url );
			$url = str_replace( '%monthnum%', get_the_date( 'm', $post ), $url );
			$url = str_replace( '%day%', get_the_date( 'd', $post ), $url );
		}
		return $url;
	}
}
