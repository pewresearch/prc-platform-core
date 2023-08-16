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
use Laminas\Validator\IsInstanceOf;
use Laminas\Validator\ValidatorInterface;

final class ContainsString extends ExtendedAbstractValidator
{
    public const NOT_CONTAINS_STRING = 'notContainsString';

    protected $messageTemplates = [
        self::NOT_CONTAINS_STRING => 'Must contain string "%needle%".',
    ];

    protected $messageVariables = [
        'needle' => ['options' => 'needle'],
    ];

    protected $options = [
        'needle' => '',
        'ignoreCase' => false,
    ];

    private ValidatorInterface $validNeedles;

    public function __construct($options)
    {
        $this->validNeedles = new WithMessage(
            'noMatchingTypes',
            'Must be string or instance of \Stringable',
            new AnyValidator([
                new Type([ 'type' => 'string' ]),
                new IsInstanceOf(\Stringable::class),
                new Type([ 'type' => 'null' ]),
            ]),
        );

        parent::__construct($options);
    }

    protected function testValue($value): void
    {
        $haystack = (string) $value;
        $needle = (string) $this->options['needle'];

        if ($this->options['ignoreCase']) {
            $haystack = strtolower($haystack);
            $needle = strtolower($needle);
        }

        if (! str_contains($haystack, $needle)) {
            $this->error(self::NOT_CONTAINS_STRING);
        }
    }

    protected function setNeedle($needle)
    {
        $valid = $this->validNeedles->isValid($needle);

        if (! $valid) {
            $messages = $this->validNeedles->getMessages();
            throw new InvalidArgumentException("Invalid 'needle': " . current($messages));
        }

        $this->options['needle'] = $needle;
    }
}
