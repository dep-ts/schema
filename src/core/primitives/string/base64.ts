import type { Base64Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating Base64 strings. */
export class Base64Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'Base64Schema';

  constructor(def: Base64Def) {
    super({
      ...def,
      pattern: def.pattern ??
        /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,
    });
  }
}

/**
 * Creates a Base64 string schema.
 *
 * @param message - Optional error message.
 * @returns Base64 schema.
 * @example
 * const schema = s.base64();
 */
export function base64(): Base64Schema;
export function base64(message?: string): Base64Schema;
export function base64(message?: string): Base64Schema {
  return new Base64Schema({
    type: 'string',
    format: 'base64',
    message,
  });
}
