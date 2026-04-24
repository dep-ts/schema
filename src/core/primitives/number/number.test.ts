import { assertEqual, assertThrows } from '@dep/assert';
import { number } from './number.ts';

Deno.test('NumberSchema', async () => {
  const NumberSchema = number();

  assertEqual(NumberSchema.kind, 'NumberSchema');
  assertEqual(NumberSchema.type, 'number');

  assertEqual(NumberSchema.parse(0), 0);
  assertEqual(NumberSchema.parse(123), 123);
  assertEqual(NumberSchema.parse(-123), -123);
  assertEqual(NumberSchema.parse(3.14), 3.14);
  assertEqual(NumberSchema.parse(-3.14), -3.14);

  assertEqual(await NumberSchema.parseAsync(0), 0);
  assertEqual(await NumberSchema.parseAsync(123), 123);
  assertEqual(await NumberSchema.parseAsync(-123), -123);
  assertEqual(await NumberSchema.parseAsync(3.14), 3.14);
  assertEqual(await NumberSchema.parseAsync(-3.14), -3.14);

  assertThrows(() => NumberSchema.parse('123'));
  assertThrows(() => NumberSchema.parse(NaN));
  assertThrows(() => NumberSchema.parse(Infinity));
});
