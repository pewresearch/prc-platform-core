<?php
/**
 * PRC Platform Activator
 *
 * @package PRC\Platform\Core
 */

/**
 * PRC Platform Activator
 *
 * @package PRC\Platform\Core
 */
class PRC_Platform_Activator {
	/**
	 * Activate the plugin.
	 *
	 * @package PRC\Platform\Core
	 */
	public static function activate() {

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Activated 🚀',
			'The PRC Platform has been activated on ' . get_site_url()
		);

		flush_rewrite_rules();
	}
}
