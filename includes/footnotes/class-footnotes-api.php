<?php
namespace PRC\Platform;

class Footnotes_API {
	public $post_id = null;
	protected $footnotes = [];
	protected $index = [];
	protected $start = 1;
	protected $content = null;

	public function __construct($post_id, $post_content = null) {
		$this->post_id = $post_id;
		$this->init($post_content);
	}

	public function init($post_content) {
		// Allow for passing through post content to avoid a second db call.
		if ( null === $post_content ) {
			$post_content = get_post_field( 'post_content', $this->post_id );
		}
		$this->process_content($post_content);
	}

	public function get_footnotes($format = 'array') {
		if ( ! array_key_exists($this->post_id, $this->footnotes) || empty($this->footnotes[$this->post_id])) {
			return false;
		}
		$footnotes = $this->footnotes[ $this->post_id ];
		if ( 'array' === $format ) {
			$footnotes = $footnotes;
		} else {
			$footnotes = implode( "\n", $footnotes );
		}
		return [
			'footnotes' => $footnotes,
			'start'     => $this->start,
		];
	}

	public function get_content() {
		return $this->content;
	}

	/**
	 * @hook the_content, run as late as possible...
	 * @return string $content
	 */
	public function process_content($content) {
		$post_id = $this->post_id;
		// Need to correct wpautop() which smart-quoteify's the " in the numoffset argument.
		$content = preg_replace( '/numoffset=&#8221;(\d+)&#8243;/i', 'numoffset="$1"', $content );

		if ( preg_match_all( '/\[(\d+\.((\s+)?numoffset="(\d+)+")? (.*?))\]/s', $content, $matches ) ) {
			/*
			Given [0. numoffset="5" This is a footnote]
			$matches[0] = The whole match including the square brackets: [0. numoffset="5" This is a footnote]
			$matches[4] = numoffset value: 5
			$matches[5] = The footnote text: This is a footnote
			*/
			$this->footnotes[ $post_id ] = array();

			foreach ( $matches[0] as $index => $target ) {
				$offset_value = (int) $matches[4][ $index ];
				$text         = trim( $matches[5][ $index ] );

				// Footnotes that have [ or ] in the text break. Use double curly quotes as an escape to workaround this.
				$text = str_replace( '{{', '[', $text );
				$text = str_replace( '}}', ']', $text );

				if ( $offset_value > 0 ) {
					$this->start = $offset_value;
				}

				$this->footnotes[ $post_id ][] = $text;
			}

			$n = $this->start;

			foreach ( $matches[0] as $index => $target ) {
				$content = str_replace(
					$target,
					wp_sprintf(
						'<sup class="footnote"><a href="%s" id="%s">%s</a></sup>',
						"#fn-{$post_id}-{$n}",
						"fnref-{$post_id}-{$n}",
						$n,
					),
					$content );
				$n++;
			}

			// *****************************************************************************************************
			// Workaround for wpautop() bug. Otherwise it sometimes inserts an opening <p> but not the closing </p>.
			// There are a bunch of open wpautop tickets. See 4298 and 7988 in particular.
			$content .= "\n\n";
			// *****************************************************************************************************
		}

		$this->content = $content;
	}
}
