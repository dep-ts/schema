// deno-lint-ignore-file no-explicit-any
import { isBigInt } from '@internal/is/bigint.ts';
import { Schema } from '@core/utilities/schema.ts';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import type { BigIntDef, InternalBigIntDef, SchemaKind } from '@internal/types';
import { _gt, _gte } from '@internal/utils/greater.ts';
import { _lt, _lte } from '@internal/utils/less.ts';
import { _multipleOf } from '@internal/utils/multiple.ts';

/** Schema for validating bigint values. */
export class BigIntSchema extends Schema<bigint> {
  public override readonly kind: SchemaKind = 'BigIntSchema';
  declare [DEF_TYPE]: InternalBigIntDef;

  constructor(def: BigIntDef) {
    super(def);
  }

  override [SCHEMA_PARSE](data: unknown): bigint {
    let input = data;

    if (this[SCHEMA_DEF].coerce) {
      try {
        input = BigInt(input as any);
      } catch {
        //
      }
    }

    return this[SCHEMA_ASSERT](isBigInt(input), {
      received: data,
      output: input,
    });
  }

  /**
   * Sets the minimum value (inclusive).
   * @param value - The minimum bigint allowed.
   * @param message - Optional error message.
   */
  gte(value: bigint): this;
  gte(value: bigint, message?: string): this;
  gte(value: bigint, message?: string): this {
    return _gte(this, value, message);
  }

  /**
   * Sets the minimum value (inclusive). Alias for gte.
   * @param value - The minimum bigint allowed.
   * @param message - Optional error message.
   */
  min(value: bigint): this;
  min(value: bigint, message?: string): this;
  min(value: bigint, message?: string): this {
    return _gte(this, value, message);
  }

  /**
   * Sets the minimum value (exclusive).
   * @param value - The value the input must be greater than.
   * @param message - Optional error message.
   */
  gt(value: bigint): this;
  gt(value: bigint, message?: string): this;
  gt(value: bigint, message?: string): this {
    return _gt(this, value, message);
  }

  /**
   * Sets the maximum value (exclusive).
   * @param value - The value the input must be less than.
   * @param message - Optional error message.
   */
  lt(value: bigint): this;
  lt(value: bigint, message?: string): this;
  lt(value: bigint, message?: string): this {
    return _lt(this, value, message);
  }

  /**
   * Sets the maximum value (inclusive).
   * @param value - The maximum bigint allowed.
   * @param message - Optional error message.
   */
  lte(value: bigint): this;
  lte(value: bigint, message?: string): this;
  lte(value: bigint, message?: string): this {
    return _lte(this, value, message);
  }

  /**
   * Sets the maximum value (inclusive). Alias for lte.
   * @param value - The maximum bigint allowed.
   * @param message - Optional error message.
   */
  max(value: bigint): this;
  max(value: bigint, message?: string): this;
  max(value: bigint, message?: string): this {
    return _lte(this, value, message);
  }

  /**
   * Requires the value to be greater than zero.
   * @param message - Optional error message.
   */
  positive(): this;
  positive(message?: string): this;
  positive(message?: string): this {
    return _gt(this, BigInt(0), message);
  }

  /**
   * Requires the value to be less than zero.
   * @param message - Optional error message.
   */
  negative(): this;
  negative(message?: string): this;
  negative(message?: string): this {
    return _lt(this, BigInt(0), message);
  }

  /**
   * Requires the value to be zero or less.
   * @param message - Optional error message.
   */
  nonpositive(): this;
  nonpositive(message?: string): this;
  nonpositive(message?: string): this {
    return _lte(this, BigInt(0), message);
  }

  /**
   * Requires the value to be zero or greater.
   * @param message - Optional error message.
   */
  nonnegative(): this;
  nonnegative(message?: string): this;
  nonnegative(message?: string): this {
    return _gte(this, BigInt(0), message);
  }

  /**
   * Requires the value to be divisible by the specified bigint.
   * @param value - The divisor.
   * @param message - Optional error message.
   */
  multipleOf(value: bigint): this;
  multipleOf(value: bigint, message?: string): this;
  multipleOf(value: bigint, message?: string): this {
    return _multipleOf(this, value, message);
  }

  override [SCHEMA_PATTERN](): RegExp {
    return new RegExp(/^-?\d+n?$/);
  }
}

/**
 * Creates a bigint schema.
 *
 * @param message - Optional error message.
 * @returns BigInt schema.
 * @example
 * const schema = s.bigint();
 */
export function bigint(): BigIntSchema;
export function bigint(message?: string): BigIntSchema;
export function bigint(message?: string): BigIntSchema {
  return new BigIntSchema({ type: 'bigint', message });
}
