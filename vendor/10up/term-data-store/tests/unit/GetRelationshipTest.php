<?php

namespace TDS;

use TDS\Tools\TestCase;

/**
 * Since these deal with the internal state of TDS, we want them all in process isolation
 *
 * @runTestsInSeparateProcesses
 */
class GetRelationshipTest extends TestCase {

	public function test_get_relationship_does_not_exist() {
		$this->assertNull( get_relationship( 'foobar' ), 'foobar should not have a relationship and should therefore be null!' );
	}

	public function test_get_relationship() {
		$random_key   = 'foobar' . rand( 1, 9 );
		$random_value = 'bazbat' . rand( 1, 9 );
		get_relationship( $random_key, $random_value );
		$this->assertSame( $random_value, get_relationship( $random_key ), "'$random_key' should have returned its related value ('$random_value') but didn't!" );
		$this->assertSame( $random_key, get_relationship( $random_value ), "'$random_value' should have returned its related value ('$random_key') but didn't!" );
	}

}
