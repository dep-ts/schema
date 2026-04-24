import type { ISODurationDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from '@core/primitives/string/string-format.ts';

/** Schema for validating ISO duration strings. */
export class ISODurationSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'ISODurationSchema';

  constructor(def: ISODurationDef) {
    super({
      ...def,
      pattern: def.pattern ??
        /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,
    });
  }
}

/**
 * Creates an ISO duration schema.
 *
 * @param message - Optional error message.
 * @returns ISO duration schema.
 * @example
 * const schema = s.iso.duration();
 */
export function duration(): ISODurationSchema;
export function duration(message?: string): ISODurationSchema;
export function duration(message?: string): ISODurationSchema {
  return new ISODurationSchema({
    type: 'string',
    format: 'duration',
    message,
  });
}
