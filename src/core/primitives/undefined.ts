import { Schema } from '@core/utilities/schema.ts';
import { isUndefined } from '@internal/is/undefined.ts';
import type { SchemaKind, UndefinedDef } from '@internal/types';
import {
  SCHEMA_ASSERT,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';

/** Schema for validating `undefined`. */
class UndefinedSchema extends Schema<undefined> {
  public override readonly kind: SchemaKind = 'UndefinedSchema';

  constructor(def: UndefinedDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): undefined {
    return this[SCHEMA_ASSERT](isUndefined(data), { received: data });
  }

  override [SCHEMA_PATTERN](): RegExp {
    return new RegExp(/^undefined$/i);
  }
}

/**
 * Creates an undefined schema.
 *
 * @param message - Optional error message.
 * @returns Undefined schema.
 * @example
 * const schema = s.undefined();
 */
function _undefined(): UndefinedSchema;
function _undefined(message?: string): UndefinedSchema;
function _undefined(message?: string): UndefinedSchema {
  return new UndefinedSchema({ type: 'undefined', message });
}

export { _undefined as undefined, UndefinedSchema };
