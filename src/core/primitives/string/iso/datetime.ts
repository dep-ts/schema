import type { ISODateTimeDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from '@core/primitives/string/string-format.ts';
import { dateSource } from '@internal/utils/date-source.ts';
import { timeSource } from '@internal/utils/time-source.ts';

/** Schema for validating ISO date-time strings. */
export class ISODateTimeSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'ISODateTimeSchema';

  constructor(def: ISODateTimeDef) {
    const time = timeSource(def.precision);
    const opts = ['Z'];

    if (def.local) {
      opts.push('');
    }

    if (def.offset) {
      opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
    }

    const timeRegex = `${time}(?:${opts.join('|')})`;

    super({
      ...def,
      pattern: def.pattern ?? new RegExp(`^${dateSource}T(?:${timeRegex})$`),
    });
  }
}

/**
 * Creates an ISO date-time string schema.
 *
 * @param message - Optional error message.
 * @returns ISO date-time schema.
 * @example
 * const schema = s.iso.datetime();
 */
export function datetime(): ISODateTimeSchema;
export function datetime(message?: string): ISODateTimeSchema;
export function datetime(message?: string): ISODateTimeSchema {
  return new ISODateTimeSchema({
    type: 'string',
    format: 'datetime',
    offset: false,
    local: false,
    precision: null,
    message,
  });
}
