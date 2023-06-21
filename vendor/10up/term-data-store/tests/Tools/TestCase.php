<?php

namespace TDS\Tools;

use WP_Mock\Tools\TestCase as BaseTestCase;

class TestCase extends BaseTestCase {

	public function setUp() {
		\WP_Query::$__instances = array();
		\WP_Query::$__posts     = array();
		\WP_Query::$__mocks     = array();
		parent::setUp();
	}

	public function tearDown() {
		parent::tearDown();
		\WP_Query::$__instances = array();
		\WP_Query::$__posts     = array();
		\WP_Query::$__mocks     = array();
	}

}
