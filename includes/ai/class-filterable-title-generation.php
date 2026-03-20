<?php
/**
 * Filterable Title Generation ability and experiment.
 *
 * Replaces the built-in AI Title Generation experiment with a PRC-constrained
 * version: sentence case for short-read posts and title case for other types,
 * both enforced via system instruction.
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
 * Filterable Title Generation ability.
 *
 * Extends the built-in behavior with PRC casing rules in the system instruction.
 */
class Filterable_Title_Generation_Ability extends Abstract_Ability {

	protected const CANDIDATES_DEFAULT = 3;

	protected function input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'content'    => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'Content to generate title suggestions for.', 'ai' ),
				),
				'post_id'    => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
					'description'       => esc_html__( 'Content from this post will be used to generate title suggestions.', 'ai' ),
				),
				'candidates' => array(
					'type'              => 'integer',
					'minimum'           => 1,
					'maximum'           => 10,
					'default'           => self::CANDIDATES_DEFAULT,
					'sanitize_callback' => 'absint',
					'description'       => esc_html__( 'Number of titles to generate', 'ai' ),
				),
			),
		);
	}

	protected function output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'titles' => array(
					'type'        => 'array',
					'description' => esc_html__( 'Generated title suggestions (sentence case for short reads, title case otherwise).', 'ai' ),
					'items'       => array( 'type' => 'string' ),
				),
			),
		);
	}

	protected function execute_callback( $input ) {
		$args = wp_parse_args(
			$input,
			array(
				'content'    => null,
				'post_id'    => null,
				'candidates' => self::CANDIDATES_DEFAULT,
			)
		);

		if ( $args['post_id'] ) {
			$post = get_post( (int) $args['post_id'] );
			if ( ! $post ) {
				return new WP_Error( 'post_not_found', sprintf( esc_html__( 'Post with ID %d not found.', 'ai' ), absint( $args['post_id'] ) ) );
			}
			$context = get_post_context( (int) $args['post_id'] );
			$context = array_merge( $context, prc_ai_publication_context_lines( $post ) );
			if ( $args['content'] ) {
				$context['content'] = normalize_content( $args['content'] );
			}
		} else {
			$context = array( 'content' => normalize_content( $args['content'] ?? '' ) );
		}

		if ( empty( $context['content'] ) ) {
			return new WP_Error( 'content_not_provided', esc_html__( 'Content is required to generate title suggestions.', 'ai' ) );
		}

		$post_type = $args['post_id'] ? get_post_type( (int) $args['post_id'] ) : null;

		$result = $this->generate_titles( $context, $args['candidates'], $post_type );
		error_log( '--------------------------------' );
		error_log( print_r( $result, true ) );
		error_log( '--------------------------------' );
		if ( is_wp_error( $result ) ) {
			return $result;
		}
		if ( empty( $result ) ) {
			return new WP_Error( 'no_results', esc_html__( 'No title suggestions were generated.', 'ai' ) );
		}

		return array(
			'titles' => array_map(
				static function ( $title ) {
					return sanitize_text_field( trim( $title, ' "\'' ) );
				},
				$result
			),
		);
	}

	protected function permission_callback( $args ) {
		$post_id = isset( $args['post_id'] ) ? absint( $args['post_id'] ) : null;
		if ( $post_id ) {
			$post = get_post( $post_id );
			if ( ! $post ) {
				return new WP_Error( 'post_not_found', sprintf( esc_html__( 'Post with ID %d not found.', 'ai' ), $post_id ) );
			}
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return new WP_Error( 'insufficient_capabilities', esc_html__( 'You do not have permission to generate titles for this post.', 'ai' ) );
			}
			$post_type_obj = get_post_type_object( get_post_type( $post_id ) );
			if ( ! $post_type_obj || empty( $post_type_obj->show_in_rest ) ) {
				return false;
			}
		} elseif ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error( 'insufficient_capabilities', esc_html__( 'You do not have permission to generate titles.', 'ai' ) );
		}
		return true;
	}

	protected function meta(): array {
		return array(
			'show_in_rest' => true,
		);
	}

	/**
	 * System instruction for the current post type (short-read vs everything else).
	 *
	 * Pass `post_type` (string) or `post_id` (int) in `$data` so casing rules match the post;
	 * omit both for title-case-only defaults (e.g. content-only runs).
	 */
	public function get_system_instruction( ?string $filename = null, array $data = array() ): string {
		$post_type = null;
		if ( isset( $data['post_type'] ) && is_string( $data['post_type'] ) && '' !== $data['post_type'] ) {
			$post_type = $data['post_type'];
		} elseif ( ! empty( $data['post_id'] ) ) {
			$post_id = (int) $data['post_id'];
			$post    = get_post( $post_id );
			if ( $post ) {
				$post_type = get_post_type( $post );
			}
		}

		return $this->get_system_instruction_for_post_type( $post_type );
	}

	/**
	 * Build system instruction with casing rules for the given post type.
	 *
	 * @param string|null $post_type Post type slug, or null when no post context (defaults to title case).
	 */
	protected function get_system_instruction_for_post_type( ?string $post_type ): string {
		$is_short_read  = 'short-read' === $post_type;
		$casing_mandate = $is_short_read
			? 'This post is a short read: every suggestion must use sentence case only (not title case).'
			: ( null !== $post_type
				? 'This post is not a short read: every suggestion must use title case (not sentence case).'
				: 'Every suggestion must use title case (not sentence case).' );
		$casing_bullet  = $is_short_read
			? '- Use sentence case: capitalize only the first letter of the first word (and proper nouns as usual); do not use title case.'
			: '- Use title case: capitalize principal words (nouns, verbs, adjectives, and adverbs). Keep articles (a, an, the), coordinating conjunctions (and, but, or), and short prepositions (of, in, on, at, to, for) lowercase unless they begin or end the title.';

		return <<<INSTRUCTION
You are an editorial assistant that generates title suggestions for online articles and pages.

Goal: You will be provided with some context and you should then generate a concise, engaging, and accurate title that reflects that context. This title should be optimized for clarity, engagement, and SEO - while maintaining an appropriate tone for the author's intent and audience.

{$casing_mandate}

The title suggestion should follow these requirements:

- Be no more than 80 characters
{$casing_bullet}
- Should not contain any markdown, bullets, numbering, or formatting - plain text only
- Output exactly one title per response: a single line only. Do not combine multiple headlines, alternatives, or run-on strings of different titles in one completion; the host requests several independent completions, each must be one title with no extra text before or after it
- Should be distinct in tone and focus
- Must reflect the actual content and context, not generic clickbait
- Do not use the phrase "key findings" in any casing unless the piece is clearly a standalone key-findings product. For typical reports and articles, use other framings; at Pew Research Center this phrasing is reserved for specific packaging.
- When additional context includes publication timing (draft last modified, scheduled, or published dates), favor timely framing aligned with that publication window. Avoid making a survey field year or data collection year from the body the centerpiece of the SEO title when it would read as stale relative to when the work is published—use judgment; years are fine when the story is explicitly about that vintage or release timing.
- Do not use the phrase "Pew" or "Pew Research Center" in any casing in the title.

The context you will be provided is delimited by triple quotes.
INSTRUCTION;
	}

	/**
	 * Generate titles using AI.
	 *
	 * Calls the model once per candidate rather than relying on candidate_count,
	 * because Anthropic's API ignores the `n` parameter and returns a single
	 * completion that concatenates multiple titles into one string.
	 */
	protected function generate_titles( $context, int $candidates = 1, ?string $post_type = null ) {
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

		$system_instruction = $this->get_system_instruction( null, array( 'post_type' => $post_type ) );
		$prompt             = '"""' . $context . '"""';
		$models             = get_preferred_models_for_text_generation();
		$titles             = array();

		for ( $i = 0; $i < $candidates; $i++ ) {
			$result = AI_Client::prompt_with_wp_error( $prompt )
				->using_system_instruction( $system_instruction )
				->using_temperature( 0.7 )
				->using_model_preference( ...$models )
				->generate_text();

			if ( is_wp_error( $result ) ) {
				return $result;
			}

			$titles[] = $result;
		}

		return $titles;
	}
}

/**
 * Filterable Title Generation experiment.
 */
class Filterable_Title_Generation_Experiment extends Abstract_Experiment {

	protected function load_experiment_metadata(): array {
		return array(
			'id'          => 'title-generation',
			'label'       => __( 'Title Generation', 'ai' ),
			'description' => __( 'Generates title suggestions from content (sentence case for short reads, title case for other types).', 'ai' ),
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
				'ability_class' => Filterable_Title_Generation_Ability::class,
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
			! post_type_supports( $screen->post_type, 'title' ) ||
			in_array( $screen->post_type, array( 'attachment' ), true )
		) {
			return;
		}
		Asset_Loader::enqueue_script( 'title_generation', 'experiments/title-generation' );
		Asset_Loader::localize_script(
			'title_generation',
			'TitleGenerationData',
			array( 'enabled' => $this->is_enabled() )
		);
	}
}

// Swap built-in Title Generation experiment for PRC-constrained version.
add_filter(
	'ai_experiments_default_experiment_classes',
	static function ( array $classes ): array {
		$idx = array_search( \WordPress\AI\Experiments\Title_Generation\Title_Generation::class, $classes, true );
		if ( $idx !== false ) {
			$classes[ $idx ] = Filterable_Title_Generation_Experiment::class;
		}
		return $classes;
	}
);
