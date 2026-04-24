import { Schema } from '@core/utilities/schema.ts';
import {
  InternalTemplateDef,
  PartsToTemplateLiteral,
  SchemaKind,
  TemplateDef,
  TemplateLiteralPart,
} from '@internal/types';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import { isString } from '@internal/is/string.ts';
import { SchemaError } from '@core/utilities/error.ts';
import { escapeRegex } from '@internal/utils/regex.ts';

/** Schema for validating template literal strings. */
export class TemplateLiteralSchema<
  Template extends string = string,
> extends Schema<Template> {
  public override readonly kind: SchemaKind = 'TemplateLiteralSchema';
  declare [DEF_TYPE]: InternalTemplateDef<Template>;

  constructor(def: TemplateDef<Template>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): Template {
    const input = this[SCHEMA_ASSERT](isString(data), {
      received: data,
      expected: 'string',
    });

    const { format, message } = this[SCHEMA_DEF];

    if (!this[SCHEMA_PATTERN]().test(input)) {
      throw new SchemaError({
        received: data,
        expected: `string that matches ${this[SCHEMA_PATTERN]()}`,
        code: 'invalid_format',
        format: format ?? 'template_literal',
        message: message ?? 'Invalid input',
      });
    }

    return input;
  }

  override [SCHEMA_PATTERN](): RegExp {
    const regexParts: Array<string> = [];

    const primitiveTypes = new Set([
      'string',
      'number',
      'bigint',
      'boolean',
      'symbol',
      'undefined',
    ]);

    for (const part of this[SCHEMA_DEF].parts) {
      if (typeof part === 'object' && part !== null) {
        if (!(SCHEMA_PATTERN in part)) {
          throw new Error(
            'Invalid template literal part: schema part does not provide an internal pattern.',
          );
        }

        const pattern = part[SCHEMA_PATTERN]!();
        const source = pattern instanceof RegExp ? pattern.source : pattern;

        if (!source) {
          throw new Error(
            'Invalid template literal part: schema part has an empty internal pattern.',
          );
        }

        const start = source.startsWith('^') ? 1 : 0;
        const end = source.endsWith('$') ? source.length - 1 : source.length;
        regexParts.push(source.slice(start, end));
      } else if (part === null || primitiveTypes.has(typeof part)) {
        regexParts.push(escapeRegex(`${part}`));
      } else {
        throw new Error(`Invalid template literal part: ${part}`);
      }
    }

    return new RegExp(`^${regexParts.join('')}$`);
  }
}

/**
 * Creates a template literal schema from the provided parts.
 *
 * @param parts - Template parts for the schema.
 * @param message - Optional error message.
 * @returns Template literal schema.
 * @example
 * const schema = s.templateLiteral(['user', number()]);
 */
export function templateLiteral<const Parts extends TemplateLiteralPart[]>(
  parts: Parts,
): TemplateLiteralSchema<PartsToTemplateLiteral<Parts>>;

export function templateLiteral<const Parts extends TemplateLiteralPart[]>(
  parts: Parts,
  message?: string,
): TemplateLiteralSchema<PartsToTemplateLiteral<Parts>>;

export function templateLiteral<const Parts extends TemplateLiteralPart[]>(
  parts: Parts,
  message?: string,
) {
  return new TemplateLiteralSchema<PartsToTemplateLiteral<Parts>>({
    type: 'template_literal',
    parts,
    message,
  });
}
