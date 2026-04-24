import { assertEqual, assertThrows } from '@dep/assert';
import { undefined as undefined_ } from './undefined.ts';

Deno.test('UndefinedSchema', async () => {
  const data = undefined;
  const UndefinedSchema = undefined_();

  assertEqual(UndefinedSchema.kind, 'UndefinedSchema');
  assertEqual(UndefinedSchema.parse(data), data);
  assertEqual(await UndefinedSchema.parseAsync(data), data);

  assertThrows(() => UndefinedSchema.parse(null));
  assertThrows(() => UndefinedSchema.parse(false));
  assertThrows(() => UndefinedSchema.parse(0));
  assertThrows(() => UndefinedSchema.parse('undefined'));
  assertThrows(() => UndefinedSchema.parse({}));
});
