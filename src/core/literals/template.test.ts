import { assertEqual } from '@dep/assert';
import { templateLiteral } from './template.ts';
import { number } from '@core/primitives/number/number.ts';
import { string } from '@core/primitives/string/string.ts';
import { SCHEMA_PATTERN } from '@internal/utils/symbols.ts';

Deno.test('TemplateLiteralSchema (Static)', async () => {
  const data = 'user-123';
  const schema = templateLiteral(['user-', '123']);

  assertEqual(schema.kind, 'TemplateLiteralSchema');
  assertEqual(schema.type, 'template_literal');

  assertEqual(schema.parse(data), data);
  assertEqual(await schema.parseAsync(data), data);
});

Deno.test('TemplateLiteralSchema (Composition)', () => {
  const schema = templateLiteral(['ID:', number()]);

  assertEqual(schema.parse('ID:42'), 'ID:42');
  assertEqual(schema.parse('ID:-10.5'), 'ID:-10.5');
});

Deno.test('TemplateLiteralSchema (Complex)', () => {
  const versionSchema = templateLiteral(['v', number(), '.', number()]);

  assertEqual(versionSchema.parse('v1.0'), 'v1.0');
  assertEqual(versionSchema.parse('v12.345'), 'v12.345');
});

Deno.test('TemplateLiteralSchema Regex Generation', () => {
  const schema = templateLiteral(['prefix_', string().min(2), '_suffix']);
  const pattern = schema[SCHEMA_PATTERN]();

  assertEqual(pattern instanceof RegExp, true);
  assertEqual(pattern.test('prefix_ab_suffix'), true);
  assertEqual(pattern.test('prefix_a_suffix'), false);
});
