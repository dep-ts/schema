import type { Base64URLDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating Base64URL strings. */
export class Base64URLSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'Base64URLSchema';

  constructor(def: Base64URLDef) {
    super({ ...def, pattern: def.pattern ?? /^[A-Za-z0-9_-]*$/ });
  }
}

/**
 * Creates a Base64URL string schema.
 *
 * @param message - Optional error message.
 * @returns Base64URL schema.
 * @example
 * const schema = s.base64url();
 */
export function base64url(): Base64URLSchema;
export function base64url(message?: string): Base64URLSchema;
export function base64url(message?: string): Base64URLSchema {
  return new Base64URLSchema({
    type: 'string',
    format: 'base64url',
    message,
  });
}
