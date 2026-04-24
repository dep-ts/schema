import { assertEqual, assertThrows } from '@dep/assert';
import { bigint } from './bigint.ts';

Deno.test('BigIntSchema', async () => {
  const BigIntSchema = bigint();

  assertEqual(BigIntSchema.kind, 'BigIntSchema');
  assertEqual(BigIntSchema.type, 'bigint');

  assertEqual(BigIntSchema.parse(0n), 0n);
  assertEqual(BigIntSchema.parse(123n), 123n);
  assertEqual(BigIntSchema.parse(-123n), -123n);

  assertEqual(await BigIntSchema.parseAsync(0n), 0n);
  assertEqual(await BigIntSchema.parseAsync(123n), 123n);
  assertEqual(await BigIntSchema.parseAsync(-123n), -123n);

  assertThrows(() => BigIntSchema.parse(0));
  assertThrows(() => BigIntSchema.parse('123'));
  assertThrows(() => BigIntSchema.parse(3.14));
  assertThrows(() => BigIntSchema.parse(NaN));
  assertThrows(() => BigIntSchema.parse(Infinity));
});
