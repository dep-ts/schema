import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { optional } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('optional', async () => {
  const OptionalString = optional(string());

  // 1. Accepts undefined
  assertEqual(OptionalString.parse(undefined), undefined);

  // 2. Parses valid value
  assertEqual(OptionalString.parse('hello'), 'hello');

  // 3. Throws on invalid input
  assertThrows(() => OptionalString.parse(123));

  // 4. Async behavior
  assertEqual(await OptionalString.parseAsync(undefined), undefined);
  assertEqual(await OptionalString.parseAsync('world'), 'world');

  await assertRejects(() => OptionalString.parseAsync(123));

  // 5. Null should NOT be accepted
  assertThrows(() => OptionalString.parse(null));
});
