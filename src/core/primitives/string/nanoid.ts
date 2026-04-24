import type { NanoIDDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating NanoID strings. */
export class NanoIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'NanoIDSchema';

  constructor(def: NanoIDDef) {
    super({
      ...def,
      pattern: def.pattern ?? /^[a-zA-Z0-9_-]{21}$/,
    });
  }
}

/**
 * Creates a NanoID string schema.
 *
 * @param message - Optional error message.
 * @returns NanoID schema.
 * @example
 * const schema = s.nanoid();
 */
export function nanoid(): NanoIDSchema;
export function nanoid(message?: string): NanoIDSchema;
export function nanoid(message?: string): NanoIDSchema {
  return new NanoIDSchema({
    type: 'string',
    format: 'nanoid',
    message,
  });
}
