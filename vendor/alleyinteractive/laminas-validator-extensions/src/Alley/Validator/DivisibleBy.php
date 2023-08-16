<?php

/*
 * This file is part of the laminas-validator-extensions package.
 *
 * (c) Alley <info@alley.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare(strict_types=1);

namespace Alley\Validator;

use Laminas\Validator\Exception\InvalidArgumentException;
use Laminas\Validator\ValidatorInterface;

final class DivisibleBy extends ExtendedAbstractValidator
{
    public const NOT_DIVISIBLE_BY = 'notDivisibleBy';

    protected $messageTemplates = [
        self::NOT_DIVISIBLE_BY => 'Must be evenly divisible by %divisor% but %value% is not.',
    ];

    protected $messageVariables = [
        'divisor' => ['options' => 'divisor'],
    ];

    protected $options = [
        'divisor' => 1,
    ];

    private ValidatorInterface $validDivisors;

    private ValidatorInterface $validRemainders;

    public function __construct($options)
    {
        $this->validDivisors = new Comparison([
            'compared' => 0,
            'operator' => '!==',
        ]);
        $this->validRemainders = new Comparison(
            [
                'compared' => 0,
                'operator' => '===',
            ],
        );

        parent::__construct($options);
    }

    protected function testValue($value): void
    {
        if (! $this->validRemainders->isValid((int) $value % $this->options['divisor'])) {
            $this->error(self::NOT_DIVISIBLE_BY);
        }
    }

    protected function setDivisor($divisor)
    {
        $divisor = (int) $divisor;
        $valid = $this->validDivisors->isValid($divisor);

        if (! $valid) {
            $messages = $this->validDivisors->getMessages();
            throw new InvalidArgumentException("Invalid 'divisor': " . current($messages));
        }

        $this->options['divisor'] = $divisor;
    }
}
