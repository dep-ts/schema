import type { CIDRv6Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating IPv6 CIDR notation strings. */
export class CIDRv6Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'CIDRv6Schema';

  constructor(def: CIDRv6Def) {
    super({
      ...def,
      pattern: def.pattern ??
        /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
    });
  }
}

/**
 * Creates an IPv6 CIDR string schema.
 *
 * @param message - Optional error message.
 * @returns CIDR v6 schema.
 * @example
 * const schema = s.cidrv6();
 */
export function cidrv6(): CIDRv6Schema;
export function cidrv6(message?: string): CIDRv6Schema;
export function cidrv6(message?: string): CIDRv6Schema {
  return new CIDRv6Schema({
    type: 'string',
    format: 'cidrv6',
    message,
  });
}
