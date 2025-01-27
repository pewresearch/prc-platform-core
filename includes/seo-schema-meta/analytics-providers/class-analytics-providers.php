<?php
namespace PRC\Platform\SEO;

class Analytics_Providers {
	public function __construct() {
		// require the files...
	}

	public function hook_integrations() {
		$parsely = new Parsely();
		$jetpack = new Jetpack_Stats();
		$semrush = new SEMRush();
	}
}
