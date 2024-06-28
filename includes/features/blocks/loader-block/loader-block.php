<?php
namespace PRC\Platform;

/**
 * Block Name:        Feature Loader Block
 * Description:       A block that loads a feature on the front end.
 * Requires at least: 6.4
 * Requires PHP:      8.1
 * Author:            Seth Rubenstein
 *
 * @package           prc-platform
 */

class Loader_Block extends Features {
	public function __construct($loader) {
		$this->init($loader);
	}

	public function init($loader = null) {
		if ( null !== $loader ) {
			$loader->add_action( 'init', $this, 'block_init' );
			$loader->add_filter( 'pre_render_block', $this, 'feature_loader_pre_render_enqueue_assets', 10, 3 );
			$loader->add_filter( 'prc_api_endpoints', $this, 'register_endpoint' );
		}
	}

	public function loader_shortcode_fallback($attributes, $content) {
		$args = wp_parse_args(
			$attributes,
			array(
				'appname' => false,
				'path'    => false,
				'deps'    => false,
				'version' => '1.0',
			)
		);

		$args = array(
			'slug' => $args['id'],
			'legacyWpackIo' => $args,
		);


		if ( function_exists( 'wp_sentry_safe' ) ) {
			$slug = $args['slug'];
			$message = 'Feature with slug: ' . $slug . ' did not migrate as expected.';
			wp_sentry_safe( function ( \Sentry\State\HubInterface $client ) use ($message) {
				$client->withScope(function (\Sentry\State\Scope $scope) use ($client, $message) {
					$scope->setTag('features-migration', true);
					$client->captureMessage($message, \Sentry\Severity::debug() );
				});
			} );
		}

		$block = new \WP_Block_Parser_Block(
			'prc-platform/feature-loader',
			$args,
			array(),
			'',
			array()
		);
		$rendered = render_block((array) $block);
		return $rendered;
	}

	/**
	 * @hook pre_render_block
	 *
	 */
	public function feature_loader_pre_render_enqueue_assets($pre_render, $parsed_block, $parent_block_obj) {
		if ( is_admin() || !isset($parsed_block) ) {
			return $pre_render;
		}
		if ( 'prc-platform/feature-loader' !== $parsed_block['blockName'] ) {
			return $pre_render;
		}
		$attributes = $parsed_block['attrs'];

		$is_legacy_wpackio = array_key_exists('legacyWpackIo', $attributes) && $attributes['legacyWpackIo'];
		$is_legacy_s3 = array_key_exists('legacyS3', $attributes) && $attributes['legacyS3'];

		$enqueued_handles = array();

		if ( $is_legacy_wpackio ) {
			// try to load the legacy wpackio, and if it fails, then log the error and return.
			try {
				$enqueued_handles = $this->load_legacy_wpackIO($attributes['legacyWpackIo']);
			} catch ( \Exception $e ) {
				if ( function_exists( 'wp_sentry_safe' ) ) {
					wp_sentry_safe( function ( \Sentry\State\HubInterface $client ) use ( $e ) {
						$client->withScope(function (\Sentry\State\Scope $scope) use ($client, $e) {
							$scope->setTag('interactive_type', 'wpackio');
							$client->captureException($e);
						});
					} );
				}
				return;
			}
		} elseif( $is_legacy_s3 ) {
			$attributes['legacyS3']['slug'] = $attributes['slug'];
			$enqueued_handles = $this->load_legacy_S3($attributes['legacyS3']);
		} else {
			$enqueued_handles = $this->load($attributes['slug']);
		}



		do_action('prc_platform_feature_loader_enqueue', $enqueued_handles, array(
			'is_legacy' => $is_legacy_wpackio || $is_legacy_s3,
		));

		$url_rewrites = $this->get_rewrites_params();

		if ( $url_rewrites ) {
			$script_handle =
			'prc-platform-feature-' . $attributes['slug'];
			if ( $is_legacy_wpackio || $is_legacy_s3 ) {
				$script_handle = $enqueued_handles['script'];
			}
			// Use wp_add_inline_script to localize the script instead of wp_localize_script because we want to add the data before the script is enqueued and we want to support multiple localizations for the same script.
			wp_add_inline_script(
				$script_handle,
				'if ( typeof prcURLVars === "undefined" ) { var prcURLVars = {}; } prcURLVars = ' . wp_json_encode($url_rewrites) . ';',
				'before'
			);
		}

		return $pre_render;
	}

	/**
	 * Loads the necessary script and attachment markup for an feature to load on the front end.
	 * @param mixed $attributes
	 * @param mixed $content
	 * @param mixed $block
	 * @return string
	 */
	public function render_feature_loader_callback($attributes, $content, $block) {
		if ( is_admin() ) {
			return;
		}
		$block_wrapper_attrs = get_block_wrapper_attributes(array(
			'id' => "js-{$attributes['slug']}"
		));

		$content = wp_sprintf(
			'<div %1$s>%2$s</div>',
			$block_wrapper_attrs,
			is_user_logged_in() ? wp_json_encode($attributes) : '',
		);

		// Allow for filtering of the feature content by other plugins.
		return apply_filters(
			'prc_platform_feature_loader_content',
			$content,
			$attributes,
		);
	}

	public function register_feature_embed_connection_meta() {
		register_post_meta(
			'feature',
			'_feature_embed_referenced_in',
			array(
				'type'         => 'integer',
				'description'  => 'The post ID of the post that references this feature embed.',
				'single'       => true,
				'show_in_rest' => true,
			)
		);
	}

	/**
	 * Register endpoint for getting the referenced feature embeds in a post.
	 * @hook prc_api_endpoints
	 * @param mixed $endpoints
	 * @return void
	 */
	public function register_endpoint($endpoints) {
		array_push($endpoints, array(
			'route' => 'features/get-referenced-embeds',
			'methods'             => 'GET',
			'callback'            => array( $this, 'restfully_get_referenced_embeds' ),
			'args'                => array(
				'post_id' => array(
					'validate_callback' => function( $param, $request, $key ) {
						return is_string( $param );
					},
				),
			),
			'permission_callback' => function () {
				return true;
			},
		));
		return $endpoints;
	}

	protected function update_legacy_embed_connection($new_id, $calling_post_id) {
		$key = '_feature_embed_referenced_in';
		$referenced_embed = get_post_meta($calling_post_id, $key, true);
		if ( ! $referenced_embed ) {
			update_post_meta($new_id, $key, $calling_post_id);
		}
	}

	/**
	 * @TODO: Work In Progress: Until we have time to create the embed block.
	 * [interactives_shortcode description]
	 *
	 * @param  [type] $attr [description]
	 * @return [type]       [description]
	 */
	public function feature_embed_shortcode_fallback($attr = array()) {
		global $post;
		$calling_post_id = $post->ID;
		// Don't render features on archive pages or on admin.
		if ( is_admin() || is_archive() ) {
			return;
		}

		$attr = wp_parse_args(
			$attr,
			array(
				'id'        => false,
				'siteid'    => false,
				'align'     => '',
				'showtitle' => false,
			)
		);

		if ( ! $attr['id'] ) {
			return '<!-- No ID set for the [interactive] shortcode -->';
		}

		if ( ! $attr['siteid'] ) {
			$attr['siteid'] = 1;
		}

		$output = '';

		$query_args = array(
			'post_type'      => 'feature',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
			'meta_query' => [
				'relation' => 'AND',
				[
					'key' => 'dt_original_post_id',
					'value' => $attr['id'],
					'compare' => '='
				],
				[
					'key' => 'dt_original_blog_id',
					'value' => $attr['siteid'],
					'compare' => '='
				]
			]
		);

		if ( 20 === (int) $attr['siteid'] ) {
			unset($query_args['meta_query']);
			$query_args['post__in'] = [$attr['id']];
		}

		// Because this is in legacy usage we're going to need to do a lookup regardless using the distributor original post and original blog id
		$feature_query = new \WP_Query(
			$query_args
		);

		// if we dont have any features, we should do the query again but without the site id check...
		if ( ! $feature_query->have_posts() ) {
			$feature_query = new \WP_Query(
				array(
					'post_type'      => 'feature',
					'post_status'    => 'publish',
					'posts_per_page' => 1,
					'meta_query' => [
						[
							'key' => 'dt_original_post_id',
							'value' => $attr['id'],
							'compare' => '='
						]
					]
				)
			);
		}

		if ( $feature_query->have_posts() ) {
			$feature_query->the_post();
			$post_id = get_the_ID();
			$title_elm = 'h2';
			$title = get_the_title( $post_id );
			if ( $attr['showtitle'] ) {
				if ( in_array( strtolower( $attr['showtitle'] ), array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ) {
					$title_elm = strtolower( $attr['showtitle'] );
				}
			}
			$permalink = get_permalink( $post_id );
			$post_name = get_post_field( 'post_name', $post_id );
			$this->update_legacy_embed_connection($post_id, $calling_post_id);
			ob_start();
			?>
			<figure class="shortcode shortcode--interactive <?php echo esc_attr( $attr['align'] ); ?>" data-slug="<?php echo esc_attr( $post_name ); ?>">
				<?php
				if ( $attr['showtitle'] ) {
					echo wp_sprintf(
						'<%1$s>%2$s</%1$s>',
						esc_html( $title_elm ),
						esc_html( $title )
					);
				}
				if ( function_exists( 'apple_news_is_exporting' ) && apple_news_is_exporting() ) {
					echo '<a href="' . esc_url( $permalink ) . '">';
					the_post_thumbnail( 'large' );
					echo '<div class="ui button">Go To Interactive</div>';
					echo '</a>';
				} else {
					the_content();
				}
				?>
			</figure>
			<?php
			$output = ob_get_clean();
			wp_reset_postdata();
		} else {
			\PRC\Platform\log_error( 'No feature found for the [interactive] shortcode, looking for ID: ' . esc_html( $attr['id'] ) . ' and Site ID: ' . esc_html( $attr['siteid'] ) );
			return '<!-- No feature found for the [interactive] shortcode, looking for ID: ' . esc_html( $attr['id'] ) . ' and Site ID: ' . esc_html( $attr['siteid'] ) . ' -->';
		}

		return $output;
	}

	public function get_referenced_feature_embeds_legacy_pairs($post_id) {
		// query all 'feature' posts that have _feature_embed_referenced_in set to the post id
		$feature_query = new \WP_Query(
			array(
				'post_type'      => 'feature',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'meta_query' => [
					[
						'key' => '_feature_embed_referenced_in',
						'value' => $post_id,
						'compare' => '='
					]
				]
			)
		);
		$to_return = [];
		if ( $feature_query->have_posts() ) {
			while ( $feature_query->have_posts() ) {
				$feature_query->the_post();
				$new_id = get_the_ID();
				$legacy_id = get_post_meta($new_id, 'dt_original_post_id', true);
				$to_return[$new_id] = $legacy_id;
			}
		}
		return $to_return;
	}

	public function restfully_get_referenced_embeds(\WP_REST_Request $request) {
		$post_id = $request->get_param('post_id');
		$referenced_embeds = $this->get_referenced_feature_embeds_legacy_pairs($post_id);
		return rest_ensure_response($referenced_embeds);
	}

	public function block_init() {
		register_block_type(
			__DIR__ . '/build',
			array(
				'render_callback' => array( $this, 'render_feature_loader_callback' ),
			)
		);
		add_shortcode('load_interactive', array($this, 'loader_shortcode_fallback'));
		add_shortcode('interactive', array($this, 'feature_embed_shortcode_fallback'));
	}
}
