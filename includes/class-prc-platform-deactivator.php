<?php
/**
 * PRC Platform Deactivator
 *
 * @package PRC\Platform\Core
 */

/**
 * PRC Platform Deactivator
 *
 * @package PRC\Platform\Core
 */
class PRC_Platform_Deactivator {

	/**
	 * Deactivate the plugin.
	 *
	 * @package PRC\Platform\Core
	 */
	public static function deactivate() {
		flush_rewrite_rules();

		wp_mail(
			DEFAULT_TECHNICAL_CONTACT,
			'PRC Platform Deactivated 👻',
			'The PRC Platform has been deactivated on ' . get_site_url()
		);
	}
}
