import { assertEqual } from '@dep/assert';
import { ipv4 } from './ipv4.ts';

Deno.test('IPv4Schema', async () => {
  const data = '192.168.1.1';
  const IPv4Schema = ipv4();

  assertEqual(IPv4Schema.kind, 'IPv4Schema');
  assertEqual(IPv4Schema.type, 'string');

  assertEqual(IPv4Schema.parse(data), data);
  assertEqual(await IPv4Schema.parseAsync(data), data);

  assertEqual(IPv4Schema.parse('0.0.0.0'), '0.0.0.0');
  assertEqual(IPv4Schema.parse('127.0.0.1'), '127.0.0.1');
  assertEqual(IPv4Schema.parse('255.255.255.255'), '255.255.255.255');
  assertEqual(IPv4Schema.parse('10.0.0.254'), '10.0.0.254');
});
