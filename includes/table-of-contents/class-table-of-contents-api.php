<?php
namespace PRC\Platform\Core\Table_Of_Contents;
use WP_HTML_Heading_Processor;

class API {
	public $parent_id;
	public $internal_chapters;
	public $back_chapters;

	public function __construct( $parent_id ) {
		$this->parent_id = $parent_id;
		$this->internal_chapters = array();
		$this->back_chapters = array();
	}

	/**
	 * Will recrusively build the table of contents through navigating all blocks and grabbing core/heading and prc-block/chapter
	 * @param mixed $array
	 * @return array
	 */
	public function prepare_chapter_blocks( $array, $post_id = false, $depth = 0 ) {
		$results = array();

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
		if( has_block('core/heading', $the_content) ) {
			$blocks = parse_blocks( $the_content );
			return $this->prepare_chapter_blocks( $blocks, $post_id );
		}
		return [];
	}
}
