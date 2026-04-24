import { SomeSchema } from '@internal/types';
import { SCHEMA_DEF } from './symbols.ts';

export function greaterThan<T extends SomeSchema>(
  schema: T,
  params: { value: bigint | number; inclusive?: boolean; message?: string },
): T {
  const allowed = ['NumberSchema', 'BigintSchema'];

  if (!allowed.includes(schema.kind)) {
    throw new Error(
      `greaterThan is not compatible with ${schema.kind}. Use ${
        allowed.join(
          ' or ',
        )
      }.`,
    );
  }

  const { value, inclusive, message } = params;

  schema[SCHEMA_DEF].checks.push((payload) => {
    const input = payload.data;
    const isSatisfied = inclusive ? input >= value : input > value;

    if (!isSatisfied) {
      payload.issues.push({
        code: 'too_small',
        received: input,
        message: message ??
          `Too small: expected ${schema.type} to be >=${value}`,
      });
    }
  });

  return schema;
}

export function _gte<T extends SomeSchema>(
  schema: T,
  value: bigint | number,
  message?: string,
) {
  return greaterThan(schema, { value, inclusive: true, message });
}

export function _gt<T extends SomeSchema>(
  schema: T,
  value: bigint | number,
  message?: string,
) {
  return greaterThan(schema, { value, inclusive: false, message });
}
