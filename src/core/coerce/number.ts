import { NumberDef, SchemaKind } from '@internal/types';
import { NumberSchema } from '@core/primitives/number/number.ts';

/** Schema for coerced number values. */
export class NumberSchemaCoerced extends NumberSchema {
  public override readonly kind: SchemaKind = 'NumberSchemaCoerced';

  constructor(def: NumberDef) {
    super(def);
  }
}

/**
 * Creates a number schema that coerces input to number.
 *
 * @param message - Optional error message.
 * @returns Coerced number schema.
 * @example
 * const schema = s.coerce.number();
 */
export function number(): NumberSchemaCoerced;
export function number(message?: string): NumberSchemaCoerced;
export function number(message?: string): NumberSchemaCoerced {
  return new NumberSchemaCoerced({ type: 'number', coerce: true, message });
}
