import { isBoolean } from '@internal/is/boolean.ts';
import { Schema } from '@core/utilities/schema.ts';
import type {
  BooleanDef,
  InternalBooleanDef,
  SchemaKind,
} from '@internal/types';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';

/** Schema for validating boolean values. */
export class BooleanSchema extends Schema<boolean> {
  public override readonly kind: SchemaKind = 'BooleanSchema';
  declare [DEF_TYPE]: InternalBooleanDef;

  constructor(def: BooleanDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): boolean {
    let input = data;

    if (this[SCHEMA_DEF].coerce) {
      try {
        input = Boolean(input);
      } catch {
        //
      }
    }

    return this[SCHEMA_ASSERT](isBoolean(input), {
      received: data,
      output: input,
    });
  }

  override [SCHEMA_PATTERN](): RegExp {
    return new RegExp(/^(?:true|false)$/i);
  }
}

/**
 * Creates a boolean schema.
 *
 * @param message - Optional error message.
 * @returns Boolean schema.
 * @example
 * const schema = s.boolean();
 */
export function boolean(): BooleanSchema;
export function boolean(message?: string): BooleanSchema;
export function boolean(message?: string): BooleanSchema {
  return new BooleanSchema({ type: 'boolean', message });
}
