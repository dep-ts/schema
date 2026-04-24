import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_ISSUES,
} from '@internal/utils/symbols.ts';
import { isSet } from '@internal/is/set.ts';
import type {
  InternalSetDef,
  Ref,
  SchemaIssue,
  SchemaKind,
  SetDef,
  SomeSchema,
} from '@internal/types';

import { Schema } from '@core/utilities/schema.ts';
import { prefixIssues } from '@internal/utils/format.ts';

/** Schema for validating Set objects. */
export class SetSchema<Value extends SomeSchema = SomeSchema> extends Schema<
  Set<Value[Ref<'OUTPUT'>]>,
  Set<Value[Ref<'INPUT'>]>
> {
  public override readonly kind: SchemaKind = 'SetSchema';
  declare [DEF_TYPE]: InternalSetDef<Value>;

  constructor(def: SetDef<Value>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const input = this[SCHEMA_ASSERT](isSet(data), { received: data });
    const issues: Array<Partial<SchemaIssue>> = [];
    const result = new Set();

    for (const item of input) {
      const parseResult = this[SCHEMA_DEF].valueType.safeParse(item);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, item));
      }

      if (parseResult.success) {
        result.add(parseResult.data);
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const input = this[SCHEMA_ASSERT](isSet(data), { received: data });
    const issues: Array<Partial<SchemaIssue>> = [];
    const result = new Set();

    for (const item of input) {
      const parseResult = await this[SCHEMA_DEF].valueType.safeParseAsync(item);

      if (!parseResult.success) {
        issues.push(...prefixIssues(parseResult.error.issues, item));
      }

      if (parseResult.success) {
        result.add(parseResult.data);
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  /**
   * Sets the minimum number of items required in the Set.
   * @param minSize - Minimum size (inclusive).
   * @param message - Optional error message.
   */
  min(minSize: number): this;
  min(minSize: number, message?: string): this;
  min(minSize: number, message?: string): this {
    return this.check((payload) => {
      if (payload.data.size < minSize) {
        payload.issues.push({
          code: 'too_small',
          message: message ??
            `Too small: expected set to have >=${minSize} items`,
        });
      }
    });
  }

  /**
   * Sets the maximum number of items allowed in the Set.
   * @param maxSize - Maximum size (inclusive).
   * @param message - Optional error message.
   */
  max(maxSize: number): this;
  max(maxSize: number, message?: string): this;
  max(maxSize: number, message?: string): this {
    return this.check((payload) => {
      if (payload.data.size > maxSize) {
        payload.issues.push({
          code: 'too_big',
          message: message ??
            `Too big: expected set to have <=${maxSize} items`,
        });
      }
    });
  }

  /**
   * Requires the Set to contain at least one item.
   * @param message - Optional error message.
   */
  nonempty(): this;
  nonempty(message?: string): this;
  nonempty(message?: string): this {
    return this.check((payload) => {
      if (payload.data.size === 0) {
        payload.issues.push({
          code: 'too_small',
          message: message ?? 'Too small: expected set to have >=1 items',
        });
      }
    });
  }

  /**
   * Requires the Set to have an exact number of items.
   * @param size - The required number of items.
   * @param message - Optional error message.
   */
  size(size: number): this;
  size(size: number, message?: string): this;
  size(size: number, message?: string): this {
    return this.check((payload) => {
      const input = payload.data;

      if (input.size !== size) {
        if (input.size <= size) {
          payload.issues.push({
            code: 'too_small',
            message: message ??
              `Too small: expected set to have >=${size} items`,
          });
        }

        if (input.size >= size) {
          payload.issues.push({
            code: 'too_big',
            message: message ?? `Too big: expected set to have <=${size} items`,
          });
        }
      }
    });
  }
}

/**
 * Creates a set schema.
 *
 * @param valueType - Schema for set items.
 * @param message - Optional error message.
 * @returns Set schema.
 * @example
 * const schema = s.set(s.string());
 */
export function set<Value extends SomeSchema>(
  valueType: Value,
): SetSchema<Value>;

export function set<Value extends SomeSchema>(
  valueType: Value,
  message?: string,
): SetSchema<Value>;

export function set<Value extends SomeSchema>(
  valueType: Value,
  message?: string,
): SetSchema<Value> {
  return new SetSchema({
    type: 'set',
    valueType,
    message,
  });
}
