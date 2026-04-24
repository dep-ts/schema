import { Schema } from '@core/utilities/schema.ts';
import type {
  EnumDef,
  EnumLike,
  InternalEnumDef,
  Ref,
  SchemaKind,
  ToEnum,
} from '@internal/types';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import { format } from '@internal/utils/format.ts';
import { escapeRegex } from '@internal/utils/regex.ts';

/** Schema for validating enum values. */
export class EnumSchema<T extends EnumLike = EnumLike> extends Schema<
  T[keyof T]
> {
  public override readonly kind: SchemaKind = 'EnumSchema';
  declare [DEF_TYPE]: InternalEnumDef<T>;

  constructor(def: EnumDef<T>) {
    const values = new Set(Object.values(def.enumValues) as Array<PropertyKey>);
    super({ ...def, values });
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { enumValues, message } = this[SCHEMA_DEF];
    const _values = new Set(Object.values(enumValues));

    return this[SCHEMA_ASSERT](_values.has(data as this[Ref<'OUTPUT'>]), {
      expected: Array.from(_values),
      received: data,
      code: 'invalid_value',
      message: message ??
        `Invalid input: expected ${Array.from(_values)}, received ${
          format(
            data,
            true,
          )
        }`,
    });
  }

  override [SCHEMA_PATTERN](): RegExp {
    const { values } = this[SCHEMA_DEF];
    const propertyKeyTypes = new Set(['string', 'number', 'symbol']);

    const validValues = [...(values ?? [])].filter((k) =>
      propertyKeyTypes.has(typeof k)
    );

    const escapedPatterns = validValues.map((o) =>
      typeof o === 'string' ? escapeRegex(o) : o.toString()
    );

    return new RegExp(`^(${escapedPatterns.join('|')})$`);
  }
}

/**
 * Creates an enum schema from values or enum-like object.
 *
 * @param values - Enum entries or array of string values.
 * @param message - Optional error message.
 * @returns Enum schema.
 * @example
 * const schema = s.enum(['red', 'blue']);
 */
function _enum<const T extends readonly string[]>(
  values: T,
): EnumSchema<ToEnum<T[number]>>;

function _enum<const T extends readonly string[]>(
  values: T,
  message?: string,
): EnumSchema<ToEnum<T[number]>>;

function _enum<const T extends EnumLike>(
  entries: T,
  message?: string,
): EnumSchema<T>;

function _enum(
  values: EnumLike | readonly string[],
  message?: string,
): EnumSchema {
  if (Array.isArray(values)) {
    const obj = Object.fromEntries(values.map((v) => [v, v]));
    return new EnumSchema({ type: 'enum', enumValues: obj, message });
  }

  return new EnumSchema({
    type: 'enum',
    enumValues: values as EnumLike,
    message,
  });
}

export { _enum as enum };
