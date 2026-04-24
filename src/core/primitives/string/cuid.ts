import type { CUIDDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating CUID strings. */
export class CUIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'CUIDSchema';

  constructor(def: CUIDDef) {
    super({
      ...def,
      pattern: def.pattern ?? /^[cC][^\s-]{8,}$/,
    });
  }
}

/**
 * Creates a CUID string schema.
 *
 * @param message - Optional error message.
 * @returns CUID schema.
 * @example
 * const schema = s.cuid();
 */
export function cuid(): CUIDSchema;
export function cuid(message?: string): CUIDSchema;
export function cuid(message?: string): CUIDSchema {
  return new CUIDSchema({
    type: 'string',
    format: 'cuid',
    message,
  });
}
