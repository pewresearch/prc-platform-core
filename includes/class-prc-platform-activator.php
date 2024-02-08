<?php
use DEFAULT_TECHNICAL_CONTACT;

class PRC_Platform_Activator {
	public static function activate() {
		require_once plugin_dir_path(__FILE__) . 'class-prc-platform-content-bootstrapper.php';

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Activated 🚀',
			'The PRC Platform has been activated on ' . get_site_url()
		);

		$bootstrapper = new PRC_Platform_Content_Bootstrapper();
		$bootstrapper->run();

		flush_rewrite_rules();
	}
}
