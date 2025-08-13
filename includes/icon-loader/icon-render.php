<?php
/**
 * Icon rendering functions.
 * This does not include the icon library itself, but rather the functions to render icons.
 * The library is included in prc-icon-library and can be included in your project by including
 * a plugin structured similiary that uses Font Awesome's SVG library.
 *
 * @package PRC\Platform\Icons
 */

namespace PRC\Platform\Icons;

use WP_HTML_Get_Element;
use WP_HTML_Tag_Processor;

define( 'PRC_PLATFORM_ICONS_CACHE_VERSION', '1.0.4' );
define( 'PRC_PLATFORM_ICONS_CACHE_TTL', 7 * DAY_IN_SECONDS );

/**
 * Render an icon from the library of your choice.
 * This function will never error out, but will log errors to the PHP error log. This should always gracefully fail and never stop the page from rendering.
 *
 * @param string       $icon_library The library to use. Defaults to 'solid'.
 * @param string       $icon_name The name of the icon to render.
 * @param float|string $size The size of the icon in em units.
 * @return string|void The rendered icon.
 */
function render( $icon_library = 'solid', $icon_name = 'question', $size = 1 ) {
	if ( ! defined( 'PRC_PLATFORM_ICONS_URL' ) ) {
		return '<!-- Error: PRC_PLATFORM_ICONS_URL is not defined. -->';
	}
	$available_libraries = array(
		'solid',
		'regular',
		'light',
		'duotone',
		'brands',
		'sharp',
		'custom-icons',
	);
	$shortcuts           = array(
		'close' => array(
			'library' => 'solid',
			'name'    => 'circle-xmark',
		),
	);
	// Check if the icon_name is in $shortcuts and if so set the library and icon name accordingly.
	// i.e. you can just use 'close' as the icone name and will delivery the correct icon.
	if ( array_key_exists( $icon_name, $shortcuts ) ) {
		$icon_library = $shortcuts[ $icon_name ]['library'];
		$icon_name    = $shortcuts[ $icon_name ]['name'];
	}
	if ( ! in_array( $icon_library, $available_libraries ) ) {
		// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		error_log( 'Invalid icon library: ' . $icon_library . '. Defaulting to solid.' );
		$icon_library = 'solid';
	}

	$icon_cache_group = 'prc_icons__rendered';
	$icon_cache_key   = md5( $icon_library . '_' . $icon_name . '_' . $size . '_' . PRC_PLATFORM_ICONS_CACHE_VERSION );
	$icon             = wp_cache_get( $icon_cache_key, $icon_cache_group );
	if ( false !== $icon ) {
		return $icon;
	}

	$icon = get_icon_as_url( $icon_library, $icon_name );
	$size = (float) $size;
	if ( is_string( $size ) ) {
		return $size;
	}
	if ( is_numeric( $size ) ) {
		$size = $size . 'em';
	}
	$icon_markup = wp_sprintf(
		'<i class="%1$s"><svg style="width: %2$s; height: %2$s;"><use xlink:href="%3$s"></use></svg></i>',
		\PRC\Platform\Block_Utils\classNames(
			'icon',
			array(
				'icon-library__' . $icon_library,
				'icon__' . $icon_name,
			)
		),
		esc_attr( $size ),
		esc_url( $icon ),
	);

	wp_cache_set( $icon_cache_key, $icon_markup, $icon_cache_group, PRC_PLATFORM_ICONS_CACHE_TTL );

	return $icon_markup;
}

/**
 * Get the URL for an icon.
 *
 * @param string $library The library to use.
 * @param string $icon The name of the icon.
 * @return string URL representing the icon.
 */
function get_icon_as_url( $library, $icon ) {
	if ( ! defined( 'PRC_PLATFORM_ICONS_URL' ) ) {
		return '<!-- Error: PRC_PLATFORM_ICONS_URL is not defined. -->';
	}
	$iconset = PRC_PLATFORM_ICONS_URL . $library . '.svg';
	$icon    = $iconset . '#' . $icon;
	return $icon;
}

/**
 * Get the icon <symbol/> from the library svg and then return a usable <svg/>.
 *
 * @param string $library The library to use.
 * @param string $icon The name of the icon.
 * @return string The icon as an SVG.
 */
function get_icon_as_svg( $library, $icon, $fill_color = 'currentColor' ) {
	if ( ! defined( 'PRC_PLATFORM_ICONS_URL' ) ) {
		return '<!-- Error: PRC_PLATFORM_ICONS_URL is not defined. -->';
	}
	$icon_cache_group = 'prc_icons__svg';
	$icon_cache_key   = md5( $library . '_' . $icon . '_' . $fill_color . '_' . PRC_PLATFORM_ICONS_CACHE_VERSION );

	$cached = wp_cache_get( $icon_cache_key, $icon_cache_group );

	if ( false !== $cached ) {
		return $cached;
	}

	$iconset = PRC_PLATFORM_ICONS_URL . $library . '.svg';
	$iconset = wpcom_vip_file_get_contents( $iconset );

	$tags = new WP_HTML_Get_Element( $iconset, 'SYMBOL', $icon );
	$icon = $tags->get_markup( 'outside' );
	$icon = str_replace( 'symbol', 'svg', $icon );

	$tags = new WP_HTML_Tag_Processor( $icon );
	$tags->next_tag( array( 'tag_name' => 'svg' ) );
	// If svg tag doesnt have xmlns attribute, add it.
	if ( ! $tags->get_attribute( 'xmlns' ) ) {
		$tags->set_attribute( 'xmlns', 'http://www.w3.org/2000/svg' );
	}
	$tags->next_tag( array( 'tag_name' => 'path' ) );
	$tags->set_attribute( 'fill', $fill_color );
	$icon_markup = $tags->get_updated_html();

	wp_cache_set( $icon_cache_key, $icon_markup, $icon_cache_group, PRC_PLATFORM_ICONS_CACHE_TTL );

	return $icon_markup;
}

/**
 * Get the icon as a data URI.
 * Useful for inlining icons in CSS.
 *
 * @param string $library The library to use.
 * @param string $icon The name of the icon.
 * @return string Encoded data URI representing the icon.
 */
function get_icon_as_data_uri( $library, $icon, $fill_color = 'currentColor' ) {
	if ( ! defined( 'PRC_PLATFORM_ICONS_URL' ) ) {
		return '<!-- Error: PRC_PLATFORM_ICONS_URL is not defined. -->';
	}
	$icon = get_icon_as_svg( $library, $icon, $fill_color );
	$icon = rawurlencode( $icon );
	$icon = 'data:image/svg+xml,' . $icon;
	return $icon;
}
