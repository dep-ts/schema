import { assertEqual } from '@dep/assert';
import { string } from './string.ts';

Deno.test('StringSchemaCoerced', async () => {
  const data = 'already a string';
  const StringSchema = string();

  assertEqual(StringSchema.kind, 'StringSchemaCoerced');
  assertEqual(StringSchema.type, 'string');

  assertEqual(StringSchema.parse(data), data);
  assertEqual(await StringSchema.parseAsync(data), data);

  assertEqual(StringSchema.parse(123), '123');
  assertEqual(StringSchema.parse(0), '0');
  assertEqual(StringSchema.parse(-1.5), '-1.5');

  assertEqual(StringSchema.parse(true), 'true');
  assertEqual(StringSchema.parse(false), 'false');

  assertEqual(StringSchema.parse([]), '');
  assertEqual(StringSchema.parse({}), '[object Object]');
});
