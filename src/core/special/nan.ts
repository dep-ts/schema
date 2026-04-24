import { isNan } from '@internal/is/nan.ts';
import { Schema } from '@core/utilities/schema.ts';
import { SCHEMA_ASSERT, SCHEMA_PARSE } from '@internal/utils/symbols.ts';
import type { NaNDef, SchemaKind } from '@internal/types';

/** Schema for validating NaN values. */
export class NaNSchema extends Schema<number> {
  public override readonly kind: SchemaKind = 'NaNSchema';

  constructor(def: NaNDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): number {
    return this[SCHEMA_ASSERT](isNan(data), { received: data });
  }
}

/**
 * Creates a NaN schema.
 *
 * @param message - Optional error message.
 * @returns NaN schema.
 * @example
 * const schema = s.nan();
 */
export function nan(): NaNSchema;
export function nan(message?: string): NaNSchema;
export function nan(message?: string): NaNSchema {
  return new NaNSchema({ type: 'nan', message });
}
