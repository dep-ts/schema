import { BooleanDef, SchemaKind } from '@internal/types';
import { BooleanSchema } from '@core/primitives/boolean.ts';

/** Schema for coerced boolean values. */
export class BooleanSchemaCoerced extends BooleanSchema {
  public override readonly kind: SchemaKind = 'BooleanSchemaCoerced';

  constructor(def: BooleanDef) {
    super(def);
  }
}

/**
 * Creates a boolean schema that coerces input to boolean.
 *
 * @param message - Optional error message.
 * @returns Coerced boolean schema.
 * @example
 * const schema = s.coerce.boolean();
 */
export function boolean(): BooleanSchemaCoerced;
export function boolean(message?: string): BooleanSchemaCoerced;
export function boolean(message?: string): BooleanSchemaCoerced {
  return new BooleanSchemaCoerced({ type: 'boolean', coerce: true, message });
}
