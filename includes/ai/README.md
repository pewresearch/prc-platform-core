# AI

Integrates platform-wide AI capabilities including the MCP adapter, Abilities API categories, a content guidelines block editor sidebar, and PDF-to-topline extraction.

## What it does

- Initializes the `WP\MCP\Core\McpAdapter` and exposes core abilities (`core/get-site-info`, `core/get-user-info`, `core/get-environment-info`) over MCP
- Registers four ability categories via `wp_abilities_api_categories_init`: `data-retrieval`, `data-modification`, `data-analysis`, `communication`
- Enqueues a block editor sidebar (`prc-ai-content-guidelines-sidebar`) for post editors (not the site editor)
- Hooks into `prc-pdf-extraction` filters to configure topline-specific post type, URL slug, labels, and prompts for survey PDF extraction
- Provides two AI-backed methods used by the `content-guidelines` plugin:
  - `generate_content_guidelines_draft()` — generates a structured JSON guidelines object from site context
  - `analyze_document()` — analyzes editor blocks against guidelines and returns issues, suggestions, and stats

## Key files

| File | Purpose |
|------|---------|
| `class-ai.php` | Main class; hooks registration, MCP init, sidebar enqueue |
| `utils.php` | Shared utility functions |
| `src/` | Block editor sidebar source (React) |
| `build/` | Compiled sidebar assets |
| `content-guidelines-2026-03-04.json` | Cached guidelines snapshot |

## Dependencies

- `WP\MCP\Core\McpAdapter` — WP MCP Adapter plugin (shows admin notice if missing)
- `WordPress\AI_Client\AI_Client` — WP AI Client for LLM calls
- `prc-pdf-extraction` plugin — for topline PDF extraction
- `wp-abilities-api` — for ability and category registration

## Filters / hooks

| Hook | Direction | Description |
|------|-----------|-------------|
| `wp_abilities_api_categories_init` | Action | Registers AI ability categories |
| `wp_register_ability_args` | Filter | Enables MCP access for core abilities |
| `enqueue_block_editor_assets` | Action | Enqueues content guidelines sidebar |
| `prc_pdf_extraction_post_type` | Filter | Returns `topline` |
| `prc_pdf_extraction_url_slug` | Filter | Returns `topline` |
| `prc_pdf_extraction_labels` | Filter | Returns topline-specific labels |
| `prc_pdf_extraction_markdown_prompt` | Filter | Returns topline extraction prompt |
| `prc_pdf_extraction_gutenberg_prompt` | Filter | Returns topline block format prompt |

## Build

```bash
npm run build -w @prc/platform-core
```
