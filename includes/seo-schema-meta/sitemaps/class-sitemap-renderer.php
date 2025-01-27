<?php
namespace PRC\Platform;

use WP_Sitemaps_Renderer;
use SimpleXMLElement;

class PRC_Sitemaps_Renderer extends WP_Sitemaps_Renderer {
	/**
	 * Gets XML for a sitemap.
	 *
	 * @since 5.5.0
	 *
	 * @param array $url_list Array of URLs for a sitemap.
	 * @return string|false A well-formed XML string for a sitemap index. False on error.
	 */
	public function get_sitemap_xml( $url_list ) {
		$news_schema = 'http://www.google.com/schemas/sitemap-news/0.9';
		$urlset      = new SimpleXMLElement(
			sprintf(
				'%1$s%2$s%3$s',
				'<?xml version="1.0" encoding="UTF-8" ?>',
				$this->stylesheet,
				( $url_list['news'] ) ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="' . $news_schema . '"/>' :
					'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" />'
			)
		);

		if ( isset( $url_list['list'] ) ) {
			$url_list = $url_list['list'];
		}

		foreach ( $url_list as $url_item ) {
			$url = $urlset->addChild( 'url' );

			// Add each element as a child node to the <url> entry.
			foreach ( $url_item as $name => $value ) {
				if ( 'loc' === $name ) {
					$url->addChild( $name, esc_url( trailingslashit( set_url_scheme( $value, 'https' ) ) ) );
					// add news-specific tags
				} elseif ( 'news' === $name ) {
					$news        = $url->addChild( 'news:news', null, $news_schema );
					$publication = $news->addChild( 'news:publication', null, $news_schema );
					$publication->addChild( 'news:name', esc_xml( 'Pew Research Center' ), $news_schema );
					$publication->addChild( 'news:language', esc_xml( 'en' ), $news_schema );
					$news->addChild( 'news:publication_date', esc_xml( $value['publication_date'] ), $news_schema );
					$news->addChild( 'news:title', esc_xml( $value['title'] ), $news_schema );
				} elseif ( 'ID' === $name ) {
					$url->addAttribute( 'id', esc_xml( $value ) );
				} else {
					$url->addChild( $name, esc_xml( $value ) );
				}
			}
		}

		return $urlset->asXML();
	}
}
