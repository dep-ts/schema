import { assertEqual, assertThrows } from '@dep/assert';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';
import { function as function_ } from './function.ts';

Deno.test('FunctionSchema', async () => {
  const schema = function_({
    input: [string()],
    output: number(),
  });

  assertEqual(schema.kind, 'FunctionSchema');
  assertEqual(schema.type, 'function');

  // 1. Test Synchronous Validation
  const validFn = (name: string) => name.length;
  const wrapped = schema.parse(validFn);

  assertEqual(wrapped('hello'), 5);
  assertThrows(() => wrapped(123 as never));

  // 2. Test Return Value Validation
  const badReturnFn = (_: string) => 'not-a-number';
  const wrappedBad = schema.parse(badReturnFn);
  assertThrows(() => wrappedBad('test'));

  // 3. Test Asynchronous Validation
  const asyncFn = async (n: number) => await Promise.resolve(n * 2);
  const asyncSchema = function_({
    input: [number()],
    output: number(),
  });
  const wrappedAsync = await asyncSchema.parseAsync(asyncFn);

  assertEqual(await wrappedAsync(10), 20);

  // 4. Test Sync error when calling async function in sync parse
  const wrappedAsyncInSync = schema.parse(asyncFn);
  assertThrows(() => wrappedAsyncInSync('test'));

  // 5. Test invalid data types
  assertThrows(() => schema.parse('not a function'));
  assertThrows(() => schema.parse(null));
});
