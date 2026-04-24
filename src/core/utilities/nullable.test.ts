import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { nullable } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('nullable', async () => {
  const NullableString = nullable(string());

  // 1. Accepts null
  assertEqual(NullableString.parse(null), null);

  // 2. Parses valid value
  assertEqual(NullableString.parse('hello'), 'hello');

  // 3. Throws on invalid input
  assertThrows(() => NullableString.parse(123));

  // 4. Async behavior
  assertEqual(await NullableString.parseAsync(null), null);
  assertEqual(await NullableString.parseAsync('world'), 'world');

  await assertRejects(() => NullableString.parseAsync(123));

  // 5. Undefined should NOT be accepted
  assertThrows(() => NullableString.parse(undefined));
});
