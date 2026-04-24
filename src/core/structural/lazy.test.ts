import { assertEqual, assertThrows } from '@dep/assert';
import { lazy } from './lazy.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';

Deno.test('LazySchema', async () => {
  const LazyString = lazy(() => string());

  assertEqual(LazyString.kind, 'LazySchema');
  assertEqual(LazyString.type, 'lazy');

  assertEqual(LazyString.parse('hello'), 'hello');
  assertThrows(() => LazyString.parse(123));

  const NodeSchema = lazy(() => string());

  const validData = 'Bunny';
  assertEqual(NodeSchema.parse(validData), validData);

  const LazyNumber = lazy(() => number());
  assertEqual(await LazyNumber.parseAsync(42), 42);
});
