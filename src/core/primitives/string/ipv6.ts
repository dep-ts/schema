import type { IPv6Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating IPv6 address strings. */
export class IPv6Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'IPv6Schema';

  constructor(def: IPv6Def) {
    super({
      ...def,
      pattern: def.pattern ??
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
    });
  }
}

/**
 * Creates an IPv6 address string schema.
 *
 * @param message - Optional error message.
 * @returns IPv6 schema.
 * @example
 * const schema = s.ipv6();
 */
export function ipv6(): IPv6Schema;
export function ipv6(message?: string): IPv6Schema;
export function ipv6(message?: string): IPv6Schema {
  return new IPv6Schema({
    type: 'string',
    format: 'ipv6',
    message,
  });
}
