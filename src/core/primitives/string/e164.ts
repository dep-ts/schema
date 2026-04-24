import type { E164Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating E.164 phone number strings. */
export class E164Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'E164Schema';

  constructor(def: E164Def) {
    super({
      ...def,
      pattern: def.pattern ?? /^\+[1-9]\d{6,14}$/,
    });
  }
}

/**
 * Creates an E.164 phone number schema.
 *
 * @param message - Optional error message.
 * @returns E.164 schema.
 * @example
 * const schema = s.e164();
 */
export function e164(): E164Schema;
export function e164(message?: string): E164Schema;
export function e164(message?: string): E164Schema {
  return new E164Schema({
    type: 'string',
    format: 'e164',
    message,
  });
}
