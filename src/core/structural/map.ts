import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
  SCHEMA_THROW_ISSUES,
} from '@internal/utils/symbols.ts';
import { isMap } from '@internal/is/map.ts';
import type {
  InternalMapDef,
  MapDef,
  Ref,
  SchemaIssue,
  SchemaKind,
  SomeSchema,
} from '@internal/types';
import { Schema } from '@core/utilities/schema.ts';
import { prefixIssues } from '@internal/utils/format.ts';

/** Schema for validating Map objects. */
export class MapSchema<
  Key extends SomeSchema = SomeSchema,
  Value extends SomeSchema = SomeSchema,
> extends Schema<
  Map<Key[Ref<'OUTPUT'>], Value[Ref<'OUTPUT'>]>,
  Map<Key[Ref<'INPUT'>], Value[Ref<'INPUT'>]>
> {
  public override readonly kind: SchemaKind = 'MapSchema';
  declare [DEF_TYPE]: InternalMapDef<Key, Value>;

  constructor(def: MapDef<Key, Value>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const input = this[SCHEMA_ASSERT](isMap(data), { received: data });
    const issues: Array<Partial<SchemaIssue>> = [];
    const result = new Map();

    for (const [key, value] of input) {
      const { valueType, keyType } = this[SCHEMA_DEF];
      const keyResult = keyType.safeParse(key);
      const valueResult = valueType.safeParse(value);

      if (!keyResult.success) {
        issues.push(...prefixIssues(keyResult.error.issues, key));
      }

      if (!valueResult.success) {
        issues.push(...prefixIssues(valueResult.error.issues, key));
      }

      if (keyResult.success && valueResult.success) {
        result.set(keyResult.data, valueResult.data);
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const input = this[SCHEMA_ASSERT](isMap(data), { received: data });
    const issues: Array<Partial<SchemaIssue>> = [];
    const result = new Map();

    for (const [key, value] of input) {
      const { valueType, keyType } = this[SCHEMA_DEF];
      const keyResult = await keyType.safeParseAsync(key);
      const valueResult = await valueType.safeParseAsync(value);

      if (!keyResult.success) {
        issues.push(...prefixIssues(keyResult.error.issues, key));
      }

      if (!valueResult.success) {
        issues.push(...prefixIssues(valueResult.error.issues, value));
      }

      if (keyResult.success && valueResult.success) {
        result.set(keyResult.data, valueResult.data);
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  /**
   * Sets the minimum number of entries required in the Map.
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
            `Too small: expected map to have >=${minSize} entries`,
        });
      }
    });
  }

  /**
   * Sets the maximum number of entries allowed in the Map.
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
            `Too big: expected map to have <=${maxSize} entries`,
        });
      }
    });
  }

  /**
   * Requires the Map to contain at least one entry.
   * @param message - Optional error message.
   */
  nonempty(): this;
  nonempty(message?: string): this;
  nonempty(message?: string): this {
    return this.check((payload) => {
      if (payload.data.size === 0) {
        payload.issues.push({
          code: 'too_small',
          message: message ?? 'Too small: expected map to have >=1 entries',
        });
      }
    });
  }

  /**
   * Requires the Map to have an exact number of entries.
   * @param size - The required number of entries.
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
              `Too small: expected map to have >=${size} entries`,
          });
        }

        if (input.size >= size) {
          payload.issues.push({
            code: 'too_big',
            message: message ??
              `Too big: expected map to have <=${size} entries`,
          });
        }
      }
    });
  }
}

/**
 * Creates a map schema.
 *
 * @param keyType - Schema for map keys.
 * @param valueType - Schema for map values.
 * @param message - Optional error message.
 * @returns Map schema.
 * @example
 * const schema = s.map(s.string(), s.number());
 */
export function map<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: Key,
  valueType: Value,
): MapSchema<Key, Value>;

export function map<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: Key,
  valueType: Value,
  message?: string,
): MapSchema<Key, Value>;

export function map<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: Key,
  valueType: Value,
  message?: string,
): MapSchema<Key, Value> {
  return new MapSchema({
    type: 'map',
    keyType,
    valueType,
    message,
  });
}
