import { assertEqual, assertThrows } from '@dep/assert';
import { int } from './int.ts';

Deno.test('IntSchema', async () => {
  const IntSchema = int();

  assertEqual(IntSchema.kind, 'IntSchema');
  assertEqual(IntSchema.type, 'number');

  assertEqual(IntSchema.parse(0), 0);
  assertEqual(IntSchema.parse(123), 123);
  assertEqual(IntSchema.parse(-123), -123);

  assertEqual(await IntSchema.parseAsync(0), 0);
  assertEqual(await IntSchema.parseAsync(123), 123);
  assertEqual(await IntSchema.parseAsync(-123), -123);

  assertThrows(() => IntSchema.parse(3.14));

  assertThrows(() => IntSchema.parse('123'));
  assertThrows(() => IntSchema.parse(NaN));
  assertThrows(() => IntSchema.parse(Infinity));
});
