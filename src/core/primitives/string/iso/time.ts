import type { ISOTimeDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from '@core/primitives/string/string-format.ts';
import { timeSource } from '@internal/utils/time-source.ts';

/** Schema for validating ISO time strings. */
export class ISOTimeSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'ISOTimeSchema';

  constructor(def: ISOTimeDef) {
    super({
      ...def,
      pattern: def.pattern ?? new RegExp(`^${timeSource(def.precision)}$`),
    });
  }
}

/**
 * Creates an ISO time string schema.
 *
 * @param message - Optional error message.
 * @returns ISO time schema.
 * @example
 * const schema = s.iso.time();
 */
export function time(): ISOTimeSchema;
export function time(message?: string): ISOTimeSchema;
export function time(message?: string): ISOTimeSchema {
  return new ISOTimeSchema({
    type: 'string',
    format: 'time',
    message,
    precision: null,
  });
}
