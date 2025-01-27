<?php
/**
 * WP_HTML_Get_Element Class
 *
 * @author Seth Rubenstein
 * @package prc-platform-core
 */

/**
 * Pass in a document, a desired tag, and an id and get back the content of the tag with the matching id.
 *
 * The WP_HTML_Tag_Processor bookmark tree navigation is inspired by the WP_Directive_Processor class https://github.com/WordPress/wordpress-develop/blob/6.5/src/wp-includes/interactivity-api/class-wp-interactivity-api-directives-processor.php#L18
 */
class WP_HTML_Get_Element extends WP_HTML_Tag_Processor {

	/**
	 * The element, the HTML tag that we are looking for.
	 *
	 * @var string
	 */
	public $element;

	/**
	 * The id, the id of the element that we are looking for.
	 *
	 * @var string
	 */
	public $id;

	/**
	 * The desired position of the markup cursor, inside our outside the tag.
	 *
	 * @var string inside | outside
	 */
	public $position;

	/**
	 * Constructor
	 */
	public function __construct( $html, $element, $id ) {
		parent::__construct( $html );
		$this->element = $element;
		$this->id      = $id;
	}

	/**
	 * Finds the matching closing tag for an opening tag.
	 *
	 * When called while the processor is on an open tag, it traverses the HTML
	 * until it finds the matching closer tag, respecting any in-between content,
	 * including nested tags of the same name. Returns false when called on a
	 * closer tag, a tag that doesn't have a closer tag (void), a tag that
	 * doesn't visit the closer tag, or if no matching closing tag was found.
	 *
	 * @since 6.5.0
	 *
	 * @access private
	 *
	 * @return bool Whether a matching closing tag was found.
	 */
	public function next_balanced_tag_closer_tag(): bool {
		$depth    = 0;
		$tag_name = $this->get_tag();

		while ( $this->next_tag(
			array(
				'tag_name'    => $tag_name,
				'tag_closers' => 'visit',
			)
		) ) {
			if ( ! $this->is_tag_closer() ) {
				++$depth;
				continue;
			}

			if ( 0 === $depth ) {
				return true;
			}

			--$depth;
		}

		return false;
	}
	/**
	 * Returns a pair of bookmarks for the current opener tag and the matching
	 * closer tag.
	 *
	 * It positions the cursor in the closer tag of the balanced tag, if it
	 * exists.
	 *
	 * @since 6.5.0
	 *
	 * @return array|null A pair of bookmarks, or null if there's no matching closing tag.
	 */
	public function get_balanced_tag_bookmarks() {
		static $i   = 0;
		$opener_tag = 'opener_tag_of_balanced_tag_' . ++$i;

		$this->set_bookmark( $opener_tag );
		if ( ! $this->next_balanced_tag_closer_tag() ) {
			$this->release_bookmark( $opener_tag );
			return null;
		}

		$closer_tag = 'closer_tag_of_balanced_tag_' . ++$i;
		$this->set_bookmark( $closer_tag );

		return array( $opener_tag, $closer_tag );
	}

	/**
	 * Gets the positions right after the opener tag and right before the closer
	 * tag in a balanced tag.
	 *
	 * By default, it positions the cursor in the closer tag of the balanced tag.
	 * If $rewind is true, it seeks back to the opener tag.
	 *
	 * @since 6.5.0
	 *
	 * @access private
	 *
	 * @param bool $rewind Optional. Whether to seek back to the opener tag after finding the positions. Defaults to false.
	 * @return array|null Start and end byte position, or null when no balanced tag bookmarks.
	 */
	public function get_after_opener_tag_and_before_closer_tag_positions( bool $rewind = false ) {
		// Flushes any changes.
		$this->get_updated_html();

		$bookmarks = $this->get_balanced_tag_bookmarks();

		if ( ! $bookmarks ) {
			return null;
		}
		list( $opener_tag, $closer_tag ) = $bookmarks;

		if ( 'inside' === $this->position ) {
			$after_opener_tag  = $this->bookmarks[ $opener_tag ]->start + $this->bookmarks[ $opener_tag ]->length;
			$before_closer_tag = $this->bookmarks[ $closer_tag ]->start;
		} else {
			$after_opener_tag  = $this->bookmarks[ $opener_tag ]->start;
			$before_closer_tag = $this->bookmarks[ $closer_tag ]->start + $this->bookmarks[ $closer_tag ]->length;
		}

		if ( $rewind ) {
			$this->seek( $opener_tag );
		}

		$this->release_bookmark( $opener_tag );
		$this->release_bookmark( $closer_tag );

		return array( $after_opener_tag, $before_closer_tag );
	}

	/**
	 * Returns the content between two balanced template tags.
	 *
	 * It positions the cursor in the closer tag of the balanced template tag,
	 * if it exists.
	 *
	 * @since 6.5.0
	 *
	 * @access private
	 *
	 * @return string|null The content between the current opener template tag and its matching closer tag or null if it
	 *                     doesn't find the matching closing tag or the current tag is not a template opener tag.
	 */
	public function get_content_between_balanced_template_tags() {
		$positions = $this->get_after_opener_tag_and_before_closer_tag_positions();
		if ( ! $positions ) {
			return null;
		}
		list( $after_opener_tag, $before_closer_tag ) = $positions;

		return substr( $this->html, $after_opener_tag, $before_closer_tag - $after_opener_tag );
	}

	/**
	 * Get the markup of the element with the matching id.
	 *
	 * @param string $position The desired position of the markup cursor, inside our outside the tag.
	 * @return string
	 */
	public function get_markup( $position = 'inside' ) {
		// If for some reason the position is not inside or outside, default to inside.
		if ( 'inside' !== $position && 'outside' !== $position ) {
			$position = 'inside';
		}
		$this->position = $position;
		while ( $this->next_tag() ) {
			if ( $this->get_tag() === strtoupper( $this->element ) ) {
				if ( $this->get_attribute( 'id' ) === $this->id ) {
					$positions = $this->get_after_opener_tag_and_before_closer_tag_positions( true );
					if ( $positions ) {
						list( $start, $end ) = $positions;
						return substr( $this->html, $start, $end - $start );
					}
				}
			}
		}
	}
}
