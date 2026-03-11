<?php
/**
 * Filterable Review Notes ability and experiment.
 *
 * Replaces the built-in AI Review Notes experiment with a version that exposes
 * ai_review_notes_system_instruction and ai_review_notes_prompt filters, enabling
 * PRC to inject content guidelines via wp_get_content_guidelines_for_post().
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

use function WordPress\AI\get_preferred_models_for_text_generation;
use function WordPress\AI\normalize_content;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Bail early when the WordPress AI plugin is not active.
if ( ! class_exists( \WordPress\AI\Abstracts\Abstract_Ability::class ) || ! class_exists( \WordPress\AI\Abstracts\Abstract_Experiment::class ) ) {
	return;
}

/**
 * Filterable Review Notes ability.
 *
 * Extends the built-in Review Notes ability to fire two filters before the AI call:
 * - ai_review_notes_system_instruction (passes post_id for content guidelines injection)
 * - ai_review_notes_prompt
 */
class Filterable_Review_Notes_Ability extends Abstract_Ability {

	protected const SUPPORTED_REVIEW_TYPES = array( 'accessibility', 'readability', 'grammar', 'seo' );

	protected function input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'block_type'     => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'The block type, e.g. core/paragraph, core/heading.', 'ai' ),
				),
				'block_content'  => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'The plain-text content of the block to review.', 'ai' ),
				),
				'context'        => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
					'description'       => esc_html__( 'Surrounding content to improve review relevance.', 'ai' ),
				),
				'post_id'        => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
					'description'       => esc_html__( 'ID of the post being reviewed.', 'ai' ),
				),
				'existing_notes' => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => esc_html__( 'Existing Note texts for this block from prior review runs, used to avoid repeating suggestions.', 'ai' ),
				),
				'review_types'   => array(
					'type'        => 'array',
					'items'       => array(
						'type' => 'string',
						'enum' => self::SUPPORTED_REVIEW_TYPES,
					),
					'description' => esc_html__( 'Review types to perform.', 'ai' ),
				),
			),
			'required'   => array( 'block_type', 'block_content' ),
		);
	}

	protected function output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'suggestions' => array(
					'type'        => 'array',
					'description' => esc_html__( 'Review suggestions for the block.', 'ai' ),
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'review_type' => array( 'type' => 'string' ),
							'text'        => array( 'type' => 'string' ),
						),
					),
				),
			),
		);
	}

	protected function execute_callback( $input ) {
		$args = wp_parse_args(
			$input,
			array(
				'block_type'     => '',
				'block_content'  => '',
				'context'        => '',
				'post_id'        => null,
				'existing_notes' => array(),
				'review_types'   => self::SUPPORTED_REVIEW_TYPES,
			)
		);

		if ( empty( $args['block_content'] ) ) {
			return new WP_Error(
				'block_content_required',
				esc_html__( 'Block content is required to perform a review.', 'ai' )
			);
		}

		/** @var list<string> $review_types */
		$review_types = array_values(
			array_filter(
				is_array( $args['review_types'] ) ? $args['review_types'] : self::SUPPORTED_REVIEW_TYPES,
				'is_string'
			)
		);

		/** @var list<string> $existing_notes */
		$existing_notes = array_values(
			array_filter(
				is_array( $args['existing_notes'] ) ? $args['existing_notes'] : array(),
				'is_string'
			)
		);

		$post_id = isset( $args['post_id'] ) ? absint( $args['post_id'] ) : null;

		$result = $this->generate_review(
			$args['block_type'],
			$args['block_content'],
			$args['context'],
			$existing_notes,
			$review_types,
			$post_id
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array( 'suggestions' => $result );
	}

	protected function permission_callback( $input ) {
		$post_id = isset( $input['post_id'] ) ? absint( $input['post_id'] ) : null;

		if ( $post_id ) {
			$post = get_post( $post_id );

			if ( ! $post ) {
				return new WP_Error(
					'post_not_found',
					sprintf( esc_html__( 'Post with ID %d not found.', 'ai' ), absint( $post_id ) )
				);
			}

			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return new WP_Error(
					'insufficient_capabilities',
					esc_html__( 'You do not have permission to run AI reviews on this post.', 'ai' )
				);
			}

			$post_type = get_post_type( $post_id );

			if ( ! $post_type ) {
				return false;
			}

			$post_type_obj = get_post_type_object( $post_type );

			if ( ! $post_type_obj || empty( $post_type_obj->show_in_rest ) ) {
				return false;
			}
		} elseif ( ! current_user_can( 'edit_posts' ) ) {
			return new WP_Error(
				'insufficient_capabilities',
				esc_html__( 'You do not have permission to run AI reviews.', 'ai' )
			);
		}

		return true;
	}

	protected function meta(): array {
		return array(
			'show_in_rest' => true,
		);
	}

	/**
	 * Load system instruction from PRC's review-notes file.
	 *
	 * @param string|null         $filename Optional filename.
	 * @param array<string,mixed> $data     Optional data for the template.
	 * @return string System instruction text.
	 */
	public function get_system_instruction( ?string $filename = null, array $data = array() ): string {
		$file = $filename ?? 'review-notes-system-instruction.php';
		return $this->load_system_instruction_from_file( $file, $data );
	}

	protected function suggestions_schema(): array {
		return array(
			'name'   => 'suggestions',
			'strict' => true,
			'schema' => array(
				'type'                 => 'object',
				'properties'           => array(
					'suggestions' => array(
						'type'  => 'array',
						'items' => array(
							'type'                 => 'object',
							'properties'           => array(
								'review_type' => array( 'type' => 'string' ),
								'text'        => array( 'type' => 'string' ),
								'priority'    => array( 'type' => 'integer' ),
							),
							'required'             => array( 'review_type', 'text', 'priority' ),
							'additionalProperties' => false,
						),
					),
				),
				'required'             => array( 'suggestions' ),
				'additionalProperties' => false,
			),
		);
	}

	/**
	 * Generates review suggestions for a single block.
	 *
	 * Fires ai_review_notes_prompt and ai_review_notes_system_instruction filters
	 * with post_id so callers can inject content guidelines.
	 *
	 * @param string       $block_type    Block type identifier.
	 * @param string       $block_content Plain-text block content.
	 * @param string       $context       Surrounding content.
	 * @param list<string> $existing_notes Prior Note texts to avoid repeating.
	 * @param list<string> $review_types  Review types to perform.
	 * @param int|null     $post_id       Post ID for content guidelines lookup.
	 * @return list<array{review_type: string, text: string}>|\WP_Error
	 */
	protected function generate_review(
		string $block_type,
		string $block_content,
		string $context,
		array $existing_notes,
		array $review_types,
		?int $post_id = null
	) {
		$prompt = $this->create_prompt( $block_type, $block_content, $context, $existing_notes, $review_types );

		/**
		 * Filters the assembled prompt sent to the AI for a single block review.
		 *
		 * @param string       $prompt         The XML-structured prompt.
		 * @param string       $block_type     The block type identifier.
		 * @param string       $block_content  The plain-text block content.
		 * @param string       $context        Surrounding post content.
		 * @param list<string> $existing_notes  Prior Note texts to avoid repeating.
		 * @param list<string> $review_types   Review types to perform.
		 * @param int|null     $post_id        Post ID for content guidelines.
		 */
		$prompt = (string) apply_filters(
			'ai_review_notes_prompt',
			$prompt,
			$block_type,
			$block_content,
			$context,
			$existing_notes,
			$review_types,
			$post_id
		);

		$system_instruction = $this->get_system_instruction();

		/**
		 * Filters the system instruction used for AI Review Notes.
		 *
		 * Use this to inject content guidelines via wp_get_content_guidelines_for_post( $post_id ).
		 *
		 * @param string       $system_instruction The full system instruction text.
		 * @param string       $block_type         The block type being reviewed.
		 * @param list<string> $review_types       The review types requested.
		 * @param int|null     $post_id            Post ID for content guidelines.
		 */
		$system_instruction = (string) apply_filters(
			'ai_review_notes_system_instruction',
			$system_instruction,
			$block_type,
			$review_types,
			$post_id
		);

		$raw = AI_Client::prompt_with_wp_error( $prompt )
			->using_system_instruction( $system_instruction )
			->using_model_preference( ...get_preferred_models_for_text_generation() )
			->as_json_response( $this->suggestions_schema() )
			->generate_text();

		if ( is_wp_error( $raw ) ) {
			return $raw;
		}

		if ( empty( $raw ) ) {
			return array();
		}

		$decoded = json_decode( (string) $raw, true );

		if ( ! is_array( $decoded ) || ! isset( $decoded['suggestions'] ) || ! is_array( $decoded['suggestions'] ) ) {
			return array();
		}

		$existing_types = $this->get_existing_review_types_from_notes( $existing_notes );

		$suggestions = array();
		foreach ( $decoded['suggestions'] as $item ) {
			if (
				! is_array( $item ) ||
				empty( $item['review_type'] ) ||
				empty( $item['text'] ) ||
				! is_string( $item['review_type'] ) ||
				! is_string( $item['text'] )
			) {
				continue;
			}

			$review_type = sanitize_text_field( $item['review_type'] );
			$text        = sanitize_text_field( $item['text'] );
			$priority    = absint( $item['priority'] ?? 5 );

			if ( isset( $existing_types[ strtolower( $review_type ) ] ) ) {
				continue;
			}

			if ( $priority > 2 ) {
				continue;
			}

			$suggestions[] = array(
				'review_type' => $review_type,
				'text'        => $text,
			);
		}

		return $suggestions;
	}

	private function create_prompt( string $block_type, string $block_content, string $context, array $existing_notes, array $review_types ): string {
		$prompt_parts = array();

		$prompt_parts[] = '<block-type>' . sanitize_text_field( $block_type ) . '</block-type>';
		$prompt_parts[] = '<block-content>' . normalize_content( $block_content ) . '</block-content>';

		if ( $context ) {
			$prompt_parts[] = '<additional-context>' . normalize_content( $context ) . '</additional-context>';
		}

		$prompt_parts[] = '<review-types>' . implode( ', ', $review_types ) . '</review-types>';

		if ( ! empty( $existing_notes ) ) {
			$prompt_parts[] = '<existing-notes>' . implode( "\n\n", array_map( 'sanitize_text_field', $existing_notes ) ) . '</existing-notes>';
		}

		return implode( "\n", $prompt_parts );
	}

	private function get_existing_review_types_from_notes( array $existing_notes ): array {
		$types = array();

		foreach ( $existing_notes as $note ) {
			if ( ! preg_match_all( '/\[([^\]]+)\]/', (string) $note, $matches ) ) {
				continue;
			}

			foreach ( $matches[1] as $type ) {
				$types[ strtolower( trim( $type ) ) ] = true;
			}
		}

		return $types;
	}
}

/**
 * Filterable Review Notes experiment.
 *
 * Registers the filterable ability instead of the built-in Review Notes ability.
 */
class Filterable_Review_Notes_Experiment extends Abstract_Experiment {

	protected function load_experiment_metadata(): array {
		return array(
			'id'          => 'review-notes',
			'label'       => __( 'Review Notes', 'ai' ),
			'description' => __( 'Reviews post content block-by-block and adds Notes with suggestions for Accessibility, Readability, Grammar, and SEO.', 'ai' ),
			'category'    => Experiment_Category::EDITOR,
		);
	}

	public function register(): void {
		add_action( 'wp_abilities_api_init', array( $this, 'register_abilities' ) );
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets' ) );
		add_filter( 'rest_pre_insert_comment', array( $this, 'maybe_set_ai_author' ), 10, 2 );

		register_meta(
			'comment',
			'ai_note',
			array(
				'type'          => 'boolean',
				'single'        => true,
				'show_in_rest'  => true,
				'auth_callback' => static function (): bool {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}

	public function register_abilities(): void {
		wp_register_ability(
			'ai/' . $this->get_id(),
			array(
				'label'         => $this->get_label(),
				'description'   => $this->get_description(),
				'ability_class' => Filterable_Review_Notes_Ability::class,
			),
		);
	}

	public function maybe_set_ai_author( $prepared_comment, \WP_REST_Request $request ) {
		if ( is_wp_error( $prepared_comment ) ) {
			return $prepared_comment;
		}

		$meta = $request->get_param( 'meta' );

		if ( ! is_array( $meta ) || empty( $meta['ai_note'] ) ) {
			return $prepared_comment;
		}

		$prepared_comment['comment_author']       = __( 'WordPress AI', 'ai' );
		$prepared_comment['comment_author_email'] = '';
		$prepared_comment['comment_author_url']   = '';
		$prepared_comment['user_id']              = 0;

		return $prepared_comment;
	}

	public function enqueue_assets(): void {
		Asset_Loader::enqueue_script( 'review_notes', 'experiments/review-notes' );
		Asset_Loader::localize_script(
			'review_notes',
			'ReviewNotesData',
			array(
				'enabled' => $this->is_enabled(),
			)
		);
	}
}

// Swap the built-in Review Notes experiment for our filterable version.
add_filter(
	'ai_experiments_default_experiment_classes',
	static function ( array $classes ): array {
		$classes = array_values(
			array_filter(
				$classes,
				static function ( $class ): bool {
					return \WordPress\AI\Experiments\Review_Notes\Review_Notes::class !== $class;
				} 
			)
		);

		$classes[] = Filterable_Review_Notes_Experiment::class;

		return $classes;
	} 
);
