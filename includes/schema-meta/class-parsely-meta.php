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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
		if ( 'post' === $object_type ) {
			return get_the_title( $object_id );
		} else if ( 'term' === $object_type ) {
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		if ( 'post' === $object_type ) {
			if ( 'page' === $object_sub_type ) {
				return 'page';
			}
			return 'post';
		} else if ( 'term' === $object_type ) {
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
		if ( null !== $object_id && 'post' === $object_type ) {
			$category_tags = wp_get_post_terms( $object_id, 'category' );
			if ( ! $category_tags ) {
				return '';
			}

			$category_tags = array_map( function( $category ) {
				return $category->name;
			}, $category_tags );

			return implode( ',', $category_tags );
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
		return null !== $object_id && 'post' === $object_type ? get_primary_term_id( 'category', $object_id ) : '';
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
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
		if ( ! empty( $authors ) && is_array($authors) ) {
			foreach( $authors as $author ) {
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
		$object_type = $this->presentation->model->object_type;
		$object_sub_type = $this->presentation->model->object_sub_type;
		$object_id = $this->presentation->model->object_id;
		if ( 'post' !== $object_type ) {
			return false;
		}

		$bylines_data = get_post_meta( $object_id, 'bylines' );
		if ( ! empty( $bylines_data ) ) {
			$bylines_data = array_pop( $bylines_data );
			$to_return = array();
			foreach ( $bylines_data as $key => $value ) {
				$to_return[] = get_term( $value['termId'], 'bylines' )->name;
			}
			return $to_return;
		}
	}
}
