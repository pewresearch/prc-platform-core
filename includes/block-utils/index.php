<?php
namespace PRC\Platform\Block_Utils;
use WP_HTML_Tag_Processor, WP_Block_Type_Registry, WP_Error;

/**
 * FOR EVERY PHP UTIL THERE MUST BE AN ACCOMPANYING JS UTIL
 * @hook enqueue_block_editor_assets
 * @return void
 */
class JS_Utils_Loader {
	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-block-utils';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		$this->init($loader);
	}

	public function init($loader) {
		if ( null !== $loader ) {
			$loader->add_action('enqueue_block_editor_assets', $this, 'register_assets_for_use', 10, 1);
		}
	}

	public function register_assets_for_use() {
		$asset_file = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		wp_register_script(
			self::$handle,
			plugins_url( 'build/index.js', __FILE__ ),
			$asset_file['dependencies'],
			$asset_file['version'],
		);
	}
}

/**
 * Finds a block in an array of blocks by its blockName attribute. Recursively searches innerBlocks 5 levels deep.
 * @param mixed $blocks
 * @param mixed $wildcard
 * @return null
 */
function find_block($blocks, $pattern = 'prc-block/', $depth = 0) {
	if ($depth > 5) {
		return null;
	}

	foreach ($blocks as $block) {
		// check for the blockname if it matches the wildcard given, like prc-block/form-input-* should return the first prc-block/form-input-checkbox block it finds for example
		if (isset($block['blockName']) && str_starts_with($block['blockName'], $pattern) !== false) {
			return $block;
		}

		if (isset($block['innerBlocks']) && count($block['innerBlocks']) > 0) {
			$innerBlock = find_block($block['innerBlocks'], $pattern, $depth + 1);
			if ($innerBlock !== null) {
				return $innerBlock;
			}
		}
	}

	return null;
}

/**
 * If a inner block is an input element, return its value.
 * @param mixed $content
 * @return mixed
 */
function get_wp_interactive_input_value($content) {
	$processor = new WP_HTML_Tag_Processor($content);
	if ( $processor->next_tag('input') && $processor->get_attribute('value') ) {
		return $processor->get_attribute('value');
	}
	return null;
}

/**
 * If a inner block has a data-wp-on--click attribute, return it.
 * @param mixed $content
 * @return mixed
 */
function get_wp_interactive_on_click_action($content) {
	$processor = new WP_HTML_Tag_Processor($content);
	if ( $processor->next_tag('input') && $processor->get_attribute('data-wp-on--click') ) {
		return $processor->get_attribute('data-wp-on--click');
	}
	return null;
}

/**
 * If a inner block has a data-wp-on--mouseenter attribute, return it.
 * @param mixed $content
 * @return mixed
 */
function get_wp_interactive_on_mouseenter_action($content) {
	$processor = new WP_HTML_Tag_Processor($content);
	if ( $processor->next_tag('input') && $processor->get_attribute('data-wp-on--mouseenter') ) {
		return $processor->get_attribute('data-wp-on--mouseenter');
	}
	return null;
}

/**
 * If a inner block has a data-wp-class attribute, return it.
 * @param mixed $content
 * @param mixed $classname
 * @return mixed
 */
function get_wp_interactive_classname($content, $classname) {
	$processor = new WP_HTML_Tag_Processor($content);
	if ( $processor->next_tag('input') && $processor->get_attribute('data-wp-class--' . $classname) ) {
		return $processor->get_attribute('data-wp-class--' . $classname);
	}
	return null;
}

/**
 * If a inner block has a data-wp-context attribute, return it.
 * @param mixed $content
 * @return mixed
 */
function get_wp_interactive_context($content) {
	$processor = new WP_HTML_Tag_Processor($content);
	if ( $processor->next_tag('input') && $processor->get_attribute('data-wp-context') ) {
		return $processor->get_attribute('data-wp-context');
	}
	return null;
}

/**
 * Returns the proper css value for a block's gap attribute.
 * Remember to define styles.supports.spacing.blockGap in the block.json file AND
 * define styles.spacing.blockGap in the block's attributes (along with margin and padding if enabled) AND
 * lastly you'll also need to output the value manually like `style="gap: <?php echo Utils\get_block_gap_support_value($attributes); ?>;"` in the block's render_callback.
 * OR you can output style="--block-gap: <?php echo Utils\get_block_gap_support_value($attributes); ?>;" in the block's render_callback and then use the css var(--block-gap) in the block style to control how that value is applied (prefered).
 * @param mixed $attributes
 * @return string
 */
function get_block_gap_support_value($attributes, $dimension_to_return = false) {
	$block_gap = array_key_exists('style', $attributes) && array_key_exists('spacing', $attributes['style']) && array_key_exists('blockGap', $attributes['style']['spacing']) ? $attributes['style']['spacing']['blockGap'] : false;
	if ( false === $block_gap ) {
		return 'inherit';
	}

	if ( is_array($block_gap) && false !== $dimension_to_return ) {
		$check_key = 'horizontal' === $dimension_to_return ? 'left' : 'top';
		$block_gap = array_key_exists($check_key, $block_gap) ? $block_gap[$check_key] : '';
	} elseif (is_array($block_gap)) {
		$block_gap = 'inherit';
	}

	// if $block_gap is like var:preset|spacing|60 then it should be var(--wp--preset--spacing--60) otherwise just return the value like 1rem or whatever.
	return preg_match('/^var:preset\|spacing\|\d+$/', $block_gap) ? 'var(--wp--preset--spacing--' . substr($block_gap, strrpos($block_gap, '|') + 1) . ')' : $block_gap;
}

function get_block_attributes($block_name, $given_attributes) {
	// We need to get the block name, then we need to get the block.json, then we need to get the attributes from that
	$block = WP_Block_Type_Registry::get_instance()->get_registered($block_name);
	$attributes = null;
	$attributes = $block->get_attributes();
	$modified_attributes = [];
	foreach($attributes as $attr_name => $attr_data) {
		if (array_key_exists($attr_name, $given_attributes)) {
			$modified_attributes[$attr_name] = $given_attributes[$attr_name];
		} elseif (array_key_exists('default', $attr_data)) {
			$modified_attributes[$attr_name] = $attr_data['default'];
		} else {
			$modified_attributes[$attr_name] = null;
		}
	}
	return $modified_attributes;
}

/**
 * Port of classNames JS library, modernized with PHP 8 features.
 * Ported from https://github.com/cstro/classnames-php
 */
/**
 * The classNames function takes any number of arguments which can be a string or array.
 * When using an array, if the value associated with a given key is falsy, that key won't be included in the output.
 * If no value is given the true is assumed.
 *
 * classNames('foo'); // 'foo'
 * classNames(['foo' => true]); // 'foo'
 * classNames('foo', ['bar' => false, 'baz' => true]); // 'foo baz'
 * classNames(['foo', 'bar' => true]) // 'foo bar'
 *
 * @return string
 */
function classNames(...$args): string {
	$data = array_reduce($args, function($carry, $arg) {
		if (is_array($arg)) {
			return array_merge($carry, $arg);
		}

		$carry[] = $arg;
		return $carry;
	}, []);

	$classes = array_map(function($key, $value) {
		$condition = $value;
		$return = $key;

		if (is_int($key)) {
			$condition = null;
			$return = $value;
		}

		$is_array = is_array($return);
		$is_object = is_object($return);
		$is_stringable_type = !($is_array || $is_object);
		$is_stringable_object = $is_object && method_exists($return, '__toString');

		if (!$is_stringable_type && !$is_stringable_object) {
			return null;
		}

		if ($condition === null) {
			return $return;
		}

		return $condition ? $return : null;
	}, array_keys($data), array_values($data));

	$classes = array_filter($classes);

	return implode(' ', $classes);
}

function get_legacy_color_by_slug($slug) {
	$colors = array(
		"white" => "#fff",
		"black" => "#000",
		"link-color" => "#346EAD",
		"text-color" => "#2a2a2a",
		"slate" => "#282828",
		"gray-darkest" => "#444444",
		"gray-dark" => "#818181",
		"gray-medium" => "#b7b8b9",
		"gray-light" => "#dadbdb",
		"gray" => "#efefef",
		"gray-alt" => "#6b6b6b",
		"gray-cool" => "#F8F8F8",
		"beige-dark" => "#b7b8af",
		"beige-medium" => "#f0f0e6",
		"beige" => "#f7f7f1",
		"oatmeal-text" => "#58585a",
		"oatmeal-dark" => "#b2b3a5",
		"oatmeal-light" => "#f8f9f5",
		"oatmeal" => "#ecece3",
		"democrat-blue" => "#436983",
		"republican-red" => "#bf3927",
		"eggplant" => "#756a7e",
		"science-orange" => "#ea9e2c",
		"global-green" => "#949d48",
		"race-ethnicity-brown" => "#a55a26",
		"politics-brown" => "#d1a730",
		"religion-blue" => "#0090bf",
		"social-trends-teal" => "#377668",
		"journalism-plum" => "#733d47",
		"internet-blue" => "#006699",
		"mustard" => "#d7b236",
		"sandwisp" => "#e4cb84",
		"cape-palliser" => "#a5673f"
	);
	if (array_key_exists($slug, $colors)) {
		return array(
			'hex' => $colors[$slug],
			'slug' => $slug,
			'name' => $colors[$slug],
		);
	}
	return false;
}


function get_color_by_slug($slug) {
	$colors = \wp_get_global_settings(array('color', 'palette', 'theme'));
	// check to see if slug is in the legacy color array first
	$legacy_color = get_legacy_color_by_slug($slug);
	if ($legacy_color) {
		return $legacy_color;
	}
	$picked_color = array_filter($colors, function($color) use ($slug) {
		return $color['slug'] === $slug;
	});
	$picked_color = array_pop($picked_color);
	$hex = $picked_color ? $picked_color['color'] : '#000';
	$slug = $picked_color ? $picked_color['slug'] : 'black';
	$name = $picked_color ? $picked_color['name'] : 'Black';
	return array(
		'hex' => $hex,
		'slug' => $slug,
		'name' => $name,
	);
}

/**
 * This mimics core get_block_wrapper_attributes($extra_attributes = array()) for when we're intercepting a block render and global $block data is lost.
 * @TODO: @sethrubenstein in #3584, move this to a new utils.php file.
 * @param array $extra_attributes
 * @return mixed
 */
function get_block_html_attributes( $attributes = array() ) {
	$normalized_attributes = array();
	foreach ( $attributes as $key => $value ) {
		$normalized_attributes[] = $key . '="' . esc_attr( $value ) . '"';
	}
	return implode( ' ', $normalized_attributes );
}
