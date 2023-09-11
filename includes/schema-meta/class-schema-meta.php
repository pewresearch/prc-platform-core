<?php
namespace PRC\Platform;

/**
 * This class handles constructing and managing the broad schema.org object graph and Google/Facebook/Twitter social metadata. As well as research related meta like DOI, PMID, etc.
 * @package
 */
class Schema_Meta {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		if ( class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' ) && class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'class-parsely-meta.php';
		}
	}

	public function yoast_seo_no_index( $robots ) {
		global $paged;

		if ( is_index() && $paged > 1 ) {
			$robots = 'noindex';
		}

		if ( get_query_var( 'formats' ) || get_query_var( 'reasearch-areas' ) || get_query_var( 'regions-countries' ) || get_query_var( 'days' ) || get_query_var( 'yr_min' ) || get_query_var( 'yr_max' ) ) {
			$robots = 'noindex,nofollow';
		}

		// We do not want to index attachment pages??
		if ( is_attachment() ) {
			$post_id = get_the_ID();
			if ( 0 !== wp_get_post_parent_id( $post_id ) ) {
				$robots = 'noindex';
			}
		}

		// If this is a dev environment then no index, no follow.
		if ( 'production' !== wp_get_environment_type() ) {
			$robots = 'noindex,nofollow';
		}

		return $robots;
	}

	public function force_search_engines_to_use_meta() {
		echo "<meta name='robots' content='NOODP' />\n";
	}

	public function yoast_seo_legacy_title_fix( $title ) {
		// If the title does not contain | Pew Research Center then it should have that appended to it:
		if ( is_singular() && strpos( $title, '| Pew Research Center' ) === false ) {
			$title = $title . ' | Pew Research Center';
		}
		return $title;
	}

	public function remove_pipe_from_social_titles( $title ) {
		$title = str_replace( '| Pew Research Center', '', $title );
		return $title;
	}

	public function enable_yoast_dev_mode() {
		add_filter( 'yoast_seo_development_mode', '__return_true' );
	}

	/**
	 * @TODO: We should depreceate this in favor of the yoast json ld output.
	 * @return void
	 */
	public function taxonomy_head_meta() {
		if ( ! is_singular() ) {
			return;
		}
		global $post;
		$taxonomies = array();
		if ( taxonomy_exists( 'formats' ) ) {
			$taxonomies[] = 'formats';
		}
		if ( taxonomy_exists( 'research-teams' ) ) {
			$taxonomies[] = 'research-teams';
		}
		if ( taxonomy_exists( 'regions-countries' ) ) {
			$taxonomies[] = 'regions-countries';
		}
		if ( taxonomy_exists( 'category' ) ) {
			$taxonomies[] = 'category';
		}
		echo "\n<!-- Begin Taxonomy Meta -->\n";
		foreach ( wp_get_object_terms( $post->ID, $taxonomies ) as $term ) {
			echo "<meta name='$term->taxonomy' content='$term->name'>\n";
		}
		$primary_category_id = get_post_meta( $post->ID, '_yoast_wpseo_primary_category', true );
		if ( $primary_category_id ) {
			$primary_category = get_term_by( 'term_id', $primary_category_id, 'category' );
			if ( $primary_category ) {
				echo "<meta name='_primary-category' content='$primary_category->name'>\n";
			}
		}
		echo "\n<!-- End Taxonomy Meta -->\n";
	}

	public function disable_parsely_json_ld( $parsely_metadata, $post, $parsely_options ) {
		return array(); // disable the default metadata
	}

	/**
	 * Adds our custom presenter to the array of presenters.
	 *
	 * @param array $presenters The current array of presenters.
	 *
	 * @return array Presenters with our custom presenter added.
	 */
	public function add_parsely_meta( $presenters ) {
		if ( is_admin() ) {
			return $presenters;
		}
		if ( ! class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' ) && ! class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' ) ) {
			return $presenters;
		}
		$presenters[] = new Parsely_Title();
		$presenters[] = new Parsely_Link();
		$presenters[] = new Parsely_Type();
		$presenters[] = new Parsely_Image_URL();
		$presenters[] = new Parsely_Section();
		$presenters[] = new Parsely_Tags();
		$presenters[] = new Parsely_Pub_Date();
		$presenters[] = new Parsely_Authors();
		return $presenters;
	}

	/**
	 * Add a ASCII logo to the head of the site.
	 * @return void
	 */
	public function ascii() {
		?>
	<!--
	#   Pew Research Center Publishing Platform
	#   Github: https://github.com/pewresearch/prc-platform-core
	#   Version: <?php echo esc_html($this->version); ?> /\n
	#
	-->
		<?php
	}
}
