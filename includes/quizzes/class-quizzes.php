<?php
namespace PRC\Platform;
use WP_Error;

class Quizzes {
	protected static $post_type = 'quiz';

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

	public static $handle = 'prc-platform-quiz-post-type';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}

	public function register_type() {
		$labels = array(
			'name'               => 'Quizzes',
			'singular_name'      => 'Quiz',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New Quiz',
			'edit_item'          => 'Edit Quiz',
			'new_item'           => 'New Quiz',
			'all_items'          => 'All Quizzes',
			'view_item'          => 'View Quiz',
			'search_items'       => 'Search Quizzes',
			'not_found'          => 'No quizzes found',
			'not_found_in_trash' => 'No quizzes found in Trash',
			'parent_item_colon'  => '',
			'menu_name'          => 'Quizzes',
		);

		$rewrite = array(
			'slug'       => 'quiz',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args   = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => $rewrite,
			'capability_type'    => 'page',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => 49,
			'menu_icon'          => 'dashicons-forms',
			'show_in_rest'       => true,
			'supports'           => array(
				'title', 'editor', 'thumbnail', 'excerpt', 'shortlinks', 'custom-fields', 'revisions'
			),
			'taxonomies'         => array( 'category', 'research-teams' ),
		);

		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			$args['taxonomies'] = array('topic');
		}

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}
}
