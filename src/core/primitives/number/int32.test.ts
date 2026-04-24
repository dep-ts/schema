import { assertEqual, assertThrows } from '@dep/assert';
import { int32 } from './int32.ts';

Deno.test('Int32Schema', async () => {
  const Int32Schema = int32();

  assertEqual(Int32Schema.kind, 'Int32Schema');
  assertEqual(Int32Schema.type, 'number');

  assertEqual(Int32Schema.parse(-2147483648), -2147483648);
  assertEqual(Int32Schema.parse(2147483647), 2147483647);

  assertEqual(await Int32Schema.parseAsync(-2147483648), -2147483648);
  assertEqual(await Int32Schema.parseAsync(2147483647), 2147483647);

  assertThrows(() => Int32Schema.parse(-2147483649));
  assertThrows(() => Int32Schema.parse(2147483648));

  assertThrows(() => Int32Schema.parse(3.14));

  assertThrows(() => Int32Schema.parse('123'));
  assertThrows(() => Int32Schema.parse(NaN));
  assertThrows(() => Int32Schema.parse(Infinity));
});
