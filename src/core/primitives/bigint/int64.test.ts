import { assertEqual, assertThrows } from '@dep/assert';
import { int64 } from './int64.ts';

Deno.test('Int64Schema', async () => {
  const Int64Schema = int64();

  assertEqual(Int64Schema.kind, 'Int64Schema');
  assertEqual(Int64Schema.type, 'bigint');

  assertEqual(Int64Schema.parse(-9223372036854775808n), -9223372036854775808n);
  assertEqual(Int64Schema.parse(9223372036854775807n), 9223372036854775807n);

  assertEqual(
    await Int64Schema.parseAsync(-9223372036854775808n),
    -9223372036854775808n,
  );
  assertEqual(
    await Int64Schema.parseAsync(9223372036854775807n),
    9223372036854775807n,
  );

  assertThrows(() => Int64Schema.parse(-9223372036854775809n));
  assertThrows(() => Int64Schema.parse(9223372036854775808n));

  assertThrows(() => Int64Schema.parse(3.14));
  assertThrows(() => Int64Schema.parse('123'));
  assertThrows(() => Int64Schema.parse(NaN));
  assertThrows(() => Int64Schema.parse(Infinity));
});
