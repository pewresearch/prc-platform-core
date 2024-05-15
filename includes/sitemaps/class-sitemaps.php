<?php
namespace PRC\Platform;

class Sitemaps {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-sitemaps';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
		require_once plugin_dir_path( __FILE__ ) . 'class-sitemap-provider.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-sitemap-renderer.php';
	}

	public function init( $loader = null ) {
		if ( null !== $loader ) {
			// $loader->add_filter('wp_sitemaps_enabled', $this, 'enable_sitemap');
			// $loader->add_filter('wp_sitemaps_taxonomies', $this, 'set_available_taxonomies');
			// $loader->add_filter('wp_sitemaps_add_provider', $this, 'disable_other_sitemaps', 10, 2);
			// $loader->add_action('init', $this, 'register_sitemaps');
			// $loader->add_action('wp_sitemap_init', $this, 'render_sitemaps');
		}
	}

	public function enable_sitemap($enabled) {
		return true;
	}

	public function set_available_taxonomies ( $taxonomies ) {
		return array_intersect_key( $taxonomies, array_flip( array( 'category' ) ) );
	}

	public function disable_other_sitemaps( $provider, $name ) {
		if ( !in_array( $name, array( 'primary', 'news', 'taxonomies', 'images' ) ) ) {
			return false;
		}
		return $provider;
	}

	public function register_sitemaps() {
		// Publish News Map
		$news_sitemap = new PRC_Sitemaps_Provider(
			'news',
			array( 'stub' ),
			array(
			'taxonomy' => 'formats',
			'field'    => 'slug',
			'terms'    => array( 'short-read', 'report' )
			)
		);
		wp_register_sitemap_provider( 'news', $news_sitemap );

		// Publish Primary Map
		$primary_sitemap = new PRC_Sitemaps_Provider( 'primary' );
		wp_register_sitemap_provider( 'primary', $primary_sitemap );
	}

	public function render_sitemaps( $sitemaps ) {
		$sitemaps->renderer = new PRC_Sitemaps_Renderer();
	}

}
