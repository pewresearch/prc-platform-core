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
		// if ( !PRC_PLATFORM_TESTING_MODE ) {
		// 	return;
		// }
		$already_bootstrapped = get_option( $this->option_name );
		if ( $already_bootstrapped || true !== $this->detect_lack_of_content() ) {
			return;
		}
		$this->create_sample_topics();
		$this->create_sample_report();
		$this->create_sample_fact_sheet();
		$this->configure_tagline();
		$this->create_homepage_and_set_as_front_page();
		$this->create_publication_page_and_set_as_blog_page()

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

	public function create_publication_page_and_set_as_blog_page() {
		// create a sample "publications" page if it doesn't already exist
		$publications_page = get_page_by_title( 'Publications' );
		if ( empty( $publications_page ) ) {
			$publications_page = wp_insert_post( array(
				'post_title' => 'Publications',
				'post_type' => 'page',
				'post_status' => 'publish',
			) );
		}
		// set the "publications" page as the home page
		update_option( 'page_for_posts', $publications_page );
	}

	public function create_homepage_and_set_as_front_page() {
		ob_start();
		?>
<!-- wp:group {"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group"><!-- wp:prc-block/grid-controller {"dividerColor":"gray","className":"is-pattern__featured-layout"} -->
<!-- wp:prc-block/grid-column {"gridLayout":{"index":1,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->

<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->

<!-- wp:prc-block/grid-column {"gridLayout":{"index":2,"desktopSpan":"6","tabletSpan":"12","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->

<!-- wp:prc-block/grid-column {"gridLayout":{"index":3,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->

<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->
<!-- /wp:prc-block/grid-controller --></div>
<!-- /wp:group -->
		<?php
		$template = ob_get_clean();
		// create a sample "home" page if it doesn't already exist
		$home_page = get_page_by_title( 'Home' );
		if ( empty( $home_page ) ) {
			$home_page = wp_insert_post( array(
				'post_title' => 'Home',
				'post_type' => 'page',
				'post_status' => 'publish',
				'post_content' => $template,
			) );
		}
		// set the "home" page as the home page
		update_option( 'page_on_front', $home_page );
		update_option( 'show_on_front', 'page' );
	}

	public function configure_tagline() {
		$tagline = 'Numbers, Facts and Trends Shaping Your World';
		update_option( 'blogdescription', $tagline );
		update_option( self::$option_name, true );
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
}
