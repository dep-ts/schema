import { assertDeepEqual, assertEqual, assertThrows } from '@dep/assert';
import { custom } from './custom.ts';
import { isNumber } from '@internal/is/number.ts';

Deno.test('CustomSchema', async () => {
  // 1. Basic validation (synchronous)
  const isString = (val: unknown) => typeof val === 'string';
  const StringSchema = custom<string>(isString);

  assertEqual(StringSchema.kind, 'CustomSchema');
  assertEqual(StringSchema.type, 'custom');
  assertEqual(StringSchema.parse('hello'), 'hello');
  assertThrows(() => StringSchema.parse(123));

  // 2. Validation with custom message
  const positiveSchema = custom<number>((val) => {
    if (isNumber(val)) {
      return val > 0;
    }
    return false;
  }, 'Value must be positive');

  assertEqual(positiveSchema.parse(10), 10);
  assertThrows(() => positiveSchema.parse(-5));

  // 3. Asynchronous validation
  const asyncSchema = custom<number>(async (val) => {
    await new Promise((resolve) => setTimeout(resolve, 10));
    return val === 42;
  });

  assertEqual(await asyncSchema.parseAsync(42), 42);

  try {
    await asyncSchema.parseAsync(10);
    throw new Error('Should have thrown');
  } catch {
    //
  }

  // 4. Test Sync error when passing async function to sync parse
  const wrappedAsyncInSync = custom(async () => await Promise.resolve(true));
  assertThrows(() => wrappedAsyncInSync.parse('any'));

  // 5. Test empty custom schema (defaults to passing everything)
  const emptySchema = custom();
  assertDeepEqual(emptySchema.parse({ any: 'thing' }), { any: 'thing' });
});
