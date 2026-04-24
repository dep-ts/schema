import { assertEqual } from '@dep/assert';
import { cuid2 } from './cuid2.ts';

Deno.test('CUID2Schema', async () => {
  const data = 'tz4a98xxat96iws9zmbrgj3a';
  const CUID2Schema = cuid2();

  assertEqual(CUID2Schema.kind, 'CUID2Schema');
  assertEqual(CUID2Schema.type, 'string');

  assertEqual(CUID2Schema.parse(data), data);
  assertEqual(await CUID2Schema.parseAsync(data), data);

  assertEqual(CUID2Schema.parse('a1b2c3d4'), 'a1b2c3d4');
  assertEqual(CUID2Schema.parse('7n9s0v9as87d'), '7n9s0v9as87d');
  assertEqual(
    CUID2Schema.parse('p998asdf88asdf88asdf88as'),
    'p998asdf88asdf88asdf88as',
  );
});
