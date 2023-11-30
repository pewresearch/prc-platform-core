<?php
namespace PRC\Platform;
use WP_Error;
use WP_HTML_Tag_Processor;

/**
 * Provides functionality for allowing embedding of interactives, charts, and other content on other sites.
 * @package
 */
class Iframe_Embeds {
	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	public static $allowed_blocks = array(
		'core/video',
		'core/image',
		'core/group',
		'prc-block/tabs',
		'prc-block/accordion-controller',
		'prc-block/chart',
	);

	public static $handle = 'prc-platform-iframe-embeds';

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'embeds/utils.php';
	}

	public function register_controls_asset() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/index.asset.php' );
		$resizer_script_slug = self::$handle . '-controls';
		$resizer_script_src = plugins_url( 'build/index.js', __FILE__ );

		$script = wp_register_script(
			$resizer_script_slug,
			$resizer_script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register resizer asset' );
		}

		return true;
	}

	public function register_view_embed_handler() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/view-embed.asset.php' );
		$view_embed_script_slug = self::$handle . '-view-embed';
		$view_embed_script_src = plugins_url( 'build/view-embed.js', __FILE__ );

		$script = wp_register_script(
			$view_embed_script_slug,
			$view_embed_script_src,
			array_merge($asset_file['dependencies'], array(self::$handle . '-resizer-script')),
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register view embed handler asset' );
		}

		return true;
	}

	public function register_embed_footer_style() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/view.asset.php' );
		$embed_footer_slug = self::$handle . '-footer';

		$embed_footer_script_src = plugins_url( 'build/view.js', __FILE__ );
		$embed_footer_style_src = plugins_url( 'build/style-view.css', __FILE__ );

		$script = wp_register_script(
			$embed_footer_slug,
			$embed_footer_script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		$style = wp_register_style(
			$embed_footer_slug,
			$embed_footer_style_src,
			array(),
			$asset_file['version'],
		);

		if ( ! $script || ! $style ) {
			return new WP_Error( self::$handle, 'Failed to register resizer asset' );
		}

		return true;
	}

	/**
	 * This is being served on THEIR pages, outside the iframe. We copy this script src in the embed code on our pages.
	 * @return WP_Error|true
	 */
	public function register_resizer_asset() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/iframe-resizer.asset.php' );
		$resizer_script_slug = self::$handle . '-resizer-script';
		$resizer_script_src = plugins_url( 'build/iframe-resizer.js', __FILE__ );

		$script = wp_register_script(
			$resizer_script_slug,
			$resizer_script_src,
			$asset_file['dependencies'],
			$asset_file['version'],
			true
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register resizer asset' );
		}

		return true;
	}

	/**
	 * This is being served on our pages, inside an /iframe.
	 * @return WP_Error|true
	 */
	public function register_resizer_window_asset() {
		$asset_file  = include(  plugin_dir_path( __FILE__ )  . 'build/iframe-resizer-content-window.asset.php' );
		$window_script_slug = self::$handle . '-resizer-window-script';
		$window_script_src = plugins_url( 'build/iframe-resizer-content-window.js', __FILE__ );

		$script = wp_register_script(
			$window_script_slug,
			$window_script_src,
			array_merge($asset_file['dependencies'], array('jquery')),
			$asset_file['version'],
			false
		);

		if ( ! $script ) {
			return new WP_Error( self::$handle, 'Failed to register resizer window asset' );
		}

		return true;
	}

	/**
	 * @hook init
	 * @return void
	 */
	public function register_assets() {
		$this->register_controls_asset();
		$this->register_resizer_asset();
		$this->register_view_embed_handler();
		$this->register_resizer_window_asset();
		$this->register_embed_footer_style();
	}

	public function enqueue_editor_controls() {
		wp_localize_script(
			self::$handle . '-controls',
			'prcEmbeds',
			array(
				'allowedBlocks' => self::$allowed_blocks,
			)
		);
		wp_enqueue_script(self::$handle . '-controls');
	}

	public function body_class( $classes ) {
		if ( $this->is_iframe() ) {
			$classes[] = 'prc-platform__iframe';
		}
		return $classes;
	}

	public function iframe_qvar( $qvars ) {
		$qvars[] = 'iframe';
		return $qvars;
	}

	/**
	 * Add /iframe endpoint to all permalinks and attachments
	 */
	public function iframe_endpoint() {
		add_rewrite_endpoint( 'iframe', EP_PERMALINK | EP_ATTACHMENT );
	}

	private function find_template() {
		global $post;
		$templates = array(
			'single-' . $post->post_name . '-iframe.php',
			'single-' . $post->post_type . '-iframe.php',
			'single-iframe.php',
		);
		$template = locate_template($templates);
		return $template;
	}

	/**
	 * @hook template_include
	 *
	 * Changes the default template file to be used if an alternative is found.
	 *
	 * If available, the following template files will be used, in order:
	 *  * single-{post_name}-iframe.php
	 *  * single-{post_type}-iframe.php
	 *  * single-iframe.php
	 *
	 * @param string $template the string value of the template file to be used.
	 * @return string the string value of the template file to be used.
	 */
	public function template_include( $template = '' ) {
		if ( $this->is_iframe() ) {
			$new_template = $this->find_template();
			if ( '' !== $new_template ) {
				$template = $new_template;
			}
			$template = apply_filters( 'prc_iframe_template', $template );
		}
		return $template;
	}

	/**
	 * @hook show_admin_bar
	 * @param mixed $show_admin_bar
	 * @return mixed
	 */
	public function disable_admin_bar_on_iframes( $show_admin_bar ) {
		if ( $this->is_iframe() ) {
			return false;
		}
		return $show_admin_bar;
	}

	/**
	 * Default output for /iframe if no template is passed through.
	 * @hook template_redirect
	 * @return void
	 */
	public function template_default() {
		if ( $this->is_iframe() ) {
			$new_template = $this->find_template();
			if ( '' === $new_template ) {
				wp_head();
				// Never show the admin bar for an iframe.
				show_admin_bar( false );
				while ( have_posts() ) {
					the_post();
					$post_content = get_the_content();
					if ( $this->test_for_embeddable_blocks( $post_content ) ) {
						echo $this->render_embeddable_block_by_id( get_query_var('iframe'), $post_content );
					} else {
						echo apply_filters( 'the_content', $post_content );
					}
				}
				wp_reset_postdata();
				?>
				<style>
					#wpadminbar {
						display: none !important;
					}
					html {
						margin: 0!important;
					}
				</style>
				<?php
				wp_footer();
				exit();
			}
		}
	}

	public function register_rest_fields() {
		$post_types = get_post_types( array( 'public' => true ) );
		foreach ( $post_types as $post_type ) {
			register_rest_field(
				$post_type,
				'_embeds',
				array(
					'get_callback' => array( $this, 'get_embeddable_blocks' ),
					'schema' => null,
				)
			);
		}
	}

	public function get_embeddable_blocks( $object, $field_name, $request ) {
		if ( !array_key_exists('content', $object) || !array_key_exists('rendered', $object['content']) ) {
			return array();
		}

		$blocks = parse_blocks( $object['content']['rendered'] );
		$iframes = array();
		foreach ( $blocks as $block ) {
			if ( in_array( $block['blockName'], self::$allowed_blocks ) ) {
				if ( array_key_exists('prcEmbed', $block['attrs']) && true === $block['attrs']['prcEmbed']['enabled'] ) {
					$id = $block['attrs']['prcEmbed']['id'];
					$iframes[$id] = array(
						'blockName' => $block['blockName'],
						'attrs' => $block['attrs'],
						'innerBlocks' => $block['innerBlocks'],
						'iframeSrc' => get_permalink( $object['id'] ) . 'iframe/' . $id . '/',
					);
				}
			}
		}
		return $iframes;
	}

	public function test_for_embeddable_blocks( $content = '' ) {
		if ( ! has_blocks( $content) ) {
			return false;
		}
		$blocks = parse_blocks( $content );
		foreach ( $blocks as $block ) {
			if ( in_array( $block['blockName'], self::$allowed_blocks ) ) {
				if ( array_key_exists('prcEmbed', $block['attrs']) && true === $block['attrs']['prcEmbed']['enabled'] ) {
					return true;
				}
			}
		}
		return false;
	}

	public function render_embeddable_block_by_id( $id, $post_content ) {
		$blocks = parse_blocks( $post_content );

		foreach ( $blocks as $block ) {
			if ( array_key_exists('blockName', $block) && in_array( $block['blockName'], self::$allowed_blocks ) ) {
				if ( array_key_exists('prcEmbed', $block['attrs']) && true === $block['attrs']['prcEmbed']['enabled'] ) {
					if ( $id === $block['attrs']['prcEmbed']['id'] ) {
						return render_block( $block );
					}
				}
			}
		}

		return false;
	}

	/**
	 * Ensures the 'iframe' query var is correctly parsed.
	 *
	 * @param  array $vars
	 * @return array $vars
	 */
	public function filter_request( $vars ) {
		if ( isset( $vars['iframe'] ) ) {
			$vars['iframe'] = true;
		}
		return $vars;
	}

	/**
	 * Provides a filter to change the post content of an iframe when viewing an iframe.
	 *
	 * @param  string $content the post_content.
	 * @return string $content
	 */
	public function filter_content( $content ) {
		if ( true === $this->is_iframe() ) {
			$content = apply_filters( 'prc_iframe_content', $content );
		}
		return $content;
	}

	/**
	 * Provides a filter to change the post title only on iframes.
	 *
	 * @param  string $title
	 * @return string $title
	 */
	public function filter_title( $title ) {
		if ( true === $this->is_iframe() ) {
			$title = apply_filters( 'prc_iframe_title', $title );
		}
		return $title;
	}

	/**
	 * Custom hook for the head of iframes
	 */
	public function head() {
		if ( true === $this->is_iframe() ) {
			do_action( 'prc_iframe_head' );
		}
	}

	/**
	 * Custom hook for the footer of iframes
	 */
	public function footer() {
		if ( true === $this->is_iframe() ) {
			do_action( 'prc_iframe_footer' );
		}
	}

	/**
	 * On iframes include the iframe resizer content window script.
	 */
	public function iframe_resizer_script() {
		if ( true === $this->is_iframe() ) {
			wp_enqueue_script( self::$handle . '-resizer-window-script' );
		}
	}

	/**
	 * Checks to see if current post/attachment is an iframe
	 *
	 * @return boolean
	 */
	public function is_iframe() {
		if ( get_query_var( 'iframe' ) ) {
			return true;
		}
		return false;
	}

	/**
	* Register additional attributes for supported blocks.
	* @param mixed $metadata
	* @return mixed
	*/
	public function add_attributes( $metadata ) {
		if ( !in_array($metadata['name'], self::$allowed_blocks) ) {
			return $metadata;
		}

		if ( ! array_key_exists( 'prcEmbed', $metadata['attributes'] ) ) {
			$metadata['attributes']['prcEmbed'] = array(
				'type'    => 'object',
				'default' => array(
					'enabled' => false,
					'id' => null,
				),
			);
		}

		return $metadata;
	}

	/**
	* Register additional settings, like context, for supported blocks.
	* @param mixed $settings
	* @param mixed $metadata
	* @return mixed
	*/
	public function add_settings(array $settings, array $metadata) {
		if ( in_array($metadata['name'], self::$allowed_blocks) ) {
			$settings['provides_context'] = array_merge(
				array_key_exists('provides_context', $settings) ? $settings['provides_context'] : array(),
				array(
					'prc/embed' => 'prcEmbed',
				)
			);
		}
		return $settings;
	}

	public function render( $block_content, $block ) {
		if ( !array_key_exists('blockName', $block) ) {
			return $block_content;
		}
		if ( !in_array($block['blockName'], self::$allowed_blocks) || is_admin() ) {
			return $block_content;
		}

		if ( ! array_key_exists( 'prcEmbed', $block['attrs'] ) ) {
			return $block_content;
		}

		$embeddable_block = $block['attrs']['prcEmbed'];
		if ( ! $embeddable_block['enabled'] ) {
			return $block_content;
		}

		$block_embed_id = $embeddable_block['id'];

		$tag = new WP_HTML_Tag_Processor( $block_content );
		$tag->next_tag();
		$tag->add_class('is-embeddable');
		return $tag->get_updated_html() . $this->embed_footer( get_the_ID(), $block_embed_id );
	}

	public function embed_footer( $post_id, $block_embed_id ) {
		$permalink = get_permalink( $post_id );
		$iframe_code = $this->get_iframe_code( $post_id, $permalink . 'iframe/' . $block_embed_id );

		$format_label = "Report";
		$format_term = get_the_terms( $post_id, 'formats' );
		if ( false !== $format_term ) {
			$format_label = $format_term[0]->slug;
			// remove formats_ from the beginning of the slug, replace dashes with spaces, and capitalize the first letter in each word.
			$format_label = ucwords( str_replace( '-', ' ', str_replace( 'formats_', '', $format_label ) ) );
		}

		wp_enqueue_style( self::$handle . '-footer' );
		wp_enqueue_script( self::$handle . '-footer' );
		ob_start();
		?>
		<div class="prc-platform__embed-footer">
			<div class="prc-platform__embed-footer__menu">
				<span href="#" class="prc-platform__embed-footer__menu__item" aria-controls="prc-platform__embed-footer__code">Embed <i class="code icon"></i></span>
				<?php if ($this->is_iframe()):?>
					<a href="<?php echo esc_url($permalink);?>" class="prc-platform__embed-footer__menu__item" target="_blank"><?php echo $format_label;?></a>
				<?php endif;?>
				<div class="prc-platform__embed-footer__menu__right">
					<a href="https://pewresearch.org" class="prc-platform__embed-footer__menu__item" target="_blank" alt="Open <?php echo $format_label;?> in new window">&copy; PEW RESEARCH CENTER</a>
				</div>
			</div>
			<div class="prc-platform__embed-footer__code prc-platform__embed-code">
				<?php echo $iframe_code; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	public function get_iframe_code( $post_id, $src = null, $output_as_iframe = false ) {
		if ( empty( $src ) ) {
			$src = get_permalink( $post_id ) . 'iframe/';
		}
		$height = get_post_meta( $post_id, 'iframe_height', true) ?: 500;

		if ( ! wp_script_is( self::$handle . '-resizer-script', 'registered' ) ) {
			return;
		}
		$script_url = wp_scripts()->registered[ self::$handle . '-resizer-script' ]->src;

		if ( true === $output_as_iframe ) {
			wp_enqueue_script(self::$handle . '-view-embed');
		}

		ob_start();
		?>
		<?php if ( true !== $output_as_iframe ): ?>
		<textarea onClick="this.focus();this.select();">
		<?php endif; ?>
		<iframe id="pewresearch-org-embed-<?php echo esc_attr( $post_id ); ?>" src="<?php echo esc_url( $src ); ?>" height="<?php echo esc_attr( $height ); ?>px" width="100%" scrolling="no" frameborder="0"></iframe>
		<?php if ( true !== $output_as_iframe ): ?>
		<script type='text/javascript' id='pew-iframe-resizer'>(function(){function async_load(){var s=document.createElement('script');s.type='text/javascript';s.async=true;s.src='<?php echo esc_url( $script_url ); ?>';s.onload=s.onreadystatechange=function(){var rs=this.readyState;try{iFrameResize([],'iframe#pewresearch-org-embed-<?php echo esc_attr( $post_id ); ?>')}catch(e){}};var embedder=document.getElementById('pew-iframe-resizer');embedder.parentNode.insertBefore(s,embedder)}if(window.attachEvent)window.attachEvent('onload',async_load);else window.addEventListener('load',async_load,false)})();</script>
		</textarea>
		<?php endif;?>
		<?php
		$output = ob_get_clean();
		if ( true !== $output_as_iframe ) {
			$output = normalize_whitespace( $output );
		}
		return apply_filters( 'prc_iframe_embed_code', $output, $post_id );
	}
}



