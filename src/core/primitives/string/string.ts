import { isString } from '@internal/is/string.ts';
import { Schema } from '@core/utilities/schema.ts';
import type { InternalStringDef, SchemaKind, StringDef } from '@internal/types';
import {
  DEF_TYPE,
  SCHEMA_ASSERT,
  SCHEMA_DEF,
  SCHEMA_PARSE,
  SCHEMA_PATTERN,
} from '@internal/utils/symbols.ts';
import { escapeRegex, testRegex } from '@internal/utils/regex.ts';
import { isUndefined } from '@internal/is/undefined.ts';

/** Schema for validating string values. */
export class StringSchema extends Schema<string> {
  public override readonly kind: SchemaKind = 'StringSchema';
  declare [DEF_TYPE]: InternalStringDef;

  constructor(def: StringDef) {
    super(def);
    if (isUndefined(this[SCHEMA_DEF].patterns)) {
      this[SCHEMA_DEF].patterns = new Set();
    }
  }

  override [SCHEMA_PARSE](data: unknown): string {
    let input = data;

    if (this[SCHEMA_DEF].coerce) {
      try {
        input = String(input);
      } catch {
        //
      }
    }

    return this[SCHEMA_ASSERT](isString(input), {
      received: data,
      output: input,
    });
  }

  /**
   * Requires the string to start with a specific value.
   * @param value - The prefix required.
   * @param message - Optional error message.
   */
  startsWith(value: string): this;
  startsWith(value: string, message?: string): this;
  startsWith(value: string, message?: string): this {
    const pattern = new RegExp(`^${escapeRegex(value)}.*`);
    this[SCHEMA_DEF].pattern = pattern;
    this[SCHEMA_DEF].patterns.add(pattern);

    return this.check((payload) => {
      if (!payload.data.startsWith(value)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'starts_with',
          message: message ?? `Invalid string: must start with '${value}'`,
        });
      }
    });
  }

  /**
   * Requires the string to end with a specific value.
   * @param value - The suffix required.
   * @param message - Optional error message.
   */
  endsWith(value: string): this;
  endsWith(value: string, message?: string): this;
  endsWith(value: string, message?: string): this {
    const pattern = new RegExp(`.*${escapeRegex(value)}$`);
    this[SCHEMA_DEF].pattern = pattern;
    this[SCHEMA_DEF].patterns.add(pattern);

    return this.check((payload) => {
      if (!payload.data.endsWith(value)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'ends_with',
          message: message ?? `Invalid string: must end with '${value}'`,
        });
      }
    });
  }

  /**
   * Requires the string to contain a specific value.
   * @param value - The substring required.
   * @param message - Optional error message.
   */
  includes(value: string): this;
  includes(value: string, message?: string): this;
  includes(value: string, message?: string): this {
    const pattern = new RegExp(`.*${escapeRegex(value)}.*`);
    this[SCHEMA_DEF].pattern = pattern;
    this[SCHEMA_DEF].patterns.add(pattern);

    return this.check((payload) => {
      if (!payload.data.includes(value)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'includes',
          message: message ?? `Invalid string: must include with '${value}'`,
        });
      }
    });
  }

  /**
   * Requires all characters to be lowercase.
   * @param message - Optional error message.
   */
  lowercase(): this;
  lowercase(message?: string): this;
  lowercase(message?: string): this {
    const pattern = /^[^A-Z]*$/;
    this[SCHEMA_DEF].pattern = pattern;
    this[SCHEMA_DEF].patterns.add(pattern);

    return this.check((payload) => {
      if (!pattern.test(payload.data)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'lowercase',
          message: message ?? 'Invalid lowercase',
        });
      }
    });
  }

  /**
   * Requires all characters to be uppercase.
   * @param message - Optional error message.
   */
  uppercase(): this;
  uppercase(message?: string): this;
  uppercase(message?: string): this {
    const pattern = /^[^a-z]*$/;
    this[SCHEMA_DEF].pattern = pattern;
    this[SCHEMA_DEF].patterns.add(pattern);

    return this.check((payload) => {
      if (!pattern.test(payload.data)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'uppercase',
          message: message ?? 'Invalid uppercase',
        });
      }
    });
  }

  /**
   * Validates the string against a Regular Expression.
   * @param regex - The pattern to match.
   * @param message - Optional error message.
   */
  regex(regex: RegExp): this;
  regex(regex: RegExp, message?: string): this;
  regex(regex: RegExp, message?: string): this {
    this[SCHEMA_DEF].pattern = regex;
    this[SCHEMA_DEF].patterns.add(regex);

    return this.check((payload) => {
      if (!testRegex(regex, payload.data)) {
        payload.issues.push({
          code: 'invalid_format',
          format: 'regex',
          message: message ?? `Invalid format: must match pattern ${regex}`,
        });
      }
    });
  }

  /**
   * Sets the minimum allowed character length.
   * @param minLength - Minimum length (inclusive).
   * @param message - Optional error message.
   */
  min(minLength: number): this;
  min(minLength: number, message?: string): this;
  min(minLength: number, message?: string): this {
    this[SCHEMA_DEF].minimum = minLength;

    return this.check((payload) => {
      if (payload.data.length < minLength) {
        payload.issues.push({
          code: 'too_small',
          message: message ??
            `Too small: expected string to have >=${minLength} character(s)`,
        });
      }
    });
  }

  /**
   * Sets the maximum allowed character length.
   * @param maxLength - Maximum length (inclusive).
   * @param message - Optional error message.
   */
  max(maxLength: number): this;
  max(maxLength: number, message?: string): this;
  max(maxLength: number, message?: string): this {
    this[SCHEMA_DEF].maximum = maxLength;

    return this.check((payload) => {
      if (payload.data.length > maxLength) {
        payload.issues.push({
          code: 'too_big',
          message: message ??
            `Too big: expected string to have <=${maxLength} character(s)`,
        });
      }
    });
  }

  /**
   * Requires the string to be an exact length.
   * @param exactLength - The required length.
   * @param message - Optional error message.
   */
  length(exactLength: number): this;
  length(exactLength: number, message?: string): this;
  length(exactLength: number, message?: string): this {
    return this.check((payload) => {
      const input = payload.data;

      if (input.length > exactLength) {
        payload.issues.push({
          code: 'too_big',
          message: message ??
            `Too big: expected string to have <=${exactLength} character(s)`,
        });
      }

      if (input.length < exactLength) {
        payload.issues.push({
          code: 'too_small',
          message: message ??
            `Too small: expected string to have >=${exactLength} character(s)`,
        });
      }
    });
  }

  /**
   * Disallows empty strings (length > 0).
   * @param message - Optional error message.
   */
  nonempty(): this;
  nonempty(message?: string): this;
  nonempty(message?: string): this {
    return this.check((payload) => {
      if (payload.data.length === 0) {
        payload.issues.push({
          code: 'too_small',
          message: message ??
            `Too small: expected string to have >=1 character(s)`,
        });
      }
    });
  }

  /**
   * Transformation: Removes whitespace from both ends.
   */
  trim = (): this => this.overwrite((v) => v.trim());

  /**
   * Transformation: Applies Unicode Normalization.
   */
  normalize = (): this => this.overwrite((v) => v.normalize());

  /**
   * Transformation: Converts the entire string to lowercase.
   */
  toLowerCase = (): this => this.overwrite((v) => v.toLowerCase());

  /**
   * Transformation: Converts the entire string to uppercase.
   */
  toUpperCase = (): this => this.overwrite((v) => v.toUpperCase());

  override [SCHEMA_PATTERN](): RegExp {
    if ('pattern' in this[SCHEMA_DEF]) {
      return this[SCHEMA_DEF].pattern as RegExp;
    }

    const { minimum, maximum, patterns } = this[SCHEMA_DEF];
    const regex = `[\\s\\S]{${minimum ?? 0},${maximum ?? ''}}`;
    return [...(patterns ?? [])].at(-1) ?? new RegExp(`^${regex}$`);
  }
}

/**
 * Creates a string schema.
 *
 * @param message - Optional error message.
 * @returns String schema.
 * @example
 * const schema = s.string();
 */
export function string(): StringSchema;
export function string(message?: string): StringSchema;
export function string(message?: string): StringSchema {
  return new StringSchema({ type: 'string', message });
}
