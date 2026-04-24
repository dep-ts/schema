import { assertEqual } from '@dep/assert';
import { literal } from './literal.ts';
import { SCHEMA_PATTERN } from '@internal/utils/symbols.ts';

Deno.test('LiteralSchema (String)', async () => {
  const data = 'hello';
  const LiteralSchema = literal('hello');

  assertEqual(LiteralSchema.kind, 'LiteralSchema');
  assertEqual(LiteralSchema.type, 'literal');

  assertEqual(LiteralSchema.parse(data), data);
  assertEqual(await LiteralSchema.parseAsync(data), data);

  const pattern = LiteralSchema[SCHEMA_PATTERN]();
  assertEqual(pattern.source, '^(hello)$');
});

Deno.test('LiteralSchema (Number)', () => {
  const schema = literal(42);
  assertEqual(schema.parse(42), 42);
});

Deno.test('LiteralSchema (Boolean)', () => {
  const schema = literal(true);
  assertEqual(schema.parse(true), true);
});

Deno.test('LiteralSchema (Null/Undefined)', () => {
  const nullSchema = literal(null);
  assertEqual(nullSchema.parse(null), null);

  const undefinedSchema = literal(undefined);
  assertEqual(undefinedSchema.parse(undefined), undefined);
});
