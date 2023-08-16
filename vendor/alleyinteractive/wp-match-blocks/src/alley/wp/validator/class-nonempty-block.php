<?php
/**
 * Nonempty_Block class file
 *
 * (c) Alley <info@alley.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @package wp-match-blocks
 */

namespace Alley\WP\Validator;

use Laminas\Validator\ValidatorInterface;
use Traversable;
use WP_Block_Parser_Block;

/**
 * Validates that the given block is not "empty" -- for example, not a block representing only line breaks.
 */
final class Nonempty_Block extends Block_Validator {
	/**
	 * Error code.
	 *
	 * @var string
	 */
	public const EMPTY_BLOCK = 'empty_block';

	/**
	 * Array of validation failure message templates.
	 *
	 * @var string[]
	 */
	protected $messageTemplates = [
		self::EMPTY_BLOCK => '',
	];

	/**
	 * Validates the input block name.
	 *
	 * @var ValidatorInterface
	 */
	private ValidatorInterface $name_validator;

	/**
	 * Set up.
	 *
	 * @param array|Traversable $options Validator options.
	 */
	public function __construct( $options = null ) {
		$this->messageTemplates[ self::EMPTY_BLOCK ] = __( 'Block is empty.', 'alley' );

		$this->name_validator = new Block_Name(
			[
				'name' => null,
			],
		);

		parent::__construct( $options );
	}

	/**
	 * Apply block validation logic and add any validation errors.
	 *
	 * @param WP_Block_Parser_Block $block The block to test.
	 */
	protected function test_block( WP_Block_Parser_Block $block ): void {
		if ( $this->name_validator->isValid( $block ) ) {
			$this->error( self::EMPTY_BLOCK );
		}
	}
}
