<?php
use WP_Error;

/**
 * Bootstraps content for PRC Platform development, if no data is present.
 */
class PRC_Platform_Content_Bootstrapper {
	public $option_name;

	public function __construct() {
		$this->option_name = 'prc_platform_content_bootstrapped';
	}

	// Get the id of the first post of a given post type.
	// if the ID is 1, then we know that the post type is empty so update_option( 'prc_platform_content_bootstrapped', true ); and return true, otherwise return false. check for the option first, if it's true, then return true.
	public function detect_lack_of_content() {
		$option = get_option( $this->option_name );
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

	public function run() {
		if ( !PRC_PLATFORM_TESTING_MODE ) {
			return;
		}
		$already_bootstrapped = get_option( $this->option_name );
		if ( $already_bootstrapped || true !== $this->detect_lack_of_content() ) {
			return;
		}
		$this->create_sample_topics();
		$this->create_sample_report();
		$this->create_sample_fact_sheet();
		$this->configure_sample_options();

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
		$tagline = 'Numbers, Facts and Trends Shaping Your World';
		update_option( 'blogdescription', $tagline );
		update_option( self::$option_name, true );
	}
}
