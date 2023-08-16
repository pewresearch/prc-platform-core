<?php
/**
 * Block_Name class file
 *
 * (c) Alley <info@alley.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @package wp-match-blocks
 */

namespace Alley\WP\Validator;

use Alley\Validator\Comparison;
use Laminas\Validator\InArray;
use Laminas\Validator\ValidatorInterface;
use Traversable;
use WP_Block_Parser_Block;

/**
 * Validates whether a block has a given name or one of a set of names.
 */
final class Block_Name extends Block_Validator {
	/**
	 * Error code.
	 *
	 * @var string
	 */
	public const NOT_NAMED = 'not_named';

	/**
	 * Error code.
	 *
	 * @var string
	 */
	public const NAME_NOT_IN = 'name_not_in';

	/**
	 * Array of validation failure message templates.
	 *
	 * @var string[]
	 */
	protected $messageTemplates = [
		self::NOT_NAMED   => '',
		self::NAME_NOT_IN => '',
	];

	/**
	 * Array of additional variables available for validation failure messages.
	 *
	 * @var string[]
	 */
	protected $messageVariables = [
		'name'       => [
			'options' => 'name',
		],
		'block_name' => 'current_block_name',
	];

	/**
	 * Options for this validator.
	 *
	 * @var array
	 */
	protected $options = [
		'name' => null,
	];

	/**
	 * Name of the block under test for use in error messages.
	 *
	 * @var string|null
	 */
	protected ?string $current_block_name = '';

	/**
	 * Validates the input block name based on how many names are valid.
	 *
	 * @var ValidatorInterface
	 */
	private ValidatorInterface $current_validator;

	/**
	 * Message template to use based on how many names are valid.
	 *
	 * @var string
	 */
	private string $current_message;

	/**
	 * Set up.
	 *
	 * @param array|Traversable $options Validator options.
	 */
	public function __construct( $options = null ) {
		$this->messageTemplates[ self::NOT_NAMED ] = sprintf(
			/* translators: 1: allowed names placeholder, 2: block name placeholder */
			__( 'Block must be named %1$s; got %2$s.', 'alley' ),
			'%name%',
			'%block_name%',
		);
		$this->messageTemplates[ self::NAME_NOT_IN ] = sprintf(
			/* translators: 1: allowed names placeholder, 2: block name placeholder */
			__( 'Block name must be one of %1$s; got %2$s.', 'alley' ),
			'%name%',
			'%block_name%',
		);

		$this->current_validator = new Comparison(
			[
				'operator' => '===',
				'compared' => $this->options['name'],
			]
		);
		$this->current_message   = self::NOT_NAMED;

		parent::__construct( $options );
	}

	/**
	 * Apply block validation logic and add any validation errors.
	 *
	 * @param WP_Block_Parser_Block $block The block to test.
	 */
	protected function test_block( WP_Block_Parser_Block $block ): void {
		if ( ! $this->current_validator->isValid( $block->blockName ) ) {
			$this->error( $this->current_message );
		}
	}

	/**
	 * Converts the input into a parser block instance to be validated.
	 *
	 * @param array|WP_Block|WP_Block_Parser_Block $value Original block.
	 */
	protected function setValue( $value ) {
		parent::setValue( $value );

		$this->current_block_name = $this->value->blockName;
	}

	/**
	 * Sets the 'name' option.
	 *
	 * @param string|string[] $name Names.
	 */
	protected function setName( $name ) {
		$this->options['name'] = $name;

		$this->current_validator = new InArray(
			[
				'haystack' => \is_array( $this->options['name'] ) ? $this->options['name'] : [ $this->options['name'] ],
				'strict'   => InArray::COMPARE_STRICT,
			]
		);
		$this->current_message   = \is_array( $this->options['name'] ) && \count( $this->options['name'] ) > 1 ? self::NAME_NOT_IN : self::NOT_NAMED;
	}
}
