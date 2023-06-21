<?php

namespace TDS;

use TDS\Tools\TestCase;
use WP_Mock;

/**
 * @runTestsInSeparateProcesses
 */
class AddRelationshipTest extends TestCase {

	/**
	 * @expectedException \TDS\Invalid_Input_Exception
	 * @expectedExceptionMessage TDS\add_relationship() invalid post_type input.
	 */
	public function test_add_relationship_invalid_post_type() {
		$post_type = 'post' . rand( 0, 9 );
		WP_Mock::userFunction( 'get_post_type_object', array( 'return' => null ) );
		add_relationship( $post_type, 'taxonomy' );
	}

	/**
	 * @expectedException \TDS\Invalid_Input_Exception
	 * @expectedExceptionMessage TDS\add_relationship() invalid taxonomy input.
	 */
	public function test_add_relationship_invalid_taxonomy() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		WP_Mock::userFunction( 'get_post_type_object', array( 'return' => (object) array( 'name' => $post_type ) ) );
		WP_Mock::userFunction( 'get_taxonomy', array( 'return' => null ) );
		add_relationship( $post_type, $taxonomy );
	}

	/**
	 * @expectedException \TDS\Invalid_Input_Exception
	 * @expectedExceptionMessage TDS\add_relationship() post_type and taxonomy already have relationships.
	 */
	public function test_add_relationship_both_already_paired() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		get_relationship( $post_type, $taxonomy );
		WP_Mock::userFunction( 'get_post_type_object', array( 'return' => (object) array( 'name' => $post_type ) ) );
		WP_Mock::userFunction( 'get_taxonomy', array( 'return' => (object) array( 'name' => $taxonomy ) ) );
		add_relationship( $post_type, $taxonomy );
	}

	/**
	 * @expectedException \TDS\Invalid_Input_Exception
	 * @expectedExceptionMessage TDS\add_relationship() post_type already has a relationship.
	 */
	public function test_add_relationship_post_type_already_paired() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		get_relationship( $post_type, 'foobar' );
		WP_Mock::userFunction( 'get_post_type_object', array( 'return' => (object) array( 'name' => $post_type ) ) );
		WP_Mock::userFunction( 'get_taxonomy', array( 'return' => (object) array( 'name' => $taxonomy ) ) );
		add_relationship( $post_type, $taxonomy );
	}

	/**
	 * @expectedException \TDS\Invalid_Input_Exception
	 * @expectedExceptionMessage TDS\add_relationship() taxonomy already has a relationship.
	 */
	public function test_add_relationship_taxonomy_already_paired() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		get_relationship( 'foobar', $taxonomy );
		WP_Mock::userFunction( 'get_post_type_object', array( 'return' => (object) array( 'name' => $post_type ) ) );
		WP_Mock::userFunction( 'get_taxonomy', array( 'return' => (object) array( 'name' => $taxonomy ) ) );
		add_relationship( $post_type, $taxonomy );
	}

	public function test_add_relationship() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		WP_Mock::userFunction( 'get_post_type_object', array(
			'times'  => 1,
			'args'   => array( $post_type ),
			'return' => (object) array( 'name' => $post_type ),
		) );
		WP_Mock::userFunction( 'get_taxonomy', array(
			'times'  => 1,
			'args'   => array( $taxonomy ),
			'return' => (object) array( 'name' => $taxonomy ),
		) );
		WP_Mock::expectActionAdded( 'save_post', get_save_post_hook( $post_type, $taxonomy ), 10, 2 );
		WP_Mock::expectActionAdded( "create_$taxonomy", get_save_term_hook( $post_type, $taxonomy ) );

		add_relationship( $post_type, $taxonomy );

		$this->assertConditionsMet();
		$this->assertEquals( $post_type, get_relationship( $taxonomy ) );
		$this->assertEquals( $taxonomy, get_relationship( $post_type ) );
	}

	public function test_remove_post_or_term() {
		$post_type = 'post' . rand( 0, 9 );
		$taxonomy  = 'post_tag' . rand( 0, 9 );
		WP_Mock::userFunction( 'get_post_type_object', array(
			'times'  => 1,
			'args'   => array( $post_type ),
			'return' => (object) array( 'name' => $post_type ),
		) );
		WP_Mock::userFunction( 'get_taxonomy', array(
			'times'  => 1,
			'args'   => array( $taxonomy ),
			'return' => (object) array( 'name' => $taxonomy ),
		) );
		WP_Mock::expectActionAdded( 'before_delete_post', get_delete_post_hook( $post_type, $taxonomy ) );
		WP_Mock::expectActionAdded( "pre_delete_term", get_delete_term_hook( $post_type, $taxonomy ), 10, 2 );

		add_relationship( $post_type, $taxonomy );

		$this->assertConditionsMet();
		$this->assertEquals( $post_type, get_relationship( $taxonomy ) );
		$this->assertEquals( $taxonomy, get_relationship( $post_type ) );

	}
}
