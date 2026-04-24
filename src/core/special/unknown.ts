import { Schema } from '@core/utilities/schema.ts';
import type { SchemaKind, UnknownDef } from '@internal/types';
import { SCHEMA_PARSE } from '@internal/utils/symbols.ts';

/** Schema for validating unknown values. */
export class UnknownSchema extends Schema<unknown> {
  public override readonly kind: SchemaKind = 'UnknownSchema';

  constructor(def: UnknownDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): unknown {
    return data;
  }
}

/**
 * Creates an unknown schema.
 *
 * @param message - Optional error message.
 * @returns Unknown schema.
 * @example
 * const schema = s.unknown();
 */
export function unknown(): UnknownSchema;
export function unknown(message?: string): UnknownSchema;
export function unknown(message?: string): UnknownSchema {
  return new UnknownSchema({ type: 'unknown', message });
}
