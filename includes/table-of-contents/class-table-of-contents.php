<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Heading_Processor;
use WP_HTML_Tag_Processor;

/**
 * Table of Contents
 * WIP: This should launch with the bulk data update, so we can update the back chapters meta key to the correct format
 */
class Table_Of_Contents {
	public $post_id = null;
	public static $handle = 'prc-platform-table-of-contents';
	public static $enabled_post_types = array( 'post', 'fact-sheet' );
	public static $legacy_back_chapters_meta_key = 'multiSectionReport';
	public static $back_chapters_meta_key = 'multiSectionReport';
	public static $constructed_toc_key = '_constructed_toc';

	public static $back_chapters_schema_properties = array(
		'key'    => array(
			'type' => 'string',
		),
		'postId' => array(
			'type' => 'integer',
		),
	);


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
	 * @param mixed $version
	 * @param mixed $loader
	 * @return void
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		if ( !class_exists('WP_HTML_Heading_Processor') ) {
			require_once( plugin_dir_path( __FILE__ ) . 'class-wp-html-heading-processor.php' );
		}
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_rest_endpoint' );
			$loader->add_action( 'prc_platform_on_update', $this, 'clear_toc_cache_on_update', 100, 1 );
			$loader->add_action( 'prc_report_package_construct_toc', $this, 'handle_scheduled_construction_of_toc', 10, 1 );
		}
	}

	public function get_report_parent_id( int $post_id ) {
		$parent_id = wp_get_post_parent_id( $post_id );
		if ( 0 !== $parent_id && is_int($parent_id) ) {
			$post_id = $parent_id;
		}
		return $post_id;
	}

	public function register_rest_fields() {
		// Register the quick Table of Contents field for all public posts types.
		$public_post_types = get_post_types( array(
			'public' => true,
		) );
		foreach ($public_post_types as $post_type) {
			register_rest_field(
				$post_type,
				'table_of_contents',
				array(
					'get_callback' => array($this, 'get_table_of_contents_field'),
					'description'  => 'The table of contents for this post.',
				)
			);
		}
	}

	/**
	 * Convert a number to words.
	 * @param mixed $number
	 * @return string|WP_Error
	 */
	public function convert_number_to_words($num) {
		if (!is_int($num)) {
		  return new WP_Error('invalid_input', 'Input must be an integer.');
		}

		$ones = array(
		  0 => 'zero', 1 => 'one', 2 => 'two', 3 => 'three', 4 => 'four',
		  5 => 'five', 6 => 'six', 7 => 'seven', 8 => 'eight', 9 => 'nine'
		);
		$tens = array(
		  0 => '', 1 => 'ten', 2 => 'twenty', 3 => 'thirty', 4 => 'forty',
		  5 => 'fifty', 6 => 'sixty', 7 => 'seventy', 8 => 'eighty', 9 => 'ninety'
		);
		$hundreds = array(
		  'hundred', 'thousand'
		);

		if ($num < 0 || $num >= 1000) {
		  return new WP_Error('out_of_range', 'Input must be between 0 and 999.');
		}

		if ($num == 0) {
		  return esc_html($ones[0]);
		}

		$result = '';
		$hundred = (int) ($num / 100);
		$ten = (int) ($num / 10) % 10;
		$one = $num % 10;

		if ($hundred > 0) {
		  $result .= $ones[$hundred] . ' ' . $hundreds[0];
		}

		if ($ten > 0 || $one > 0) {
		  if (!empty($result)) {
			$result .= ' ';
		  }

		  if ($ten < 2) {
			$result .= $ones[$ten * 10 + $one];
		  } else {
			$result .= $tens[$ten];
			if ($one > 0) {
			  $result .= '-' . $ones[$one];
			}
		  }
		}

		return esc_html($result);
	}

	/**
	 * Core Heading Chapter
	 */
	protected function process_core_heading($array, $permalink) {
		$level = array_key_exists('level', $array['attrs']) ? $array['attrs']['level'] : 2;
		$tags = new WP_HTML_Tag_Processor($array['innerHTML']);
		$tags->next_tag('H'.$level);
		$id = $tags->get_attribute('id');

		if ( empty( $id ) ) {
			$id = sanitize_title( $array['innerHTML'] );
		}

		// Check if the heading has a number in it and if so then we'll convert it to words, also we're removing the default h- from heading blocks, looks awful for SEO.
		if ( preg_match( '/^h-(\d+)-/', $id, $matches ) ) {
			$number = $matches[1];
			$number = intval( $number );
			$number = $this->convert_number_to_words( $level );
			if ( is_wp_error( $number ) ) {
				$id = preg_replace( '/^h-(\d+)-/', '', $id );
			} else {
				$id = preg_replace( '/^h-(\d+)-/', $number . '-', $id );
			}
		} else {
			$id = preg_replace( '/^h-/', '', $id );
		}

		return array(
			'id' => $id,
			'title' => wp_strip_all_tags( !empty($array['attrs']['altTocText']) ? $array['attrs']['altTocText'] : $array['innerHTML'] ),
			'link' => $permalink . '#' . $id,
		);
	}

	protected function process_legacy_chapter_block($array, $permalink) {
		$needs_migration = true;
		$id = $array['attrs']['id'];
		// Ensure the ID is clean and none of the core/heading block id stuff gets added.
		if ( preg_match( '/^h-\d+/', $id ) ) {
			$id = preg_replace( '/^h-\d+-/', '', $id );
		} elseif ( preg_match( '/^h-/', $id ) ) {
			$id = preg_replace( '/^h-/', '', $id );
		}
		return array(
			'id' => $id,
			'title' => wp_strip_all_tags( $array['attrs']['value'] ),
			'link' => $permalink . '#' . $id,
		);
	}

	/**
	 * Will recrusively build the table of contents through navigating all blocks and grabbing core/heading and prc-block/chapter
	 * @param mixed $array
	 * @return array
	 */
	public function prepare_chapter_blocks( $array, $post_id = false, $depth = 0 ) {
		$results = array();

		if ( !in_array(get_post_type( $post_id ), [
			'post',
			'fact-sheet',
		]) ) {
			return $results;
		}

		$permalink = get_permalink( $post_id );

		if ( is_array( $array ) ) {
			// We get the first level of the array first...
			$block_name = array_key_exists('blockName', $array) ? $array['blockName'] : false;
			if ( in_array($block_name, array('core/heading', 'prc-block/chapter')) ) {
				// Check if this is a core/heading block...
				if ( array_key_exists('isChapter', $array['attrs']) && true === $array['attrs']['isChapter'] ) {
					$results[] = $this->process_core_heading($array, $permalink);
				// Or if it's a legacy prc-block/chapter block...
				} elseif ( 'prc-block/chapter' === $array['blockName'] ) {
					$results[] = $this->process_legacy_chapter_block($array, $permalink);
				}
			}
			// Then we get the rest of the array...
			if ($depth < 3) {
				foreach ( $array as $subarray ) {
					$results = array_merge( $results, $this->prepare_chapter_blocks( $subarray, $post_id, $depth + 1 ) );
				}
			}
		}

		return $results;
	}

	public function get_internal_chapters($post_id) {
		$the_content = get_post_field( 'post_content', $post_id, 'raw' );
		$legacy = $this->prepare_legacy_headings($the_content, $post_id);
		if ( false !== $legacy ) {
			$blocks = '';
		} else {
			$blocks = parse_blocks( $the_content );
		}
		$chapters = $this->prepare_chapter_blocks( $blocks, $post_id );
		return $chapters;
	}

	/**
	 * Get the back chapters for a given post.
	 * @param mixed $post_id
	 * @return array
	 */
	public function get_back_chapters( $post_id ) {
		$post_id = $this->get_report_parent_id( $post_id );

		$back_chapters = get_post_meta( $post_id, self::$back_chapters_meta_key, true );

		if ( empty( $back_chapters ) ) {
			return array();
		}

		$formatted = array();
		foreach( $back_chapters as $chapter ) {
			$chapter_id = $chapter['postId'];
			$chapters = $this->get_internal_chapters( $chapter_id );
			$formatted[] = array(
				'id' => $chapter_id,
				'title' => get_the_title( $chapter_id ),
				'slug' => get_post_field( 'post_name', $chapter_id ),
				'link' => get_permalink( $chapter_id ),
				'internal_chapters' => $chapters,
			);
		}

		return $formatted;
	}

	private function get_toc_cache_key($cache_key) {
		$cache_invalidate = '050924';
		return md5(wp_json_encode(['key' => $cache_key, 'invalidate' => $cache_invalidate]));
	}

	private function get_toc_cache($cache_key, $sub_cache = false) {
		$cache_group = 'toc';
		if ( $sub_cache ) {
			$cache_group .= '_' . $sub_cache;
		}
		$cache_key = $this->get_toc_cache_key( $cache_key );
		return wp_cache_get( $cache_key, $cache_group );
	}

	private function update_toc_cache($cache_key, $toc, $sub_cache = false) {
		$cache_group = 'toc';
		if ( $sub_cache ) {
			$cache_group .= '_' . $sub_cache;
		}
		$cache_key = $this->get_toc_cache_key( $cache_key );
		return wp_cache_set( $cache_key, $toc, $cache_group, 7 * DAY_IN_SECONDS );
	}

	public function handle_scheduled_construction_of_toc($parent_id) {
		$this->construct_toc( $parent_id );
	}

	/**
	 *
	 * @hook prc_platform_on_update
	 */
	public function clear_toc_cache_on_update($post, $is_preview = false) {
		if ( 'post' !== $post->post_type ) {
			return;
		}
		$post_id = $post->ID;
		$parent_id = $this->get_report_parent_id( $post_id );
		if ( 0 !== $post->post_parent ) {
			// If this is not the parent then lets clear the cache for the parent and schedule a new construction of the toc.
			$post = get_post($parent_id);
			return $this->clear_toc_cache_on_update( $post, $is_preview );
		}
		// Schedule a new construction of the toc...
		$group = $parent_id;
		if ( $is_preview ) {
			$group = 'preview_' . $group;
		}
		return as_enqueue_async_action( 'prc_report_package_construct_toc', array( $parent_id ), $group );
	}

	protected function __construct_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );
		$internal_chapters = $this->get_internal_chapters( $parent_id );
		$back_chapters = $this->get_back_chapters( $parent_id );

		if ( empty( $internal_chapters ) && empty( $back_chapters ) ) {
			return false;
		}

		// We always return at least the parent post with its internal chapters (if it has any),
		// in this way this function will work on any post type regardless if the post supports child posts or the "back chapters" meta.
		$constructed_toc = array_merge( array(
			array(
				'id' => $parent_id,
				'title' => get_the_title( $parent_id ),
				'slug' => get_post_field( 'post_name', $parent_id ),
				'link' => get_permalink( $parent_id ),
				'internal_chapters' => $internal_chapters
			),
		), $back_chapters );

		return $constructed_toc;
	}

	protected function construct_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );

		$constructed_toc = $this->__construct_toc( $post_id );

		update_post_meta( $parent_id, self::$constructed_toc_key, $constructed_toc );

		$this->update_toc_cache( $parent_id, $constructed_toc );

		return $constructed_toc;
	}

	/**
	 * This function will work with any post type, if the post is not a report package and does not have backchapter posts then it will just collapse the internal chapters into the main list.
	 * @param mixed $post_id
	 * @return mixed
	 */
	public function get_constructed_toc( $post_id ) {
		$parent_id = $this->get_report_parent_id( $post_id );

		$cached_toc = $this->get_toc_cache( $parent_id );

		if ( false !== $cached_toc ) {
			return $cached_toc;
		}

		$stored_toc = get_post_meta( $parent_id, self::$constructed_toc_key, true );
		return $stored_toc;
	}

	/**
	 * @hook prc_api_endpoints
	 */
	public function register_rest_endpoint($endpoints) {
		$endpoint = array(
			'route' => '/report-package/regenerate-toc',
			'methods' => 'POST',
			'callback' => array($this, 'restfully_regenerate_toc'),
			'args' => array(
				'postId' => array(
					'required' => true,
					'type' => 'integer',
				),
			),
			'permission_callback' => function() {
				return current_user_can( 'edit_posts' );
			},
		);
		return array_merge($endpoints, array($endpoint));
	}

	public function restfully_regenerate_toc(\WP_REST_Request $request) {
		$post_id = $request->get_param('postId');
		if ( empty($post_id) ) {
			return new WP_Error('400', 'Missing post_id parameter.');
		}
		return $this->construct_toc( $post_id );
	}

	/**
	 * Get the report package for a given post object.
	 * This is intended for use with the REST API and will return the
	 * report_materials and table_of_contents on the post object.
	 * @param mixed $object
	 * @return mixed
	 */
	public function get_table_of_contents_field( $object ) {
		$post_id = $object['id'];
		return $this->get_constructed_toc( $post_id );
	}
}
