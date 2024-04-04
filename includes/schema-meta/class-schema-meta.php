<?php
namespace PRC\Platform;
use WPSEO_Options;

/**
 * This class handles constructing and managing the broad schema.org object graph and Google/Facebook/Twitter social metadata. As well as research related meta like DOI, PMID, etc.
 * @package
 */
class Schema_Meta {
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
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'wpseo_robots', $this, 'yoast_seo_no_index' );
			$loader->add_action( 'wp_head', $this, 'force_search_engines_to_use_meta' );
			$loader->add_filter( 'wpseo_title', $this, 'yoast_seo_legacy_title_fix', 10, 1 );
			$loader->add_filter( 'wpseo_opengraph_title', $this, 'remove_pipe_from_social_titles', 10, 1 );
			$loader->add_filter( 'wpseo_opengraph_image', $this, 'get_chart_image', 100, 1 );
			$loader->add_filter( 'wpseo_metadesc', $this, 'get_chart_description', 100, 1 );
			$loader->add_filter( 'wpseo_title', $this, 'get_chart_title', 100, 1 );

			$loader->add_filter( 'wpseo_frontend_presenters', $this, 'add_parsely_meta' );
			$loader->add_filter( 'wp_parsely_metadata', $this, 'disable_parsely_json_ld', 10, 3 );

			$loader->add_filter( 'wpvip_parsely_load_mu', $this, 'enable_parsely_mu_on_vip' );
			$loader->add_action( 'wp_head', $this, 'ascii', 1 );
			$loader->add_filter( 'wpseo_twitter_creator_account', $this, 'yoast_seo_default_twitter' );
			$loader->add_filter( 'wpseo_hide_version', $this, 'yoast_hide_version' );
		}
	}

	/**
	 * @hook wpvip_parsely_load_mu
	 * @return true
	 */
	public function enable_parsely_mu_on_vip() {
		return true;
	}

	public function yoast_seo_no_index( $robots ) {
		global $paged;

		// On publication pages AND on search pages we do not want to index the page if it is not the first page.
		if ( is_index(true) && $paged > 1 ) {
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

	/**
	 * Remove the Yoast SEO version number from the head.
	 * @hook wpseo_hide_version
	 */
	public function yoast_hide_version() {
		return true;
	}

	/**
	 * Default Twitter to the site's twitter handle rather than personal twitter handles.
	 * @hook wpseo_twitter_creator_account
	 * @param mixed $twitter
	 * @return mixed
	 */
	public function yoast_seo_default_twitter( $twitter ) {
		$twitter = WPSEO_Options::get( 'twitter_site' );
		return $twitter;
	}

	public function remove_pipe_from_social_titles( $title ) {
		$title = str_replace( '| Pew Research Center', '', $title );
		return $title;
	}

	public function enable_yoast_dev_mode() {
		add_filter( 'yoast_seo_development_mode', '__return_true' );
	}

	public function disable_parsely_json_ld( $parsely_metadata, $post, $parsely_options ) {
		return $parsely_metadata; // disable the default metadata
	}

	public function get_chart_attribute($post_id, $attribute) {
		if ( ! is_singular( 'chart' ) ) {
			return;
		}

		$post_content = get_post_field('post_content', $post_id);
		// get all of the blocks on the page with the name 'prc-block/chart-builder-controller'
		$blocks = parse_blocks( $post_content );
		$controller_blocks = array_filter( $blocks, function( $block ) {
			return $block['blockName'] === 'prc-block/chart-builder-controller';
		} );
		// if there are no chart controller blocks, return
		if ( empty( $controller_blocks ) ) {
			return;
		}
		$chart_blocks = array_map( function( $block ) {
			// return inner blocks with the block name 'prc-block/chart-builder'
			return array_filter( $block['innerBlocks'], function( $inner_block ) {
				return $inner_block['blockName'] === 'prc-block/chart-builder';
			} );
		}, $controller_blocks );
		// get the first chart block
		$chart_block = reset( $chart_blocks );
		$attributes = $chart_block[1]['attrs'];

		$block_attribute = array_key_exists($attribute, $attributes) ? $attributes[$attribute] : false;

		return $block_attribute;
	}

	public function get_chart_title($title) {
		global $post;
		if ( ! is_singular( 'chart' ) ) {
			return $title;
		}
		$id = $post->ID;
		$title = $this->get_chart_attribute($id, 'metaTitle');
		return $title;
	}

	public function get_chart_image($image) {
		global $post;
		if ( ! is_singular( 'chart' ) ) {
			return $image;
		}
		$id = $post->ID;
		$png_id = $this->get_chart_attribute($id, 'pngId');
		$image = wp_get_attachment_url($png_id);

		return $image;
	}

	public function get_chart_description($description) {
		global $post;
		if ( ! is_singular( 'chart' ) ) {
			return $description;
		}
		$id = $post->ID;
		$description = $this->get_chart_attribute($id, 'metaSource');
		return $description;
	}

	/**
	 * Adds our custom presenter to the array of presenters.
	 *
	 * @hook wpseo_frontend_presenters
	 *
	 * @param array $presenters The current array of presenters.
	 * @return array Presenters with our custom presenter added.
	 */
	public function add_parsely_meta( $presenters ) {
		if ( is_admin() ) {
			return $presenters;
		}
		if ( class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' ) && class_exists( 'Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' ) ) {
			require_once plugin_dir_path( __FILE__ ) . 'class-parsely-meta.php';
			$presenters[] = new Parsely_Title();
			$presenters[] = new Parsely_Link();
			$presenters[] = new Parsely_Type();
			$presenters[] = new Parsely_Image_URL();
			$presenters[] = new Parsely_Section();
			$presenters[] = new Parsely_Tags();
			$presenters[] = new Parsely_Pub_Date();
			$presenters[] = new Parsely_Authors();
		}
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
	#   Version: <?php echo esc_html($this->version); ?>
	#
	-->
		<?php
	}
}
