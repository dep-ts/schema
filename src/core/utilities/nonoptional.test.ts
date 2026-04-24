import { assertEqual, assertRejects, assertThrows } from '@dep/assert';
import { nonoptional, optional } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('nonoptional', async () => {
  const Base = optional(string());
  const NonOpt = nonoptional(Base);

  // 1. Accepts valid value
  assertEqual(NonOpt.parse('hello'), 'hello');

  // 2. Rejects undefined even if inner allows it
  assertThrows(() => NonOpt.parse(undefined));

  // 3. Throws on invalid input
  assertThrows(() => NonOpt.parse(123));

  // 4. Async behavior
  assertEqual(await NonOpt.parseAsync('world'), 'world');

  await assertRejects(() => NonOpt.parseAsync(undefined));
  await assertRejects(() => NonOpt.parseAsync(123));
});
