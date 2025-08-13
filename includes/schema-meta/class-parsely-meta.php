<?php
namespace PRC\Platform;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Adds a custom parsely-title meta tag.
 */


class Parsely_Title extends Abstract_Indexable_Tag_Presenter {
	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-title" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
			$object_type     = $this->presentation->model->object_type;
			$object_sub_type = $this->presentation->model->object_sub_type;
			$object_id       = $this->presentation->model->object_id;
		if ( is_front_page() ) {
			return 'Pew Research Center';
		}
		if ( 'post' === $object_type ) {
			return get_the_title( $object_id );
		} elseif ( 'term' === $object_type ) {
			return get_term_field( 'name', $object_id );
		}
	}
}

/**
 * Adds a custom parsely-title meta tag.
 */
class Parsely_Link extends Abstract_Indexable_Tag_Presenter {
	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-link" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
			$object_type     = $this->presentation->model->object_type;
			$object_sub_type = $this->presentation->model->object_sub_type;
			$object_id       = $this->presentation->model->object_id;
		if ( is_front_page() ) {
			return get_bloginfo( 'url' );
		}
			return $this->presentation->generate_canonical();
	}
}

/**
 * Adds a custom parsely-title meta tag.
 */
class Parsely_Type extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-type" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
			$object_type     = $this->presentation->model->object_type;
			$object_sub_type = $this->presentation->model->object_sub_type;
		if ( is_front_page() ) {
			return 'index';
		}
		if ( 'post' === $object_type ) {
			if ( 'page' === $object_sub_type ) {
				return 'page';
			}
			return 'post';
		} elseif ( 'term' === $object_type ) {
			return 'page';
		}
	}
}

/**
 * Adds a custom parsely-tags meta tag.
 */
class Parsely_Tags extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-tags" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
		$object_type     = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id       = $this->presentation->model->object_id;
		if ( null !== $object_id && 'post' === $object_type ) {
			$is_child           = has_post_parent( $object_id );
			$parent_id          = $is_child ? get_post_field( 'post_parent', $object_id ) : $object_id;
			$category_tags      = wp_get_post_terms( $parent_id, 'category' );
			$research_team_tags = wp_get_post_terms( $parent_id, 'research-team' );
			$format_tags        = wp_get_post_terms( $parent_id, 'formats' );
			$meta_tags          = array(
				'post__' . $object_id,
			);
			if ( $is_child ) {
				$meta_tags[] = 'parent__' . $parent_id;
			}

			$category_tags = ( is_array( $category_tags ) && ! empty( $category_tags ) && property_exists( $category_tags[0], 'name' ) )
				? array_map(
					function ( $category ) {
						return property_exists( $category, 'name' ) ? $category->name : null;
					},
					$category_tags
				)
				: array();

			$research_team_tags = ( is_array( $research_team_tags ) && ! empty( $research_team_tags ) && property_exists( $research_team_tags[0], 'name' ) )
				? array_map(
					function ( $research_team ) {
						return property_exists( $research_team, 'name' ) ? $research_team->name : null;
					},
					$research_team_tags
				)
				: array();

			$format_tags = ( is_array( $format_tags ) && ! empty( $format_tags ) && property_exists( $format_tags[0], 'name' ) )
				? array_map(
					function ( $format ) {
						return property_exists( $format, 'name' ) ? $format->name : null;
					},
					$format_tags
				)
				: array();

			return implode( ',', array_merge( $category_tags, $format_tags, $research_team_tags, $meta_tags ) );
		}
	}
}

/**
 * Adds a custom parsely-tags meta tag.
 */
class Parsely_Section extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-section" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
		$object_type     = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id       = $this->presentation->model->object_id;
		$is_child        = has_post_parent( $object_id );
		$parent_id       = $is_child ? get_post_field( 'post_parent', $object_id ) : $object_id;
		return null !== $object_id && 'post' === $object_type ? get_primary_term_id( 'category', $parent_id ) : '';
	}
}

/**
 * Adds a custom parsely-pub-date meta tag.
 */
class Parsely_Pub_Date extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-pub-date" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
		$object_type     = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id       = $this->presentation->model->object_id;
		if ( is_front_page() ) {
			return;
		}
		if ( 'post' === $object_type ) {
			return get_the_date( 'c', $object_id );
		}
	}
}

/**
 * Adds a custom parsely-image-url meta tag.
 */
class Parsely_Image_URL extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-image-url" content="%s" />';

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
		$object_type     = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id       = $this->presentation->model->object_id;
		if ( 'post' === $object_type && post_type_supports( $object_sub_type, 'thumbnail' ) ) {
			$image_url = get_the_post_thumbnail_url( $object_id, 'medium' );
			return $image_url ? $image_url : '';
		}
		return '';
	}
}

/**
 * Adds a custom parsely-author meta tag.
 */
class Parsely_Authors extends Abstract_Indexable_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="parsely-author" content="%s" />';

		/**
		 * This output the full meta tag you want to add.
		 */
	public function present() {
		$authors = $this->get();
		if ( ! empty( $authors ) && is_array( $authors ) ) {
			foreach ( $authors as $author ) {
				return wp_sprintf( $this->tag_format, $author );
			}
		}
	}

	/**
	 * Returns the value of our new tag.
	 *
	 * @return string The value of our meta tag.
	 */
	public function get() {
		$object_type     = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id       = $this->presentation->model->object_id;
		if ( 'post' !== $object_type ) {
			return false;
		}
		$is_child  = has_post_parent( $object_id );
		$parent_id = $is_child ? get_post_field( 'post_parent', $object_id ) : $object_id;

		$bylines_data = get_post_meta( $parent_id, 'bylines' );
		if ( ! empty( $bylines_data ) ) {
			$bylines_data = array_pop( $bylines_data );
			$to_return    = array();
			foreach ( $bylines_data as $key => $value ) {
				$to_return[] = get_term( $value['termId'], 'bylines' )->name;
			}
			return $to_return;
		}
	}
}
