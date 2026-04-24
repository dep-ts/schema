import type { InternalFunctionDef, SomeSchema } from '@internal/types';
import type {
  FunctionDef,
  FunctionIn,
  FunctionOut,
  InfertFunctionInput,
  InfertFunctionOutput,
  Ref,
  SchemaKind,
} from '@internal/types';

import { array, Schema } from '@core/utilities/schema.ts';
import { tuple, TupleSchema } from './tuple.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_SYNC,
} from '@internal/utils/symbols.ts';
import { isFunction } from '@internal/is/function.ts';
import { unknown } from '@core/special/unknown.ts';
import { isPromiseLike } from '@internal/is/promise.ts';

/** Schema for validating function values. */
export class FunctionSchema<
  Args extends FunctionIn = FunctionIn,
  Returns extends FunctionOut = FunctionOut,
> extends Schema<
  InfertFunctionOutput<Args, Returns>,
  InfertFunctionInput<Args, Returns>
> {
  public override readonly kind: SchemaKind = 'FunctionSchema';
  declare [DEF_TYPE]: InternalFunctionDef<Args, Returns>;

  constructor(def: FunctionDef<Args, Returns>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const fn = this[SCHEMA_ASSERT](isFunction(data), {
      received: data,
    });

    return (...args: Array<unknown>) => {
      const validatedArgs = this[SCHEMA_DEF].input.parse(args);
      const result = fn(...validatedArgs);

      if (isPromiseLike(result)) {
        throw this[SCHEMA_THROW_SYNC]();
      }

      return this[SCHEMA_DEF].output.parse(result);
    };
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const fn = this[SCHEMA_ASSERT](isFunction(data), {
      received: data,
    });

    return await Promise.resolve(async (...args: Array<unknown>) => {
      const validatedArgs = await this[SCHEMA_DEF].input.parseAsync(args);
      const result = await fn(...validatedArgs);
      return await this[SCHEMA_DEF].output.parseAsync(result);
    });
  }
}

/**
 * Creates a function schema.
 *
 * @param params - Optional configuration for input and output validation.
 * @returns Function schema.
 * @example
 * const schema = s.function({
 *   input: [s.string()],
 *   output: s.number(),
 * });
 */
function _function(): FunctionSchema;

function _function<In extends readonly [SomeSchema, ...SomeSchema[]]>(params: {
  input: In;
}): FunctionSchema<TupleSchema<In, null>, FunctionOut>;

function _function<
  In extends readonly [SomeSchema, ...SomeSchema[]],
  const Out extends FunctionOut = FunctionOut,
>(params: {
  input: In;
  output: Out;
}): FunctionSchema<TupleSchema<In, null>, Out>;

function _function<const In extends FunctionIn = FunctionIn>(params: {
  input: In;
}): FunctionSchema<In, FunctionOut>;

function _function<const Out extends FunctionOut = FunctionOut>(params: {
  output: Out;
}): FunctionSchema<FunctionIn, Out>;

function _function<
  In extends FunctionIn = FunctionIn,
  Out extends SomeSchema = SomeSchema,
>(params: { input: In; output: Out }): FunctionSchema<In, Out>;

function _function<
  In extends FunctionIn = FunctionIn,
  Out extends SomeSchema = SomeSchema,
>(
  params: {
    input?: In;
    output?: Out;
    message?: string;
  } = {},
): FunctionSchema<In, Out> {
  return new FunctionSchema({
    type: 'function',
    input: Array.isArray(params?.input)
      ? tuple(params?.input as unknown as [])
      : (params?.input ?? array(unknown())),
    output: params?.output ?? unknown(),
    // deno-lint-ignore no-explicit-any
  }) as any;
}

export { _function as function };
