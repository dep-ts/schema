import { BigIntDef, SchemaKind } from '@internal/types';
import { BigIntSchema } from '@core/primitives/bigint/bigint.ts';

/** Schema for coerced bigint values. */
export class BigIntSchemaCoerced extends BigIntSchema {
  public override readonly kind: SchemaKind = 'BigIntSchemaCoerced';

  constructor(def: BigIntDef) {
    super(def);
  }
}

/**
 * Creates a bigint schema that coerces input to bigint.
 *
 * @param message - Optional error message.
 * @returns Coerced bigint schema.
 * @example
 * const schema = s.coerce.bigint();
 */
export function bigint(): BigIntSchemaCoerced;
export function bigint(message?: string): BigIntSchemaCoerced;
export function bigint(message?: string): BigIntSchemaCoerced {
  return new BigIntSchemaCoerced({ type: 'bigint', coerce: true, message });
}
