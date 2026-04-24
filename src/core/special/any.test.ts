import { assertEqual } from '@dep/assert';
import { any } from './any.ts';

Deno.test('AnySchema', async () => {
  const AnySchema = any();

  assertEqual(AnySchema.kind, 'AnySchema');
  assertEqual(AnySchema.type, 'any');

  const values = [
    'string',
    123,
    true,
    null,
    undefined,
    { key: 'value' },
    [1, 2, 3],
    Symbol('test'),
    () => {},
  ];

  for (const value of values) {
    assertEqual(AnySchema.parse(value), value);
    assertEqual(await AnySchema.parseAsync(value), value);
  }
});
