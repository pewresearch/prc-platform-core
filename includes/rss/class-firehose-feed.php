<?php
/**
 * Firehose RSS Feed
 * Combines multiple post types into a single RSS feed.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

/**
 * Class Firehose_Feed
 */
class Firehose_Feed {

	/**
	 * The post types to include in the feed.
	 *
	 * @var array
	 */
	private $post_types = array(
		'post',
		'fact-sheet',
		'quiz',
		'short-read',
		'feature',
	);

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param mixed $loader  The loader object.
	 */
	public function __construct( $loader ) {
		$this->init( $loader );
	}

	/**
	 * Initialize the feed functionality.
	 *
	 * @param mixed $loader The loader object.
	 * @return void
	 */
	public function init( $loader = null ): void {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'add_feed' );
			$loader->add_action( 'wp_head', $this, 'add_to_head' );
		}
	}

	/**
	 * Add the firehose feed.
	 *
	 * @return void
	 */
	public function add_feed(): void {
		add_feed( 'firehose', array( $this, 'render_feed' ) );
	}

	/**
	 * Add the feed link to the head.
	 *
	 * @return void
	 */
	public function add_to_head(): void {
		printf(
			'<link rel="alternate" type="application/rss+xml" title="%1$s Firehose RSS Feed" href="%2$s/feed/firehose/">',
			esc_attr( get_bloginfo( 'name' ) ),
			esc_url( home_url() )
		);
	}

	/**
	 * Render the firehose feed.
	 *
	 * @return void
	 */
	public function render_feed(): void {
		header( 'Content-Type: ' . feed_content_type( 'rss2' ) . '; charset=' . get_option( 'blog_charset' ), true );

		$args = array(
			'post_type'      => $this->post_types,
			'posts_per_page' => 25,
			'orderby'        => 'date',
			'order'          => 'DESC',
		);

		$query = new \WP_Query( $args );

		echo '<?xml version="1.0" encoding="' . esc_attr( get_option( 'blog_charset' ) ) . '"?>' . "\n";
		?>
		<rss version="2.0"
			xmlns:content="http://purl.org/rss/1.0/modules/content/"
			xmlns:dc="http://purl.org/dc/elements/1.1/"
			xmlns:atom="http://www.w3.org/2005/Atom"
			xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
			<?php do_action( 'rss2_ns' ); ?>
		>
		<channel>
			<title><?php echo esc_html( get_bloginfo( 'name' ) ); ?> - Firehose Feed</title>
			<atom:link href="<?php self_link(); ?>" rel="self" type="application/rss+xml" />
			<link><?php bloginfo_rss( 'url' ); ?></link>
			<description><?php bloginfo_rss( 'description' ); ?></description>
			<lastBuildDate><?php echo esc_html( mysql2date( 'r', get_lastpostmodified( 'GMT' ), false ) ); ?></lastBuildDate>
			<language><?php bloginfo_rss( 'language' ); ?></language>
			<sy:updatePeriod><?php echo esc_html( apply_filters( 'rss_update_period', 'hourly' ) ); ?></sy:updatePeriod>
			<sy:updateFrequency><?php echo esc_html( apply_filters( 'rss_update_frequency', '1' ) ); ?></sy:updateFrequency>
			<?php do_action( 'rss2_head' ); ?>
			<?php
			if ( $query->have_posts() ) :
				while ( $query->have_posts() ) :
					$query->the_post();
					$bylines = new Bylines( get_the_ID() );
					?>
					<item>
						<title><?php the_title_rss(); ?></title>
						<link><?php the_permalink_rss(); ?></link>
						<guid isPermaLink="false"><?php the_guid(); ?></guid>
						<pubDate><?php echo esc_html( mysql2date( 'r', get_post_time( 'Y-m-d H:i:s', true ), false ) ); ?></pubDate>
						<dc:creator><![CDATA[<?php echo esc_html( $bylines->format( 'string' ) ); ?>]]></dc:creator>
						<?php
						// Add categories.
						$categories = get_the_category();
						if ( ! empty( $categories ) ) {
							foreach ( $categories as $category ) {
								echo '<category><![CDATA[' . esc_html( $category->name ) . ']]></category>';
							}
						}
						?>
						<description><![CDATA[<?php the_excerpt_rss(); ?>]]></description>
						<?php do_action( 'rss2_item' ); ?>
					</item>
					<?php
				endwhile;
				wp_reset_postdata();
			endif;
			?>
		</channel>
		</rss>
		<?php
	}
}
