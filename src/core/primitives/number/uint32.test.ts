import { assertEqual, assertThrows } from '@dep/assert';
import { uint32 } from './uint32.ts';

Deno.test('UInt32Schema', async () => {
  const UInt32Schema = uint32();

  assertEqual(UInt32Schema.kind, 'UInt32Schema');
  assertEqual(UInt32Schema.type, 'number');

  assertEqual(UInt32Schema.parse(0), 0);
  assertEqual(UInt32Schema.parse(4294967295), 4294967295);

  assertEqual(await UInt32Schema.parseAsync(0), 0);
  assertEqual(await UInt32Schema.parseAsync(4294967295), 4294967295);

  assertThrows(() => UInt32Schema.parse(-1));
  assertThrows(() => UInt32Schema.parse(4294967296));

  assertThrows(() => UInt32Schema.parse(3.14));

  assertThrows(() => UInt32Schema.parse('123'));
  assertThrows(() => UInt32Schema.parse(NaN));
  assertThrows(() => UInt32Schema.parse(Infinity));
});
