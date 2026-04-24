import { assertEqual } from '@dep/assert';
import { bigint } from './bigint.ts';

Deno.test('BigIntSchemaCoerced', async () => {
  const data = 100n;
  const BigIntSchema = bigint();

  assertEqual(BigIntSchema.kind, 'BigIntSchemaCoerced');
  assertEqual(BigIntSchema.type, 'bigint');

  assertEqual(BigIntSchema.parse(data), data);
  assertEqual(await BigIntSchema.parseAsync(data), data);

  assertEqual(BigIntSchema.parse('123'), 123n);
  assertEqual(BigIntSchema.parse(456), 456n);
  assertEqual(BigIntSchema.parse(true), 1n);
  assertEqual(BigIntSchema.parse(false), 0n);
});
