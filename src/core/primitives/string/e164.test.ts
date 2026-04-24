import { assertEqual } from '@dep/assert';
import { e164 } from './e164.ts';

Deno.test('E164Schema', async () => {
  const data = '+14155552671';
  const E164Schema = e164();

  assertEqual(E164Schema.kind, 'E164Schema');
  assertEqual(E164Schema.type, 'string');

  assertEqual(E164Schema.parse(data), data);
  assertEqual(await E164Schema.parseAsync(data), data);

  // Testing various E.164 compliant formats
  assertEqual(E164Schema.parse('+442071234567'), '+442071234567');
  assertEqual(E164Schema.parse('+4915123456789'), '+4915123456789');
  assertEqual(E164Schema.parse('+1234567'), '+1234567');
});
