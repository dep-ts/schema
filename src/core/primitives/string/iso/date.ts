import type { ISODateDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from '@core/primitives/string/string-format.ts';
import { dateSource } from '@internal/utils/date-source.ts';

/** Schema for validating ISO date strings. */
export class ISODateSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'ISODateSchema';

  constructor(def: ISODateDef) {
    super({ ...def, pattern: def.pattern ?? new RegExp(`^${dateSource}$`) });
  }
}

/**
 * Creates an ISO date string schema.
 *
 * @param message - Optional error message.
 * @returns ISO date schema.
 * @example
 * const schema = s.iso.date();
 */
export function date(): ISODateSchema;
export function date(message?: string): ISODateSchema;
export function date(message?: string): ISODateSchema {
  return new ISODateSchema({
    type: 'string',
    format: 'date',
    message,
  });
}
