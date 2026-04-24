// deno-lint-ignore-file no-explicit-any
import { Schema } from '@core/utilities/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PARSE_ASYNC,
} from '@internal/utils/symbols.ts';
import type { InternalRecordDef, RecordDef, SchemaKind } from '@internal/types';
import {
  prefixRecordIssues,
  prefixUnrecognizedIssue,
} from '@internal/utils/format.ts';

import { isRecord } from '@internal/is/record.ts';
import { isPropertyKey } from '@internal/is/property-key.ts';
import { SCHEMA_ASSERT, SCHEMA_THROW_ISSUES } from '@internal/utils/symbols.ts';
import type {
  InfertRecordInput,
  InfertRecordOutput,
  RecordKey,
  Ref,
  SchemaIssue,
  SomeSchema,
} from '@internal/types';

function isNumericKey(unsuccess: boolean, key: string | symbol): boolean {
  return unsuccess && typeof key === 'string' && /^-?\d+(?:\.\d+)?$/.test(key);
}

function normalize(key: PropertyKey): string | symbol {
  return typeof key === 'number' ? key.toString() : key;
}

/** Schema for validating record (dictionary) objects. */
export class RecordSchema<
  Key extends SomeSchema,
  Value extends SomeSchema,
> extends Schema<
  InfertRecordOutput<Key, Value>,
  InfertRecordInput<Key, Value>
> {
  public override readonly kind: SchemaKind = 'RecordSchema';
  declare [DEF_TYPE]: InternalRecordDef<Key, Value>;

  constructor(def: RecordDef<Key, Value>) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): this[Ref<'OUTPUT'>] {
    const { input, issues, values } = this.#parseContext(data);
    const result: any = {};

    if (values) {
      const recordKeys = new Set<string | symbol>();

      for (const key of values) {
        if (!isPropertyKey(key)) continue;

        const normalized = normalize(key);
        recordKeys.add(normalized);

        const valueResult = this[SCHEMA_DEF].valueType.safeParse(
          input[normalized],
        );

        if (!valueResult.success) {
          issues.push(
            ...prefixRecordIssues(normalized, valueResult.error.issues),
          );
        }

        if (valueResult.success) {
          result[key] = valueResult.data;
        }
      }

      const unrecognized: string[] = [];
      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized.push(key);
        }
      }

      if (unrecognized.length > 0) {
        issues.push(
          prefixUnrecognizedIssue(
            input,
            unrecognized,
            this[SCHEMA_DEF].message,
          ),
        );
      }

      this[SCHEMA_THROW_ISSUES](issues);
    }

    for (const key of Reflect.ownKeys(input)) {
      if (key === '__proto__') continue;

      let keyResult = this[SCHEMA_DEF].keyType.safeParse(key);

      if (isNumericKey(!keyResult.success, key)) {
        const retryResult = this[SCHEMA_DEF].keyType.safeParse(Number(key));

        if (retryResult.success) {
          keyResult = retryResult;
        }
      }

      if (!keyResult.success) {
        issues.push(...prefixRecordIssues(key, keyResult.error.issues));
        continue;
      }

      const valueResult = this[SCHEMA_DEF].valueType.safeParse(input[key]);

      if (!valueResult.success) {
        issues.push(...prefixRecordIssues(key, valueResult.error.issues));
      }

      if (keyResult.success && valueResult.success) {
        result[keyResult.data] = valueResult.data;
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  override async [SCHEMA_PARSE_ASYNC](
    data: unknown,
  ): Promise<this[Ref<'OUTPUT'>]> {
    const { input, issues, values } = this.#parseContext(data);
    const result: any = {};

    if (values) {
      const recordKeys = new Set<string | symbol>();

      for (const key of values) {
        if (!isPropertyKey(key)) continue;

        const normalized = normalize(key);
        recordKeys.add(normalized);

        const valueResult = await this[SCHEMA_DEF].valueType.safeParseAsync(
          input[normalized],
        );

        if (!valueResult.success) {
          issues.push(
            ...prefixRecordIssues(normalized, valueResult.error.issues),
          );
        }

        if (valueResult.success) {
          result[key] = valueResult.data;
        }
      }

      const unrecognized: string[] = [];
      const haUnrecognized = unrecognized.length > 0;

      for (const key in input) {
        if (!recordKeys.has(key)) {
          unrecognized.push(key);
        }
      }

      if (haUnrecognized) {
        issues.push(
          prefixUnrecognizedIssue(
            input,
            unrecognized,
            this[SCHEMA_DEF].message,
          ),
        );
      }

      this[SCHEMA_THROW_ISSUES](issues);
    }

    for (const key of Reflect.ownKeys(input)) {
      if (key === '__proto__') continue;

      let keyResult = await this[SCHEMA_DEF].keyType.safeParseAsync(key);

      if (isNumericKey(!keyResult.success, key)) {
        const retryResult = await this[SCHEMA_DEF].keyType.safeParseAsync(
          Number(key),
        );

        if (retryResult.success) {
          keyResult = retryResult;
        }
      }

      if (!keyResult.success) {
        issues.push(...prefixRecordIssues(key, keyResult.error.issues));
        continue;
      }

      const valueResult = await this[SCHEMA_DEF].valueType.safeParseAsync(
        input[key],
      );

      if (!valueResult.success) {
        issues.push(...prefixRecordIssues(key, valueResult.error.issues));
      }

      if (keyResult.success && valueResult.success) {
        result[keyResult.data] = valueResult.data;
      }
    }

    this[SCHEMA_THROW_ISSUES](issues);
    return result;
  }

  #parseContext(data: unknown): {
    input: Record<PropertyKey, unknown>;
    values?: Set<PropertyKey>;
    issues: Array<Partial<SchemaIssue>>;
  } {
    const input = this[SCHEMA_ASSERT](isRecord(data), {
      received: data,
    });

    const issues: Array<Partial<SchemaIssue>> = [];
    const { values } = this[SCHEMA_DEF].keyType[SCHEMA_DEF];

    return {
      input: input as Record<PropertyKey, unknown>,
      values,
      issues,
    };
  }
}

/**
 * Creates a record schema.
 *
 * @param keyType - Schema for record keys.
 * @param valueType - Schema for record values.
 * @param message - Optional error message.
 * @returns Record schema.
 * @example
 * const schema = s.record(s.string(), s.number());
 */
export function record<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: RecordKey<Key>,
  valueType: Value,
): RecordSchema<Key, Value>;

export function record<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: RecordKey<Key>,
  valueType: Value,
  message?: string,
): RecordSchema<Key, Value>;

export function record<Key extends SomeSchema, Value extends SomeSchema>(
  keyType: RecordKey<Key>,
  valueType: Value,
  message?: string,
): RecordSchema<Key, Value> {
  return new RecordSchema({ type: 'record', keyType, valueType, message });
}
