import { Schema } from '@core/utilities/schema.ts';
import { isNull } from '@internal/is/null.ts';
import {
  SCHEMA_ASSERT,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import type { NullDef, SchemaKind } from '@internal/types';

/** Schema for validating `null`. */
class NullSchema extends Schema<null> {
  public override readonly kind: SchemaKind = 'NullSchema';

  constructor(def: NullDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): null {
    return this[SCHEMA_ASSERT](isNull(data), { received: data });
  }

  override [SCHEMA_PATTERN](): RegExp {
    return new RegExp(/^null$/i);
  }
}

/**
 * Creates a null schema.
 *
 * @param message - Optional error message.
 * @returns Null schema.
 * @example
 * const schema = s.null();
 */
function null_(): NullSchema;
function null_(message?: string): NullSchema;
function null_(message?: string): NullSchema {
  return new NullSchema({ type: 'null', message });
}

export { null_ as null, NullSchema };
