<?php
namespace PRC\Platform;

class Footnotes {
	public function __construct($version, $loader) {
		require_once plugin_dir_path( __FILE__ ) . 'class-footnotes-api.php';
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_filter( 'the_content', $this, 'filter_content', 100 );
		}
	}

	public function filter_content($content) {
		if ( ! is_singular() ) {
			return $content;
		}
		global $post;
		$post_id = $post->ID;
		$footnotes_api = new Footnotes_API( $post_id, $content );
		return $footnotes_api->get_content();
	}
}
