<?php

namespace TDS;

use TDS\Tools\TestCase;

/**
 * @runTestsInSeparateProcesses
 */
class HookGettersTest extends TestCase {

	/**
	 * @dataProvider data_all
	 */
	public function test_get_hook_return_value( $type ) {
		$this->assertSame( $this->get_closure( $type ), $this->get_closure( $type ) );
	}

	/**
	 * @dataProvider data_all
	 */
	public function test_get_hook_returns_closure( $type ) {
		$this->assertInstanceOf( 'Closure', $this->get_closure( $type ) );
	}

	public function data_all() {
		return array(
			array( 'post_type' ),
			array( 'taxonomy' ),
		);
	}

	public function test_get_save_post_hook_closure_signature() {
		$end        = <<<'EOF'
  - Bound Variables [2] {
      Variable #0 [ $post_type ]
      Variable #1 [ $taxonomy ]
  }

  - Parameters [2] {
    Parameter #0 [ <required> $post_id ]
    Parameter #1 [ <required> $post ]
  }
}
EOF;
		$reflection = new \ReflectionFunction( $this->get_closure( 'post_type' ) );
		$this->assertStringEndsWith( trim( $end ), trim( (string) $reflection ) );
	}

	public function test_get_create_term_hook_closure_signature() {
		$end        = <<<'EOF'
  - Bound Variables [2] {
      Variable #0 [ $post_type ]
      Variable #1 [ $taxonomy ]
  }

  - Parameters [1] {
    Parameter #0 [ <required> $term_id ]
  }
}
EOF;
		$reflection = new \ReflectionFunction( $this->get_closure( 'taxonomy' ) );
		$this->assertStringEndsWith( trim( $end ), trim( (string) $reflection ) );
	}

	private function get_closure( $type ) {
		switch ( $type ) {
			case 'post_type':
				return get_save_post_hook( 'foobar', 'bazbat' );
			case 'taxonomy':
				return get_save_term_hook( 'foobar', 'bazbat' );
		}
		$this->fail( 'Tried to create an invalid closure type in the Hook Getters test.' );
	}

}
