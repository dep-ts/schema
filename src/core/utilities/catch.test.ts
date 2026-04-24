// deno-lint-ignore-file require-await
import { assertEqual, assertThrows } from '@dep/assert';
import { catch as _catch } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('catch', async () => {
  const CatchString = _catch(string(), 'fallback');

  // 1. Returns valid value
  assertEqual(CatchString.parse('hello'), 'hello');

  // 2. Returns fallback on invalid input
  assertEqual(CatchString.parse(123), 'fallback');

  // 3. Async behavior
  assertEqual(await CatchString.parseAsync('world'), 'world');
  assertEqual(await CatchString.parseAsync(123), 'fallback');

  // 4. Catch as function
  const FnCatch = _catch(string(), ({ data }) => `invalid:${data}`);

  assertEqual(FnCatch.parse(123), 'invalid:123');

  // 5. Sync should throw if catch returns Promise
  const AsyncCatch = _catch(string(), async () => 'fallback');
  assertThrows(() => AsyncCatch.parse(123));

  // 6. Async catch works
  assertEqual(await AsyncCatch.parseAsync(123), 'fallback');
});
