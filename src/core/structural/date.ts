// deno-lint-ignore-file no-explicit-any
import type { DateDef, InternalDateDef, SchemaKind } from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
} from '@internal/utils/symbols.ts';
import { isDate } from '@internal/is/date.ts';

export class DateSchema extends Schema<Date> {
  public override readonly kind: SchemaKind = 'DateSchema';
  declare [DEF_TYPE]: InternalDateDef;

  constructor(def: DateDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): Date {
    let input = data;

    if (this[SCHEMA_DEF].coerce) {
      try {
        input = new Date(input as any);
      } catch {
        //
      }
    }

    return this[SCHEMA_ASSERT](isDate(input), {
      received: data,
      output: input,
    });
  }
}

export function date(): DateSchema;
export function date(message?: string): DateSchema;
export function date(message?: string): DateSchema {
  return new DateSchema({
    type: 'date',
    message,
  });
}
