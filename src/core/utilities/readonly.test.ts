import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { readonly } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('readonly', async () => {
  const ReadonlyString = readonly(string());

  // 1. Parses valid value
  const result = ReadonlyString.parse('hello');
  assertEqual(result, 'hello');

  // 2. Result should be frozen (primitives are fine, just ensure no crash)
  assertEqual(Object.isFrozen(result), true);

  // 3. Throws on invalid input
  assertThrows(() => ReadonlyString.parse(123));

  // 4. Async behavior
  const asyncResult = await ReadonlyString.parseAsync('world');
  assertEqual(asyncResult, 'world');
  assertEqual(Object.isFrozen(asyncResult), true);

  await assertRejects(() => ReadonlyString.parseAsync(123));
});
