import { assertEqual, assertThrows } from '@dep/assert';
import { prefault } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('prefault', async () => {
  const PrefaultString = prefault(string(), 'fallback');

  // 1. Uses prefault when undefined
  assertEqual(PrefaultString.parse(undefined), 'fallback');

  // 2. Uses provided value
  assertEqual(PrefaultString.parse('hello'), 'hello');

  // 3. Throws on invalid input
  assertThrows(() => PrefaultString.parse(123));

  // 4. Async behavior
  assertEqual(await PrefaultString.parseAsync(undefined), 'fallback');
  assertEqual(await PrefaultString.parseAsync('world'), 'world');

  // 5. Prefault still goes through parsing (transform applies)
  const Trimmed = prefault(
    string().transform((s) => s.trim()),
    '  fallback  ',
  );

  assertEqual(Trimmed.parse(undefined), 'fallback');

  // 6. Null should NOT trigger prefault
  assertThrows(() => PrefaultString.parse(null));
});
