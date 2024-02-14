<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once plugin_dir_path( __FILE__ ) . '/class-query.php';
require_once plugin_dir_path( __FILE__ ) . '/class-schema.php';
require_once plugin_dir_path( __FILE__ ) . '/class-shape.php';
require_once plugin_dir_path( __FILE__ ) . '/class-table.php';

// Instantiate the standard Dataset Downloads Log table.
$dataset_downloads = new Dataset_Downloads_Log();
// If the table does not exist, then create the table.
if ( ! $dataset_downloads->exists() ) {
	$dataset_downloads->install();
}

// Uninstall the database. Uncomment this code to force the database to rebuild.
if( $dataset_downloads->exists() ){
	// $dataset_downloads->uninstall();
}
