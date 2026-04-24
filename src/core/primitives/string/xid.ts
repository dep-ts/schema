import type { SchemaKind, XIDDef } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating XID strings. */
export class XIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'XIDSchema';

  constructor(def: XIDDef) {
    super({
      ...def,
      pattern: def.pattern ?? /^[0-9a-vA-V]{20}$/,
    });
  }
}

/**
 * Creates an XID string schema.
 *
 * @param message - Optional error message.
 * @returns XID schema.
 * @example
 * const schema = s.xid();
 */
export function xid(): XIDSchema;
export function xid(message?: string): XIDSchema;
export function xid(message?: string): XIDSchema {
  return new XIDSchema({
    type: 'string',
    format: 'xid',
    message,
  });
}
