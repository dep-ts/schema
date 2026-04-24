import type { SchemaKind, VoidDef } from '@internal/types';
import { SCHEMA_ASSERT, SCHEMA_PARSE } from '@internal/utils/symbols.ts';
import { Schema } from '@core/utilities/schema.ts';
import { isUndefined } from '@internal/is/undefined.ts';

/** Schema for validating void values. */
export class VoidSchema extends Schema<void> {
  public override readonly kind: SchemaKind = 'VoidSchema';

  constructor(def: VoidDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): void {
    return this[SCHEMA_ASSERT](isUndefined(data), {
      expected: 'void',
      received: data,
    });
  }
}

/**
 * Creates a void schema.
 *
 * @param message - Optional error message.
 * @returns Void schema.
 * @example
 * const schema = s.void();
 */
function _void(): VoidSchema;
function _void(message?: string): VoidSchema;
function _void(message?: string): VoidSchema {
  return new VoidSchema({ type: 'void', message });
}

export { _void as void };
