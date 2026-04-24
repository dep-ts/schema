import { NumberFormatDef, NumberFormats } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { NumberSchema } from './number.ts';

/** Schema for validating numeric formats and ranges. */
export class NumberFormatSchema extends NumberSchema {
  constructor(def: NumberFormatDef) {
    super(def);

    const _def = this[SCHEMA_DEF] as NumberFormatDef;
    const format = def.format ?? 'float64';
    const isInt = format.includes('int');

    if (isInt) {
      Object.assign(this[SCHEMA_DEF], { pattern: /^-?\d+$/ });
    }

    _def.checks?.push((payload) => {
      const input = payload.data;

      const LIMITS: Record<string, [number, number]> = {
        safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
        int32: [-2147483648, 2147483647],
        uint32: [0, 4294967295],
        float32: [-3.4028234663852886e38, 3.4028234663852886e38],
        float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
      };

      const [min, max] = LIMITS[format];
      const expected = isInt ? 'int' : 'number';

      if (isInt) {
        if (!Number.isInteger(input)) {
          const received = typeof input;

          payload.issues.push({
            code: 'invalid_type',
            expected,
            received: input,
            message: _def.message ??
              `Invalid input: expected ${expected}, received ${received}`,
            format: def.format,
          });
          return;
        }

        if (!Number.isSafeInteger(input)) {
          if (input > 0) {
            payload.issues.push({
              code: 'too_big',
              expected: 'Number.MAX_SAFE_INTEGER',
              received: input,
              message: _def.message ??
                `Too big: expected ${expected} to be <=${Number.MAX_SAFE_INTEGER}`,
            });
          } else {
            payload.issues.push({
              code: 'too_big',
              expected: 'Number.MIN_SAFE_INTEGER',
              received: input,
              message: _def.message ??
                `Too small: expected ${expected} to be >=${Number.MIN_SAFE_INTEGER}`,
            });
          }

          return;
        }
      }

      if (input < min) {
        payload.issues.push({
          code: 'too_small',
          expected: min,
          received: input,
          message: _def.message ?? `Too small: expected number to be >=${min}`,
        });
      }
      if (input > max) {
        payload.issues.push({
          code: 'too_big',
          expected: max,
          received: input,
          message: _def.message ?? `Too big: expected number to be <=${max}"`,
        });
      }
    });
  }
}

/**
 * Creates a number schema for the given numeric format.
 *
 * @param format - Numeric format name.
 * @param message - Optional error message.
 * @returns Number format schema.
 * @example
 * const schema = s.numberFormat('int32');
 */
export function numberFormat(format: NumberFormats): NumberFormatSchema;
export function numberFormat(
  format: NumberFormats,
  message?: string,
): NumberFormatSchema;

export function numberFormat(
  format: NumberFormats,
  message?: string,
): NumberFormatSchema {
  return new NumberFormatSchema({ type: 'number', format, message });
}
