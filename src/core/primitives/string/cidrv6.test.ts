import { assertEqual } from '@dep/assert';
import { cidrv6 } from './cidrv6.ts';

Deno.test('CIDRv6Schema', async () => {
  const data = '2001:db8:0:0:0:0:0:0/32';
  const CIDRv6Schema = cidrv6();

  assertEqual(CIDRv6Schema.kind, 'CIDRv6Schema');
  assertEqual(CIDRv6Schema.type, 'string');

  assertEqual(CIDRv6Schema.parse(data), data);
  assertEqual(await CIDRv6Schema.parseAsync(data), data);

  assertEqual(CIDRv6Schema.parse('::1/128'), '::1/128');
  assertEqual(CIDRv6Schema.parse('::/0'), '::/0');
});
