// deno-lint-ignore-file no-explicit-any
import { Schema } from '@core/utilities/schema.ts';
import type { AnyDef, SchemaKind } from '@internal/types';
import { SCHEMA_PARSE } from '@internal/utils/symbols.ts';

/** Schema for validating any value. */
export class AnySchema extends Schema<any> {
  public override readonly kind: SchemaKind = 'AnySchema';

  constructor(def: AnyDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): any {
    return data;
  }
}

/**
 * Creates an any schema.
 *
 * @param message - Optional error message.
 * @returns Any schema.
 * @example
 * const schema = s.any();
 */
export function any(): AnySchema;
export function any(message?: string): AnySchema;
export function any(message?: string): AnySchema {
  return new AnySchema({ type: 'any', message });
}
