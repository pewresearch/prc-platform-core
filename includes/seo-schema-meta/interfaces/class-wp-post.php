<?php
namespace PRC\Platform\SEO;

interface WP_Post {
	/**
	 * Get the meta title for a post.
	 *
	 * @param string $title The current title.
	 * @return string The new title.
	 */
	public function get_title( $title );

	/**
	 * Get the meta description for a post.
	 * @param string $description The current description.
	 * @return string The new description.
	 */
	public function get_description( $description );

	/**
	 * Get the canonical URL for a post.
	 */
	public function get_canonical_url( $url );

	/**
	 * Get the meta image for a post.
	 * @param string $image The current image.
	 * @return string The new image.
	 */
	public function get_image( $image );

	/**
	 * Set the meta title for a post.
	 */
	public function set_title( $title );

	/**
	 * Set the meta description for a post.
	 */
	public function set_description( $description );

	/**
	 * Set the meta image for a post.
	 */
	public function set_image( $image );

	/**
	 * Set the canonical URL for a post.
	 */
	public function set_canonical_url( $url );
}
