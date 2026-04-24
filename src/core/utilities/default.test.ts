import { assertEqual, assertThrows } from '@dep/assert';
import { default as _default } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('default', async () => {
  const DefaultString = _default(string(), 'fallback');

  // 1. Uses default when undefined
  assertEqual(DefaultString.parse(undefined), 'fallback');

  // 2. Uses provided value
  assertEqual(DefaultString.parse('hello'), 'hello');

  // 3. Throws on invalid input
  assertThrows(() => DefaultString.parse(123));

  // 4. Async behavior
  assertEqual(await DefaultString.parseAsync(undefined), 'fallback');
  assertEqual(await DefaultString.parseAsync('world'), 'world');

  // 5. Null should NOT trigger default
  assertThrows(() => DefaultString.parse(null));
});
