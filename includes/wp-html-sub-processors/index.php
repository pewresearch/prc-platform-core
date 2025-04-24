<?php
/**
 * WP HTML Sub Processors
 *
 * @package PRC\Platform
 */

namespace PRC\Platform\Core\WP_HTML_Sub_Processors;

require_once plugin_dir_path( __FILE__ ) . 'class-wp-html-get-element.php';
require_once plugin_dir_path( __FILE__ ) . 'class-wp-html-heading-processor.php';
require_once plugin_dir_path( __FILE__ ) . 'class-wp-html-table-processor.php';

/**
 * Processes a table block into an array of data. All HTML is stripped from the table.
 *
 * Tested with the core/table block and flexible-table/table block.
 *
 * @param string $table_content The content of the table block.
 * @return array
 */
function parse_table_block_into_array( $table_content ) {
	// Strip $table_content of any <!-- comments -->, which can interfer with the parser below.
	$table_content = preg_replace( '/<!--(.|\s)*?-->/', '', $table_content );
	$processor     = new \WP_HTML_Table_Processor( $table_content );
	return $processor->get_data();
}
