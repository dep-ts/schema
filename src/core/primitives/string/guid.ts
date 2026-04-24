import type { GUIDDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating GUID (UUID) strings. */
export class GUIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'GUIDSchema';

  constructor(def: GUIDDef) {
    super({
      ...def,
      pattern: def.pattern ??
        /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
    });
  }
}

/**
 * Creates a GUID string schema.
 *
 * @param message - Optional error message.
 * @returns GUID schema.
 * @example
 * const schema = s.guid();
 */
export function guid(): GUIDSchema;
export function guid(message?: string): GUIDSchema;
export function guid(message?: string): GUIDSchema {
  return new GUIDSchema({
    type: 'string',
    format: 'guid',
    message,
  });
}
