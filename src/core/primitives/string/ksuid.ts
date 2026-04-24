import type { KSUIDDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating KSUID (K-Sortable Unique Identifier) strings. */
export class KSUIDchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'KSUIDchema';

  constructor(def: KSUIDDef) {
    super({
      ...def,
      pattern: def.pattern ?? /^[A-Za-z0-9]{27}$/,
    });
  }
}

/**
 * Creates a KSUID string schema.
 *
 * @param message - Optional error message.
 * @returns KSUID schema.
 * @example
 * const schema = s.ksuid();
 */
export function ksuid(): KSUIDchema;
export function ksuid(message?: string): KSUIDchema;
export function ksuid(message?: string): KSUIDchema {
  return new KSUIDchema({
    type: 'string',
    format: 'ksuid',
    message,
  });
}
