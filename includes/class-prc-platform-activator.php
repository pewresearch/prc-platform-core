<?php
use DEFAULT_TECHNICAL_CONTACT;

class PRC_Platform_Activator {
	public static function activate() {

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Activated 🚀',
			'The PRC Platform has been activated on ' . get_site_url()
		);

		flush_rewrite_rules();
	}
}
