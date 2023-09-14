<?php
namespace PRC\Platform;
use WP_Error;

class Short_Reads {
	public static $post_type = 'short-read';

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

	public static $handle = 'prc-platform-short-reads';

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
	}

	public function register_type() {
		$labels = array(
			'name'               => 'Short Reads',
			'singular_name'      => 'Short Read',
			'add_new'            => 'Add New',
			'add_new_item'       => 'Add New Short Read',
			'edit_item'          => 'Edit Short Read',
			'new_item'           => 'New Short Read',
			'all_items'          => 'All Short Reads',
			'view_item'          => 'View Short Read',
			'search_items'       => 'Search Short Reads',
			'not_found'          => 'No short reads found',
			'not_found_in_trash' => 'No short reads found in trash',
			'parent_item_colon'  => '',
			'menu_name'          => 'Short Reads',
		);

		$args = array(
			'labels'             => $labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true,
			'query_var'          => true,
			'rewrite'            => true,
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => 5,
			'supports'           => array( 'title', 'editor', 'author', 'excerpt', 'revisions', 'thumbnail', 'custom-fields' ),
			'taxonomies'         => array( 'category' ),
		);

		if ( get_current_blog_id() !== PRC_MIGRATION_SITE ) {
			$args['taxonomies'] = array( 'topic' );
		}

		register_post_type( self::$post_type, $args );

		add_feed( 'short-reads-full', array( $this, 'short_reads_feed_callback' ) );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push($post_types, self::$post_type);
		return $post_types;
	}

	public function register_permalink_structure() {
		// via http://shibashake.com/wordpress-theme/custom-post-type-permalinks-part-2
		global $wp_rewrite;
		// Short Reads Singular Post
		$wp_rewrite->add_rewrite_tag( '%short-read%', '([^/]+)', 'short-read=' );
		$wp_rewrite->add_permastruct( 'short-read', '/short-reads/%year%/%monthnum%/%day%/%short-read%', false );

		// Short Reads Archive
		$args                       = array(
			'feed' => false,
		);
		$simple_fact_tank_structure = '/short-reads/%short-reads-list%';
		add_rewrite_tag( '%short-reads-list%', '(list)', 'post_type=short-read&short-reads-list=' );
		$wp_rewrite->add_permastruct( 'short-read-simple', $simple_fact_tank_structure, $args );
	}

	// Adapted from get_permalink function in wp-includes/link-template.php
	// http://pewresearch.local/fact-tank/2019/11/15/key-takeaways-on-americans-views-about-privacy-surveillance-and-data-sharing/
	public function get_short_read_permalink( $permalink, $post_id, $leavename ) {
		$post = get_post( $post_id );
		if ( self::$post_type !== $post->post_type ) {
			return $permalink;
		}
		$rewritecode = array(
			'%year%',
			'%monthnum%',
			'%day%',
			'%hour%',
			'%minute%',
			'%second%',
			$leavename ? '' : '%postname%',
			'%post_id%',
			'%category%',
			'%author%',
			$leavename ? '' : '%pagename%',
		);

		if ( '' != $permalink && ! in_array( $post->post_status, array( 'pending', 'auto-draft' ) ) ) {
			$unixtime = strtotime( $post->post_date );

			$category = '';
			if ( strpos( $permalink, '%category%' ) !== false ) {
				$cats = get_the_category( $post->ID );
				if ( $cats ) {
					usort( $cats, '_usort_terms_by_ID' ); // order by ID
					$category = $cats[0]->slug;
					if ( $parent = $cats[0]->parent ) {
						$category = get_category_parents( $parent, false, '/', true ) . $category;
					}
				}
				// show default category in permalinks, without
				// having to assign it explicitly
				if ( empty( $category ) ) {
					$default_category = get_category( get_option( 'default_category' ) );
					$category         = is_wp_error( $default_category ) ? '' : $default_category->slug;
				}
			}

			$author = '';
			if ( strpos( $permalink, '%author%' ) !== false ) {
				$authordata = get_userdata( $post->post_author );
				$author     = $authordata->user_nicename;
			}

			$date           = explode( ' ', date( 'Y m d H i s', $unixtime ) );
			$rewritereplace =
			array(
				$date[0],
				$date[1],
				$date[2],
				$date[3],
				$date[4],
				$date[5],
				$post->post_name,
				$post->ID,
				$category,
				$author,
				$post->post_name,
			);
			$permalink      = str_replace( $rewritecode, $rewritereplace, $permalink );
		}

		return $permalink;
	}

	public function short_reads_feed_callback() {
		/**
		* Template Name: Custom RSS Template - Short Reads Full Feed
		*/
		$args = array(
			'showposts' => 10,
			'post_type' => self::$post_type,
		);
		query_posts($args);
		header('Content-Type: '.feed_content_type('rss-http').'; charset='.get_option('blog_charset'), true);
		echo esc_html('<?xml version="1.0" encoding="'.get_option('blog_charset').'"?'.'>');
		?>
		<rss version="2.0"
        xmlns:content="http://purl.org/rss/1.0/modules/content/"
        xmlns:wfw="http://wellformedweb.org/CommentAPI/"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:atom="http://www.w3.org/2005/Atom"
        xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
        xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
        <?php do_action('rss2_ns'); ?>>
		<channel>
	        <title>Pew Research Center - Short Reads</title>
	        <atom:link href="<?php self_link(); ?>" rel="self" type="application/rss+xml" />
	        <link><?php bloginfo_rss('url') ?></link>
	        <description><?php bloginfo_rss('description') ?></description>
	        <lastBuildDate><?php echo mysql2date('D, d M Y H:i:s +0000', get_lastpostmodified('GMT'), false); ?></lastBuildDate>
	        <language><?php echo get_option('rss_language'); ?></language>
	        <sy:updatePeriod><?php echo apply_filters( 'rss_update_period', 'hourly' ); ?></sy:updatePeriod>
	        <sy:updateFrequency><?php echo apply_filters( 'rss_update_frequency', '1' ); ?></sy:updateFrequency>
	        <?php do_action('rss2_head'); ?>
	        <?php while(have_posts()) : the_post(); ?>
				<?php global $more; $more = -1; // Disable the <!--more--> tag ?>
				<?php $bylines = new Bylines(get_the_ID()); ?>
                <item>
                    <title><?php the_title_rss(); ?></title>
                    <link><?php the_permalink_rss(); ?></link>
                    <pubDate><?php echo mysql2date('D, d M Y H:i:s +0000', get_post_time('Y-m-d H:i:s', true), false); ?></pubDate>
                    <dc:creator><?php echo $bylines->format('string'); ?></dc:creator>
                    <guid isPermaLink="false"><?php the_guid(); ?></guid>
                    <description><![CDATA[<?php the_excerpt_rss(); ?>]]></description>
                    <content:encoded><![CDATA[<?php the_content_feed();?>]]></content:encoded>
                    <?php rss_enclosure(); ?>
                    <?php do_action('rss2_item'); ?>
                </item>
	        <?php endwhile; ?>
		</channel>
		</rss>
		<?php
	}
}
