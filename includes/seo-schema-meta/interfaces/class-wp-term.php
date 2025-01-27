<?php
namespace PRC\Platform\SEO;

interface WP_Term {
	/**
	 * Get the meta title for a term.
	 *
	 * @param string $title The current title.
	 * @return string The new title.
	 */
	public function get_seo_title( $title );

	/**
	 * Get the meta description for a term.
	 * @param string $description The current description.
	 * @return string The new description.
	 */
	public function get_seo_description( $description );

	/**
	 * Get the meta image for a term.
	 * @param string $image The current image.
	 * @return string The new image.
	 */
	public function get_seo_image( $image );
}
