import { Schema } from '@core/utilities/schema.ts';
import type { InternalLiteralDef, Literal } from '@internal/types';
import type { LiteralDef, SchemaKind } from '@internal/types';
import { format } from '@internal/utils/format.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import { escapeRegex } from '@internal/utils/regex.ts';

/** Schema for validating a single literal value. */
export class LiteralSchema<T extends Literal = Literal> extends Schema<T> {
  public override readonly kind: SchemaKind = 'LiteralSchema';
  declare [DEF_TYPE]: InternalLiteralDef<T>;

  constructor(def: LiteralDef<T>) {
    const values = new Set([def.literaldata] as Array<PropertyKey>);
    super({ ...def, values });
  }

  override [SCHEMA_PARSE](data: unknown): T {
    const { literaldata, message } = this[SCHEMA_DEF];

    return this[SCHEMA_ASSERT](Object.is(data, literaldata), {
      expected: literaldata,
      received: data,
      code: 'invalid_value',
      message: message ??
        `Invalid input: expected ${
          format(
            literaldata,
            true,
          )
        }, received ${format(data, true)}`,
    });
  }

  override [SCHEMA_PATTERN](): RegExp {
    const { values } = this[SCHEMA_DEF];

    const escapedPatterns = [...(values ?? [])].map((o) =>
      typeof o === 'string'
        ? escapeRegex(o)
        : o
        ? escapeRegex(o.toString())
        : String(o)
    );

    return new RegExp(`^(${escapedPatterns.join('|')})$`);
  }
}

/**
 * Creates a literal schema for the provided value.
 *
 * @param literaldata - The literal value to validate.
 * @param message - Optional error message.
 * @returns Literal schema.
 * @example
 * const schema = s.literal('hello');
 */
export function literal<T extends Literal>(literaldata: T): LiteralSchema<T>;
export function literal<T extends Literal>(
  literaldata: T,
  message?: string,
): LiteralSchema<T>;

export function literal<T extends Literal>(
  literaldata: T,
  message?: string,
): LiteralSchema<T> {
  return new LiteralSchema<T>({ type: 'literal', literaldata, message });
}
