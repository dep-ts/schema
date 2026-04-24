import { assertEqual } from '@dep/assert';
import { httpUrl, url } from './url.ts';

Deno.test('URLSchema', async () => {
  const data = 'https://example.com/path?query=1';
  const URLSchema = url();

  assertEqual(URLSchema.kind, 'URLSchema');
  assertEqual(URLSchema.type, 'string');

  assertEqual(URLSchema.parse(data), data);
  assertEqual(await URLSchema.parseAsync(data), data);
});

Deno.test('URLSchema normalization', () => {
  const schema = httpUrl(true);
  const input = '  https://EXAMPLE.com/path  ';
  const expected = 'https://example.com/path';

  assertEqual(schema.parse(input), expected);
});

Deno.test('URLSchema constraints', () => {
  const hostSchema = url({ hostname: /google\.com$/ });
  assertEqual(
    hostSchema.parse('https://www.google.com'),
    'https://www.google.com',
  );

  const protocolSchema = url({ protocol: /^ftp$/ });
  assertEqual(
    protocolSchema.parse('ftp://files.example.com'),
    'ftp://files.example.com',
  );
});
