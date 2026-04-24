import { SomeSchema } from '@internal/types';
import {
  EVALUATING,
  SCHEMA_DEF,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';

export function defineLazy<T, K extends keyof T>(
  object: T,
  key: K,
  getter: () => T[K],
): void {
  let value: T[K] | typeof EVALUATING | undefined = undefined;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return undefined as T[K];
      }
      if (value === undefined) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object, key, {
        value: v,
      });
    },
    configurable: true,
  });
}

export function inheritPattern<T extends SomeSchema, I extends SomeSchema>(
  schema: T,
  innerType: I,
) {
  if (innerType[SCHEMA_PATTERN]()) {
    defineLazy(schema, SCHEMA_PATTERN, () => innerType[SCHEMA_PATTERN]);
  }
}

export function inheritValues<T extends SomeSchema, I extends SomeSchema>(
  schema: T,
  innerType: I,
) {
  const { values } = innerType[SCHEMA_DEF];

  if (values) {
    defineLazy(schema[SCHEMA_DEF], 'values', () => values);
  }
}
