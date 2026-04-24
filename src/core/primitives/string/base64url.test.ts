import { assertEqual } from '@dep/assert';
import { base64url } from './base64url.ts';

Deno.test('Base64URLSchema', async () => {
  const data = 'SGVsbG8_V29ybGQt';
  const Base64URLSchema = base64url();

  assertEqual(Base64URLSchema.kind, 'Base64URLSchema');
  assertEqual(Base64URLSchema.type, 'string');

  assertEqual(Base64URLSchema.parse(data), data);
  assertEqual(await Base64URLSchema.parseAsync(data), data);

  assertEqual(Base64URLSchema.parse(''), '');
  assertEqual(Base64URLSchema.parse('YQ'), 'YQ');
  assertEqual(Base64URLSchema.parse('YWI'), 'YWI');
  assertEqual(Base64URLSchema.parse('PD4_'), 'PD4_');
});
