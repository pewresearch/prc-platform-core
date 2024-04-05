<?php
namespace PRC\Platform;

class Block_Area_Modules {
	public static $taxonomy = 'block_area';
	public static $post_type = 'block_module';
	public static $handle = 'prc-platform-block-area-modules';
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $version, $loader ) {
		$this->version = $version;
		require_once plugin_dir_path( __FILE__ ) . '/blocks/block-area/block-area.php';
		require_once plugin_dir_path( __FILE__ ) . '/blocks/block-area-context-provider/block-area-context-provider.php';
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$block_area = new Block_Area();
			$block_area_context_provider = new Block_Area_Context_Provider();

			// Init Block Area Modules
			$loader->add_action( 'init', $this, 'register_block_areas' );
			$loader->add_action( 'init', $this, 'register_block_modules' );
			$loader->add_action( 'ini', $this, 'register_meta' );
			$loader->add_action( 'rest_api_init', $this, 'register_rest_fields' );
			$loader->add_filter( 'prc_load_gutenberg', $this, 'enable_gutenberg_ramp' );

			// When saving block_modules update block area context
			$loader->add_action(
				'prc_platform_on_update',
				$this,
				'on_block_module_update_store_story_item_ids',
				10, 2
			);
			$loader->add_action(
				'prc_platform_on_rest_update',
				$this,
				'on_block_module_update_store_story_item_ids',
				10, 2
			);
			$loader->add_action(
				'prc_platform_on_update',
				$block_area_context_provider,
				'clear_cache_on_block_module_saves'
			);

			// Handle block area context
			$loader->add_filter(
				'render_block_context',
				$block_area_context_provider,
				'construct_block_context',
				1, 3
			);
			$loader->add_filter(
				'render_block_context',
				$block_area_context_provider,
				'execute_block_context',
				100, 3
			);
			$loader->add_action(
				'pre_get_posts',
				$block_area_context_provider,
				'execute_on_main_query',
			);

			// Init Blocks
			$loader->add_action( 'init', $block_area, 'block_init' );
			$loader->add_action( 'init', $block_area_context_provider, 'block_init');
		}
	}

	public function register_block_areas() {
		$labels = array(
			'name'                       => _x( 'Block Areas', 'Taxonomy General Name', 'text_domain' ),
			'singular_name'              => _x( 'Block Area', 'Taxonomy Singular Name', 'text_domain' ),
			'menu_name'                  => __( 'Block Areas', 'text_domain' ),
			'all_items'                  => __( 'All block areas', 'text_domain' ),
			'parent_item'                => __( 'Parent Block Area', 'text_domain' ),
			'parent_item_colon'          => __( 'Parent Block Area:', 'text_domain' ),
			'new_item_name'              => __( 'New Block Area Name', 'text_domain' ),
			'add_new_item'               => __( 'Add New Block Area', 'text_domain' ),
			'edit_item'                  => __( 'Edit Block Area', 'text_domain' ),
			'update_item'                => __( 'Update Block Area', 'text_domain' ),
			'view_item'                  => __( 'View Block Area', 'text_domain' ),
			'separate_items_with_commas' => __( 'Separate block areas with commas', 'text_domain' ),
			'add_or_remove_items'        => __( 'Add or remove block areas', 'text_domain' ),
			'choose_from_most_used'      => __( 'Choose from the most used', 'text_domain' ),
			'popular_items'              => __( 'Popular block areas', 'text_domain' ),
			'search_items'               => __( 'Search block areas', 'text_domain' ),
			'not_found'                  => __( 'Not Found', 'text_domain' ),
			'no_terms'                   => __( 'No block areas', 'text_domain' ),
			'items_list'                 => __( 'Block areas list', 'text_domain' ),
			'items_list_navigation'      => __( 'Block areas list navigation', 'text_domain' ),
		);

		$args = array(
			'labels'            => $labels,
			'hierarchical'      => true,
			'public'            => true,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud'     => false,
			'show_in_rest'      => true,
		);

		register_taxonomy( self::$taxonomy, self::$post_type, $args );
	}

	public function register_block_modules() {
		$labels  = array(
			'name'                  => _x( 'Block Modules', 'Post Type General Name', 'text_domain' ),
			'singular_name'         => _x( 'Module', 'Post Type Singular Name', 'text_domain' ),
			'menu_name'             => __( 'Block Modules', 'text_domain' ),
			'name_admin_bar'        => __( 'Module', 'text_domain' ),
			'archives'              => __( 'Modules Archives', 'text_domain' ),
			'parent_item_colon'     => __( 'Parent Module:', 'text_domain' ),
			'all_items'             => __( 'All Modules', 'text_domain' ),
			'add_new_item'          => __( 'Add New Module', 'text_domain' ),
			'add_new'               => __( 'Add New', 'text_domain' ),
			'new_item'              => __( 'New Module', 'text_domain' ),
			'edit_item'             => __( 'Edit Module', 'text_domain' ),
			'update_item'           => __( 'Update Module', 'text_domain' ),
			'view_item'             => __( 'View Module', 'text_domain' ),
			'search_items'          => __( 'Search Modules', 'text_domain' ),
			'not_found'             => __( 'Not found', 'text_domain' ),
			'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
			'featured_image'        => __( 'Featured Image', 'text_domain' ),
			'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
			'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
			'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
			'insert_into_item'      => __( 'Insert into Module', 'text_domain' ),
			'uploaded_to_this_item' => __( 'Uploaded to this Module', 'text_domain' ),
			'items_list'            => __( 'Modules list', 'text_domain' ),
			'items_list_navigation' => __( 'Modules list navigation', 'text_domain' ),
			'filter_items_list'     => __( 'Filter Module list', 'text_domain' ),
		);

		$rewrite = array(
			'slug'       => 'block-module',
			'with_front' => true,
			'pages'      => true,
			'feeds'      => true,
		);

		$args    = array(
			'label'               => __( 'Block Module', 'text_domain' ),
			'description'         => __( 'A block module goes into a block area', 'text_domain' ),
			'labels'              => $labels,
			'supports'            => array(
				'title',
				'editor',
				'excerpt',
				'author',
				'custom-fields',
				'revisions'
			),
			'taxonomies'          => array( 'category', 'block_area' ),
			'hierarchical'        => false,
			'public'              => true,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-screenoptions',
			'menu_position'       => 5,
			'show_in_admin_bar'   => true,
			'show_in_nav_menus'   => true,
			'show_in_rest'        => true,
			'can_export'          => true,
			'has_archive'         => true,
			'exclude_from_search' => false,
			'publicly_queryable'  => true,
			'rewrite'             => $rewrite,
			'capability_type'     => 'post',
		);

		register_post_type( self::$post_type, $args );
	}

	public function enable_gutenberg_ramp($post_types) {
		array_push( $post_types, self::$post_type );
		return $post_types;
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function register_meta() {
		register_post_meta(
			self::$post_type,
			'_story_item_ids',
			array(
				'show_in_rest'  => true,
				'single'        => true,
				'default' 	    => 'public',
				'type'          => 'array',
				'auth_callback' => function() {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	/**
	 * Register `_story_item_ids` rest field.
	 *
	 * Adds an array of story item post id's to the block module post type.
	 *
	 * @hook rest_api_init
	 */
	public function register_rest_fields() {
		register_rest_field(
			self::$post_type,
			'_story_item_ids',
			array(
				'get_callback'    => function( $object ) {
					return get_post_meta( $object['id'], '_story_item_ids', true );
				},
				'update_callback' => function( $value, $object ) {
					return update_post_meta( $object->ID, '_story_item_ids', $value );
				},
				'schema'          => array(
					'description' => "Collected prc-block/story-item post id's from the block module.",
					'type'        => 'array',
				),
			)
		);
	}

	public function get_query_args(
		$category_slug = null,
		$block_area_slug = null,
		$inherit_category = false,
		$reference_id = false
	) {
		if ( null === $block_area_slug && false === $reference_id ) {
			return false;
		}

		if ( true === $inherit_category ) {
			global $wp_query;
			if ( $wp_query->is_main_query() && $wp_query->is_category() ) {
				$queried_object = $wp_query->get_queried_object();
				$category_slug = $queried_object->slug;
			}
		}

		$tax_query = array(
			'relation' => 'AND',
			array(
				'taxonomy' => 'block_area',
				'field' => 'slug',
				'terms' => array($block_area_slug),
			)
		);

		if ( null !== $category_slug ) {
			array_push($tax_query, array(
				'taxonomy' => 'category',
				'field' => 'slug',
				'terms' => array($category_slug),
				'include_children' => false, //
			));
		}

		$block_module_query_args = array(
			'post_type' => 'block_module',
			'posts_per_page' => 1,
			'fields' => 'ids',
			'tax_query' => $tax_query,
		);

		if ( false !== $reference_id ) {
			$block_module_query_args['post__in'] = array($reference_id);
			unset($block_module_query_args['tax_query']);
		}

		do_action('qm/debug', 'Block Area Query Args' . print_r($block_module_query_args, true));

		return $block_module_query_args;
	}

	/**
	 * A very fast way to collect story item id's from innerblocks.
	 *
	 * It doesn't check for anything else, it doesn't care for anything else, it just collects the id attribute if it exists for story-item blocks and returns them in an array.
	 *
	 * @param mixed $blocks
	 * @return array
	 */
	public function collect_story_item_ids($blocks) {
		$story_item_post_ids = [];
		$temp_ids = [];

		foreach ($blocks as $block) {
			if ('prc-block/story-item' === $block['blockName'] && isset($block['attrs']['postId'])) {
				$story_item_post_ids[] = $block['attrs']['postId'];
			}
			if (isset($block['innerBlocks'])) {
				$temp_ids[] = $this->collect_story_item_ids($block['innerBlocks']);
			}
		}

		foreach ($temp_ids as $ids) {
			$story_item_post_ids = array_merge($story_item_post_ids, $ids);
		}

		return array_values($story_item_post_ids);
	}

	/**
	 * @hook prc_platform_on_update, prc_platform_on_rest_update
	 * @param mixed $post
	 * @param mixed $has_blocks
	 * @return void
	 */
	public function on_block_module_update_store_story_item_ids($post, $has_blocks){
		if ( self::$post_type !== $post->post_type ) {
			return;
		}
		$content = $post->post_content;
		$block_module_blocks = parse_blocks($content);

		$story_item_ids = $this->collect_story_item_ids($block_module_blocks);

		update_post_meta(
			$post->ID,
			'_story_item_ids',
			$story_item_ids,
		);
	}


}
