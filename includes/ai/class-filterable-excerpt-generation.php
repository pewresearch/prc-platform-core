<?php
/**
 * Filterable Excerpt Generation ability and experiment.
 *
 * Replaces the built-in AI Excerpt Generation experiment with a PRC-constrained
 * version that enforces a 60-70 character target (Content/SEO request from
 * #prc-schema-seo). Constraint is imposed via system instruction and deterministic
 * post-processing fallback.
 *
 * @package PRC\Platform
 */

declare( strict_types=1 );

namespace PRC\Platform;

use WP_Error;
use WordPress\AI\Abstracts\Abstract_Ability;
use WordPress\AI\Abstracts\Abstract_Experiment;
use WordPress\AI\Asset_Loader;
use WordPress\AI\Experiment_Category;
use WordPress\AI_Client\AI_Client;

use function WordPress\AI\get_post_context;
use function WordPress\AI\get_preferred_models_for_text_generation;
use function WordPress\AI\normalize_content;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bail early when the WordPress AI plugin is not active.
if ( ! class_exists( Abstract_Ability::class ) || ! class_exists( Abstract_Experiment::class ) ) {
	return;
}

/**
 * Excerpt length constraint (characters). Target from Beshay/Content team.
 */
const PRC_EXCERPT_TARGET_CHARS = 70;

/**
 * Excerpt max chars before trimming at word boundary.
 */
const PRC_EXCERPT_HARD_MAX_CHARS = 85;

/**
 * Filterable Excerpt Generation ability.
 *
 * Extends the built-in behavior with PRC constraints: target 60-70 characters
 * with some flexibility, enforced via system instruction and post-processing.
 */
class Filterable_Excerpt_Generation_Ability extends Abstract_Ability {

	protected function input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'content' => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'Content to generate an excerpt suggestion for.', 'ai' ),
				),
				'context' => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'Additional context to use when generating an excerpt suggestion for the content.', 'ai' ),
				),
			),
		);
	}

	protected function output_schema(): array {
		return array(
			'type'        => 'string',
			'description' => esc_html__( 'Generated excerpt (60-70 chars target).', 'ai' ),
		);
	}

	protected function execute_callback( $input ) {
		$args = wp_parse_args(
			$input,
			array(
				'content' => null,
				'context' => null,
			)
		);

		if ( is_numeric( $args['context'] ) ) {
			$post = get_post( (int) $args['context'] );
			if ( ! $post ) {
				return new WP_Error(
					'post_not_found',
					sprintf( esc_html__( 'Post with ID %d not found.', 'ai' ), absint( $args['context'] ) )
				);
			}
			$context = get_post_context( $post->ID );
			$content = $context['content'] ?? '';
			unset( $context['content'] );
			$context = array_merge( $context, prc_ai_publication_context_lines( $post ) );
			if ( $args['content'] ) {
				$content = normalize_content( $args['content'] );
			}
		} else {
			$content = normalize_content( $args['content'] ?? '' );
			$context = $args['context'] ?? '';
		}

		if ( empty( $content ) ) {
			return new WP_Error(
				'content_not_provided',
				esc_html__( 'Content is required to generate an excerpt suggestion.', 'ai' )
			);
		}

		$result = $this->generate_excerpt( $content, $context );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		if ( empty( $result ) ) {
			return new WP_Error(
				'no_results',
				esc_html__( 'No excerpt suggestion was generated.', 'ai' )
			);
		}

		$result = sanitize_textarea_field( trim( $result, ' "\'' ) );
		return self::apply_excerpt_length_constraint( $result );
	}

	protected function permission_callback( $args ) {
		$post_id = isset( $args['context'] ) && is_numeric( $args['context'] ) ? absint( $args['context'] ) : null;
		if ( $post_id ) {
			$post = get_post( $post_id );
			if ( ! $post ) {
				return new WP_Error( 'post_not_found', sprintf( esc_html__( 'Post with ID %d not found.', 'ai' ), $post_id ) );
			}
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return new WP_Error( 'insufficient_capabilities', esc_html__( 'You do not have permission to generate excerpts for this post.', 'ai' ) );
			}
			$post_type_obj = get_post_type_object( get_post_type( $post_id ) );
			if ( ! $post_type_obj || empty( $post_type_obj->show_in_rest ) ) {
				return false;
			}
		} elseif ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error( 'insufficient_capabilities', esc_html__( 'You do not have permission to generate excerpts.', 'ai' ) );
		}
		return true;
	}

	protected function meta(): array {
		return array(
			'show_in_rest' => true,
		);
	}

	/**
	 * Get system instruction with PRC excerpt length constraint (60-70 chars).
	 */
	public function get_system_instruction( ?string $filename = null, array $data = array() ): string {
		return <<<'INSTRUCTION'
You are an editorial assistant that generates excerpts for online articles and pages.

An excerpt is a brief summary or preview of the full content, typically displayed in archive pages, RSS feeds, search results, and social media previews. It gives readers a quick overview of what the article covers without requiring them to read the full post.

Goal: You will be provided with content and optionally some additional context and you should then generate a concise, engaging, and accurate excerpt that reflects that content and keeps in mind the context. This excerpt should be optimized for clarity, engagement, and SEO - suitable for archive views, RSS feeds, and search results - while maintaining an appropriate tone for the author's intent and audience.

The excerpt suggestion should follow these requirements:

- Be approximately 60-70 characters in length, with some flexibility up to 85 characters if needed to complete a thought.
- Should not contain any markdown, bullets, numbering, or formatting - plain text only
- Should be a complete, coherent summary that captures the main points and key information from the content
- Must reflect the actual content and context accurately, not generic summaries or clickbait
- Should be self-contained and readable on its own, providing enough context for readers to understand the topic without reading the full article
- When additional context includes publication timing (draft last modified, scheduled, or published dates), prefer framing consistent with that publication window. Do not anchor the excerpt on a data or fieldwork year from the body if it would undercut a timely read relative to when the work is published.
- Align the excerpt with the article's primary argument as established by the Title (when provided in context) and the opening portion of the content. Do not open with a statistic or example that appears only deep in the body unless the opening already establishes it as central. Do not let a vivid fact become the main story if it sidesteps the headline's core tension (for example, consensus on one item when the piece is about divisions or debate).
- When stating shares from one through ten, use spelled-out, hyphenated forms (e.g. nine-in-ten, not "9 in 10"). Do not apply this style to titles; this rule applies only to excerpt text.
- Do not use the phrase "Pew" or "Pew Research Center" in any casing in the excerpt.
INSTRUCTION;
	}

	/**
	 * Generate excerpt using AI.
	 */
	protected function generate_excerpt( string $content, $context ) {
		if ( is_array( $context ) ) {
			$context = implode(
				"\n",
				array_map(
					static function ( $key, $value ) {
						return sprintf( '%s: %s', ucwords( str_replace( '_', ' ', $key ) ), $value );
					},
					array_keys( $context ),
					$context
				)
			);
		}

		$content = '<content>' . $content . '</content>';
		if ( $context ) {
			$content .= "\n\n<additional-context>" . $context . '</additional-context>';
		}

		return AI_Client::prompt_with_wp_error( $content )
			->using_system_instruction( $this->get_system_instruction() )
			->using_temperature( 0.4 )
			->using_model_preference( ...get_preferred_models_for_text_generation() )
			->generate_text();
	}

	/**
	 * Apply excerpt length constraint: trim at word boundary if over hard max.
	 */
	public static function apply_excerpt_length_constraint( string $excerpt ): string {
		if ( mb_strlen( $excerpt ) <= PRC_EXCERPT_HARD_MAX_CHARS ) {
			return $excerpt;
		}
		$trimmed    = mb_substr( $excerpt, 0, PRC_EXCERPT_HARD_MAX_CHARS );
		$last_space = mb_strrpos( $trimmed, ' ' );
		if ( $last_space !== false && $last_space > PRC_EXCERPT_TARGET_CHARS ) {
			return mb_substr( $trimmed, 0, $last_space );
		}
		return $trimmed;
	}
}

/**
 * Filterable Excerpt Generation experiment.
 */
class Filterable_Excerpt_Generation_Experiment extends Abstract_Experiment {

	protected function load_experiment_metadata(): array {
		return array(
			'id'          => 'excerpt-generation',
			'label'       => __( 'Excerpt Generation', 'ai' ),
			'description' => __( 'Generates excerpt suggestions from content (60-70 character target).', 'ai' ),
			'category'    => Experiment_Category::EDITOR,
		);
	}

	public function register(): void {
		add_action( 'wp_abilities_api_init', array( $this, 'register_abilities' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	public function register_abilities(): void {
		wp_register_ability(
			'ai/' . $this->get_id(),
			array(
				'label'         => $this->get_label(),
				'description'   => $this->get_description(),
				'ability_class' => Filterable_Excerpt_Generation_Ability::class,
			),
		);
	}

	public function enqueue_assets( string $hook_suffix ): void {
		if ( 'post.php' !== $hook_suffix && 'post-new.php' !== $hook_suffix ) {
			return;
		}
		$screen = get_current_screen();
		if (
			! $screen ||
			! post_type_supports( $screen->post_type, 'excerpt' ) ||
			in_array( $screen->post_type, array( 'attachment' ), true )
		) {
			return;
		}
		Asset_Loader::enqueue_script( 'excerpt_generation', 'experiments/excerpt-generation' );
		Asset_Loader::localize_script(
			'excerpt_generation',
			'ExcerptGenerationData',
			array( 'enabled' => $this->is_enabled() )
		);
	}
}

// Swap built-in Excerpt Generation experiment for PRC-constrained version.
add_filter(
	'ai_experiments_default_experiment_classes',
	static function ( array $classes ): array {
		$idx = array_search( \WordPress\AI\Experiments\Excerpt_Generation\Excerpt_Generation::class, $classes, true );
		if ( $idx !== false ) {
			$classes[ $idx ] = Filterable_Excerpt_Generation_Experiment::class;
		}
		return $classes;
	}
);
