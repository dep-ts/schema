import { assertEqual } from '@dep/assert';
import { base64 } from './base64.ts';

Deno.test('Base64Schema', async () => {
  const data = 'SGVsbG8gV29ybGQ=';
  const Base64Schema = base64();

  assertEqual(Base64Schema.kind, 'Base64Schema');
  assertEqual(Base64Schema.type, 'string');

  assertEqual(Base64Schema.parse(data), data);
  assertEqual(await Base64Schema.parseAsync(data), data);

  assertEqual(Base64Schema.parse(''), '');
  assertEqual(Base64Schema.parse('YQ=='), 'YQ==');
  assertEqual(Base64Schema.parse('YWI='), 'YWI=');
  assertEqual(Base64Schema.parse('YWJj'), 'YWJj');
});
