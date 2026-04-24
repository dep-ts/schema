import type { Int32Def, SchemaKind } from '@internal/types';
import { NumberFormatSchema } from './number-format.ts';

/** Schema for validating signed 32-bit number values. */
export class Int32Schema extends NumberFormatSchema {
  public override readonly kind: SchemaKind = 'Int32Schema';

  constructor(def: Int32Def) {
    super({ ...def, format: 'int32' });
  }
}

/**
 * Creates an int32 schema.
 *
 * @param message - Optional error message.
 * @returns Int32 schema.
 * @example
 * const schema = s.int32();
 */
export function int32(): Int32Schema;
export function int32(message?: string): Int32Schema;
export function int32(message?: string): Int32Schema {
  return new Int32Schema({ type: 'number', format: 'int32', message });
}
