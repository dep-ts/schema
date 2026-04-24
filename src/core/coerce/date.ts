import { DateDef, SchemaKind } from '@internal/types';
import { DateSchema } from '@core/structural/date.ts';

/** Schema for coerced date values. */
export class DateSchemaCoerced extends DateSchema {
  public override readonly kind: SchemaKind = 'DateSchemaCoerced';

  constructor(def: DateDef) {
    super(def);
  }
}

/**
 * Creates a date schema that coerces input to Date.
 *
 * @param message - Optional error message.
 * @returns Coerced date schema.
 * @example
 * const schema = s.coerce.date();
 */
export function date(): DateSchemaCoerced;
export function date(message?: string): DateSchemaCoerced;
export function date(message?: string): DateSchemaCoerced {
  return new DateSchemaCoerced({ type: 'date', coerce: true, message });
}
