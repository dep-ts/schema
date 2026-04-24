import type {
  InternalTupleDef,
  SchemaIssue,
  SomeSchema,
} from '@internal/types';

import type {
  InferTupleInput,
  InferTupleOutput,
  Ref,
  SchemaKind,
  TupleDef,
} from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import { isArray } from '@internal/is/array.ts';
import { isNull } from '@internal/is/null.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_ISSUES,
} from '@internal/utils/symbols.ts';
import { isSchema } from '@internal/is/schema.ts';
import { prefixIssues } from '@internal/utils/format.ts';
import { SchemaError } from '@core/utilities/error.ts';

/** Schema for validating tuple (fixed-length array) values. */
export class TupleSchema<
  T extends ReadonlyArray<SomeSchema> = readonly SomeSchema[],
  R extends SomeSchema | null = SomeSchema | null,
> extends Schema<InferTupleOutput<T, R>, InferTupleInput<T, R>> {
  public override readonly kind: SchemaKind = 'TupleSchema';
  declare [DEF_TYPE]: InternalTupleDef<T, R>;

  constructor(def: TupleDef<T, R>) {
    super({ ...def, rest: def.rest ?? null } as TupleDef<T, R>);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const input = this[SCHEMA_ASSERT](isArray(data), { received: data });
    const result = [];

    //handle length
    this.#validateLength(input);

    const issues: Array<Partial<SchemaIssue>> = [];
    const def = this[SCHEMA_DEF];
    let index = 0;

    //handle items
    for (const item of def.items) {
      const parseResult = item.safeParse(input[index]);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, index));
      }

      if (parseResult.success) {
        result.push(parseResult.data);
      }

      index++;
    }

    //handle rest
    if (def.rest) {
      const rest = input.slice(index);

      for (const item of rest) {
        const parseResult = def.rest.safeParse(item);

        if (!parseResult.success) {
          issues.push(...prefixIssues(parseResult.error.issues, index));
        }

        if (parseResult.success) {
          result.push(parseResult.data);
        }

        index++;
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result as InferTupleOutput<T, R>;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const input = this[SCHEMA_ASSERT](isArray(data), { received: data });
    const result = [];

    //handle length
    this.#validateLength(input);

    const issues: Array<Partial<SchemaIssue>> = [];
    const def = this[SCHEMA_DEF];
    let index = 0;

    //handle items
    for (const item of def.items) {
      const parseResult = await item.safeParseAsync(input[index]);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, index));
      }

      if (parseResult.success) {
        result.push(parseResult.data);
      }

      index++;
    }

    //handle rest
    if (def.rest) {
      const rest = input.slice(index);

      for (const item of rest) {
        const parseResult = await def.rest.safeParseAsync(item);

        if (!parseResult.success) {
          issues.push(...prefixIssues(parseResult.error.issues, index));
        }

        if (parseResult.success) {
          result.push(parseResult.data);
        }

        index++;
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result as InferTupleOutput<T, R>;
  }

  /**
   * Appends a schema to handle all remaining elements in the array.
   * @param rest - The schema for the additional items.
   * @returns A new TupleSchema instance including the rest definition.
   */
  rest<Rest extends SomeSchema = SomeSchema>(rest: Rest): TupleSchema<T, Rest> {
    const next = this.clone();
    next[SCHEMA_DEF].rest = rest;
    return next as unknown as TupleSchema<T, Rest>;
  }

  #validateLength(input: InferTupleOutput<T, R>) {
    const { rest, items, message } = this[SCHEMA_DEF];

    if (!isNull(rest)) return;

    const expected = items.length;
    const actual = input.length;

    const reversedIndex = [...items]
      .reverse()
      .findIndex((item) => item.kind !== 'OptionalSchema');

    const optStart = reversedIndex === -1 ? 0 : expected - reversedIndex;
    const tooBig = actual > expected;
    const tooSmall = actual < optStart - 1;

    if (tooBig) {
      throw new SchemaError({
        code: 'too_big',
        message: message ??
          `Too big: expected array to have <=${expected} item(s)`,
      });
    }

    if (tooSmall) {
      throw new SchemaError({
        code: 'too_small',
        message: message ??
          `Too small: expected array to have >=${optStart - 1} item(s)`,
      });
    }
  }
}

/**
 * Creates a tuple schema.
 *
 * @param items - Schemas for tuple elements.
 * @param rest - Optional schema for remaining elements.
 * @param message - Optional error message.
 * @returns Tuple schema.
 * @example
 * const schema = s.tuple([s.string(), s.number()]);
 */
export function tuple<T extends readonly [SomeSchema, ...SomeSchema[]]>(
  items: T,
  message?: string,
): TupleSchema<T, null>;

export function tuple<
  T extends readonly [SomeSchema, ...SomeSchema[]],
  Rest extends SomeSchema,
>(items: T, rest: Rest, message?: string): TupleSchema<T, Rest>;

export function tuple(items: [], message?: string): TupleSchema<[], null>;

export function tuple<
  T extends ReadonlyArray<SomeSchema>,
  Rest extends SomeSchema,
>(
  items: T,
  params?: Rest | string,
  message?: string,
): TupleSchema<T, Rest | null> {
  const rest = isSchema(params) ? params : null;
  const resolvedMessage = typeof params === 'string' ? params : message;

  return new TupleSchema<T, Rest | null>({
    type: 'tuple',
    items,
    rest,
    message: resolvedMessage,
  });
}
