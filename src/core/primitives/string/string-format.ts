import { StringSchema } from './string.ts';
import type { StringFormatDef, StringFormats } from '@internal/types';

import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { testRegex } from '@internal/utils/regex.ts';

/** Schema for validating string formats. */
export class StringFormatSchema extends StringSchema {
  constructor(def: StringFormatDef) {
    super(def);
    const _def = this[SCHEMA_DEF];

    if (_def.pattern) {
      _def.checks.push((payload) => {
        const input = payload.data;

        if (_def.pattern && !testRegex(_def.pattern, input)) {
          payload.issues.push({
            code: 'invalid_format',
            expected: _def.format,
            received: input,
            message: _def.message ??
              `Invalid format: must match pattern ${_def.pattern}`,
          });
        }
      });
    }
  }
}

/**
 * Creates a string schema for the given format and pattern.
 *
 * @param format - Named string format.
 * @param pattern - Pattern to validate against.
 * @param message - Optional error message.
 * @returns String format schema.
 * @example
 * const schema = s.stringFormat('email', /.+@.+\..+/);
 */
export function stringFormat(
  format: StringFormats,
  pattern: RegExp,
): StringFormatSchema;
export function stringFormat(
  format: StringFormats,
  pattern: RegExp,
  message?: string,
): StringFormatSchema;

export function stringFormat(
  format: StringFormats,
  pattern: RegExp,
  message?: string,
): StringFormatSchema {
  return new StringFormatSchema({ type: 'string', format, pattern, message });
}
