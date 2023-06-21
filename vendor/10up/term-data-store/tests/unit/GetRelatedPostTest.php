<?php

namespace TDS;

use Mockery;
use TDS\Tools\TestCase;
use WP_Mock;

class GetRelatedPostTest extends TestCase {

	public function test_get_related_post_noop_when_empty_taxonomy() {
		$this->assertNull( get_related_post( 1, '' ) );
	}

	public function test_get_related_post_noop_when_term_not_object_or_int() {
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		$this->assertNull( get_related_post( 'foobar', 'category' ) );
	}

	public function test_get_related_post_noop_when_term_is_wp_error() {
		WP_Mock::userFunction( 'get_term', array(
			'times'  => 1,
			'args'   => array( 1, 'category' ),
			'return' => Mockery::mock( 'WP_Error' ),
		) );
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => true ) );
		$this->assertNull( get_related_post( 1, 'category' ) );
	}

	/**
	 * @runInSeparateProcess
	 */
	public function test_get_related_post_noop_when_relationship_not_set() {
		$term = (object) array(
			'term_id'  => rand( 1, 9 ),
			'taxonomy' => 'category',
		);
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		$this->assertNull( get_related_post( $term, $term->taxonomy ) );
	}

	public function test_get_related_post_null_when_no_post_found() {
		$term = (object) array(
			'term_id'  => rand( 1, 9 ),
			'taxonomy' => 'category',
		);
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		get_relationship( 'post', 'category' );
		$this->assertNull( get_related_post( $term, $term->taxonomy ) );
	}

	public function test_get_related_post() {
		$term = (object) array(
			'term_id'  => rand( 1, 9 ),
			'taxonomy' => 'category',
		);
		WP_Mock::userFunction( 'is_wp_error', array( 'return' => false ) );
		get_relationship( 'post', 'category' );
		$posts = array(
			$this->mockPost( array( 'ID' => rand( 100, 199 ) ) ),
			$this->mockPost( array( 'ID' => rand( 200, 299 ) ) ),
			$this->mockPost( array( 'ID' => rand( 300, 399 ) ) ),
			$this->mockPost( array( 'ID' => rand( 400, 499 ) ) ),
		);
		shuffle( $posts );
		\WP_Query::$__posts[0] = $posts;
		$this->assertSame( $posts[0], get_related_post( $term, $term->taxonomy ) );
		$this->assertEquals(
			array(
				'post_type'           => 'post',
				'posts_per_page'      => 1,
				'tax_query'           => array( array(
					'taxonomy'        => $term->taxonomy,
					'field'           => 'id',
					'terms'           => $term->term_id
				) ),
				'ignore_sticky_posts' => true,
				'include_children'    => false,
				'no_found_rows'       => true
			),
			\WP_Query::$__instances[0]->__data
		);
	}

}
