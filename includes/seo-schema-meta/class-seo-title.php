<?php
namespace PRC\Platform\SEO;

class Title {
	public $title;
	public $separator = '|';

	public function __construct($loader) {
		$loader->add_action('document_title_parts', $this, 'get_title_parts');
		$loader->add_filter('document_title_separator', $this, 'set_separator');
	}

	public function set_separator($separator) {
		return $this->separator;
	}

	/**
	 * @hook wp_get_document_title
	 */
	public function get_title_parts($title_parts) {
		// ['title'], ['site'], ['tagline'], ['page']
		return $title_parts;
	}

	/**
	 * @hook single_post_title
	 */
	public function get_post_title($title, $post) {
		return $post->post_title;
	}

	/**
	 * @hook single_term_title
	 */
	public function get_term_title($term_name) {
		$term = get_queried_object();
		return $term->name;
	}
}
