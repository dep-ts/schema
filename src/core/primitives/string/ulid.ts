import type { SchemaKind, ULIDDef } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating ULID (Universally Unique Lexicographically Sortable Identifier) strings. */
export class ULIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'ULIDSchema';

  constructor(def: ULIDDef) {
    super({
      ...def,
      pattern: def.pattern ?? /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,
    });
  }
}

/**
 * Creates a ULID string schema.
 *
 * @param message - Optional error message.
 * @returns ULID schema.
 * @example
 * const schema = s.ulid();
 */
export function ulid(): ULIDSchema;
export function ulid(message?: string): ULIDSchema;
export function ulid(message?: string): ULIDSchema {
  return new ULIDSchema({
    type: 'string',
    format: 'ulid',
    message,
  });
}
