<?php

class PRC_Platform_Deactivator {

	public static function deactivate() {
		flush_rewrite_rules();

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Deactivated 👻',
			'The PRC Platform has been deactivated on ' . get_site_url()
		);
	}

}
