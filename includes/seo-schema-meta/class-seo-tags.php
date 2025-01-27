<?php
namespace PRC\Platform\SEO;

class Tags {
	public static $tags = [];
	public $tag_name;
	public $tag_content;
	public function __construct($tag_name, $tag_content) {
		$this->tag_name = $tag_name;
		$this->tag_content = $tag_content;
		self::$tags[] = $this->generate_tag();
	}
	public function generate_tag() {
		return wp_sprintf(
			'<meta name="%s" content="%s" />',
			$this->tag_name,
			$this->tag_content
		);
	}

	public static function get_tag($name) {
		foreach (self::$tags as $tag) {
			if (strpos($tag, $name) !== false) {
				return $tag;
			}
		}
		return null;
	}

	public static function get_tags() {
		return self::$tags;
	}
}

// new Tags('robots', 'index, follow');
// new Tags('description', 'This is a description');
// new Tags('keywords', 'these, are, keywords');
// add_action('wp_head', function() {
// 	foreach (Tags::get_tags() as $tag) {
// 		echo $tag;
// 	}
// });

function output_tags() {
	$tags = Tags::get_tags();
	foreach ($tags as $tag) {
		echo $tag;
	}
}
