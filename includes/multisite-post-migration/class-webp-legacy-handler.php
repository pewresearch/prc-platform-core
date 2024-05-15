<?php

namespace PRC\Platform;

class WebP_Legacy_Hanlder {
	public function __construct($loader) {
		$loader->add_filter( 'the_content', array($this, 'webp_uploads_update_image_references'), 10 );
	}
	/**
	 * Filters `the_content` to update images so that they use the preferred MIME type where possible.
	 *
	 * By default, this is `image/webp`, if the current attachment contains the targeted MIME
	 * type. In the near future this will be filterable.
	 *
	 * Note that most of this function will not be needed for an eventual core implementation as it
	 * would rely on `wp_filter_content_tags()`.
	 *
	 * @since 1.0.0
	 *
	 * @see wp_filter_content_tags()
	 *
	 * @param string $content The content of the current post.
	 * @return string The content with the updated references to the images.
	 */
	function webp_uploads_update_image_references( string $content ): string {
		// Bail early if request is not for the frontend.
		if ( ! webp_uploads_in_frontend_body() ) {
			return $content;
		}

		// This content does not have any tag on it, move forward.
		if ( ! preg_match_all( '/<(img)\s[^>]+>/', $content, $img_tags, PREG_SET_ORDER ) ) {
			return $content;
		}

		$images = array();
		foreach ( $img_tags as list( $img ) ) {
			// Find the ID of each image by the class.
			if ( ! preg_match( '/wp-image-([\d]+)/i', $img, $class_name ) ) {
				continue;
			}

			if ( empty( $class_name ) ) {
				continue;
			}

			// Make sure we use the last item on the list of matches.
			$attachment_id = (int) $class_name[1];

			if ( ! $attachment_id ) {
				continue;
			}

			$images[ $img ] = $attachment_id;
		}

		$attachment_ids = array_unique( array_filter( array_values( $images ) ) );
		if ( count( $attachment_ids ) > 1 ) {
			/**
			 * Warm the object cache with post and meta information for all found
			 * images to avoid making individual database calls.
			 */
			_prime_post_caches( $attachment_ids, false, true );
		}

		foreach ( $images as $img => $attachment_id ) {
			$content = str_replace( $img, webp_uploads_img_tag_update_mime_type( $img, 'the_content', $attachment_id ), $content );
		}

		return $content;
	}

	/**
	 * Returns mime types that should be used for an image in the specific context.
	 *
	 * @since 1.0.0
	 *
	 * @param int    $attachment_id The attachment ID.
	 * @param string $context       The current context.
	 * @return string[] Mime types to use for the image.
	 */
	function webp_uploads_get_content_image_mimes( int $attachment_id, string $context ): array {
		$target_mimes = array( 'image/webp', 'image/jpeg' );

		/**
		 * Filters mime types that should be used to update all images in the content. The order of
		 * mime types matters. The first mime type in the list will be used if it is supported by an image.
		 *
		 * @since 1.0.0
		 *
		 * @param array  $target_mimes  The list of mime types that can be used to update images in the content.
		 * @param int    $attachment_id The attachment ID.
		 * @param string $context       The current context.
		 */
		$target_mimes = apply_filters( 'webp_uploads_content_image_mimes', $target_mimes, $attachment_id, $context );
		if ( ! is_array( $target_mimes ) ) {
			$target_mimes = array();
		}

		return $target_mimes;
	}

	/**
	 * Finds all the urls with *.jpg and *.jpeg extension and updates with *.webp version for the provided image
	 * for the specified image sizes, the *.webp references are stored inside of each size.
	 *
	 * @since 1.0.0
	 *
	 * @param string $original_image An <img> tag where the urls would be updated.
	 * @param string $context        The context where this is function is being used.
	 * @param int    $attachment_id  The ID of the attachment being modified.
	 * @return string The updated img tag.
	 */
	function webp_uploads_img_tag_update_mime_type( string $original_image, string $context, int $attachment_id ): string {
		$image    = $original_image;
		$metadata = wp_get_attachment_metadata( $attachment_id );

		if ( empty( $metadata['file'] ) ) {
			return $image;
		}

		$original_mime = get_post_mime_type( $attachment_id );
		$target_mimes  = webp_uploads_get_content_image_mimes( $attachment_id, $context );

		foreach ( $target_mimes as $target_mime ) {
			if ( $target_mime === $original_mime ) {
				continue;
			}

			if ( ! isset( $metadata['sources'][ $target_mime ]['file'] ) ) {
				continue;
			}

			/**
			 * Filter to replace additional image source file, by locating the original
			 * mime types of the file and return correct file path in the end.
			 *
			 * Altering the $image tag through this filter effectively short-circuits the default replacement logic using the preferred MIME type.
			 *
			 * @since 1.1.0
			 *
			 * @param string $image         An <img> tag where the urls would be updated.
			 * @param int    $attachment_id The ID of the attachment being modified.
			 * @param string $size          The size name that would be used to create this image, out of the registered subsizes.
			 * @param string $target_mime   The target mime in which the image should be created.
			 * @param string $context       The context where this is function is being used.
			 */
			$filtered_image = (string) apply_filters( 'webp_uploads_pre_replace_additional_image_source', $image, $attachment_id, 'full', $target_mime, $context );

			// If filtered image is same as the image, run our own replacement logic, otherwise rely on the filtered image.
			if ( $filtered_image === $image ) {
				$basename = wp_basename( $metadata['file'] );
				$image    = str_replace(
					$basename,
					$metadata['sources'][ $target_mime ]['file'],
					$image
				);
			} else {
				$image = $filtered_image;
			}
		}

		if ( isset( $metadata['sizes'] ) && is_array( $metadata['sizes'] ) ) {
			// Replace sub sizes for the image if present.
			foreach ( $metadata['sizes'] as $size => $size_data ) {

				if ( empty( $size_data['file'] ) ) {
					continue;
				}

				foreach ( $target_mimes as $target_mime ) {
					if ( $target_mime === $original_mime ) {
						continue;
					}

					if ( ! isset( $size_data['sources'][ $target_mime ]['file'] ) ) {
						continue;
					}

					if ( $size_data['file'] === $size_data['sources'][ $target_mime ]['file'] ) {
						continue;
					}

					/** This filter is documented in plugins/webp-uploads/load.php */
					$filtered_image = (string) apply_filters( 'webp_uploads_pre_replace_additional_image_source', $image, $attachment_id, $size, $target_mime, $context );

					// If filtered image is same as the image, run our own replacement logic, otherwise rely on the filtered image.
					if ( $filtered_image === $image ) {
						$image = str_replace(
							$size_data['file'],
							$size_data['sources'][ $target_mime ]['file'],
							$image
						);
					} else {
						$image = $filtered_image;
					}
				}
			}
		}

		foreach ( $target_mimes as $target_mime ) {
			if ( $target_mime === $original_mime ) {
				continue;
			}

			if (
				! has_action( 'wp_footer', 'webp_uploads_wepb_fallback' ) &&
				$image !== $original_image &&
				'the_content' === $context &&
				'image/jpeg' === $original_mime &&
				'image/webp' === $target_mime
			) {
				add_action( 'wp_footer', 'webp_uploads_wepb_fallback' );
			}
		}

		return $image;
	}
}
