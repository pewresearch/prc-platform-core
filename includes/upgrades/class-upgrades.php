<?php
namespace PRC\Platform;

/**
 * This class manages running upgrade routines when the platform is updated.
 */
class Upgrades {
	/**
	 * Constructor.
	 * For now, this just loads the CLI commands.
	 *
	 * @param object $loader The loader object.
	 */
	public function __construct( $loader ) {
		require_once plugin_dir_path( __FILE__ ) . 'class-cli.php';
		// We're not doing auto-upgrades until we have a better handle on the process.
		// For now, create, and run CLI comamnds to run upgrade process manually.
		// $loader->add_action( 'init', $this, 'check_current_version' );
		// $loader->add_action( 'init', $this, 'run_upgrades' );
		// $loader->add_action( 'init', $this, 'register_meta' );
	}

	public function register_meta() {
		register_post_meta(
			'',
			'_prc_platform_upgrade__deprecated_blocks',
			array(
				'show_in_rest' => true,
				'single'       => false,
				'type'         => 'string',
			)
		);
	}

	/**
	 * Check the current version of the platform on init.
	 * If the version is not set, set it to the current version.
	 */
	public function check_current_version() {
		$version = get_option( 'prc_platform_version' );
		if ( ! $version ) {
			self::update_version();
		}
	}

	/**
	 * Update the version of the platform in the database to the current code version.
	 */
	public static function update_version() {
		update_option( 'prc_platform_version', PRC_PLATFORM_VERSION );
	}

	/**
	 * Check if the current version of the platform is out of date.
	 */
	public static function is_current_version_out_of_date() {
		$current_version = get_option( 'prc_platform_version' );
		if ( version_compare( $current_version, PRC_PLATFORM_VERSION, '<' ) ) {
			return true;
		}
		return false;
	}

	/**
	 * Run upgrades for the platform in sequence.
	 * As the platform evolves, we will leave these in place to ensure that the platform can be updated.
	 */
	public function run_upgrades() {
		$current_version = get_option( 'prc_platform_version' );
		if ( version_compare( $current_version, '1.1.0', '<' ) ) {
			// new Upgrade_To_1_1_0();
		}
	}
}
