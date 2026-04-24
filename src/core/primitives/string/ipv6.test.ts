import { assertEqual } from '@dep/assert';
import { ipv6 } from './ipv6.ts';

Deno.test('IPv6Schema', async () => {
  const data = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
  const IPv6Schema = ipv6();

  assertEqual(IPv6Schema.kind, 'IPv6Schema');
  assertEqual(IPv6Schema.type, 'string');

  assertEqual(IPv6Schema.parse(data), data);
  assertEqual(await IPv6Schema.parseAsync(data), data);

  assertEqual(
    IPv6Schema.parse('2001:db8:85a3::8a2e:370:7334'),
    '2001:db8:85a3::8a2e:370:7334',
  );
  assertEqual(IPv6Schema.parse('::1'), '::1');
  assertEqual(IPv6Schema.parse('::'), '::');
  assertEqual(
    IPv6Schema.parse('abcd:ef01:2345:6789:abcd:ef01:2345:6789'),
    'abcd:ef01:2345:6789:abcd:ef01:2345:6789',
  );
});
