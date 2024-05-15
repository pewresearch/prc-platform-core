<?php

class Yoast_Author {

	public static function filter_graph( $graph, $context ) {
		if ( 'person' === $context ) {
			$graph['@type'] = 'Person';
		}
		return $graph;
	}

	public static function filter_author_graph( $graph, $context, $person, $post ) {
		if ( 'person' === $context ) {
			$graph['@type'] = 'Person';
		}
		return $graph;
	}

	public static function filter_schema_profilepage( $graph, $context, $person, $post ) {
		if ( 'person' === $context ) {
			$graph['@type'] = 'Person';
		}
		return $graph;
	}

	public static function filter_author_meta( $author, $post ) {
		if ( is_singular() && 'guest-author' === get_post_type() ) {
			$author = '';
		}
		return $author;
	}

	public static function allow_indexing_guest_author_archive( $robots, $post ) {
		if ( is_author() && ! is_singular() ) {
			$robots['index'] = 'index';
		}
		return $robots;
	}

	public static function fix_guest_author_archive_url_presenter( $url, $post ) {
		if ( is_author() && ! is_singular() ) {
			$url = get_author_posts_url( get_queried_object_id() );
		}
		return $url;
	}

}