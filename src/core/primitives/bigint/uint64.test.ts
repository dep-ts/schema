import { assertEqual, assertThrows } from '@dep/assert';
import { uint64 } from './uint64.ts';

Deno.test('UInt64Schema', async () => {
  const UInt64Schema = uint64();

  assertEqual(UInt64Schema.kind, 'UInt64Schema');
  assertEqual(UInt64Schema.type, 'bigint');

  assertEqual(UInt64Schema.parse(0n), 0n);
  assertEqual(UInt64Schema.parse(18446744073709551615n), 18446744073709551615n);

  assertEqual(await UInt64Schema.parseAsync(0n), 0n);
  assertEqual(
    await UInt64Schema.parseAsync(18446744073709551615n),
    18446744073709551615n,
  );

  assertThrows(() => UInt64Schema.parse(-1n));
  assertThrows(() => UInt64Schema.parse(18446744073709551616n));

  assertThrows(() => UInt64Schema.parse(3.14));
  assertThrows(() => UInt64Schema.parse('123'));
  assertThrows(() => UInt64Schema.parse(NaN));
  assertThrows(() => UInt64Schema.parse(Infinity));
});
