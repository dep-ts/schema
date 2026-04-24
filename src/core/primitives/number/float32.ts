import type { Float32Def, SchemaKind } from '@internal/types';
import { NumberFormatSchema } from './number-format.ts';

/** Schema for validating 32-bit float number values. */
export class Float32Schema extends NumberFormatSchema {
  public override readonly kind: SchemaKind = 'Float32Schema';

  constructor(def: Float32Def) {
    super({ ...def, format: 'float32' });
  }
}

/**
 * Creates a float32 schema.
 *
 * @param message - Optional error message.
 * @returns Float32 schema.
 * @example
 * const schema = s.float32();
 */
export function float32(): Float32Schema;
export function float32(message?: string): Float32Schema;
export function float32(message?: string): Float32Schema {
  return new Float32Schema({ type: 'number', format: 'float32', message });
}
