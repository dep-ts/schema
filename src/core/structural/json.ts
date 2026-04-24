import { array, union } from '@core/utilities/schema.ts';
import { lazy } from '@core/structural/lazy.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';
import { boolean } from '@core/primitives/boolean.ts';
import { null as null_ } from '@core/primitives/null.ts';
import { record } from '@core/structural/record.ts';
import { JSONSchema } from '@internal/types';

/**
 * Creates a schema for validating JSON-compatible values.
 *
 * @param massage - Optional validation message.
 * @returns JSON schema.
 * @example
 * const schema = s.json();
 */
export function json(): JSONSchema;
export function json(massage?: string): JSONSchema;
export function json(massage?: string): JSONSchema {
  const schema: JSONSchema = lazy(() => {
    return union([
      string(massage),
      number(),
      boolean(),
      null_(),
      array(schema),
      record(string(), schema),
    ]);
  });
  return schema;
}
