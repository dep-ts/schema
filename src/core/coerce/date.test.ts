import { assertEqual } from '@dep/assert';
import { date } from './date.ts';

Deno.test('DateSchemaCoerced', async () => {
  const now = new Date();
  const DateSchema = date();

  assertEqual(DateSchema.kind, 'DateSchemaCoerced');
  assertEqual(DateSchema.type, 'date');

  assertEqual(DateSchema.parse(now).getTime(), now.getTime());
  assertEqual((await DateSchema.parseAsync(now)).getTime(), now.getTime());

  const isoString = '2024-01-01T00:00:00.000Z';
  const parsedFromIso = DateSchema.parse(isoString);
  assertEqual(parsedFromIso instanceof Date, true);
  assertEqual(parsedFromIso.toISOString(), isoString);

  const timestamp = 1704067200000;
  const parsedFromTimestamp = DateSchema.parse(timestamp);
  assertEqual(parsedFromTimestamp.getTime(), timestamp);
});
