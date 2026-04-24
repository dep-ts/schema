import { assertEqual, assertThrows } from '@dep/assert';
import { float64 } from './float64.ts';

Deno.test('Float64Schema', async () => {
  const Float64Schema = float64();

  assertEqual(Float64Schema.kind, 'Float64Schema');
  assertEqual(Float64Schema.type, 'number');

  assertEqual(Float64Schema.parse(0), 0);
  assertEqual(Float64Schema.parse(3.14), 3.14);
  assertEqual(Float64Schema.parse(-3.14), -3.14);

  assertEqual(await Float64Schema.parseAsync(0), 0);
  assertEqual(await Float64Schema.parseAsync(3.14), 3.14);
  assertEqual(await Float64Schema.parseAsync(-3.14), -3.14);

  assertThrows(() => Float64Schema.parse('123'));
  assertThrows(() => Float64Schema.parse(NaN));
  assertThrows(() => Float64Schema.parse(Infinity));
});
