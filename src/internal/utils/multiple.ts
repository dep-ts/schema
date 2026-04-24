import { SomeSchema } from '@internal/types';
import { SCHEMA_DEF } from './symbols.ts';

export function _multipleOf<T extends SomeSchema>(
  schema: T,
  value: bigint | number,
  message?: string,
): T {
  const allowed = ['NumberSchema', 'BigintSchema'];

  if (!allowed.includes(schema.kind)) {
    throw new Error(
      `multipleOf is not compatible with ${schema.kind}. Use ${
        allowed.join(
          ' or ',
        )
      }.`,
    );
  }

  schema[SCHEMA_DEF].checks.push((payload) => {
    const input = payload.data;
    let isMultiple: boolean;

    if (typeof input === 'bigint' && typeof value === 'bigint') {
      isMultiple = input % value === 0n;
    } else {
      isMultiple = Number(input) % Number(value) === 0;
    }

    if (!isMultiple) {
      payload.issues.push({
        code: 'not_multiple_of',
        received: input,
        expected: value,
        message: message ??
          `Invalid ${schema.type}: must be a multiple of ${value}`,
      });
    }
  });

  return schema;
}
