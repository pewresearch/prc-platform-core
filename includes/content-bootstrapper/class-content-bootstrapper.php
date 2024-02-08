<?php
namespace PRC\Platform;
use WP_Error;

/**
 * Bootstraps content for PRC Platform development, if no data is present.
 */
class Content_Bootstrapper {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-content-boostrapper';

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
	}

	public function init( $loader = null ) {
		if ( !PRC_PLATFORM_TESTING_MODE ) {
			return;
		}
		if ( null !== $loader ) {
			// $loader->add_action('', $this, 'my_func');
			// $loader->add_filter('', $this, 'my_func');
		}
	}

	// Get the id of the first post of a given post type.
	// if the ID is 1, then we know that the post type is empty so update_option( 'prc_platform_content_bootstrapped', true ); and return true, otherwise return false. check for the option first, if it's true, then return true.
	public function detect_lack_of_content() {
		$option = get_option( 'prc_platform_content_bootstrapped' );
		if ( true === $option ) {
			return true;
		}
		$posts = get_posts( array(
			'post_type' => 'post',
			'posts_per_page' => 1,
		) );
		if ( empty( $posts ) ) {
			return true;
		}
		if ( 1 === $posts[0]->ID ) {
			return true;
		}
		return false;
	}

	public function bootstrap_content() {
		$this->create_sample_topics();
		$this->create_sample_report();
		$this->create_sample_fact_sheet();
	}

	public function create_sample_topics() {
		// create a sample "politics" and "religion" categories if they dont already exist
		$categories = get_categories( array(
			'hide_empty' => false,
			'fields' => 'ids',
			'name' => array( 'politics', 'religion' ),
		) );
		if ( empty( $categories ) ) {
			$politics = wp_insert_term( 'Politics', 'category' );
			$religion = wp_insert_term( 'Religion', 'category' );
		}
	}

	public function create_sample_report() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_fact_sheet() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_short_read() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_interactive() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_quiz() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_chart() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_page() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_staff() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_homepage() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_dataset() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function create_sample_block_module() {
		?>
		<p>Ipsum....</p>
		<?php
		$content = ob_get_clean();
	}

	public function configure_sample_options() {

	}
}
