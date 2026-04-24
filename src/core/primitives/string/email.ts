import type { EmailDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating email address strings. */
export class EmailSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'EmailSchema';

  constructor(def: EmailDef) {
    super({
      ...def,
      pattern: def.pattern ??
        /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,
    });
  }
}

/**
 * Creates an email string schema.
 *
 * @param message - Optional error message.
 * @returns Email schema.
 * @example
 * const schema = s.email();
 */
export function email(): EmailSchema;
export function email(message?: string): EmailSchema;
export function email(message?: string): EmailSchema {
  return new EmailSchema({
    type: 'string',
    format: 'email',
    message,
  });
}
