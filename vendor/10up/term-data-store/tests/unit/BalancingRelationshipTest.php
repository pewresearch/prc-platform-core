<?php

namespace TDS;

use TDS\Tools\TestCase;

/**
 * Since these deal with the internal state of TDS, we want them all in process isolation
 *
 * @runTestsInSeparateProcesses
 */
class BalancingRelationshipTest extends TestCase {

	public function test_balancing_relationship_default() {
		$this->assertFalse( balancing_relationship(), 'balancing_relationship() does not return false by default!' );
	}

	public function test_balancing_relationship_override() {
		balancing_relationship( true );
		$this->assertTrue( balancing_relationship(), 'balancing_relationship() did not return true after setting it to true!' );
	}

	public function test_balancing_relationship_override_false() {
		balancing_relationship( true );
		balancing_relationship( false );
		$this->assertFalse( balancing_relationship(), 'balancing_relationship() did not set itself back to false!' );
	}

	public function test_balancing_relationship_forces_boolean() {
		balancing_relationship( 1 );
		$this->assertTrue( balancing_relationship(), 'balancing_relationship() did not cast 1 to true!' );
		balancing_relationship( '' );
		$this->assertFalse( balancing_relationship(), 'balancing_relationship() did not cast \'\' to false!' );
	}

}
