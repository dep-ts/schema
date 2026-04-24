import { Schema } from '@core/utilities/schema.ts';
import type { NeverDef, SchemaKind } from '@internal/types';
import { SCHEMA_ASSERT, SCHEMA_PARSE } from '@internal/utils/symbols.ts';

/** Schema for validating never values. */
export class NeverSchema extends Schema<never> {
  public override readonly kind: SchemaKind = 'NeverSchema';

  constructor(def: NeverDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): never {
    return this[SCHEMA_ASSERT](false, { received: data });
  }
}

/**
 * Creates a never schema.
 *
 * @param message - Optional error message.
 * @returns Never schema.
 * @example
 * const schema = s.never();
 */
export function never(): NeverSchema;
export function never(message?: string): NeverSchema;
export function never(message?: string): NeverSchema {
  return new NeverSchema({ type: 'never', message });
}
