import { assertEqual, assertThrows } from '@dep/assert';
import { float32 } from './float32.ts';

Deno.test('Float32Schema', async () => {
  const Float32Schema = float32();

  assertEqual(Float32Schema.kind, 'Float32Schema');
  assertEqual(Float32Schema.type, 'number');

  assertEqual(Float32Schema.parse(0), 0);
  assertEqual(Float32Schema.parse(3.14), 3.14);
  assertEqual(Float32Schema.parse(-3.14), -3.14);

  assertEqual(await Float32Schema.parseAsync(0), 0);
  assertEqual(await Float32Schema.parseAsync(3.14), 3.14);
  assertEqual(await Float32Schema.parseAsync(-3.14), -3.14);

  assertThrows(() => Float32Schema.parse('123'));
  assertThrows(() => Float32Schema.parse(NaN));
  assertThrows(() => Float32Schema.parse(Infinity));
});
