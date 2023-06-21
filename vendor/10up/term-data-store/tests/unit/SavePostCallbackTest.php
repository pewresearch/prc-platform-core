<?php

namespace TDS;

use TDS\Tools\TestCase;
use WP_Mock;

class SavePostCallbackTest extends TestCase {

	public function setUp() {
		parent::setUp();
		balancing_relationship( false );
	}

	public function tearDown() {
		balancing_relationship( false );
		parent::tearDown();
	}

	public function test_callback_noop_when_balancing_tags() {
		balancing_relationship( true );
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		$post = (object) array( 'ID' => rand( 1, 9 ) );
		call_user_func( get_save_post_hook( 'foo', 'bar' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_filter_can_short_circuit() {
		$post_type = 'post';
		$taxonomy  = 'category';
		$post      = (object) array(
			'ID'        => rand( 1, 9 ),
			'post_type' => $post_type,
		);
		balancing_relationship( false );
		WP_Mock::onFilter( 'tds_balancing_from_post' )
		       ->with( false, $post_type, $taxonomy, $post )
		       ->reply( true );
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		call_user_func( get_save_post_hook( $post_type, $taxonomy ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_noop_on_empty_post() {
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		call_user_func( get_save_post_hook( 'foo', 'bar' ), 1, null );
		$this->assertConditionsMet();
	}

	public function test_callback_noop_on_wrong_post_type() {
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		$post = (object) array( 'ID' => 1, 'post_type' => 'post' );
		call_user_func( get_save_post_hook( 'foo', 'bar' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_noop_on_wrong_status() {
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		$post = (object) array( 'ID' => 1, 'post_type' => 'post', 'post_status' => 'draft' );
		call_user_func( get_save_post_hook( 'post', 'bar' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_noop_on_term_exists() {
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );
		$post = (object) array( 'ID' => 1, 'post_type' => 'post', 'post_status' => 'publish' );
		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( 1, 'category' ),
			'return' => array(
				(object) array(
					'term_id' => 2,
					'name'    => 'Cat',
					'slug'    => 'cat',
				)
			)
		) );
		call_user_func( get_save_post_hook( 'post', 'category' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_successful_without_wpcom_vip_get_term_by() {
		$post             = $this->mockPost( array(
			'ID'          => rand( 1, 9 ),
			'post_title'  => $title = 'Foo Bar ' . rand( 0, 9 ),
			'post_name'   => str_replace( ' ', '-', strtolower( $title ) ),
			'post_type'   => 'post',
			'post_status' => 'publish',
		) );
		$taxonomy         = 'category';
		$term_id          = rand( 10, 99 );
		$term_taxonomy_id = rand( 100, 199 );

		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, $taxonomy ),
			'return' => array(),
		) );
		WP_Mock::userFunction( 'get_term_by', array(
			'times'  => 1,
			'args'   => array( 'slug', $post->post_name, $taxonomy, ARRAY_A ),
			'return' => false,
		) );
		$insertTerm = compact( 'term_id', 'term_taxonomy_id' );
		WP_Mock::userFunction( 'wp_insert_term', array(
			'times'  => 1,
			'args'   => array( $post->post_title, $taxonomy, array( 'slug' => $post->post_name ) ),
			'return' => $insertTerm,
		) );
		WP_Mock::userFunction( 'is_wp_error', array(
			'times'  => 1,
			'args'   => array( $insertTerm ),
			'return' => false
		) );
		WP_Mock::userFunction( 'wp_set_object_terms', array(
			'times' => 1,
			'args'  => array( $post->ID, $term_id, $taxonomy ),
		) );

		WP_Mock::onFilter( 'tds_balancing_from_post' )
		       ->with( false, $post->post_type, $taxonomy, $post )
		       ->reply( false );

		call_user_func( get_save_post_hook( 'post', 'category' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	/**
	 * @runInSeparateProcess
	 */
	public function test_callback_successful_with_wpcom_vip_get_term_by() {
		$post             = $this->mockPost( array(
			'ID'          => rand( 1, 9 ),
			'post_title'  => $title = 'Foo Bar ' . rand( 0, 9 ),
			'post_name'   => str_replace( ' ', '-', strtolower( $title ) ),
			'post_type'   => 'post',
			'post_status' => 'publish',
		) );
		$taxonomy         = 'category';
		$term_id          = rand( 10, 99 );
		$term_taxonomy_id = rand( 100, 199 );

		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, $taxonomy ),
			'return' => array(),
		) );
		WP_Mock::userFunction( 'get_term_by', array( 'times' => 0 ) );
		WP_Mock::userFunction( 'wpcom_vip_get_term_by', array(
			'times'  => 1,
			'args'   => array( 'slug', $post->post_name, $taxonomy, ARRAY_A ),
			'return' => false,
		) );
		$insertTerm = compact( 'term_id', 'term_taxonomy_id' );
		WP_Mock::userFunction( 'wp_insert_term', array(
			'times'  => 1,
			'args'   => array( $post->post_title, $taxonomy, array( 'slug' => $post->post_name ) ),
			'return' => $insertTerm,
		) );
		WP_Mock::userFunction( 'is_wp_error', array(
			'times'  => 1,
			'args'   => array( $insertTerm ),
			'return' => false
		) );
		WP_Mock::userFunction( 'wp_set_object_terms', array(
			'times' => 1,
			'args'  => array( $post->ID, $term_id, $taxonomy ),
		) );

		WP_Mock::onFilter( 'tds_balancing_from_post' )
		       ->with( false, $post->post_type, $taxonomy, $post )
		       ->reply( false );

		call_user_func( get_save_post_hook( 'post', 'category' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

	public function test_callback_wp_error_on_insert_term() {
		$post     = $this->mockPost( array(
			'ID'          => rand( 1, 9 ),
			'post_title'  => $title = 'Foo Bar ' . rand( 0, 9 ),
			'post_name'   => str_replace( ' ', '-', strtolower( $title ) ),
			'post_type'   => 'post',
			'post_status' => 'publish',
		) );
		$taxonomy = 'category';

		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, $taxonomy ),
			'return' => array(),
		) );
		WP_Mock::userFunction( 'get_term_by', array(
			'times'  => 1,
			'args'   => array( 'slug', $post->post_name, $taxonomy, ARRAY_A ),
			'return' => false,
		) );
		$insert_term = \Mockery::mock( 'WP_Error' );
		$insert_term->shouldReceive( 'get_error_messages' )
		            ->once()->andReturn( array( 'Error Message' ) );
		WP_Mock::userFunction( 'wp_insert_term', array(
			'times'  => 1,
			'args'   => array( $post->post_title, $taxonomy, array( 'slug' => $post->post_name ) ),
			'return' => $insert_term,
		) );
		WP_Mock::userFunction( 'is_wp_error', array(
			'times'  => 1,
			'args'   => array( $insert_term ),
			'return' => true
		) );
		WP_Mock::userFunction( 'wp_set_object_terms', array( 'times' => 0 ) );

		WP_Mock::onFilter( 'tds_balancing_from_post' )
		       ->with( false, $post->post_type, $taxonomy, $post )
		       ->reply( false );

		$this->setExpectedException(
			'\TDS\General_Exception',
			"Error creating a term: Error Message Slug: $post->post_name / Title: $post->post_title"
		);

		call_user_func( get_save_post_hook( 'post', 'category' ), $post->ID, $post );
	}

	public function test_callback_term_is_inexplicably_object() {
		$post     = $this->mockPost( array(
			'ID'          => rand( 1, 9 ),
			'post_title'  => $title = 'Foo Bar ' . rand( 0, 9 ),
			'post_name'   => str_replace( ' ', '-', strtolower( $title ) ),
			'post_type'   => 'post',
			'post_status' => 'publish',
		) );
		$taxonomy = 'category';

		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, $taxonomy ),
			'return' => array(),
		) );
		$term = (object) array( 'term_id' => rand( 10, 99 ) );
		WP_Mock::userFunction( 'get_term_by', array(
			'times'  => 1,
			'args'   => array( 'slug', $post->post_name, $taxonomy, ARRAY_A ),
			'return' => $term,
		) );
		WP_Mock::userFunction( 'wp_set_object_terms', array(
			'times' => 1,
			'args'  => array( $post->ID, $term->term_id, $taxonomy ),
		) );

		WP_Mock::onFilter( 'tds_balancing_from_post' )
		       ->with( false, $post->post_type, $taxonomy, $post )
		       ->reply( false );

		call_user_func( get_save_post_hook( 'post', 'category' ), $post->ID, $post );
		$this->assertConditionsMet();
	}

}
