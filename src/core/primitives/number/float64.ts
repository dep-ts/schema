import type { Float64Def, SchemaKind } from '@internal/types';
import { NumberFormatSchema } from './number-format.ts';

/** Schema for validating 64-bit float number values. */
export class Float64Schema extends NumberFormatSchema {
  public override readonly kind: SchemaKind = 'Float64Schema';

  constructor(def: Float64Def) {
    super({ ...def, format: 'float64' });
  }
}

/**
 * Creates a float64 schema.
 *
 * @param message - Optional error message.
 * @returns Float64 schema.
 * @example
 * const schema = s.float64();
 */
export function float64(): Float64Schema;
export function float64(message?: string): Float64Schema;
export function float64(message?: string): Float64Schema {
  return new Float64Schema({ type: 'number', format: 'float64', message });
}
