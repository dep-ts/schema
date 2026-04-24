// deno-lint-ignore-file no-explicit-any
import { SchemaError } from './error.ts';
import { clone as _clone } from './clone.ts';
import { isArray } from '@internal/is/array.ts';
import { cleanRegex } from '@internal/utils/regex.ts';

import type {
  ArrayDef,
  CatchCtx,
  CatchDef,
  CatchFn,
  CheckFn,
  DefaultDef,
  DefaultFn,
  InternalArrayDef,
  InternalCatchDef,
  InternalDefaultDef,
  InternalIntersectionDef,
  InternalNonOptionalDef,
  InternalNullableDef,
  InternalOptionalDef,
  InternalPipeDef,
  InternalPrefaultDef,
  InternalReadonlyDef,
  InternalSchemaDef,
  InternalTransformDef,
  InternalUnionDef,
  IntersectionDef,
  MaybeAsync,
  NonOptionalDef,
  NullableDef,
  OptionalDef,
  Params,
  PipeDef,
  PrefaultDef,
  PrefaultFn,
  ReadonlyDef,
  Ref,
  SafeParseError,
  SafeParseResult,
  SafeParseSuccess,
  SchemaDef,
  SchemaIssue,
  SchemaKind,
  SomeSchema,
  TransformDef,
  Transformer,
  UnionDef,
} from '@internal/types';

import {
  DEF_TYPE,
  INPUT_TYPE,
  OUTPUT_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_PATTERN,
  SCHEMA_THROW_ISSUES,
  SCHEMA_THROW_SYNC,
} from '@internal/utils/symbols.ts';

import { normalizeParams } from '@internal/utils/normalize-params.ts';
import { format, prefixIssues } from '@internal/utils/format.ts';
import { isUndefined } from '@internal/is/undefined.ts';
import { isNull } from '@internal/is/null.ts';
import { isPromiseLike } from '@internal/is/promise.ts';
import { isFunction } from '@internal/is/function.ts';
import {
  defineLazy,
  inheritPattern,
  inheritValues,
} from '@internal/utils/define.ts';
import { isRecord } from '@internal/is/record.ts';
import { isDate } from '@internal/is/date.ts';
import { JSONX } from '@internal/utils/jsonx.ts';

/**
 * Base schema class for all schema definitions.
 */
export abstract class Schema<TOutput = any, TInput = TOutput> {
  /**
   * The unique identifier for the schema kind.
   */
  public readonly kind: SchemaKind = 'AnySchema';
  declare [INPUT_TYPE]: TInput;
  declare [OUTPUT_TYPE]: TOutput;
  declare [DEF_TYPE]: InternalSchemaDef<TOutput>;
  #def: this[Ref<'DEF'>];

  /**
   * The unique identifier for the schema type.
   */
  public get type(): this[Ref<'DEF'>]['type'] {
    return this.#def.type;
  }

  get [SCHEMA_DEF](): this[Ref<'DEF'>] {
    return this.#def;
  }

  constructor(def: SchemaDef<TOutput>) {
    this.#def = {
      checks: [],
      ...def,
    };
  }

  abstract [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>];

  async [SCHEMA_PARSE_ASYNC](data: unknown): Promise<this[Ref<'OUTPUT'>]> {
    return await Promise.resolve(this[SCHEMA_PARSE](data));
  }

  /**
   * Synchronously validates input and returns the parsed output.
   *
   * @param data - Input value to validate.
   * @returns Parsed output when validation succeeds.
   * @throws {SchemaError} When validation fails.
   * @throws {Error} When a synchronous parse encounters an async overwrite/check.
   * @example
   * const result = schema.parse(value);
   */
  parse(data: unknown): this[Ref<'OUTPUT'>] {
    let result: TOutput = this[SCHEMA_PARSE](data);
    const issues: SchemaIssue[] = [];

    for (const check of this.#def.checks) {
      const payload = { data: result, issues };
      const checkResult = check(payload);

      if (isPromiseLike(checkResult)) {
        throw this[SCHEMA_THROW_SYNC]();
      }

      result = payload.data;
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  /**
   * Asynchronously validates input and returns the parsed output.
   *
   * @param data - Input value to validate.
   * @returns Parsed output when validation succeeds.
   * @throws {SchemaError} When validation fails.
   * @example
   * const result = await schema.parseAsync(value);
   */
  async parseAsync(data: unknown): Promise<this[Ref<'OUTPUT'>]> {
    let result: TOutput = await this[SCHEMA_PARSE_ASYNC](data);
    const issues: SchemaIssue[] = [];

    for (const check of this.#def.checks) {
      const payload = { data: result, issues };

      await check(payload);

      result = payload.data;
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  /**
   * Synchronously validates input and returns a safe parse result.
   *
   * @param data - Input value to validate.
   * @returns Success result or error result.
   * @throws {Error} When an unexpected non-SchemaError is thrown.
   * @example
   * const result = schema.safeParse(value);
   */
  safeParse(data: unknown): SafeParseError;
  safeParse(data: unknown): SafeParseSuccess<TOutput>;
  safeParse(data: unknown): SafeParseResult<TOutput> {
    try {
      const parsed = this.parse(data);
      return { success: true, data: parsed };
    } catch (error) {
      if (error instanceof SchemaError) return { success: false, error };
      throw error;
    }
  }

  /**
   * Asynchronously validates input and returns a safe parse result.
   *
   * @param data - Input value to validate.
   * @returns Promise resolving to a success result or error result.
   * @throws {Error} When an unexpected non-SchemaError is thrown.
   * @example
   * const result = await schema.safeParseAsync(value);
   */
  safeParseAsync(data: unknown): Promise<{ success: true; data: TOutput }>;
  safeParseAsync(data: unknown): Promise<SafeParseError>;
  async safeParseAsync(data: unknown): Promise<SafeParseResult<TOutput>> {
    try {
      const parsed = await this.parseAsync(data);
      return { success: true, data: parsed };
    } catch (error) {
      if (error instanceof SchemaError) return { success: false, error };
      throw error;
    }
  }

  /**
   * Builds an array schema whose elements are validated by this schema.
   *
   * @returns Array schema for this schema's output type.
   * @example
   * const numbers = number().array();
   */
  array(): ArraySchema<this> {
    return new ArraySchema({ type: 'array', element: this }); //message??
  }

  /**
   * Creates a union schema with this schema and the provided option.
   *
   * @param option - Schema to union with.
   * @returns Union schema combining both options.
   * @example
   * const schema = s.string().or(s.number());
   */
  or<O extends SomeSchema>(option: O): UnionSchema<[this, O]> {
    return new UnionSchema<[this, O]>({
      type: 'union',
      options: [this, option],
    });
  }

  /**
   * Creates an intersection schema that validates against both schemas.
   *
   * @param incoming - Additional schema to intersect with.
   * @returns Intersection schema for combined validation.
   * @example
   * const schema = s.object().and(s.number());
   */
  and<I extends SomeSchema>(incoming: I): IntersectionSchema<this, I> {
    return new IntersectionSchema<this, I>({
      type: 'intersection',
      left: this,
      right: incoming,
    });
  }

  /**
   * Creates a default schema that supplies a fallback value when input is undefined.
   *
   * @param defaultData - Static default value or function that returns it.
   * @returns Schema with default fallback behavior.
   * @example
   * const schema = s.string().default("anonymous");
   */
  default(defaultData: TOutput): DefaultSchema<this>;
  default(defaultData: DefaultFn<TOutput>): DefaultSchema<this>;
  default(defaultData: TOutput | DefaultFn<TOutput>): DefaultSchema<this> {
    return _default(this, defaultData);
  }

  /**
   * Creates a prefault schema that replaces undefined input before validation.
   *
   * @param defaultData - Static default value or function that returns it.
   * @returns Schema that applies a prefault value.
   * @example
   * const schema = s.string().prefault("fallback");
   */
  prefault(defaultData: TOutput): PrefaultSchema<this>;
  prefault(defaultData: PrefaultFn<TOutput>): PrefaultSchema<this>;
  prefault(defaultData: TOutput | PrefaultFn<TOutput>): PrefaultSchema<this> {
    return prefault(this, defaultData);
  }

  /**
   * Wraps this schema as optional, allowing undefined input.
   *
   * @returns Optional schema.
   * @example
   * const schema = s.string().optional();
   */
  optional(): OptionalSchema<this> {
    return new OptionalSchema<this>({ type: 'optional', innerType: this });
  }

  /**
   * Wraps this schema as exact optional, preserving the inner schema's pattern.
   *
   * @returns Exact optional schema.
   * @example
   * const schema = s.string().exactOptional();
   */
  exactOptional(): ExactOptionalSchema<this> {
    return new ExactOptionalSchema({ type: 'optional', innerType: this });
  }

  /**
   * Wraps this schema so undefined input is rejected.
   *
   * @returns Non-optional schema.
   * @example
   * const schema = s.string().nonoptional();
   */
  nonoptional(): NonOptionalSchema<this> {
    return new NonOptionalSchema<this>({
      type: 'nonoptional',
      innerType: this,
    });
  }

  /**
   * Wraps this schema so null input is accepted.
   *
   * @returns Nullable schema.
   * @example
   * const schema = s.string().nullable();
   */
  nullable(): NullableSchema<this> {
    return new NullableSchema<this>({ type: 'nullable', innerType: this });
  }

  /**
   * Creates a shallow clone of this schema, preserving current configuration.
   *
   * @returns Cloned schema instance.
   * @example
   * const copy = string().clone();
   */
  clone(): this {
    return _clone(this);
  }

  /**
   * Wraps this schema as readonly, freezing the parsed value.
   *
   * @returns Readonly schema.
   * @example
   * const schema = s.object().readonly();
   */
  readonly(): ReadonlySchema<this> {
    return new ReadonlySchema<this>({
      type: 'readonly',
      innerType: this,
    });
  }

  /**
   * Adds custom validation checks to the schema clone.
   *
   * @param checks - Check functions that may add issues.
   * @returns Schema clone with the added checks.
   * @throws {Error} When a synchronous parse encounters an async check.
   * @example
   * const schema = s.string().check(({ data }) => data.length > 0);
   */
  check(...checks: Array<CheckFn<TOutput>>): this {
    const next = this.clone();
    next[SCHEMA_DEF].checks.push(...checks);
    return next;
  }

  /**
   * Pipes parsed output from this schema into another schema.
   *
   * @param target - Target schema accepting this schema's output.
   * @returns Pipe schema combining both schemas.
   * @example
   * const schema = s.number().pipe(string());
   */
  pipe<T extends SomeSchema<any, this[Ref<'OUTPUT'>]>>(
    target: T | SomeSchema<any, this[Ref<'OUTPUT'>]>,
  ): PipeSchema<this, T> {
    return new PipeSchema({
      type: 'pipe',
      in: this,
      out: target as T,
    });
  }

  /**
   * Adds a custom refine validation step to the schema clone.
   *
   * @param fn - Validation function returning truthy or falsy.
   * @param params - Optional parameters used to construct issues.
   * @returns Schema clone with the refinement.
   * @throws {Error} When a synchronous parse encounters an async refine.
   * @example
   * const schema = s.string().refine((value) => value.includes("@"));
   */
  refine(fn: (data: TOutput) => MaybeAsync<unknown>): this;
  refine(fn: (data: TOutput) => MaybeAsync<unknown>, params?: Params): this;
  refine(fn: (data: TOutput) => MaybeAsync<unknown>, params?: Params): this {
    const next = this.clone();

    next[SCHEMA_DEF].checks.push((payload) => {
      const addIssue = () => {
        payload.issues.push({
          code: 'custom',
          message: 'Invalid input',
          ...normalizeParams(params),
        });
      };

      const result = fn(payload.data);

      if (isPromiseLike(result)) {
        return result.then((resolved) => {
          if (!resolved) addIssue();
        });
      }

      if (!result) addIssue();
    });

    return next;
  }

  /**
   * Creates a transform schema that maps parsed values.
   *
   * @param transformer - Function that transforms the parsed output.
   * @returns Transform schema.
   * @example
   * const schema = s.string().transform((value) => value.length);
   */
  transform<U>(transformer: Transformer<TOutput, U>): TransformSchema<this, U> {
    return new TransformSchema<this, U>({
      type: 'transform',
      innerType: this,
      transformer,
    });
  }

  /**
   * Adds an overwrite step to the schema clone.
   *
   * @param fn - Function that transforms the parsed output.
   * @returns Schema clone with the overwrite transformation.
   * @throws {Error} When a synchronous parse encounters an async overwrite.
   * @example
   * const schema = s.string().overwrite((value) => value.trim());
   */
  overwrite(fn: (x: TOutput) => TOutput): this {
    const next = this.clone();

    next[SCHEMA_DEF].checks.push((payload) => {
      payload.data = fn(payload.data);
    });

    return next;
  }

  /**
   * Creates a catch schema that returns a fallback value on failure.
   *
   * @param catchValue - Fallback value or function that receives failure context.
   * @returns Schema that catches validation failure.
   * @example
   * const schema = s.number().catch(0);
   */
  catch(catchValue: TOutput): CatchSchema<this>;
  catch(catchValue: CatchFn<TOutput>): CatchSchema<this>;
  catch(catchValue: TOutput | CatchFn<TOutput>): CatchSchema<this> {
    return _catch(this, catchValue);
  }

  [SCHEMA_ASSERT](
    isValid: boolean,
    ctx: Partial<SchemaIssue> & {
      received: unknown;
      output?: unknown;
    },
  ): TOutput {
    if (!isValid) {
      const def = this.#def;
      const expected = ctx.expected ?? def.type;

      throw new SchemaError({
        code: ctx.code ?? 'invalid_type',
        expected,
        received: ctx.received,
        message: def.message ??
          ctx.message ??
          `Invalid input: expected ${expected}, received ${
            format(
              ctx.received,
            )
          }`,
        path: ctx.path ?? [],
      });
    }

    return ('output' in ctx ? ctx.output : ctx.received) as TOutput;
  }

  [SCHEMA_THROW_SYNC]() {
    throw new Error(
      `${this.kind} cannot be parsed synchronously. Use .parseAsync() instead.`,
    );
  }

  [SCHEMA_THROW_ISSUES](issues: Array<Partial<SchemaIssue>>): void {
    if (issues.length > 0) {
      throw new SchemaError(issues);
    }
  }

  [SCHEMA_PATTERN](): RegExp | undefined {
    return undefined;
  }
}

/** Schema for validating arrays of values. */
export class ArraySchema<Element extends SomeSchema> extends Schema<
  Array<Element[Ref<'OUTPUT'>]>,
  Array<Element[Ref<'INPUT'>]>
> {
  public override readonly kind: SchemaKind = 'ArraySchema';
  declare [DEF_TYPE]: InternalArrayDef<Element>;

  constructor(def: ArrayDef<Element>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const items = this[SCHEMA_ASSERT](isArray(data), { received: data });

    const parseResults = items.map((item) =>
      this[SCHEMA_DEF].element.safeParse(item)
    );

    return this.#handleResults(parseResults);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const items = this[SCHEMA_ASSERT](isArray(data), { received: data });

    const parseResults = await Promise.all(
      items.map(
        async (item) => await this[SCHEMA_DEF].element.safeParseAsync(item),
      ),
    );

    return this.#handleResults(parseResults);
  }

  #handleResults<T = unknown>(parseResults: Array<SafeParseResult<T>>) {
    const issues: SchemaIssue[] = [];
    const result = [];
    let index = 0;

    for (const parseResult of parseResults) {
      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, index));
      }

      if (parseResult.success) {
        result.push(parseResult.data);
      }

      index++;
    }

    if (issues.length > 0) throw new SchemaError(issues);

    return result;
  }
}

/**
 * Creates an array schema for the given element schema.
 *
 * @param element - Schema for array elements.
 * @param message - Optional error message.
 * @returns Array schema.
 * @example
 * const schema = s.array(s.string());
 */
export function array<Element extends SomeSchema>(
  element: Element,
): ArraySchema<Element>;

export function array<Element extends SomeSchema>(
  element: Element,
  message?: string,
): ArraySchema<Element>;

export function array<Element extends SomeSchema>(
  element: Element,
  message?: string,
): ArraySchema<Element> {
  return new ArraySchema({ type: 'array', element, message });
}

/** Schema that validates input against both schemas. */
export class IntersectionSchema<
  T extends SomeSchema,
  I extends SomeSchema,
> extends Schema<
  T[Ref<'OUTPUT'>] & I[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>] & I[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'IntersectionSchema';
  declare [DEF_TYPE]: InternalIntersectionDef<T, I>;

  constructor(def: IntersectionDef<T, I>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { left, right } = this[SCHEMA_DEF];
    const leftResult = left.safeParse(data);
    const rightResult = right.safeParse(data);
    return this.#handleResults(leftResult, rightResult);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const { left, right } = this[SCHEMA_DEF];
    const leftResult = await left.safeParseAsync(data);
    const rightResult = await right.safeParseAsync(data);
    return this.#handleResults(leftResult, rightResult);
  }

  #mergeValues(
    left: unknown,
    right: unknown,
  ): {
    success: boolean;
    data?: unknown;
    errorPath?: Array<unknown>;
  } {
    if (left === right) {
      return { success: true, data: left };
    }

    if (isDate(left) && isDate(right) && +left === +right) {
      return { success: true, data: left };
    }

    if (isRecord(left) && isRecord(right)) {
      const rightKeys = Object.keys(right);
      const sharedKeys = Object.keys(left).filter(
        (key) => rightKeys.indexOf(key) !== -1,
      );

      const mergedRecord = {
        ...(left as Record<PropertyKey, unknown>),
        ...(right as Record<PropertyKey, unknown>),
      };

      for (const key of sharedKeys) {
        const result = this.#mergeValues(left[key], right[key]);
        if (!result.success) {
          return {
            success: false,
            errorPath: [key, ...(result.errorPath ?? [])],
          };
        }
        mergedRecord[key] = result.data;
      }
      return { success: true, data: mergedRecord };
    }

    if (isArray(left) && isArray(right)) {
      if (left.length !== right.length) {
        return { success: false, errorPath: [] };
      }

      const mergedArray = [];

      for (let i = 0; i < left.length; i++) {
        const result = this.#mergeValues(left[i], right[i]);
        if (!result.success) {
          return {
            success: false,
            errorPath: [i, ...(result.errorPath ?? [])],
          };
        }
        mergedArray.push(result.data);
      }
      return { success: true, data: mergedArray };
    }

    return { success: false, errorPath: [] };
  }

  #handleResults(
    leftResult: SafeParseResult<Ref<'OUTPUT'>>,
    rightResult: SafeParseResult<Ref<'OUTPUT'>>,
  ): Ref<'OUTPUT'> {
    if (!leftResult.success || !rightResult.success) {
      const issues = [
        ...(leftResult.success ? [] : leftResult.error.issues),
        ...(rightResult.success ? [] : rightResult.error.issues),
      ];

      throw new SchemaError(issues);
    }

    const merged = this.#mergeValues(leftResult.data, rightResult.data);

    if (!merged.success) {
      throw new Error(
        `Unmergable intersection. Error path: ${
          JSONX.stringify(merged.errorPath)
        }`,
      );
    }

    return merged.data as Ref<'OUTPUT'>;
  }
}

/**
 * Creates an intersection schema from two schemas.
 *
 * @param left - First schema.
 * @param right - Second schema.
 * @returns Intersection schema combining both.
 * @example
 * const schema = s.intersection(
 *  s.object({ name: s.string() }),
 *  s.object({ age: s.number() }),
 * );
 */
export function intersection<T extends SomeSchema, I extends SomeSchema>(
  left: T,
  right: I,
): IntersectionSchema<T, I> {
  return new IntersectionSchema<T, I>({
    type: 'intersection',
    left,
    right,
  });
}

/** Schema that supplies a default value when input is undefined. */
export class DefaultSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'DefaultSchema';
  declare [DEF_TYPE]: InternalDefaultDef<T>;

  constructor(def: DefaultDef<T>) {
    super(def);
    inheritValues(this, def.innerType);
  }

  [SCHEMA_PARSE](data?: unknown): T[Ref<'OUTPUT'>] {
    const { innerType, defaultData } = this[SCHEMA_DEF];

    if (isUndefined(data)) {
      return defaultData();
    }

    const result = innerType.parse(data);
    return isUndefined(result) ? defaultData() : result;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data?: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    const { innerType, defaultData } = this[SCHEMA_DEF];

    if (isUndefined(data)) {
      return await defaultData();
    }

    const result = await innerType.parseAsync(data);
    return isUndefined(result) ? await defaultData() : result;
  }
}

/**
 * Creates a default schema with fallback behavior.
 *
 * @param innerType - Schema to validate.
 * @param defaultData - Static default or generator function.
 * @returns Default schema.
 * @example
 * const schema = s.default(s.string(), "guest");
 */
function _default<T extends SomeSchema = SomeSchema>(
  innerType: T,
  defaultData: T[Ref<'OUTPUT'>] | DefaultFn<T[Ref<'OUTPUT'>]>,
): DefaultSchema<T> {
  return new DefaultSchema<T>({
    type: 'default',
    innerType,
    defaultData: isFunction(defaultData) ? defaultData : () => defaultData,
  });
}

export { _default as default };

/** Schema that replaces undefined input before parsing. */
export class PrefaultSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'PrefaultSchema';
  declare [DEF_TYPE]: InternalPrefaultDef<T>;

  constructor(def: PrefaultDef<T>) {
    super(def);
    inheritValues(this, def.innerType);
  }

  override [SCHEMA_PARSE](data?: unknown): T[Ref<'OUTPUT'>] {
    const { innerType, value } = this.#handlePrefault(data);
    return innerType.parse(value);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data?: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    const { innerType, value } = this.#handlePrefault(data);
    return await innerType.parseAsync(value);
  }

  #handlePrefault(data: unknown) {
    const { innerType, defaultData } = this[SCHEMA_DEF];
    return { value: isUndefined(data) ? defaultData() : data, innerType };
  }
}

/**
 * Creates a prefault schema that normalizes undefined input.
 *
 * @param innerType - Schema to validate.
 * @param defaultData - Static fallback or generator function.
 * @returns Prefault schema.
 * @example
 * const schema = s.prefault(s.string(), "fallback");
 */
export function prefault<T extends SomeSchema = SomeSchema>(
  innerType: T,
  defaultData: T[Ref<'OUTPUT'>] | DefaultFn<T[Ref<'OUTPUT'>]>,
): PrefaultSchema<T> {
  return new PrefaultSchema<T>({
    type: 'prefault',
    innerType,
    defaultData: isFunction(defaultData) ? defaultData : () => defaultData,
  });
}

/** Schema that transforms parsed values using a transformer. */
export class TransformSchema<T extends SomeSchema, U> extends Schema<
  U,
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'TransformSchema';
  declare [DEF_TYPE]: InternalTransformDef<T, U>;

  constructor(def: TransformDef<T, U>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): U {
    const { innerType, transformer } = this[SCHEMA_DEF];
    const parsed = innerType.parse(data);
    const transformered = transformer(parsed);

    if (isPromiseLike(transformered)) {
      throw this[SCHEMA_THROW_SYNC]();
    }

    return transformered;
  }

  override async [SCHEMA_PARSE_ASYNC](data: unknown): Promise<U> {
    const { innerType, transformer } = this[SCHEMA_DEF];
    const parsed = await innerType.parseAsync(data);
    return await transformer(parsed);
  }
}

/**
 * Creates a transform schema that maps parsed values.
 *
 * @param innerType - Schema to parse first.
 * @param transformer - Function that transforms the parsed value.
 * @returns Transform schema.
 * @example
 * const schema = s.transform(s.number(), (value) => value.toString());
 */
export function transform<T extends SomeSchema, U>(
  innerType: T,
  transformer: Transformer<T[Ref<'OUTPUT'>], U>,
): TransformSchema<T, U> {
  return new TransformSchema<T, U>({
    type: 'transform',
    innerType,
    transformer,
  });
}

/** Schema that accepts undefined and validates non-undefined values. */
export class OptionalSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>] | undefined,
  T[Ref<'INPUT'>] | undefined
> {
  public override readonly kind: SchemaKind = 'OptionalSchema';
  declare [DEF_TYPE]: InternalOptionalDef<T>;

  constructor(def: OptionalDef<T>) {
    super(def);

    const { innerType } = this[SCHEMA_DEF];
    const pattern = innerType[SCHEMA_PATTERN]();

    inheritValues(this, innerType);

    if (pattern) {
      defineLazy(this, SCHEMA_PATTERN, () => {
        return () => new RegExp(`^(${cleanRegex(pattern.source)})?$`);
      });
    }
  }

  override [SCHEMA_PARSE](data?: unknown): this[Ref<'OUTPUT'>] {
    if (isUndefined(data)) return undefined;
    const { innerType } = this[SCHEMA_DEF];
    return innerType.parse(data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data?: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    if (isUndefined(data)) return undefined;
    const { innerType } = this[SCHEMA_DEF];
    return await innerType.parseAsync(data);
  }
}

/**
 * Creates an optional schema from an inner schema.
 *
 * @param innerType - Schema to wrap.
 * @returns Optional schema.
 * @example
 * const schema = s.optional(s.string());
 */
export function optional<T extends SomeSchema>(
  innerType: T,
): OptionalSchema<T> {
  return new OptionalSchema<T>({ type: 'optional', innerType });
}

/** Schema that accepts null and validates non-null values. */
export class NullableSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>] | null,
  T[Ref<'INPUT'>] | null
> {
  public override readonly kind: SchemaKind = 'NullableSchema';
  declare [DEF_TYPE]: InternalNullableDef<T>;

  constructor(def: NullableDef<T>) {
    super(def);

    const { innerType } = this[SCHEMA_DEF];
    const pattern = innerType[SCHEMA_PATTERN]();

    inheritValues(this, innerType);

    if (pattern) {
      defineLazy(this, SCHEMA_PATTERN, () => {
        return () => new RegExp(`^(${cleanRegex(pattern.source)}|null)$`);
      });
    }
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    if (isNull(data)) return null;
    const { innerType } = this[SCHEMA_DEF];
    return innerType.parse(data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    if (isNull(data)) return null;
    const { innerType } = this[SCHEMA_DEF];
    return await innerType.parseAsync(data);
  }
}

/**
 * Creates a nullable schema from an inner schema.
 *
 * @param innerType - Schema to wrap.
 * @returns Nullable schema.
 * @example
 * const schema = s.nullable(s.string());
 */
export function nullable<T extends SomeSchema>(
  innerType: T,
): NullableSchema<T> {
  return new NullableSchema<T>({ type: 'nullable', innerType });
}

/** Schema that validates input against one of several schemas. */
export class UnionSchema<
  const T extends readonly SomeSchema[] = SomeSchema[],
> extends Schema<T[number][Ref<'OUTPUT'>], T[number][Ref<'INPUT'>]> {
  public override readonly kind: SchemaKind = 'UnionSchema';
  declare [DEF_TYPE]: InternalUnionDef<T>;

  constructor(def: UnionDef<T>) {
    super(def);

    if (def.options.length > 0) {
      if (def.options.every((opt) => opt[SCHEMA_PATTERN]())) {
        defineLazy(this, SCHEMA_PATTERN, () => {
          const patterns = def.options.map((opt) => opt[SCHEMA_PATTERN]());
          return () =>
            new RegExp(
              `^(${
                patterns
                  .map((pattern) => cleanRegex(pattern!.source))
                  .join('|')
              })$`,
            );
        });
      }

      if (def.options.every((opt) => opt[SCHEMA_DEF].values)) {
        defineLazy(
          this[SCHEMA_DEF],
          'values',
          () =>
            new Set(
              def.options.flatMap((opt) =>
                Array.from(opt[SCHEMA_DEF].values ?? [])
              ),
            ),
        );
      }
    }
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { options } = this[SCHEMA_DEF];
    const issues: SchemaIssue[] = [];

    for (const option of options) {
      const result = option.safeParse(data);
      if (result.success) return result.data;
      issues.push(...result.error.issues);
    }

    this[SCHEMA_THROW_ISSUES](issues);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const { options } = this[SCHEMA_DEF];
    const issues: SchemaIssue[] = [];

    for (const option of options) {
      const result = await option.safeParseAsync(data);
      if (result.success) return result.data;
      issues.push(...result.error.issues);
    }

    this[SCHEMA_THROW_ISSUES](issues);
  }
}

/**
 * Creates a union schema from an array of schemas.
 *
 * @param options - Schemas to union.
 * @param message - Optional error message.
 * @returns Union schema.
 * @example
 * const schema = s.union([s.string(), s.number()]);
 */
export function union<const T extends readonly SomeSchema[]>(
  options: T,
): UnionSchema<T>;

export function union<const T extends readonly SomeSchema[]>(
  options: T,
  message?: string,
): UnionSchema<T>;

export function union<const T extends readonly SomeSchema[]>(
  options: T,
  message?: string,
): UnionSchema<T> {
  return new UnionSchema<T>({ type: 'union', options, message });
}

/** Schema that freezes parsed output as readonly. */
export class ReadonlySchema<T extends SomeSchema> extends Schema<
  Readonly<T[Ref<'OUTPUT'>]>,
  Readonly<T[Ref<'INPUT'>]>
> {
  public override readonly kind: SchemaKind = 'ReadonlySchema';
  declare [DEF_TYPE]: InternalReadonlyDef<T>;

  constructor(def: ReadonlyDef<T>) {
    super(def);
    inheritValues(this, def.innerType);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const result = this[SCHEMA_DEF].innerType.safeParse(data);

    if (!result.success) {
      throw new SchemaError(result.error.issues);
    }

    return Object.freeze(result.data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const result = await this[SCHEMA_DEF].innerType.safeParseAsync(data);

    if (!result.success) {
      throw new SchemaError(result.error.issues);
    }

    return Object.freeze(result.data);
  }
}

/**
 * Creates a readonly schema from an inner schema.
 *
 * @param innerType - Schema to wrap.
 * @param message - Optional error message.
 * @returns Readonly schema.
 * @example
 * const schema = s.readonly(s.object());
 */
export function readonly<T extends SomeSchema>(innerType: T): ReadonlySchema<T>;

export function readonly<T extends SomeSchema>(
  innerType: T,
  message?: string,
): ReadonlySchema<T>;

export function readonly<T extends SomeSchema>(
  innerType: T,
  message?: string,
): ReadonlySchema<T> {
  return new ReadonlySchema<T>({ type: 'readonly', innerType, message });
}

/** Schema that rejects undefined input even when the inner schema accepts it. */
export class NonOptionalSchema<T extends SomeSchema> extends Schema<
  Exclude<T[Ref<'OUTPUT'>], undefined>,
  Exclude<T[Ref<'INPUT'>], undefined>
> {
  public override readonly kind: SchemaKind = 'NonOptionalSchema';
  declare [DEF_TYPE]: InternalNonOptionalDef<T>;

  constructor(def: NonOptionalDef<T>) {
    super(def);

    defineLazy(this[SCHEMA_DEF], 'values', () => {
      const { values } = def.innerType[SCHEMA_DEF];
      return values
        ? new Set([...values].filter((x) => x !== undefined))
        : undefined;
    });
  }

  override [SCHEMA_PARSE](data: unknown): T[Ref<'OUTPUT'>] {
    const { innerType } = this[SCHEMA_DEF];
    const parseResult = innerType.safeParse(data);

    if (parseResult.success) {
      this[SCHEMA_ASSERT](!isUndefined(data), {
        received: data,
      });
    }

    return innerType.parse(data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    const { innerType } = this[SCHEMA_DEF];
    const parseResult = await innerType.safeParseAsync(data);

    if (parseResult.success) {
      this[SCHEMA_ASSERT](!isUndefined(data), {
        received: data,
      });
    }

    return await innerType.parseAsync(data);
  }
}

/**
 * Creates a nonoptional schema from an inner schema.
 *
 * @param innerType - Schema to wrap.
 * @param message - Optional error message.
 * @returns Non-optional schema.
 * @example
 * const schema = s.nonoptional(s.string());
 */
export function nonoptional<T extends SomeSchema>(
  innerType: T,
): NonOptionalSchema<T>;

export function nonoptional<T extends SomeSchema>(
  innerType: T,
  message?: string,
): NonOptionalSchema<T>;

export function nonoptional<T extends SomeSchema>(
  innerType: T,
  message?: string,
): NonOptionalSchema<T> {
  return new NonOptionalSchema<T>({ type: 'nonoptional', innerType, message });
}

/** Schema that returns a fallback value when validation fails. */
export class CatchSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'CatchSchema';
  declare [DEF_TYPE]: InternalCatchDef<T>;

  constructor(def: CatchDef<T>) {
    super(def);
    inheritValues(this, def.innerType);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { innerType, catchValue } = this[SCHEMA_DEF];
    const result = innerType.safeParse(data);

    if (result.success) {
      return result.data;
    }

    const catchedValue = catchValue({
      issues: result.error.issues,
      data,
    });

    if (isPromiseLike(catchedValue)) {
      throw this[SCHEMA_THROW_SYNC]();
    }

    return catchedValue;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const { innerType, catchValue } = this[SCHEMA_DEF];
    const result = await innerType.safeParseAsync(data);

    if (result.success) {
      return result.data;
    }

    return catchValue({
      issues: result.error.issues,
      data,
    }) as Promise<Awaited<T[Ref<'OUTPUT'>]>>;
  }
}

/**
 * Creates a catch schema that supplies fallback behavior.
 *
 * @param innerType - Schema to validate.
 * @param catchValue - Static fallback or function.
 * @returns Catch schema.
 * @example
 * const schema = s.catch(s.number(), 0);
 */
function _catch<T extends SomeSchema>(
  innerType: T,
  catchValue: T[Ref<'OUTPUT'>],
): CatchSchema<T>;

function _catch<T extends SomeSchema>(
  innerType: T,
  catchValue: CatchFn<T[Ref<'OUTPUT'>]>,
): CatchSchema<T>;

function _catch<T extends SomeSchema>(
  innerType: T,
  catchValue: T[Ref<'OUTPUT'>] | CatchFn<T[Ref<'OUTPUT'>]>,
): CatchSchema<T>;

function _catch<T extends SomeSchema>(
  innerType: T,
  catchValue: T[Ref<'OUTPUT'>] | CatchFn<T[Ref<'OUTPUT'>]>,
): CatchSchema<T> {
  return new CatchSchema({
    type: 'catch',
    innerType,
    catchValue: isFunction(catchValue)
      ? catchValue
      : (_ctx: CatchCtx) => catchValue,
  });
}

export { _catch as catch };

/** Exact optional schema that preserves the inner schema’s pattern. */
export class ExactOptionalSchema<T extends SomeSchema> extends Schema<
  T[Ref<'OUTPUT'>],
  T[Ref<'INPUT'>]
> {
  public override readonly kind: SchemaKind = 'ExactOptionalSchema';
  declare [DEF_TYPE]: InternalOptionalDef<T>;

  constructor(def: OptionalDef<T>) {
    super(def);
    inheritPattern(this, def.innerType);
    inheritValues(this, def.innerType);
  }

  override [SCHEMA_PARSE](data: unknown): T[Ref<'OUTPUT'>] {
    return this[SCHEMA_DEF].innerType.parse(data);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<T[Ref<'OUTPUT'>]> {
    return await this[SCHEMA_DEF].innerType.parseAsync(data);
  }
}

/**
 * Creates an exact optional schema that preserves pattern matching.
 *
 * @param innerType - Schema to wrap.
 * @returns Exact optional schema.
 * @example
 * const schema = s.exactOptional(s.string());
 */
export function exactOptional<T extends SomeSchema>(
  innerType: T,
): ExactOptionalSchema<T> {
  return new ExactOptionalSchema<T>({ type: 'optional', innerType });
}

/** Schema that pipes output from one schema into another. */
export class PipeSchema<
  A extends SomeSchema = SomeSchema,
  B extends SomeSchema = SomeSchema,
> extends Schema<B[Ref<'OUTPUT'>], A[Ref<'INPUT'>]> {
  public override readonly kind: SchemaKind = 'PipeSchema';
  declare [DEF_TYPE]: InternalPipeDef<A, B>;
  declare readonly in: A;
  declare readonly out: B;

  constructor(def: PipeDef<A, B>) {
    super(def);

    this.in = def.in;
    this.out = def.out;
    inheritValues(this, def.in);
  }

  override [SCHEMA_PARSE](data: unknown): B[Ref<'OUTPUT'>] {
    const { in: left, out: right } = this[SCHEMA_DEF];
    const parsed = left.parse(data);
    return right.parse(parsed);
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<B[Ref<'OUTPUT'>]> {
    const { in: left, out: right } = this[SCHEMA_DEF];
    const parsed = await left.parseAsync(data);
    return await right.parseAsync(parsed);
  }
}

/**
 * Creates a pipe schema from two schemas.
 *
 * @param in_ - First schema in the pipeline.
 * @param out - Second schema consuming the first output.
 * @returns Pipe schema.
 * @example
 * const schema = s.pipe(s.number(), s.string());
 */
export function pipe<
  const A extends SomeSchema,
  B extends SomeSchema<any, A[Ref<'OUTPUT'>]> = SomeSchema<
    any,
    A[Ref<'OUTPUT'>]
  >,
>(in_: A, out: B | SomeSchema<any, A[Ref<'OUTPUT'>]>): PipeSchema<A, B> {
  return new PipeSchema({
    type: 'pipe',
    in: in_,
    out: out as B,
  });
}
