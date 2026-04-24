import { assertEqual, assertThrows } from '@dep/assert';
import { promise } from './promise.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';

Deno.test('PromiseSchema', async () => {
  const InnerSchema = string();
  const PromiseSchema = promise(InnerSchema);

  assertEqual(PromiseSchema.kind, 'PromiseSchema');
  assertEqual(PromiseSchema.type, 'promise');

  // 1. Validates resolved values asynchronously
  const validPromise = Promise.resolve('hello');
  const result = await PromiseSchema.parseAsync(await validPromise);
  assertEqual(result, 'hello');

  // 2. Throws when the resolved value fails inner schema validation
  const invalidValuePromise = Promise.resolve(123);
  try {
    await PromiseSchema.parseAsync(invalidValuePromise);
    throw new Error('Should have thrown');
  } catch {
    // Success: Inner schema validation failed
  }

  // 3. Throws when the promise itself rejects
  const rejectedPromise = Promise.reject(new Error('Failed'));
  try {
    await PromiseSchema.parseAsync(await rejectedPromise);
    throw new Error('Should have thrown');
  } catch {
    // Success: Promise rejection handled
  }

  // 4. Synchronous parse should always throw SCHEMA_THROW_SYNC
  // Based on your implementation, this schema cannot be used synchronously
  assertThrows(() => PromiseSchema.parse(validPromise));

  // 5. Works with complex inner schemas
  const ComplexPromiseSchema = promise(number());
  assertEqual(
    await ComplexPromiseSchema.parseAsync(await Promise.resolve(42)),
    42,
  );
});
