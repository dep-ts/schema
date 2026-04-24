import type { IntDef, SchemaKind } from '@internal/types';
import { NumberFormatSchema } from './number-format.ts';

/** Schema for validating safe integer values. */
export class IntSchema extends NumberFormatSchema {
  public override readonly kind: SchemaKind = 'IntSchema';

  constructor(def: IntDef) {
    super({ ...def, format: 'safeint' });
  }
}

/**
 * Creates an int schema.
 *
 * @param message - Optional error message.
 * @returns Int schema.
 * @example
 * const schema = s.int();
 */
export function int(): IntSchema;
export function int(message?: string): IntSchema;
export function int(message?: string): IntSchema {
  return new IntSchema({ type: 'number', format: 'safeint', message });
}
