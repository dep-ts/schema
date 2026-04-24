import { SomeSchema } from '@internal/types';
import { SCHEMA_DEF } from './symbols.ts';

export function lessThan<T extends SomeSchema>(
  schema: T,
  params: { value: bigint | number; inclusive?: boolean; message?: string },
): T {
  const allowed = ['NumberSchema', 'BigintSchema'];

  if (!allowed.includes(schema.kind)) {
    throw new Error(
      `lessThan is not compatible with ${schema.kind}. Use ${
        allowed.join(
          ' or ',
        )
      }.`,
    );
  }

  const { value, inclusive, message } = params;

  schema[SCHEMA_DEF].checks.push((payload) => {
    const input = payload.data;
    const isSatisfied = inclusive ? input <= value : input < value;

    if (!isSatisfied) {
      payload.issues.push({
        code: 'too_big',
        received: input,
        message: message ?? `Too big: expected ${schema.type} to be <=${value}`,
      });
    }
  });

  return schema;
}

export function _lt<T extends SomeSchema>(
  schema: T,
  value: bigint | number,
  message?: string,
) {
  return lessThan(schema, { value, inclusive: false, message });
}

export function _lte<T extends SomeSchema>(
  schema: T,
  value: bigint | number,
  message?: string,
) {
  return lessThan(schema, { value, inclusive: true, message });
}
