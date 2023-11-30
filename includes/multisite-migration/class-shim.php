<?php
namespace PRC\Platform;
use WP_Error;

class Shim extends Multisite_Migration {
	public function __construct() {
		if ( PRC_PRIMARY_SITE_ID !== get_current_blog_id() ) {
			add_action( 'init', array( $this, 'init' ) );
		}
	}
	// functions to create stub post type, register topic taxonomy

	public function init(){
		$this->register_stub_post_type();
		$this->register_topic_taxonomy_for_all_post_types();
	}

	public function register_stub_post_type() {
		if ( 1 === get_current_blog_id() ) {
			register_post_type( 'stub', array(
				'labels'             =>  array(
					'name'               => 'Publications',
					'singular_name'      => 'Stub',
					'add_new'            => 'Add New',
					'add_new_item'       => 'Add New Stub',
					'edit_item'          => 'Edit Stub',
					'new_item'           => 'New Stub',
					'all_items'          => 'All Publications',
					'view_item'          => 'View Stub',
					'search_items'       => 'Search Publications',
					'not_found'          => 'No publications found',
					'not_found_in_trash' => 'No publicatinos found in Trash',
					'parent_item_colon'  => '',
					'menu_name'          => 'Stub Index',
					'item_link' 		 => 'Stub Link',
					'item_link_description' => 'Link to the stub',
				),
				'description'        => 'Pew Research Center survey reports, demographic studies and data-driven analysis.',
				'public'             => true,
				'publicly_queryable' => true,
				'show_ui'            => true,
				'show_in_menu'       => true,
				'query_var'          => true,
				'rewrite'            => false,
				'capability_type'    => 'post',
				'has_archive'        => true,
				'hierarchical'       => false,
				'menu_position'      => 4,
				'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'shortlinks' ),
				'show_in_rest'       => true,
			) );
		}
	}

	public function register_topic_taxonomy_for_all_post_types() {
		register_taxonomy('topic', array(
			'post','stub','chart','interactives','fact-sheets','fact-sheet','interactive','short-read','short-reads','quiz'
		));
	}
}

