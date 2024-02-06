<?php
namespace PRC\Platform;
use WP_Error;

class Short_Reads {
	public static $post_type = 'short-read';

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-short-reads';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'register_type' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );
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
				'slug' => 'short-read/%year%/%monthnum%/%day%',
				'with_front' => true,
				'pages'      => true,
				'feeds'      => true,
			),
			'capability_type'    => 'post',
			'has_archive'        => 'short-reads',
			'hierarchical'       => false,
			'menu_position'      => 5,
			'supports'           => array( 'title', 'editor', 'author', 'excerpt', 'revisions', 'thumbnail', 'custom-fields' ),
			'taxonomies'         => array( 'category' ),
		);

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	/**
	 * Convert the %year%, %monthnum%, and %day% placeholders in the post type's rewrite slug to the actual datettime.
	 * @hook post_type_link
	 * @param mixed $url
	 * @param mixed $post
	 * @param mixed $leavename
	 * @return mixed
	 */
	public function get_short_read_permalink($url, $post, $leavename) {
		if ( self::$post_type == get_post_type($post) ) {
			$url = str_replace( "%year%", get_the_date('Y'), $url );
			$url = str_replace( "%monthnum%", get_the_date('m'), $url );
			$url = str_replace( "%day%", get_the_date('d'), $url );
		}
		return $url;
	}
}
