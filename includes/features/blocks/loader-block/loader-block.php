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

	/**
	 * @TODO: Work In Progress: Until we have time to create the embed block.
	 * [interactives_shortcode description]
	 *
	 * @param  [type] $attr [description]
	 * @return [type]       [description]
	 */
	public function feature_embed_shortcode_fallback($attr = array()) {
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

		if ( ! $attr['id'] && ! $attr['slug'] ) {
			return '<!-- No ID, Slug set for the [interactive] shortcode -->';
		}

		$output = '';

		// Because this is in legacy usage we're going to need to do a lookup regardless using the distributor original post and original blog id
		$feature_query = new \WP_Query(
			array(
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
			)
		);

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
			//@TODO: check for legacy post meta on main post, if not present drop the new id's in an array and surface in migration panel.
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
