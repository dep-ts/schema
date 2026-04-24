import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { pipe } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('pipe', async () => {
  const TrimUpper = pipe(
    string().transform((s) => s.trim()),
    string().transform((s) => s.toUpperCase()),
  );

  // 1. Pipes transformations correctly
  assertEqual(TrimUpper.parse('  hello  '), 'HELLO');

  // 2. Throws if first schema fails
  assertThrows(() => TrimUpper.parse(123));

  // 3. Async behavior
  assertEqual(await TrimUpper.parseAsync('  world  '), 'WORLD');

  await assertRejects(() => TrimUpper.parseAsync(123));

  // 4. Throws if second schema fails
  const FailSecond = pipe(
    string(),
    string().transform<string>(() => {
      throw new Error('fail');
    }),
  );

  assertThrows(() => FailSecond.parse('ok'));
});
