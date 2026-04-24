import { assertEqual, assertThrows } from '@dep/assert';
import { date } from './date.ts';

Deno.test('DateSchema', async () => {
  const now = new Date();
  const DateSchema = date();

  assertEqual(DateSchema.kind, 'DateSchema');
  assertEqual(DateSchema.type, 'date');

  assertEqual(DateSchema.parse(now), now);
  assertEqual(await DateSchema.parseAsync(now), now);

  assertThrows(() => DateSchema.parse('2024-01-01'));
  assertThrows(() => DateSchema.parse(1713888000000));
  assertThrows(() => DateSchema.parse(null));
  assertThrows(() => DateSchema.parse({}));
});
