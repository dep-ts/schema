import type {
  InternalPromiseDef,
  PromiseDef,
  Ref,
  SchemaKind,
  SomeSchema,
} from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_SYNC,
} from '@internal/utils/symbols.ts';

/** Schema for validating Promise objects. */
export class PromiseSchema<T extends SomeSchema = SomeSchema> extends Schema<
  Promise<T[Ref<'OUTPUT'>]>,
  Promise<T[Ref<'INPUT'>]>
> {
  public override readonly kind: SchemaKind = 'PromiseSchema';
  declare [DEF_TYPE]: InternalPromiseDef<T>;

  constructor(def: PromiseDef<T>) {
    super(def);
  }

  override [SCHEMA_PARSE](_data: unknown): Promise<T[Ref<'OUTPUT'>]> {
    throw this[SCHEMA_THROW_SYNC]();
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    const parsed: Ref<'OUTPUT'> = await this[SCHEMA_DEF].innerType.parseAsync(
      data,
    );

    return await Promise.resolve(parsed);
  }
}

/**
 * Creates a promise schema.
 *
 * @param innerType - Schema for the resolved value.
 * @param message - Optional error message.
 * @returns Promise schema.
 * @example
 * const schema = s.promise(s.string());
 */
export function promise<T extends SomeSchema>(innerType: T): PromiseSchema<T>;

export function promise<T extends SomeSchema>(
  innerType: T,
  message?: string,
): PromiseSchema<T>;

export function promise<T extends SomeSchema>(
  innerType: T,
  message?: string,
): PromiseSchema<T> {
  return new PromiseSchema<T>({ type: 'promise', message, innerType });
}
