import { isNumber } from '@internal/is/number.ts';
import { Schema } from '@core/utilities/schema.ts';
import { _gt, _gte } from '@internal/utils/greater.ts';
import { _lt, _lte } from '@internal/utils/less.ts';
import { _multipleOf } from '@internal/utils/multiple.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import type { InternalNumberDef, NumberDef, SchemaKind } from '@internal/types';

/** Schema for validating number values. */
export class NumberSchema extends Schema<number> {
  public override readonly kind: SchemaKind = 'NumberSchema';
  declare [DEF_TYPE]: InternalNumberDef;

  constructor(def: NumberDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): number {
    let input = data;

    if (this[SCHEMA_DEF].coerce) {
      try {
        input = Number(input);
      } catch {
        //
      }
    }

    return this[SCHEMA_ASSERT](isNumber(input), {
      received: data,
      output: input,
    });
  }

  /**
   * Sets the minimum value (exclusive).
   * @param value - The value the input must be greater than.
   * @param message - Optional error message.
   */
  gt(value: number): this;
  gt(value: number, message?: string): this;
  gt(value: number, message?: string): this {
    return _gt(this, value, message);
  }

  /**
   * Sets the minimum value (inclusive).
   * @param value - The minimum number allowed.
   * @param message - Optional error message.
   */
  gte(value: number): this;
  gte(value: number, message?: string): this;
  gte(value: number, message?: string): this {
    return _gte(this, value, message);
  }

  /**
   * Sets the minimum value (inclusive). Alias for gte.
   * @param value - The minimum number allowed.
   * @param message - Optional error message.
   */
  min(value: number): this;
  min(value: number, message?: string): this;
  min(value: number, message?: string): this {
    return _gte(this, value, message);
  }

  /**
   * Sets the maximum value (exclusive).
   * @param value - The value the input must be less than.
   * @param message - Optional error message.
   */
  lt(value: number): this;
  lt(value: number, message?: string): this;
  lt(value: number, message?: string): this {
    return _lt(this, value, message);
  }

  /**
   * Sets the maximum value (inclusive).
   * @param value - The maximum number allowed.
   * @param message - Optional error message.
   */
  lte(value: number): this;
  lte(value: number, message?: string): this;
  lte(value: number, message?: string): this {
    return _lte(this, value, message);
  }

  /**
   * Sets the maximum value (inclusive). Alias for lte.
   * @param value - The maximum number allowed.
   * @param message - Optional error message.
   */
  max(value: number): this;
  max(value: number, message?: string): this;
  max(value: number, message?: string): this {
    return _lte(this, value, message);
  }

  /**
   * Requires the value to be a whole number (no decimals).
   * @param message - Optional error message.
   */
  int(): this;
  int(message?: string): this;
  int(message?: string): this {
    return this.check((payload) => {
      const input = payload.data;
      if (!Number.isInteger(input)) {
        payload.issues.push({
          code: 'invalid_type',
          expected: 'int',
          received: input,
          message: message ?? 'Invalid input: expected int, received number',
          format: 'safeint',
        });
      }
    });
  }

  /**
   * Requires the value to be greater than zero.
   * @param message - Optional error message.
   */
  positive(): this;
  positive(message?: string): this;
  positive(message?: string): this {
    return _gt(this, 0, message);
  }

  /**
   * Requires the value to be zero or greater.
   * @param message - Optional error message.
   */
  nonnegative(): this;
  nonnegative(message?: string): this;
  nonnegative(message?: string): this {
    return _gte(this, 0, message);
  }

  /**
   * Requires the value to be less than zero.
   * @param message - Optional error message.
   */
  negative(): this;
  negative(message?: string): this;
  negative(message?: string): this {
    return _lt(this, 0, message);
  }

  /**
   * Requires the value to be zero or less.
   * @param message - Optional error message.
   */
  nonpositive(): this;
  nonpositive(message?: string): this;
  nonpositive(message?: string): this {
    return _lte(this, 0, message);
  }

  /**
   * Requires the value to be divisible by the specified number.
   * @param value - The divisor.
   * @param message - Optional error message.
   */
  multipleOf(value: number): this;
  multipleOf(value: number, message?: string): this;
  multipleOf(value: number, message?: string): this {
    return _multipleOf(this, value, message);
  }

  override [SCHEMA_PATTERN](): RegExp {
    if ('pattern' in this[SCHEMA_DEF]) {
      return this[SCHEMA_DEF].pattern as RegExp;
    }

    return new RegExp(/^-?\d+(?:\.\d+)?$/);
  }
}

/**
 * Creates a number schema.
 *
 * @param message - Optional error message.
 * @returns Number schema.
 * @example
 * const schema = s.number();
 */
export function number(): NumberSchema;
export function number(message?: string): NumberSchema;
export function number(message?: string): NumberSchema {
  return new NumberSchema({ type: 'number', message });
}
