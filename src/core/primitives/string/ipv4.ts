import type { IPv4Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating IPv4 address strings. */
export class IPv4Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'IPv4Schema';

  constructor(def: IPv4Def) {
    super({
      ...def,
      pattern: def.pattern ??
        /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
    });
  }
}

/**
 * Creates an IPv4 address string schema.
 *
 * @param message - Optional error message.
 * @returns IPv4 schema.
 * @example
 * const schema = s.ipv4();
 */
export function ipv4(): IPv4Schema;
export function ipv4(message?: string): IPv4Schema;
export function ipv4(message?: string): IPv4Schema {
  return new IPv4Schema({
    type: 'string',
    format: 'ipv4',
    message,
  });
}
