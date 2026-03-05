# WP HTML Sub Processors

PHP HTML parsing utilities that extend `WP_HTML_Tag_Processor` for extracting structured data from WordPress block output.

## What it does

Provides three specialized processors for parsing HTML content server-side, plus a convenience function for table block parsing:

| Class / Function | Purpose |
|-----------------|---------|
| `WP_HTML_Heading_Processor` | Extracts all `h1`–`h3` elements and their text content from a document |
| `WP_HTML_Table_Processor` | Parses a table block into a PHP array (strips all HTML, returns data only) |
| `WP_HTML_Get_Element` | Retrieves a specific HTML element by tag name or attribute |
| `parse_table_block_into_array()` | Convenience wrapper around `WP_HTML_Table_Processor` |

## Usage

### Parse a table block to an array

```php
use function PRC\Platform\Core\WP_HTML_Sub_Processors\parse_table_block_into_array;

$table_html = get_the_content(); // or any block HTML string
$data = parse_table_block_into_array( $table_html );
// Returns: [ 'headers' => [...], 'rows' => [...] ]
```

Tested with `core/table` and `flexible-table/table` blocks. Block comments (`<!-- ... -->`) are stripped before parsing to avoid interference.

### Extract headings

```php
$processor = new WP_HTML_Heading_Processor( $post_content );
$headings  = $processor->get_headings();
// Returns: [ [ 'tag' => 'h2', 'content' => 'Section Title' ], ... ]
```

## Key files

| File | Purpose |
|------|---------|
| `index.php` | Loads all processors; exposes `parse_table_block_into_array()` |
| `class-wp-html-heading-processor.php` | Heading extraction with balanced tag navigation |
| `class-wp-html-table-processor.php` | Table-to-array conversion |
| `class-wp-html-get-element.php` | Generic element retrieval |

## Notes

- All classes extend `WP_HTML_Tag_Processor` (core WordPress, available since 6.2)
- `WP_HTML_Heading_Processor` uses bookmark-based tree navigation cribbed from the Interactivity API's `WP_Directive_Processor`
- These are server-side only — no JavaScript equivalent
