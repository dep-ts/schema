import type { SchemaKind, UInt32Def } from '@internal/types';
import { NumberFormatSchema } from './number-format.ts';

/** Schema for validating unsigned 32-bit number values. */
export class UInt32Schema extends NumberFormatSchema {
  public override readonly kind: SchemaKind = 'UInt32Schema';

  constructor(def: UInt32Def) {
    super({ ...def, format: 'uint32' });
  }
}

/**
 * Creates a uint32 schema.
 *
 * @param message - Optional error message.
 * @returns UInt32 schema.
 * @example
 * const schema = s.uint32();
 */
export function uint32(): UInt32Schema;
export function uint32(message?: string): UInt32Schema;
export function uint32(message?: string): UInt32Schema {
  return new UInt32Schema({ type: 'number', format: 'uint32', message });
}
