<?php

class WP_Query {

	public $query;

	public $query_vars = array();

	public $tax_query;

	public $meta_query = false;

	public $date_query = false;

	public $queried_object;

	public $queried_object_id;

	public $request;

	public $posts;

	public $post_count = 0;

	public $current_post = - 1;

	public $in_the_loop = false;

	public $post;

	public $comments;

	public $comment_count = 0;

	public $current_comment = - 1;

	public $comment;

	public $found_posts = 0;

	public $max_num_pages = 0;

	public $max_num_comment_pages = 0;

	public $is_single = false;

	public $is_preview = false;

	public $is_page = false;

	public $is_archive = false;

	public $is_date = false;

	public $is_year = false;

	public $is_month = false;

	public $is_day = false;

	public $is_time = false;

	public $is_author = false;

	public $is_category = false;

	public $is_tag = false;

	public $is_tax = false;

	public $is_search = false;

	public $is_feed = false;

	public $is_comment_feed = false;

	public $is_trackback = false;

	public $is_home = false;

	public $is_404 = false;

	public $is_comments_popup = false;

	public $is_paged = false;

	public $is_admin = false;

	public $is_attachment = false;

	public $is_singular = false;

	public $is_robots = false;

	public $is_posts_page = false;

	public $is_post_type_archive = false;

	private $query_vars_hash = false;

	private $query_vars_changed = true;

	public $thumbnails_cached = false;

	private $stopwords;

	private $compat_fields = array( 'query_vars_hash', 'query_vars_changed' );

	private $compat_methods = array( 'init_query_flags', 'parse_tax_query' );

	public $__mock;

	public $__data;

	public $__key;

	public static $__instances = array();

	public static $__posts = array();

	public static $__mocks = array();

	public function __construct( $args = array() ) {
		$this->__key = count( self::$__instances );

		self::$__instances[ $this->__key ] = $this;

		$this->__mock = empty( self::$__mocks[ $this->__key ] ) ? Mockery::mock( __CLASS__ ) : self::$__mocks[ $this->__key ];
		$this->__data = $this->query_vars = $args;
		if ( ! $args ) {
			return;
		}
		$this->posts      = isset( self::$__posts[ $this->__key ] ) ? (array) self::$__posts[ $this->__key ] : array();
		$this->post       = reset( $this->posts );
		$this->post_count = $this->found_posts = count( $this->posts );
	}

	private function init_query_flags() {
		call_user_func_array( array( $this->__mock, 'init_query_flags' ), func_get_args() );
	}

	public function init() {
		call_user_func_array( array( $this->__mock, 'init' ), func_get_args() );
	}

	public function parse_query_vars() {
		call_user_func_array( array( $this->__mock, 'parse_query_vars' ), func_get_args() );
	}

	public function fill_query_vars() {
		call_user_func_array( array( $this->__mock, 'fill_query_vars' ), func_get_args() );
	}

	public function parse_query() {
		call_user_func_array( array( $this->__mock, 'parse_query' ), func_get_args() );
	}

	public function parse_tax_query() {
		call_user_func_array( array( $this->__mock, 'parse_tax_query' ), func_get_args() );
	}

	protected function parse_search() {
		call_user_func_array( array( $this->__mock, 'parse_search' ), func_get_args() );
	}

	protected function parse_search_terms() {
		call_user_func_array( array( $this->__mock, 'parse_search_terms' ), func_get_args() );
	}

	protected function get_search_stopwords() {
		call_user_func_array( array( $this->__mock, 'get_search_stopwords' ), func_get_args() );
	}

	protected function parse_search_order() {
		call_user_func_array( array( $this->__mock, 'parse_search_order' ), func_get_args() );
	}

	protected function parse_orderby() {
		call_user_func_array( array( $this->__mock, 'parse_orderby' ), func_get_args() );
	}

	protected function parse_order() {
		call_user_func_array( array( $this->__mock, 'parse_order' ), func_get_args() );
	}

	public function set_404() {
		call_user_func_array( array( $this->__mock, 'set_404' ), func_get_args() );
	}

	public function get() {
		call_user_func_array( array( $this->__mock, 'get' ), func_get_args() );
	}

	public function set() {
		call_user_func_array( array( $this->__mock, 'set' ), func_get_args() );
	}

	public function get_posts() {
		call_user_func_array( array( $this->__mock, 'get_posts' ), func_get_args() );
	}

	private function set_found_posts() {
		call_user_func_array( array( $this->__mock, 'set_found_posts' ), func_get_args() );
	}

	public function next_post() {
		call_user_func_array( array( $this->__mock, 'next_post' ), func_get_args() );
	}

	public function the_post() {
		call_user_func_array( array( $this->__mock, 'the_post' ), func_get_args() );
	}

	public function have_posts() {
		call_user_func_array( array( $this->__mock, 'have_posts' ), func_get_args() );
	}

	public function rewind_posts() {
		call_user_func_array( array( $this->__mock, 'rewind_posts' ), func_get_args() );
	}

	public function next_comment() {
		call_user_func_array( array( $this->__mock, 'next_comment' ), func_get_args() );
	}

	public function the_comment() {
		call_user_func_array( array( $this->__mock, 'the_comment' ), func_get_args() );
	}

	public function have_comments() {
		call_user_func_array( array( $this->__mock, 'have_comments' ), func_get_args() );
	}

	public function rewind_comments() {
		call_user_func_array( array( $this->__mock, 'rewind_comments' ), func_get_args() );
	}

	public function query() {
		call_user_func_array( array( $this->__mock, 'query' ), func_get_args() );
	}

	public function get_queried_object() {
		call_user_func_array( array( $this->__mock, 'get_queried_object' ), func_get_args() );
	}

	public function get_queried_object_id() {
		call_user_func_array( array( $this->__mock, 'get_queried_object_id' ), func_get_args() );
	}

	public function is_archive() {
		call_user_func_array( array( $this->__mock, 'is_archive' ), func_get_args() );
	}

	public function is_post_type_archive() {
		call_user_func_array( array( $this->__mock, 'is_post_type_archive' ), func_get_args() );
	}

	public function is_attachment() {
		call_user_func_array( array( $this->__mock, 'is_attachment' ), func_get_args() );
	}

	public function is_author() {
		call_user_func_array( array( $this->__mock, 'is_author' ), func_get_args() );
	}

	public function is_category() {
		call_user_func_array( array( $this->__mock, 'is_category' ), func_get_args() );
	}

	public function is_tag() {
		call_user_func_array( array( $this->__mock, 'is_tag' ), func_get_args() );
	}

	public function is_tax() {
		call_user_func_array( array( $this->__mock, 'is_tax' ), func_get_args() );
	}

	public function is_comments_popup() {
		call_user_func_array( array( $this->__mock, 'is_comments_popup' ), func_get_args() );
	}

	public function is_date() {
		call_user_func_array( array( $this->__mock, 'is_date' ), func_get_args() );
	}

	public function is_day() {
		call_user_func_array( array( $this->__mock, 'is_day' ), func_get_args() );
	}

	public function is_feed() {
		call_user_func_array( array( $this->__mock, 'is_feed' ), func_get_args() );
	}

	public function is_comment_feed() {
		call_user_func_array( array( $this->__mock, 'is_comment_feed' ), func_get_args() );
	}

	public function is_front_page() {
		call_user_func_array( array( $this->__mock, 'is_front_page' ), func_get_args() );
	}

	public function is_home() {
		call_user_func_array( array( $this->__mock, 'is_home' ), func_get_args() );
	}

	public function is_month() {
		call_user_func_array( array( $this->__mock, 'is_month' ), func_get_args() );
	}

	public function is_page() {
		call_user_func_array( array( $this->__mock, 'is_page' ), func_get_args() );
	}

	public function is_paged() {
		call_user_func_array( array( $this->__mock, 'is_paged' ), func_get_args() );
	}

	public function is_preview() {
		call_user_func_array( array( $this->__mock, 'is_preview' ), func_get_args() );
	}

	public function is_robots() {
		call_user_func_array( array( $this->__mock, 'is_robots' ), func_get_args() );
	}

	public function is_search() {
		call_user_func_array( array( $this->__mock, 'is_search' ), func_get_args() );
	}

	public function is_single() {
		call_user_func_array( array( $this->__mock, 'is_single' ), func_get_args() );
	}

	public function is_singular() {
		call_user_func_array( array( $this->__mock, 'is_singular' ), func_get_args() );
	}

	public function is_time() {
		call_user_func_array( array( $this->__mock, 'is_time' ), func_get_args() );
	}

	public function is_trackback() {
		call_user_func_array( array( $this->__mock, 'is_trackback' ), func_get_args() );
	}

	public function is_year() {
		call_user_func_array( array( $this->__mock, 'is_year' ), func_get_args() );
	}

	public function is_404() {
		call_user_func_array( array( $this->__mock, 'is_404' ), func_get_args() );
	}

	public function is_main_query() {
		call_user_func_array( array( $this->__mock, 'is_main_query' ), func_get_args() );
	}

	public function setup_postdata() {
		call_user_func_array( array( $this->__mock, 'setup_postdata' ), func_get_args() );
	}

	public function reset_postdata() {
		call_user_func_array( array( $this->__mock, 'reset_postdata' ), func_get_args() );
	}

}
