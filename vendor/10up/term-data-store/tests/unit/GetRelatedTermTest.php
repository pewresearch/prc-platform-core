<?php

namespace TDS;

use Mockery;
use TDS\Tools\TestCase;
use WP_Mock;

class GetRelatedTermTest extends TestCase {

	public function test_get_related_term_noop_when_no_post() {
		WP_Mock::userFunction( 'get_post', array( 'return' => null ) );
		$this->assertNull( get_related_term( 1 ) );
	}

	public function test_get_related_term_noop_when_wp_error_from_terms() {
		$post = $this->mockPost( array(
			'ID'        => rand( 1, 9 ),
			'post_type' => 'post',
		) );
		get_relationship( 'post', 'category' );
		WP_Mock::passthruFunction( 'get_post' );
		$error = Mockery::mock( 'WP_Error' );
		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, 'category' ),
			'return' => $error,
		) );
		WP_Mock::userFunction( 'is_wp_error', array(
			'times'  => 1,
			'args'   => array( $error ),
			'return' => true,
		) );
		$this->assertNull( get_related_term( $post ) );
	}

	public function test_get_related_term_noop_when_no_terms_fetched() {
		$post = $this->mockPost( array(
			'ID'        => rand( 1, 9 ),
			'post_type' => 'post',
		) );
		get_relationship( 'post', 'category' );
		WP_Mock::passthruFunction( 'get_post' );
		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, 'category' ),
			'return' => false,
		) );
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		$this->assertNull( get_related_term( $post ) );
	}

	public function test_get_related_term() {
		$post = $this->mockPost( array(
			'ID'        => rand( 1, 9 ),
			'post_type' => 'post',
		) );
		get_relationship( 'post', 'category' );
		WP_Mock::passthruFunction( 'get_post' );
		$terms = array(
			(object) array( 'term_id' => rand( 10, 19 ) ),
			(object) array( 'term_id' => rand( 20, 29 ) ),
			(object) array( 'term_id' => rand( 30, 39 ) ),
			(object) array( 'term_id' => rand( 40, 49 ) ),
		);
		shuffle( $terms );
		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, 'category' ),
			'return' => $terms,
		) );
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		$this->assertEquals( $terms[0], get_related_term( $post ) );
	}

	public function test_get_related_term_returns_null_for_unexpected_return_value() {
		$post = $this->mockPost( array(
			'ID'        => rand( 1, 9 ),
			'post_type' => 'post',
		) );
		get_relationship( 'post', 'category' );
		WP_Mock::passthruFunction( 'get_post' );
		WP_Mock::userFunction( 'get_the_terms', array(
			'times'  => 1,
			'args'   => array( $post->ID, 'category' ),
			'return' => 'non_empty_non_array',
		) );
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		$this->assertNull( get_related_term( $post ) );
	}

}
