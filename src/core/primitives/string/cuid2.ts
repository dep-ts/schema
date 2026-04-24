import type { CUID2Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating CUID2 strings. */
export class CUID2Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'CUID2Schema';

  constructor(def: CUID2Def) {
    super({
      ...def,
      pattern: def.pattern ?? /^[0-9a-z]+$/,
    });
  }
}

/**
 * Creates a CUID2 string schema.
 *
 * @param message - Optional error message.
 * @returns CUID2 schema.
 * @example
 * const schema = s.cuid2();
 */
export function cuid2(): CUID2Schema;
export function cuid2(message?: string): CUID2Schema;
export function cuid2(message?: string): CUID2Schema {
  return new CUID2Schema({
    type: 'string',
    format: 'cuid2',
    message,
  });
}
