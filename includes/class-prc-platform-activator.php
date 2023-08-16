<?php

class PRC_Platform_Activator {
	public static function activate() {
		// I want to update some options here possibly...
		// I want to ensure some network settings are set like maximum file size and etc....
		flush_rewrite_rules();

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Activated 🚀',
			'The PRC Platform has been activated on ' . get_site_url()
		);
	}
}
