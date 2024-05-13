<?php
namespace PRC\Platform;
use WP_Error;

/**
 * This helper class for Post_Report_Package is responsible for constructing a pagination object with the the current post's title and link and id, the next post's title and link and id, and the previous post's title and link and id. Aswell, it will provided a 'pagination' array with a list of pages by number and their title and link and id and whether or not they are the current page.
 * @package PRC\Platform
 */
class Pagination extends Post_Report_Package {
	public $post_id;
	public $current_post;
	public $posts = array();
	public $next_post;
	public $previous_post;

	public function __construct( $post_id ) {
		$this->post_id = $post_id;
		if ( $this->is_report_package($this->post_id) ) {
			$this->posts = $this->set_posts_structure();
		}
	}

	/**
	 * This gets the back chapters structure from the report package. It comes in as an array like so (example):
	 * array(
	 * array(
	 * 'id' => 123,
	 * 'title' => 'Chapter 1',
	 * 'link' => 'https://example.com/chapter-1',
	 * 'slug' => 'chapter-1',
	 * 'internal_chapters' => array(),
	 * ),
	 * array(
	 * 'id' => 456,
	 * 'title' => 'Chapter 2',
	 * 'link' => 'https://example.com/chapter-2',
	 * 'slug' => 'chapter-2',
	 * 'internal_chapters' => array(),
	 * )
	 * @return void
	 */
	public function set_posts_structure() {
		$chapters = $this->get_constructed_toc( $this->post_id );
		if ( empty($chapters) ) {
			return [];
		}
		// we want to return this data but strip out internal_chapters, we also want to add an is_active key to each chapter. and check against the current post id.
		$posts = array_map( function( $chapter ) {
			$chapter['is_active'] = $chapter['id'] === $this->post_id;
			unset( $chapter['internal_chapters'] );
			return $chapter;
		}, $chapters );

		return $posts;
	}

	public function get_current_post() {
		$posts = $this->posts;
		foreach( $posts as $key => $chapter ) {
			if ( $chapter['is_active'] ) {
				return $chapter;
				break;
			}
		}
	}

	/**
	 * Get the next post in the $this->back_chapters array.
	 * @return void
	 */
	public function get_next_post() {
		$next_post = false;
		$posts = $this->posts;
		// get the next item in the $posts array after the current post and return it.
		foreach( $posts as $key => $chapter ) {
			if ((int) $chapter['id'] === (int) $this->post_id) {
				$key_val = $key + 1;
				if ( $key_val > count($posts) - 1 ) {
					$next_post = false;
				} else {
					$next_post = $posts[ $key_val ];
				}
			}
		}
		$this->next_post = $next_post;
		return $next_post;
	}

	public function get_previous_post() {
		$previous_post = false;
		$posts = $this->posts;
		// get the previous item in the $posts array before the current post and return it.
		foreach( $posts as $key => $chapter ) {
			if ($chapter['id'] === $this->post_id) {
				$key_val = $key - 1;
				if ( $key_val < 0 ) {
					$previous_post = false;
				} else {
					$previous_post = $posts[ $key_val ];
				}
			}
		}
		$this->previous_post = $previous_post;
		return $previous_post;
	}

	private function return_pagination_data() {
		$pagination = array();
		$posts = $this->posts;
		foreach( $posts as $key => $chapter ) {
			$pagination[] = array(
				'id' => $chapter['id'],
				'title' => $chapter['title'],
				'link' => $chapter['link'],
				'is_active' => $chapter['is_active'],
			);
		}
		return $pagination;
	}

	public function get() {
		if ( empty($this->posts) ) {
			return false;
		}
		$current_post = $this->get_current_post();
		$next_post  = $this->get_next_post();
		$previous_post = $this->get_previous_post();
		$pagination = $this->return_pagination_data();
		return array(
			'current_post' => $current_post,
			'next_post' => $next_post,
			'previous_post' => $previous_post,
			'pagination_items' => $pagination,
		);
	}
}
