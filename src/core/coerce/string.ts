import { SchemaKind, StringDef } from '@internal/types';
import { StringSchema } from '@core/primitives/string/string.ts';

/** Schema for coerced string values. */
export class StringSchemaCoerced extends StringSchema {
  public override readonly kind: SchemaKind = 'StringSchemaCoerced';

  constructor(def: StringDef) {
    super(def);
  }
}

/**
 * Creates a string schema that coerces input to string.
 *
 * @param message - Optional error message.
 * @returns Coerced string schema.
 * @example
 * const schema = s.coerce.string();
 */
export function string(): StringSchemaCoerced;
export function string(message?: string): StringSchemaCoerced;
export function string(message?: string): StringSchemaCoerced {
  return new StringSchemaCoerced({ type: 'string', coerce: true, message });
}
