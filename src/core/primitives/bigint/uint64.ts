import type { SchemaKind, UInt64Def } from '@internal/types';
import { BigIntFormatSchema } from './bigint-format.ts';

/** Schema for validating unsigned 64-bit bigint values. */
export class UInt64Schema extends BigIntFormatSchema {
  public override readonly kind: SchemaKind = 'UInt64Schema';

  constructor(def: UInt64Def) {
    super({ ...def, format: 'uint64' });
  }
}

/**
 * Creates a uint64 schema.
 *
 * @param message - Optional error message.
 * @returns UInt64 schema.
 * @example
 * const schema = s.uint64();
 */
export function uint64(): UInt64Schema;
export function uint64(message?: string): UInt64Schema;
export function uint64(message?: string): UInt64Schema {
  return new UInt64Schema({
    type: 'bigint',
    format: 'uint64',
    message,
  });
}
