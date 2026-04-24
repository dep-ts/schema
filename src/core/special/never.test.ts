import { assertEqual, assertThrows } from '@dep/assert';
import { never } from './never.ts';

Deno.test('NeverSchema', async () => {
  const NeverSchema = never();

  assertEqual(NeverSchema.kind, 'NeverSchema');
  assertEqual(NeverSchema.type, 'never');

  const values = [
    'string',
    123,
    true,
    null,
    undefined,
    { key: 'value' },
    [1, 2, 3],
    Symbol('test'),
    NaN,
  ];

  for (const value of values) {
    assertThrows(() => NeverSchema.parse(value));

    try {
      await NeverSchema.parseAsync(value);
      throw new Error('parseAsync should have thrown');
    } catch {
      //
    }
  }
});
