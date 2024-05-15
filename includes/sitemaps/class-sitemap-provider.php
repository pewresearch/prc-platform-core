<?php
namespace PRC\Platform;
use WP_Sitemaps_Provider;

class PRC_Sitemaps_Provider extends WP_Sitemaps_Provider {
  public $postTypes = array();

  public function __construct( $name, $postTypes = array( 'stub' ), $taxQuery = null ) {
    $this->name             = $name;
    $this->postTypes        = $postTypes;
    $this->object_type      = 'post';
    $this->tax_query        = $taxQuery;
    $this->image_mime_types = array( 'image/jpeg', 'image/gif', 'image/png', 'image/bmp', 'image/tiff', 'image/x-icon' );
  }

  private function queryArgs( $page_num ) {
    $args = array(
      'post_type'      => $this->postTypes,
      'post_status'    => array( 'inherit', 'publish' ),
      'posts_per_page' => ( 'news' === $this->name ) ? 20 : 500,
      'orderby'        => 'post_date',
      'order'          => 'DESC',
      'paged'          => $page_num,
      'post_mime_type' => ( 'images' === $this->name ) ? $this->image_mime_types : null,
      'tax_query'      => ( null !== $this->tax_query ) ? array( $this->tax_query ) : null
    );

    //Do not return child posts
    if ( 'news' === $this->name ) {
      $args['post_parent'] = 0;
    }

    return $args;
  }

  public function get_base_tags( $post ) {
    return array(
      'loc'     => ( 'stub' === $post->post_type ) ? get_post_meta( $post->ID, '_redirect', true ) : get_the_permalink( $post ),
      'lastmod' => get_the_modified_time( 'c', $post ),
      'ID'      => $post->ID
    );
  }

  public function get_news_tags( $post ) {
    return array(
      'publication_date' => get_the_date( 'Y-m-d', $post ),
      'title'            => get_the_title( $post )
    );
  }

  public function get_image_tags( $post ) {
    return array(
      'loc'     => $post->guid,
      'caption' => 'Nothing',
      'title'   => 'Nothing'
    );
  }

  public function get_url_list( $page_num, $post_type = '' ) {
    $query = new WP_Query( $this->queryArgs( $page_num ) );
    $urlList = array();

    if ('images' === $this->name ) {
      $imageList = array();
      foreach ( $query->posts as $post ) {
        if ( 0 !==  $post->post_parent ) {
          $imageList[$post->post_parent][] =  $this->get_image_tags( $post );
        }
      }
      foreach ( $imageList as $k => $v ) {
        $post                  = get_post( $k );
        $sitemapEntry          = $this->get_base_tags( $post );
        $sitemapEntry['image'] = $v;
        $sitemapEntry          = apply_filters( 'wp_sitemaps_posts_entry', $sitemapEntry, $post, $post_type );
        $urlList[]             = $sitemapEntry;
      }
    } else {
      foreach ( $query->posts as $post ) {
        $sitemapEntry = $this->get_base_tags( $post );

        if ( 'news' === $this->name ) {
          $sitemapEntry['news'] = $this->get_news_tags( $post );
        }

        $sitemapEntry = apply_filters( 'wp_sitemaps_posts_entry', $sitemapEntry, $post, $post_type );
        $urlList[] = $sitemapEntry;
      }
    }

    return array(
      'news' => ('news' === $this->name) ? true : false,
      'list' => $urlList
    );
  }

  public function get_max_num_pages( $post_type = '' ) {
    $args                  = $this->queryArgs( 0 );
    $args['fields']        = 'ids';
    $args['no_found_rows'] = false;

    $query = new WP_Query( $args );
    return ( 'news' === $this->name ) ? 1 : $query->max_num_pages;
  }
}
