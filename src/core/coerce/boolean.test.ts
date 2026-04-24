import { assertEqual } from '@dep/assert';
import { boolean } from './boolean.ts';

Deno.test('BooleanSchemaCoerced', async () => {
  const data = true;
  const BooleanSchema = boolean();

  assertEqual(BooleanSchema.kind, 'BooleanSchemaCoerced');
  assertEqual(BooleanSchema.type, 'boolean');

  assertEqual(BooleanSchema.parse(data), data);
  assertEqual(await BooleanSchema.parseAsync(data), data);

  assertEqual(BooleanSchema.parse(1), true);
  assertEqual(BooleanSchema.parse(0), false);
  assertEqual(BooleanSchema.parse('true'), true);
  assertEqual(BooleanSchema.parse(''), false);
  assertEqual(BooleanSchema.parse(null), false);
  assertEqual(BooleanSchema.parse(undefined), false);
});
