<?php
/**
 * AI class.
 *
 * @package PRC\Platform
 */

namespace PRC\Platform;

use WP\MCP\Core\McpAdapter;
use WordPress\AI_Client\AI_Client;

/**
 * AI class.
 *
 * @package PRC\Platform
 */
class AI {
	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * Script handle for the content guidelines editor sidebar.
	 *
	 * @var string
	 */
	public static $sidebar_handle = 'prc-ai-content-guidelines-sidebar';

	/**
	 * Constructor.
	 *
	 * @param Loader $loader The loader that's responsible for maintaining and registering all hooks that power the plugin.
	 * @since 0.1.0
	 * @return void
	 */
	public function __construct( $loader ) {
		$this->loader = $loader;
		require_once plugin_dir_path( __FILE__ ) . 'utils.php';

		$this->init_mcp();
		$this->register_pdf_extraction_filters();
		$this->loader->add_action( 'init', $this, 'register_content_guidelines_filters', 99 );
		$this->loader->add_action( 'wp_abilities_api_categories_init', $this, 'register_categories' );
		$this->loader->add_filter( 'wp_register_ability_args', $this, 'enable_core_abilities_mcp_access', 10, 2 );
		$this->loader->add_action( 'enqueue_block_editor_assets', $this, 'enqueue_sidebar_assets' );
	}

	/**
	 * Initialize the MCP adapter.
	 *
	 * @return void
	 */
	public function init_mcp(): void {
		// Check if MCP Adapter is available.
		if ( ! class_exists( McpAdapter::class ) ) {
			// Show admin notice that the MCP Adapter is not available.
			add_action(
				'admin_notices',
				function () {
					echo '<div class="notice notice-error"><p>PRC Platform Core could not find the WP MCP Adapter plugin. Please install and activate the AI plugin.</p></div>';
				}
			);

			return;
		}

		// Initialize the MCP adapter.
		McpAdapter::instance();
	}

	/**
	 * Enqueue content guidelines editor sidebar assets.
	 *
	 * Loads the sidebar for the block editor (post editor only, not site editor).
	 *
	 * @hook enqueue_block_editor_assets
	 *
	 * @return void
	 */
	public function enqueue_sidebar_assets(): void {
		global $current_screen;

		if ( ! $current_screen || 'site-editor' === ( $current_screen->base ?? '' ) ) {
			return;
		}

		$build_dir  = plugin_dir_path( __FILE__ ) . 'build/';
		$build_url  = plugin_dir_url( __FILE__ ) . 'build/';
		$asset_file = $build_dir . 'index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset          = include $asset_file;
		$dependencies   = $asset['dependencies'] ?? array();
		$dependencies[] = 'wp-annotations';

		wp_enqueue_script(
			self::$sidebar_handle,
			$build_url . 'index.js',
			$dependencies,
			$asset['version'] ?? false,
			true
		);

		$style_file = $build_dir . 'style-index.css';
		if ( file_exists( $style_file ) ) {
			wp_enqueue_style(
				self::$sidebar_handle,
				$build_url . 'style-index.css',
				array( 'wp-components' ),
				$asset['version'] ?? false
			);
		}
	}

	/**
	 * Enable MCP access for core abilities.
	 *
	 * @hook wp_register_ability_args
	 *
	 * @param array<string, mixed> $args        Ability registration arguments.
	 * @param string               $ability_name  Ability ID.
	 * @return array<string, mixed> Modified ability registration arguments.
	 */
	public function enable_core_abilities_mcp_access( array $args, string $ability_name ): array {
		// Enable MCP access for the three current core abilities.
		$core_abilities = array(
			'core/get-site-info',
			'core/get-user-info',
			'core/get-environment-info',
		);
		if ( in_array( $ability_name, $core_abilities, true ) ) {
			$args['meta']['mcp']['public'] = true;
		}

		return $args;
	}

	/**
	 * Register ability categories.
	 *
	 * @hook wp_abilities_api_categories_init
	 *
	 * @since 0.1.0
	 * @return void
	 */
	public function register_categories(): void {
		wp_register_ability_category(
			'data-retrieval',
			array(
				'label'       => __( 'Data Retrieval', 'prc-platform-core' ),
				'description' => __( 'PRC AI abilities that retrieve and return data.', 'prc-platform-core' ),
			)
		);

		wp_register_ability_category(
			'media-generation',
			array(
				'label'       => __( 'Media Generation', 'prc-platform-core' ),
				'description' => __( 'PRC AI abilities that generate media.', 'prc-platform-core' ),
			)
		);

		wp_register_ability_category(
			'data-modification',
			array(
				'label'       => __( 'Data Modification', 'prc-platform-core' ),
				'description' => __( 'PRC AI abilities that modify data.', 'prc-platform-core' ),
			)
		);

		wp_register_ability_category(
			'data-analysis',
			array(
				'label'       => __( 'Data Analysis', 'prc-platform-core' ),
				'description' => __( 'PRC AI abilities that analyze data.', 'prc-platform-core' ),
			)
		);

		wp_register_ability_category(
			'communication',
			array(
				'label'       => __( 'Communication', 'prc-platform-core' ),
				'description' => __( 'PRC AI abilities that send messages or notifications.', 'prc-platform-core' ),
			)
		);
	}

	/**
	 * Register filters for prc-pdf-extraction when used for topline/ survey PDFs.
	 *
	 * Overrides the generic PDF extraction defaults to use topline-specific
	 * post type, URL slug, labels, and prompts.
	 */
	private function register_pdf_extraction_filters(): void {
		add_filter( 'prc_pdf_extraction_post_type', array( $this, 'get_topline_post_type' ) );
		add_filter( 'prc_pdf_extraction_url_slug', array( $this, 'get_toplines_url_slug' ) );
		add_filter( 'prc_pdf_extraction_labels', array( $this, 'get_topline_labels' ) );
		add_filter( 'prc_pdf_extraction_markdown_prompt', array( $this, 'get_topline_markdown_prompt' ) );
		add_filter( 'prc_pdf_extraction_gutenberg_prompt', array( $this, 'get_topline_gutenberg_prompt' ) );
	}

	/**
	 * Return 'topline' as the post type.
	 *
	 * @return string
	 */
	public function get_topline_post_type(): string {
		return 'topline';
	}

	/**
	 * Return 'toplines' as the URL slug.
	 *
	 * @return string
	 */
	public function get_toplines_url_slug(): string {
		return 'topline';
	}

	/**
	 * Get topline-specific post type labels.
	 *
	 * @return array<string, string>
	 */
	public function get_topline_labels(): array {
		return array(
			'name'                  => 'Toplines',
			'singular_name'         => 'Topline',
			'add_new'               => 'Add New',
			'add_new_item'          => 'Add New Topline',
			'edit_item'             => 'Edit Topline',
			'new_item'              => 'New Topline',
			'view_item'             => 'View Topline',
			'view_items'            => 'View Toplines',
			'search_items'          => 'Search Toplines',
			'not_found'             => 'No toplines found',
			'not_found_in_trash'    => 'No toplines found in trash',
			'parent_item_colon'     => 'Parent Article:',
			'all_items'             => 'All Toplines',
			'archives'              => 'Topline Archives',
			'attributes'            => 'Topline Attributes',
			'insert_into_item'      => 'Insert into topline',
			'uploaded_to_this_item' => 'Uploaded to this topline',
			'filter_items_list'     => 'Filter toplines list',
			'items_list_navigation' => 'Toplines list navigation',
			'items_list'            => 'Toplines list',
			'item_published'        => 'Topline published',
			'item_updated'          => 'Topline updated',
		);
	}

	/**
	 * Get topline-specific markdown extraction prompt.
	 *
	 * @return string
	 */
	public function get_topline_markdown_prompt(): string {
		return <<<'PROMPT'
You are extracting text from a Pew Research Center survey topline document. This is a PDF containing survey questions, response options, and percentage data.

Please extract ALL text from this document and format it as clean, well-structured Markdown following these rules:

1. **Survey Questions/Variables**: Use the original label exactly as it appears in the PDF as the heading (e.g., Q15., FOLNEWS, SMUSE, INTREQ, etc.)
2. **Response Options**: Format as a table with columns for the response text and percentage values
3. **Sample Sizes**: Keep n= values inline with their context
4. **Instructions/Notes**: Format as blockquotes (> text)
5. **Section Headers**: Use appropriate heading levels (# for main sections, ## for subsections)
6. **Preserve ALL data**: Every percentage, every response option, every note must be included
7. **Tables**: Use proper Markdown table syntax with headers
8. **Hyperlinks**: Preserve all URLs and hyperlinks from the PDF. Format them as Markdown links: [link text](URL). This includes DOI links, citation URLs, methodology links, and any other embedded references.

Extract the complete content maintaining the logical structure of the survey document. Do not summarize or omit any content.
PROMPT;
	}

	/**
	 * Get topline-specific Gutenberg block extraction prompt.
	 *
	 * @return string
	 */
	public function get_topline_gutenberg_prompt(): string {
		return <<<'PROMPT'
Extract ALL text from this Pew Research Center survey topline PDF and format it as WordPress Gutenberg block HTML.

BLOCK FORMATS TO USE:

1. **Headings** - Use for survey questions, variable labels, and section titles. Preserve the original label exactly as it appears in the PDF (e.g., Q15., FOLNEWS, SMUSE, INTREQ, etc.):
<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">[Original question or variable label from PDF]</h2>
<!-- /wp:heading -->

2. **Tables** - Use prc-block/table for survey response data with percentages. Any valid table structure is acceptable:
<!-- wp:prc-block/table -->
<figure class="wp-block-prc-block-table"><table>
<thead><tr><th>Response</th><th>%</th></tr></thead>
<tbody>
<tr><td>Option 1</td><td>45</td></tr>
<tr><td>Option 2</td><td>32</td></tr>
</tbody>
</table></figure>
<!-- /wp:prc-block/table -->

3. **Paragraphs** - Use for descriptive text, instructions, and notes:
<!-- wp:paragraph -->
<p>Text content here</p>
<!-- /wp:paragraph -->

4. **Blockquotes** - Use for survey instructions, interviewer notes, or special annotations:
<!-- wp:quote -->
<blockquote class="wp-block-quote"><p>Note or instruction text</p></blockquote>
<!-- /wp:quote -->

TABLE RULES:
- Cross-national surveys: country/region rows, response option columns (e.g., Not mentioned, Mentioned, DK/Refused), Total column
- Domestic panel surveys: date/wave trend rows, response option columns, sample sizes per wave
- Use colspan when headers span multiple columns (e.g., country groupings, demographic categories)
- Use rowspan when row labels span multiple data rows (e.g., country names with sub-categories)
- Keep all percentage data in separate cells
- Use <thead> for header rows and <tbody> for data rows
- Sample sizes (n=1,234) can be in their own column or as a note below the table

IMPORTANT:
- Extract ALL content from ALL pages - do not summarize or omit anything
- Preserve the exact structure and hierarchy of the survey document
- Every percentage, every response option, every sample size must be included
- Preserve all hyperlinks from the PDF as <a href="URL"> tags within the block HTML
- Output ONLY the Gutenberg block HTML, nothing else
PROMPT;
	}

	/**
	 * Register filter hooks for content-guidelines AI integration.
	 *
	 * Hooks into content-guidelines filter hooks to provide AI capabilities
	 * for playground tests and draft generation. Only registers when both
	 * content-guidelines and AiClient are available.
	 *
	 * @return void
	 */
	public function register_content_guidelines_filters(): void {
		if ( ! class_exists( 'ContentGuidelines\Hooks' ) ) {
			return;
		}
		if ( ! class_exists( AI_Client::class ) ) {
			return;
		}

		add_filter( 'wp_content_guidelines_has_ai_provider', '__return_true', 20 );
		add_filter( 'wp_content_guidelines_run_playground_test', array( $this, 'run_content_guidelines_playground_test' ), 10, 2 );
		add_filter( 'wp_content_guidelines_generate_draft', array( $this, 'generate_content_guidelines_draft' ), 10, 3 );
		add_filter( 'wp_content_guidelines_analyze_document', array( $this, 'analyze_document' ), 10, 2 );
	}

	/**
	 * Run AI-powered playground test for content guidelines.
	 *
	 * @param array|null $result  Previous filter result (null if unhandled).
	 * @param array      $request Request data: task, fixture_content, guidelines, context_packet, extra_instructions.
	 * @return array|null AI result with output, alternatives, metadata; or null on failure.
	 */
	public function run_content_guidelines_playground_test( $result, array $request ) {
		$packet_text = $request['context_packet']['packet_text'] ?? '';
		$task        = $request['task'] ?? '';
		$content     = $request['fixture_content'] ?? '';
		$extra       = $request['extra_instructions'] ?? '';

		$system = $packet_text
			? $packet_text . "\n\nFollow these guidelines when generating content."
			: 'You are a professional content writer. Write clear, engaging content.';

		$user_prompt = '';
		switch ( $task ) {
			case 'rewrite_intro':
				$user_prompt = "Rewrite this introduction following the guidelines above:\n\n" . $content;
				break;
			case 'generate_headlines':
				$user_prompt = "Generate 5 headline options for this content following the guidelines above:\n\n" . $content;
				break;
			case 'write_cta':
				$user_prompt = "Write a call-to-action for this content following the guidelines above:\n\n" . $content;
				break;
			default:
				$user_prompt = "Apply the guidelines to this content:\n\n" . $content;
		}

		if ( $extra ) {
			$user_prompt .= "\n\nAdditional instructions: " . $extra;
		}

		try {
			$response = AI_Client::prompt( $user_prompt )
				->using_system_instruction( $system )
				->using_temperature( 0.4 )
				->generate_text();

			return array(
				'output'       => trim( $response ),
				'alternatives' => array(),
				'metadata'     => array(),
			);
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * Generate content guidelines draft from site context using AI.
	 *
	 * @param array|null $draft        Previous filter result (null if unhandled).
	 * @param array      $site_context Site data: site_title, tagline, source_posts.
	 * @param array      $args         Additional args: goal, constraints.
	 * @return array|null Guidelines draft matching schema; or null on failure.
	 */
	public function generate_content_guidelines_draft( $draft, array $site_context, array $args = array() ) {
		$site_title   = $site_context['site_title'] ?? '';
		$tagline      = $site_context['tagline'] ?? '';
		$source_posts = $site_context['source_posts'] ?? array();
		$goal         = $args['goal'] ?? 'Create editorial guidelines that reflect the site\'s voice and standards';
		$constraints  = $args['constraints'] ?? '';

		$content_sample = is_array( $source_posts )
			? implode( "\n\n---\n\n", array_slice( $source_posts, 0, 5 ) )
			: '';

		$prompt  = "Analyze this website and generate content guidelines.\n\n";
		$prompt .= "Site: {$site_title}\n";
		$prompt .= "Tagline: {$tagline}\n\n";
		$prompt .= "Goal: {$goal}\n";
		if ( $constraints ) {
			$prompt .= "Constraints: {$constraints}\n";
		}
		$prompt .= "\nSample content:\n" . ( $content_sample ?: '(No sample content provided)' );

		$json_schema = array(
			'name'   => 'content_guidelines',
			'strict' => false,
			'schema' => array(
				'type'       => 'object',
				'properties' => array(
					'version'       => array( 'type' => 'integer' ),
					'brand_context' => array(
						'type'       => 'object',
						'properties' => array(
							'site_description' => array( 'type' => 'string' ),
							'audience'         => array( 'type' => 'string' ),
							'primary_goal'     => array( 'type' => 'string' ),
							'topics'           => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
						),
					),
					'voice_tone'    => array(
						'type'       => 'object',
						'properties' => array(
							'description' => array( 'type' => 'string' ),
							'tone_traits' => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'tone_notes'  => array( 'type' => 'string' ),
							'pov'         => array( 'type' => 'string' ),
							'readability' => array(
								'type' => 'string',
								'enum' => array( 'simple', 'general', 'expert' ),
							),
						),
					),
					'copy_rules'    => array(
						'type'       => 'object',
						'properties' => array(
							'dos'        => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'donts'      => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
							'formatting' => array(
								'type'  => 'array',
								'items' => array( 'type' => 'string' ),
							),
						),
					),
					'vocabulary'    => array(
						'type'       => 'object',
						'properties' => array(
							'prefer' => array(
								'type'  => 'array',
								'items' => array(
									'type'       => 'object',
									'properties' => array(
										'term' => array( 'type' => 'string' ),
										'note' => array( 'type' => 'string' ),
									),
								),
							),
							'avoid'  => array(
								'type'  => 'array',
								'items' => array(
									'type'       => 'object',
									'properties' => array(
										'term' => array( 'type' => 'string' ),
										'note' => array( 'type' => 'string' ),
									),
								),
							),
						),
					),
					'notes'         => array( 'type' => 'string' ),
				),
			),
		);

		try {
			$response = AI_Client::prompt( $prompt )
				->using_system_instruction( 'You are an expert at creating editorial content guidelines. Output only valid JSON matching the schema.' )
				->using_temperature( 0.3 )
				->as_json_response( $json_schema )
				->generate_text();

			$parsed = json_decode( $response, true );
			if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $parsed ) ) {
				return null;
			}

			// Ensure required top-level keys exist with defaults.
			$defaults = array(
				'version'       => 1,
				'brand_context' => array(
					'site_description' => '',
					'audience'         => '',
					'primary_goal'     => '',
					'topics'           => array(),
				),
				'voice_tone'    => array(
					'description' => '',
					'tone_traits' => array(),
					'tone_notes'  => '',
					'pov'         => '',
					'readability' => 'general',
				),
				'copy_rules'    => array(
					'dos'        => array(),
					'donts'      => array(),
					'formatting' => array(),
				),
				'vocabulary'    => array(
					'prefer'            => array(),
					'avoid'             => array(),
					'acronyms'          => array(),
					'acronym_usage'     => 'expand_first',
					'custom_dictionary' => array(),
					'voice_corrections' => array(),
				),
				'heuristics'    => array(
					'words_per_sentence'      => null,
					'sentences_per_paragraph' => null,
					'paragraphs_per_section'  => null,
					'reading_level'           => '',
					'reading_level_custom'    => '',
					'max_syllables'           => null,
				),
				'references'    => array(
					'references' => array(),
					'notes'      => '',
				),
				'images'        => array(
					'style'               => '',
					'alt_text_guidelines' => '',
					'reference_images'    => array(),
					'dos'                 => array(),
					'donts'               => array(),
					'text_policy'         => '',
				),
				'notes'         => '',
				'blocks'        => array(),
			);

			return array_replace_recursive( $defaults, $parsed );
		} catch ( \Exception $e ) {
			return null;
		}
	}

	/**
	 * Analyze document blocks against guidelines using AI.
	 *
	 * @param array|null $result  Previous filter result (null if unhandled).
	 * @param array      $request Request with blocks, guidelines, packet_text.
	 * @return array|null Analysis result with issues, suggestions, stats; or null on failure.
	 */
	public function analyze_document( $result, array $request ) {
		$blocks      = $request['blocks'] ?? array();
		$packet_text = $request['packet_text'] ?? '';

		if ( empty( $blocks ) ) {
			return array(
				'issues'      => array(),
				'suggestions' => array(),
				'stats'       => array(
					'word_count'             => 0,
					'sentence_count'         => 0,
					'avg_words_per_sentence' => 0,
				),
				'issue_count' => 0,
			);
		}

		$blocks_json = wp_json_encode( $blocks );

		$system = $packet_text
			? $packet_text . "\n\n---\n\nANALYSIS TASK: Analyze the document blocks below against these guidelines. "
			: 'You are an editorial guidelines checker. Analyze content for vocabulary, tone, readability, and copy rule compliance. ';

		$system .= "Return a JSON object with:\n";
		$system .= "- issues: array of objects with blockClientId (REQUIRED - copy exactly from input, do NOT modify or abbreviate), type (vocabulary_avoid, tone, readability, copy_rule, pov, formatting), message, optional note, optional start/end character offsets for vocabulary/copy_rule, optional blockLevel:true for tone/readability\n";
		$system .= "- suggestions: array of { blockClientId, type, message, optional note }\n";
		$system .= "- stats: { word_count, sentence_count, avg_words_per_sentence }\n";
		$system .= 'CRITICAL: blockClientId values MUST be copied EXACTLY from the input blocks. Do not invent, truncate, or modify them.';

		$user_prompt = "Analyze these document blocks and return the analysis JSON:\n\n" . $blocks_json;

		$json_schema = array(
			'name'   => 'document_analysis',
			'strict' => true,
			'schema' => array(
				'type'                 => 'object',
				'additionalProperties' => false,
				'properties'           => array(
					'issues'      => array(
						'type'  => 'array',
						'items' => array(
							'type'                 => 'object',
							'additionalProperties' => false,
							'properties'           => array(
								'blockClientId'      => array( 'type' => 'string' ),
								'type'               => array( 'type' => 'string' ),
								'message'            => array( 'type' => 'string' ),
								'note'               => array( 'type' => array( 'string', 'null' ) ),
								'richTextIdentifier' => array( 'type' => array( 'string', 'null' ) ),
								'start'              => array( 'type' => array( 'integer', 'null' ) ),
								'end'                => array( 'type' => array( 'integer', 'null' ) ),
								'blockLevel'         => array( 'type' => array( 'boolean', 'null' ) ),
							),
							'required'             => array( 'blockClientId', 'type', 'message', 'note', 'richTextIdentifier', 'start', 'end', 'blockLevel' ),
						),
					),
					'suggestions' => array(
						'type'  => 'array',
						'items' => array(
							'type'                 => 'object',
							'additionalProperties' => false,
							'properties'           => array(
								'blockClientId' => array( 'type' => 'string' ),
								'type'          => array( 'type' => 'string' ),
								'message'       => array( 'type' => 'string' ),
								'note'          => array( 'type' => array( 'string', 'null' ) ),
							),
							'required'             => array( 'blockClientId', 'type', 'message', 'note' ),
						),
					),
					'stats'       => array(
						'type'                 => 'object',
						'additionalProperties' => false,
						'properties'           => array(
							'word_count'             => array( 'type' => 'integer' ),
							'sentence_count'         => array( 'type' => 'integer' ),
							'avg_words_per_sentence' => array( 'type' => 'number' ),
						),
						'required'             => array( 'word_count', 'sentence_count', 'avg_words_per_sentence' ),
					),
				),
				'required'             => array( 'issues', 'suggestions', 'stats' ),
			),
		);

		try {
			$response = AI_Client::prompt( $user_prompt )
				->using_system_instruction( $system )
				->using_model_preference( array( 'claude-opus-4-6', 'gemini-3-flash-preview' ) )
				->using_temperature( 0.2 )
				->as_json_response( $json_schema )
				->generate_text();

			$parsed = json_decode( $response, true );
			if ( json_last_error() !== JSON_ERROR_NONE || ! is_array( $parsed ) ) {
				error_log( 'analyze_document: JSON decode failed — ' . json_last_error_msg() );
				error_log( 'analyze_document: raw response — ' . substr( $response, 0, 500 ) );
				return null;
			}

			$parsed['issues']      = isset( $parsed['issues'] ) ? $parsed['issues'] : array();
			$parsed['suggestions'] = isset( $parsed['suggestions'] ) ? $parsed['suggestions'] : array();
			$parsed['stats']       = isset( $parsed['stats'] ) ? $parsed['stats'] : array(
				'word_count'             => 0,
				'sentence_count'         => 0,
				'avg_words_per_sentence' => 0,
			);

			return $parsed;
		} catch ( \Exception $e ) {
			error_log( 'analyze_document: exception — ' . $e->getMessage() );
			return null;
		}
	}
}
