import { BigIntSchema } from './bigint.ts';
import type { BigIntFormatDef, BigIntFormats } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';

/** Schema for validating formatted bigint ranges. */
export class BigIntFormatSchema extends BigIntSchema {
  constructor(def: BigIntFormatDef) {
    super(def);
    const _def = this[SCHEMA_DEF] as BigIntFormatDef;

    const [min, max] = {
      int64: [BigInt('-9223372036854775808'), BigInt('9223372036854775807')],
      uint64: [BigInt(0), BigInt('18446744073709551615')],
    }[_def.format];

    _def.checks?.push((payload) => {
      const input = payload.data;

      if (input < min) {
        payload.issues.push({
          code: 'too_small',
          expected: min.toString(),
          received: input,
          message: _def.message ?? `Too small: expected bigint to be >=${min}`,
        });
      }

      if (input > max) {
        payload.issues.push({
          code: 'too_big',
          expected: max.toString(),
          received: input,
          message: _def.message ?? `Too big: expected bigint to be <=${max}`,
        });
      }
    });
  }
}

/**
 * Creates a bigint schema for the given format.
 *
 * @param format - Bigint format name.
 * @param message - Optional error message.
 * @returns BigInt format schema.
 * @example
 * const schema = s.bigintFormat('int64');
 */
export function bigintFormat(format: BigIntFormats): BigIntFormatSchema;
export function bigintFormat(
  format: BigIntFormats,
  message?: string,
): BigIntFormatSchema;

export function bigintFormat(
  format: BigIntFormats,
  message?: string,
): BigIntFormatSchema {
  return new BigIntFormatSchema({ type: 'bigint', format, message });
}
