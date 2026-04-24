import { assertEqual } from '@dep/assert';
import { xid } from './xid.ts';

Deno.test('XIDSchema', async () => {
  const data = 'btv8mo7696f8c7nkjeb0';
  const XIDSchema = xid();

  assertEqual(XIDSchema.kind, 'XIDSchema');
  assertEqual(XIDSchema.type, 'string');

  assertEqual(XIDSchema.parse(data), data);
  assertEqual(await XIDSchema.parseAsync(data), data);

  assertEqual(XIDSchema.parse('9m4e2mr0ui3e8a215n4g'), '9m4e2mr0ui3e8a215n4g');
  assertEqual(XIDSchema.parse('00000000000000000000'), '00000000000000000000');
  assertEqual(XIDSchema.parse('vvvvvvvvvvvvvvvvvvvv'), 'vvvvvvvvvvvvvvvvvvvv');
});
