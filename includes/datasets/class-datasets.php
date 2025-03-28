<?php
namespace PRC\Platform;

use TDS\Invalid_Input_Exception;
use TDS\get_related_post;
use TDS\get_related_term;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

class Datasets {
	public static $post_object_name     = 'dataset';
	public static $taxonomy_object_name = 'datasets';
	public static $download_meta_key    = '_download_attachment_id';
	public static $atp_legal_key        = 'is_atp';
	public static $schema_key           = 'dataset_schema';
	public static $enabled_post_types   = array(
		'post',
		'interactives',
		'fact-sheets',
		'fact-sheet',
		'interactive',
		'short-read',
		'quiz',
		'chart',
	);

	/**
	 * Settings for the dataset post type.
	 */
	public static $post_object_args = array(
		'labels'             => array(
			'name'                       => 'Datasets',
			'singular_name'              => 'Dataset',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Dataset',
			'edit_item'                  => 'Edit Dataset',
			'new_item'                   => 'New Dataset',
			'all_items'                  => 'Datasets',
			'view_item'                  => 'View Dataset',
			'search_items'               => 'Search datasets',
			'not_found'                  => 'No dataset found',
			'not_found_in_trash'         => 'No dataset found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Item',
			'new_item_name'              => 'New Item Name',
			'add_new_item'               => 'Add New Item',
			'separate_items_with_commas' => 'Separate items with commas',
			'add_or_remove_items'        => 'Add or remove items',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Items',
			'items_list'                 => 'Items list',
			'items_list_navigation'      => 'Items list navigation',
			'menu_name'                  => 'Datasets',
		),
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'show_in_rest'       => true,
		'query_var'          => true,
		'rewrite'            => false,
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => 10,
		'menu_icon'          => 'dashicons-download',
		'supports'           => array( 'title', 'editor', 'excerpt', 'revisions', 'custom-fields' ),
	);

	/**
	 * Settings for the dataset taxonomy.
	 */
	public static $taxonomy_object_args = array(
		'labels'            => array(
			'name'                       => 'Datasets',
			'singular_name'              => 'Dataset',
			'add_new'                    => 'Add New',
			'add_new_item'               => 'Add New Dataset',
			'edit_item'                  => 'Edit Dataset',
			'new_item'                   => 'New Dataset',
			'all_items'                  => 'Datasets',
			'view_item'                  => 'View Dataset',
			'search_items'               => 'Search datasets',
			'not_found'                  => 'No dataset found',
			'not_found_in_trash'         => 'No dataset found in Trash',
			'parent_item_colon'          => '',
			'parent_item'                => 'Parent Item',
			'new_item_name'              => 'New Item Name',
			'separate_items_with_commas' => 'Separate items with commas',
			'add_or_remove_items'        => 'Add or remove items',
			'choose_from_most_used'      => 'Choose from the most used',
			'popular_items'              => 'Popular Items',
			'items_list'                 => 'Items list',
			'items_list_navigation'      => 'Items list navigation',
			'menu_name'                  => 'Datasets',
		),
		'hierarchical'      => false,
		'public'            => true,
		'rewrite'           => array(
			'slug'         => 'dataset',
			'with_front'   => false,
			'hierarchical' => false,
		),
		'show_ui'           => true,
		'show_admin_column' => true,
		'show_in_rest'      => true,
		'show_in_menu'      => true,
		'show_in_nav_menus' => false,
		'show_tagcloud'     => false,
	);

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $handle = 'prc-platform-datasets';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string $plugin_name       The name of this plugin.
	 * @param      string $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . '/downloads-log/index.php';
		require_once plugin_dir_path( __FILE__ ) . '/class-cli-missing-files.php';
		$this->init( $loader );
	}

	public function init( $loader ) {
		if ( null !== $loader ) {
			// Establish a bi-directional relationship between the "dataset" post type and the "datasets" taxonomy.
			$loader->add_action( 'init', $this, 'register_term_data_store' );
			$loader->add_action( 'init', $this, 'block_init' );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_panel' );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_dataset_endpoints' );
			$loader->add_filter( 'prc_platform_rewrite_rules', $this, 'archive_rewrites' );
			$loader->add_action( 'wp_head', $this, 'schema_ld_json' );

			$loader->add_filter( 'post_type_link', $this, 'modify_dataset_permalink', 20, 2 );
			$loader->add_action( 'admin_bar_menu', $this, 'modify_admin_bar_edit_link', 100 );
			$loader->add_action( 'enqueue_block_editor_assets', $this, 'register_dataset_description_block' );

			$download_logger = new Datasets_Download_Logger();
			$loader->add_action( 'init', $download_logger, 'register_meta' );
			$loader->add_action( 'rest_api_init', $download_logger, 'register_field' );
			$loader->add_filter( 'prc_api_endpoints', $download_logger, 'register_download_logger_endpoint' );
			$loader->add_filter( 'prc_api_endpoints', $download_logger, 'register_download_stats_endpoint' );
		}
	}

	/**
	 * Register the dataset post type and taxonomy and establish a relationship between them.
	 *
	 * @hook init
	 */
	public function register_term_data_store() {
		register_post_type( self::$post_object_name, self::$post_object_args );
		register_taxonomy( self::$taxonomy_object_name, self::$enabled_post_types, self::$taxonomy_object_args );
		$relationship = \TDS\add_relationship( self::$post_object_name, self::$taxonomy_object_name );
		$this->register_dataset_fields();
	}

	/**
	 * @hook prc_platform_rewrite_rules
	 * @param array $rewrite_rules
	 * @return array $rewrite_rules
	 */
	public function archive_rewrites( $rewrite_rules ) {
		return array_merge(
			$rewrite_rules,
			array(
				'datasets/(\d\d\d\d)/page/?([0-9]{1,})/?$' => 'index.php?post_type=dataset&year=$matches[1]&paged=$matches[2]',
			),
			array(
				'datasets/(\d\d\d\d)/?$' => 'index.php?post_type=dataset&year=$matches[1]',
			),
			array(
				'datasets/page/?([0-9]{1,})/?$' => 'index.php?post_type=dataset&paged=$matches[1]',
			),
			array(
				'datasets/?$' => 'index.php?post_type=dataset',
			),
		);
	}

	/**
	 * Modifies the dataset permalink to point to the datasets term archive permalink.
	 *
	 * @hook post_link
	 * @param string  $url
	 * @param WP_Post $post
	 * @return string
	 */
	public function modify_dataset_permalink( $url, $post ) {
		if ( 'publish' !== $post->post_status ) {
			return $url;
		}
		if ( self::$post_object_name === $post->post_type ) {
			// Get the matching term...
			$dataset_term = \TDS\get_related_term( $post->ID );
			if ( ! $dataset_term ) {
				return $url;
			}
			// get the term link
			$matched_url = get_term_link( $dataset_term, self::$taxonomy_object_name );
			if ( ! is_wp_error( $matched_url ) ) {
				return $matched_url;
			}
		}
		return $url;
	}

	/**
	 * @hook admin_bar_menu
	 * @param mixed $admin_bar
	 * @return void
	 */
	public function modify_admin_bar_edit_link( $admin_bar ) {
		if ( ! is_tax( self::$taxonomy_object_name ) ) {
			return;
		}

		$term_id = get_queried_object()->term_id;
		// get the associated post id...
		$dataset_id = \TDS\get_related_post( $term_id, self::$taxonomy_object_name );

		if ( is_wp_error( $dataset_id ) ) {
			return;
		}

		$admin_bar->remove_menu( 'edit' );

		$link = get_edit_post_link( $dataset_id );
		$admin_bar->add_menu(
			array(
				'parent' => false,
				'id'     => 'edit_dataset',
				'title'  => __( 'Edit Dataset' ),
				'href'   => $link,
				'meta'   => array(
					'title' => __( 'Edit Dataset' ),
				),
			)
		);
	}

	/**
	 * Registers the download endpoint. Checks the nonce against user credentials and
	 *
	 * @hook prc_api_endpoints
	 * @return void
	 */
	public function register_dataset_endpoints( $endpoints ) {
		$get_download_endpoint = array(
			'route'               => 'datasets/get-download',
			'methods'             => 'POST',
			'args'                => array(
				'dataset_id' => array(
					'required' => true,
					'type'     => 'integer',
				),
			),
			'callback'            => array( $this, 'restfully_download_dataset' ),
			'permission_callback' => function ( WP_REST_Request $request ) {
				return true;
			},
		);

		$check_atp_endpoint = array(
			'route'               => 'datasets/check-atp',
			'methods'             => 'POST',
			'callback'            => array( $this, 'restfully_check_atp_acceptance' ),
			'permission_callback' => function ( WP_REST_Request $request ) {
				return true;
			},
		);

		$accept_atp_endpoint = array(
			'route'               => 'datasets/accept-atp',
			'methods'             => 'POST',
			'callback'            => array( $this, 'restfully_accept_atp' ),
			'permission_callback' => function ( WP_REST_Request $request ) {
				return true;
			},
		);

		array_push( $endpoints, $get_download_endpoint );
		array_push( $endpoints, $check_atp_endpoint );
		array_push( $endpoints, $accept_atp_endpoint );
		return $endpoints;
	}

	/**
	 * Get the original blog id from the post meta.
	 *
	 * @param mixed $post_id
	 * @return int|null
	 */
	public static function get_original_blog_id( $post_id ) {
		$value = get_post_meta( $post_id, 'dt_original_blog_id', true );
		if ( is_numeric( $value ) ) {
			return intval( $value );
		} else {
			return null;
		}
	}

	/**
	 * Get the original post id from the post meta.
	 *
	 * @param mixed $post_id
	 * @return int|null
	 */
	public static function get_original_post_id( $post_id ) {
		$value = get_post_meta( $post_id, 'dt_original_post_id', true );
		if ( is_numeric( $value ) ) {
			return intval( $value );
		} else {
			return null;
		}
	}

	protected static function get_original_site_slug( $site_id ) {
		// based on the $this->original_site_id, get the site slug.
		switch ( $site_id ) {
			case 2:
				return '/global';
				break;
			case 3:
				return '/social-trends';
				break;
			case 4:
				return '/politics';
				break;
			case 5:
				return '/hispanic';
				break;
			case 7:
				return '/religion';
				break;
			case 8:
				return '/journalism';
				break;
			case 9:
				return '/internet';
				break;
			case 10:
				return '/methods';
				break;
			case 16:
				return '/science';
				break;
			case 18:
				return '/race-ethnicity';
				break;
			case 19:
				return '/decoded';
				break;
			default:
				return '';
				break;
		}
	}

	/**
	 * Simple function to return the original site rest route. Replaces the post id from the current rest route with the original post id.
	 */
	protected static function get_original_rest_route( $post_id, $original_post_id, $rest_route ) {
		return str_replace( $post_id, $original_post_id, $rest_route );
	}

	/**
	 * Tries to find the download from the archive on legacy.pewresearch.org.
	 * Once it finds it, it will enqueue an action to save the download to the current dataset
	 * and return the download url for immediate download.
	 *
	 * @param int $dataset_id
	 * @return string | WP_Error
	 */
	public function attempt_download_from_archive( $dataset_id ) {
		$original_blog_id    = self::get_original_blog_id( $dataset_id );
		$original_post_id    = self::get_original_post_id( $dataset_id );
		$original_site_slug  = self::get_original_site_slug( $original_blog_id );
		$original_rest_route = rest_get_route_for_post( $dataset_id );
		$original_rest_route = self::get_original_rest_route( $dataset_id, $original_post_id, $original_rest_route );
		$rest_endpoint       = 'https://legacy.pewresearch.org' . $original_site_slug . '/wp-json' . $original_rest_route;

		$response = \vip_safe_wp_remote_get( $rest_endpoint );
		if ( is_wp_error( $response ) ) {
			return rest_ensure_response(
				array(
					'status'  => 'error',
					'message' => 'Failed to get the original dataset from archive.',
				)
			);
		}
		$data = wp_remote_retrieve_body( $response );
		if ( is_wp_error( $data ) ) {
			return $data;
		}
		$data = json_decode( $data, true );
		// We need to get one of the legacy dataset meta keys...
		// If we find it, we should prepare to return it, but also fire off an as_enqueu_action to save it to the current dataset so we'll pass it the current dataset id and the new url for the media.
		$original_dataset_media_url = null;
		if ( array_key_exists( 'dataset_download_url', $data ) ) {
			$original_dataset_media_url = $data['dataset_download_url'];
		}
		if ( empty( $original_dataset_media_url ) ) {
			return rest_ensure_response(
				array(
					'status'  => 'error',
					'message' => 'Failed to get the original dataset media from archive.',
				)
			);
		}
		as_enqueue_async_action(
			'prc_dataset_recovery',
			array(
				'dataset_id' => $dataset_id,
				'file_url'   => $original_dataset_media_url,
			),
			$dataset_id,
			true,
			5
		);

		return $original_dataset_media_url;
	}

	/**
	 * Restfully download a dataset.
	 *
	 * @param WP_REST_Request $request
	 * @return WP_REST_Response|WP_Error
	 */
	public function restfully_download_dataset( WP_REST_Request $request ) {
		$data  = json_decode( $request->get_body(), true );
		$nonce = array_key_exists( 'NONCE', $data ) ? $data['NONCE'] : null;
		if ( ! wp_verify_nonce( $nonce, 'prc_platform_dataset_download' ) ) {
			return new WP_Error(
				'invalid_nonce',
				'Invalid nonce.',
				array(
					'status' => 400,
					'data'   => $data,
				)
			);
		}
		if ( ! array_key_exists( 'uid', $data ) ) {
			return new WP_Error( 'no_uid', 'No UID provided.', array( 'status' => 400 ) );
		}
		$uid = $data['uid'];

		$id = $request->get_param( 'dataset_id' );
		if ( ! $id ) {
			return new WP_Error( 'no_id', 'No dataset ID provided.', array( 'status' => 400 ) );
		}
		$file_url      = null;
		$attachment_id = get_post_meta( $id, self::$download_meta_key, true );
		// We need to fall back and look for
		if ( $attachment_id ) {
			$file_url = wp_get_attachment_url( $attachment_id );
		}
		if ( ! $file_url || empty( $file_url ) ) {
			// If ultimately we can not get an attachment url, we should check the archive.
			$file_url = get_post_meta( $id, 'dataset_download_url', true );
			if ( ! $file_url || empty( $file_url ) ) {
				// $file_url = $this->attempt_download_from_archive( $id );
				return rest_ensure_response(
					array(
						'error' => 'No file found for dataset.',
					)
				);
			}
		}

		if ( ! $file_url ) {
			return rest_ensure_response(
				array(
					'error' => 'No file found for dataset.',
				)
			);
		} else {
			// Log the download.
			$download_logger = new Datasets_Download_Logger();
			$download_logger->increment_download_total( $id );
			$download_logger->log_monthly_download_count( $id );
			$download_logger->log_dataset_to_user( $uid, $id );
			return rest_ensure_response(
				array(
					'file_url' => $file_url,
				)
			);
		}
	}

	public function restfully_check_atp_acceptance( WP_REST_Request $request ) {
		$data  = json_decode( $request->get_body(), true );
		$nonce = array_key_exists( 'NONCE', $data ) ? $data['NONCE'] : null;
		if ( ! wp_verify_nonce( $nonce, 'prc_platform_dataset_download' ) ) {
			return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 400 ) );
		}
		if ( ! array_key_exists( 'uid', $data ) ) {
			return new WP_Error( 'no_uid', 'No UID provided.', array( 'status' => 400 ) );
		}
		$uid = $data['uid'];
		if ( ! class_exists( 'PRC\Platform\User_Accounts\User_Data' ) ) {
			return new WP_Error( 'no_user_accounts', 'User Accounts class not found.', array( 'status' => 400 ) );
		}
		$user = new \PRC\Platform\User_Accounts\User_Data( $uid, null );
		return rest_ensure_response( $user->check_atp() );
	}

	public function restfully_accept_atp( WP_REST_Request $request ) {
		$data  = json_decode( $request->get_body(), true );
		$nonce = array_key_exists( 'NONCE', $data ) ? $data['NONCE'] : null;
		if ( ! wp_verify_nonce( $nonce, 'prc_platform_dataset_download' ) ) {
			return new WP_Error( 'invalid_nonce', 'Invalid nonce.', array( 'status' => 400 ) );
		}
		if ( ! array_key_exists( 'uid', $data ) ) {
			return new WP_Error( 'no_uid', 'No UID provided.', array( 'status' => 400 ) );
		}
		$uid = $data['uid'];
		if ( ! class_exists( 'PRC\Platform\User_Accounts\User_Data' ) ) {
			return new WP_Error( 'no_user_accounts', 'User Accounts class not found.', array( 'status' => 400 ) );
		}
		$user = new \PRC\Platform\User_Accounts\User_Data( $uid, null );
		return rest_ensure_response( $user->accept_atp() );
	}

	public function register_dataset_fields() {
		register_post_meta(
			self::$post_object_name,
			self::$download_meta_key,
			array(
				'description'   => 'Attachment ID for the dataset download.',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'integer',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			self::$post_object_name,
			self::$atp_legal_key,
			array(
				'description'   => 'Is this dataset under the ATP legal agreement?',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);

		register_post_meta(
			self::$post_object_name,
			self::$schema_key,
			array(
				'description'   => 'Dataset schema.',
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'string',
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * @hook enqueue_block_editor_assets
	 */
	public function enqueue_panel() {
		$screen = get_current_screen();
		if ( ! is_admin() || ! in_array( $screen->post_type, array( self::$post_object_name ) ) ) {
			return;
		}

		$asset_file = include plugin_dir_path( __FILE__ ) . 'build/panel/index.asset.php';
		$asset_slug = 'prc-platform-datasets-panel';
		$script_src = plugin_dir_url( __FILE__ ) . 'build/panel/index.js';

		wp_enqueue_script(
			$asset_slug,
			$script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);
	}

	/**
	 * @hook wp_head
	 */
	public function schema_ld_json() {
		$schema_json  = null;
		$schema_class = null;
		if ( is_tax( self::$taxonomy_object_name ) ) {
			$dataset_id = get_the_ID();
			// But, usually, we're going to be viewing these from the perspective of the datasets taxonomy archive, so use that to get the dataset id.
			if ( is_tax( 'datasets' ) ) {
				$dataset_term_id = get_queried_object_id();
				$dataset         = \TDS\get_related_post( $dataset_term_id, 'datasets' );
				$dataset_id      = $dataset->ID;
			}

			$schema_json  = get_post_meta( $dataset_id, self::$schema_key, true );
			$schema_class = 'dataset-schema-single';
		} elseif ( is_post_type_archive( self::$post_object_name ) ) {
			ob_start();
			?>
				{
					"@context" : "https://schema.org",
					"@id" : "https://www.pewresearch.org/datasets/",
					"@type" : "DataCatalog",
					"name" : "Pew Research Center - Datasets",
					"creator" : {
						"@type" : "Organization",
						"@id" : "https://www.pewresearch.org",
						"name" : "Pew Research Center"
					},
					"description" : "Pew Research Center makes the case-level microdata for much of its research available to the public for secondary analysis after a period of time.",
					"funder" : [
						{
						"@type" : "Organization",
						"@id" : "https://pewtrusts.org/",
						"name" : "Pew Charitable Trusts"
						},
						{
						"@type" : "Organization",
						"@id" : "https://www.templeton.org/",
						"name" : "John Templeton Foundation"
						}
					],
					"about" :[
						{
						"@id": "http://id.loc.gov/authorities/subjects/sh85112549"
						},
						{
						"name" : "religion data"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85127580"
						},
						{
						"name" : "religion surveys"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85124003",
						"name" : "social science surveys"
						},
						{
						"@id" : "http://id.loc.gov/authorities/subjects/sh85104459",
						"name": "political surveys"
						}
					],
					"genre" : [
						{"@id" : "http://id.loc.gov/authorities/genreForms/gf2014026059",
						"name" : "Census data"
						}
					]
				}
			<?php
			$schema_json  = ob_get_clean();
			$schema_class = 'dataset-schema-archive';
		}

		if ( $schema_json ) {
			echo wp_sprintf(
				'<script type="application/ld+json" class="%s">%s</script>',
				$schema_class,
				wp_kses_data( $schema_json ),
			);
		}
	}

	public function get_dataset_description_for_block_binding( $source_args, $block, $attribute_name ) {
		// Don't run this for anything other than the paragraph block.
		if ( 'core/paragraph' !== $block->name ) {
			return;
		}
		if ( is_tax( self::$taxonomy_object_name ) || is_singular( self::$post_object_name ) ) {
			$dataset_term_id = get_queried_object_id();
			$dataset         = \TDS\get_related_post( $dataset_term_id, 'datasets' );
			$dataset_id      = $dataset->ID;
		} else {
			$dataset_id = get_the_ID();
		}
		$dataset_content = get_post_field( 'post_content', $dataset_id );
		$content         = apply_filters( 'the_content', $dataset_content );
		return $content;
	}

	public function register_dataset_description_block() {
		// get the current directory...
		$block_json_file    = plugin_dir_path( __FILE__ ) . 'build/dataset-description-block/block.json';
		$block_json         = \wp_json_file_decode( $block_json_file, array( 'associative' => true ) );
		$block_json['file'] = wp_normalize_path( realpath( $block_json_file ) );
		$editor_script      = register_block_script_handle( $block_json, 'editorScript' );
		wp_enqueue_script( $editor_script );
	}

	public function block_init() {
		register_block_bindings_source(
			'prc-platform/dataset-description',
			array(
				'label'              => __( 'Dataset Description', 'prc-platform/dataset-description' ),
				'get_value_callback' => array( $this, 'get_dataset_description_for_block_binding' ),
			)
		);
		register_block_type( __DIR__ . '/build/dataset-atp-legal-acceptance-block' );
		register_block_type( __DIR__ . '/build/download-block' );
	}
}
