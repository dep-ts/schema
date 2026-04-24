import type { SchemaKind, TelDef } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating telephone number strings (E.164 format). */
export class TelSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'TelSchema';

  constructor(def: TelDef) {
    super({ ...def, pattern: def.pattern ?? /^\+(?:[0-9]){6,14}[0-9]$/ });
  }
}

/**
 * Creates a telephone number string schema.
 *
 * @param message - Optional error message.
 * @returns Tel schema.
 * @example
 * const schema = s.tel();
 */
export function tel(): TelSchema;
export function tel(message?: string): TelSchema;
export function tel(message?: string): TelSchema {
  return new TelSchema({
    type: 'string',
    format: 'tel',
    message,
  });
}
