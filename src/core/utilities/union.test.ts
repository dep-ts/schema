import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { union } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('union', async () => {
  const UnionString = union([string(), string()]);

  // 1. Accepts valid value
  assertEqual(UnionString.parse('hello'), 'hello');

  // 2. Throws when all options fail
  assertThrows(() => UnionString.parse(123));

  // 3. Async behavior
  assertEqual(await UnionString.parseAsync('world'), 'world');

  await assertRejects(() => UnionString.parseAsync(123));

  // 4. Returns first successful match
  const FirstMatch = union([
    string().transform((s) => s.toUpperCase()),
    string().transform((s) => `x-${s}`),
  ]);

  assertEqual(FirstMatch.parse('a'), 'A');
});
