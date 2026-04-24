import { assertEqual } from '@dep/assert';
import { string } from './string.ts';

Deno.test('StringSchema', async () => {
  const data = 'hello world';
  const StringSchema = string();

  assertEqual(StringSchema.kind, 'StringSchema');
  assertEqual(StringSchema.type, 'string');

  assertEqual(StringSchema.parse(data), data);
  assertEqual(await StringSchema.parseAsync(data), data);
});

Deno.test('StringSchema constraints', () => {
  const schema = string()
    .min(3)
    .max(10)
    .startsWith('he')
    .endsWith('o')
    .includes('ell');

  assertEqual(schema.parse('hello'), 'hello');
});

Deno.test('StringSchema casing', () => {
  const lower = string().lowercase();
  assertEqual(lower.parse('abc'), 'abc');

  const upper = string().uppercase();
  assertEqual(upper.parse('ABC'), 'ABC');
});

Deno.test('StringSchema transformations', () => {
  const schema = string().trim().toLowerCase();
  assertEqual(schema.parse('  HELLO  '), 'hello');
});

Deno.test('StringSchema length', () => {
  const schema = string().length(5);
  assertEqual(schema.parse('abcde'), 'abcde');

  const nonempty = string().nonempty();
  assertEqual(nonempty.parse(' '), ' ');
});
