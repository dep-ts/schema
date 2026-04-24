import type { Int64Def, SchemaKind } from '@internal/types';
import { BigIntFormatSchema } from './bigint-format.ts';

/** Schema for validating signed 64-bit bigint values. */
export class Int64Schema extends BigIntFormatSchema {
  public override readonly kind: SchemaKind = 'Int64Schema';

  constructor(def: Int64Def) {
    super({ ...def, format: 'int64' });
  }
}

/**
 * Creates an int64 schema.
 *
 * @param message - Optional error message.
 * @returns Int64 schema.
 * @example
 * const schema = s.int64();
 */
export function int64(): Int64Schema;
export function int64(message?: string): Int64Schema;
export function int64(message?: string): Int64Schema {
  return new Int64Schema({
    type: 'bigint',
    format: 'int64',
    message,
  });
}
