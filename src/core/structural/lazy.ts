import { SomeSchema } from '@internal/types';

import type {
  InternalLazyDef,
  LazyDef,
  Ref,
  SchemaKind,
} from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';

/** Schema for validating values with a lazily evaluated schema. */
export class LazySchema<T extends SomeSchema = SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'LazySchema';
  declare [DEF_TYPE]: InternalLazyDef<T>;

  constructor(def: LazyDef<T>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): T[Ref<'OUTPUT'>] {
    const { getter } = this[SCHEMA_DEF];
    return getter().parse(data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    const { getter } = this[SCHEMA_DEF];
    return await getter().parseAsync(data);
  }

  override [SCHEMA_PATTERN](): RegExp | undefined {
    const innerType = this[SCHEMA_DEF].getter();
    const pattern = innerType[SCHEMA_PATTERN]();
    if (pattern) return pattern;
    return undefined;
  }
}

/**
 * Creates a lazy schema.
 *
 * @param getter - Function that returns the schema to use.
 * @param message - Optional error message.
 * @returns Lazy schema.
 * @example
 * const schema = s.lazy(() => s.string());
 */
export function lazy<T extends SomeSchema>(getter: () => T): LazySchema<T>;
export function lazy<T extends SomeSchema>(
  getter: () => T,
  message?: string,
): LazySchema<T>;

export function lazy<T extends SomeSchema>(
  getter: () => T,
  message?: string,
): LazySchema<T> {
  return new LazySchema<T>({ type: 'lazy', getter, message });
}
