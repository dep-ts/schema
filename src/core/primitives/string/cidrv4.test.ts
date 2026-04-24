import { assertEqual } from '@dep/assert';
import { cidrv4 } from './cidrv4.ts';

Deno.test('CIDRv4Schema', async () => {
  const data = '192.168.1.0/24';
  const CIDRv4Schema = cidrv4();

  assertEqual(CIDRv4Schema.kind, 'CIDRv4Schema');
  assertEqual(CIDRv4Schema.type, 'string');

  assertEqual(CIDRv4Schema.parse(data), data);
  assertEqual(await CIDRv4Schema.parseAsync(data), data);

  assertEqual(CIDRv4Schema.parse('0.0.0.0/0'), '0.0.0.0/0');
  assertEqual(CIDRv4Schema.parse('10.0.0.1/32'), '10.0.0.1/32');
  assertEqual(CIDRv4Schema.parse('255.255.255.255/32'), '255.255.255.255/32');
});
