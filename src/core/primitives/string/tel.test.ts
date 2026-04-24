import { assertEqual } from '@dep/assert';
import { tel } from './tel.ts';

Deno.test('TelSchema', async () => {
  const data = '+14155552671';
  const TelSchema = tel();

  assertEqual(TelSchema.kind, 'TelSchema');
  assertEqual(TelSchema.type, 'string');

  assertEqual(TelSchema.parse(data), data);
  assertEqual(await TelSchema.parseAsync(data), data);

  assertEqual(TelSchema.parse('+442071234567'), '+442071234567');
  assertEqual(TelSchema.parse('+4915123456789'), '+4915123456789');
  assertEqual(TelSchema.parse('+1234567'), '+1234567');
});
