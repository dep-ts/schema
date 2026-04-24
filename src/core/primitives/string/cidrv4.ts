import type { CIDRv4Def, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating IPv4 CIDR notation strings. */
export class CIDRv4Schema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'CIDRv4Schema';

  constructor(def: CIDRv4Def) {
    super({
      ...def,
      pattern: def.pattern ??
        /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,
    });
  }
}

/**
 * Creates an IPv4 CIDR string schema.
 *
 * @param message - Optional error message.
 * @returns CIDR v4 schema.
 * @example
 * const schema = s.cidrv4();
 */
export function cidrv4(): CIDRv4Schema;
export function cidrv4(message?: string): CIDRv4Schema;
export function cidrv4(message?: string): CIDRv4Schema {
  return new CIDRv4Schema({
    type: 'string',
    format: 'cidrv4',
    message,
  });
}
