import { assertEqual } from '@dep/assert';
import { number } from './number.ts';

Deno.test('NumberSchemaCoerced', async () => {
  const data = 42;
  const NumberSchema = number();

  assertEqual(NumberSchema.kind, 'NumberSchemaCoerced');
  assertEqual(NumberSchema.type, 'number');

  assertEqual(NumberSchema.parse(data), data);
  assertEqual(await NumberSchema.parseAsync(data), data);

  assertEqual(NumberSchema.parse('123'), 123);
  assertEqual(NumberSchema.parse('12.34'), 12.34);
  assertEqual(NumberSchema.parse(''), 0);

  assertEqual(NumberSchema.parse(true), 1);
  assertEqual(NumberSchema.parse(false), 0);

  assertEqual(NumberSchema.parse(null), 0);
});
