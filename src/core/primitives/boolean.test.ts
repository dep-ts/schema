import { assertEqual, assertThrows } from '@dep/assert';
import { boolean } from './boolean.ts';

Deno.test('BooleanSchema', async () => {
  const data = true;
  const BooleanSchema = boolean();

  assertEqual(BooleanSchema.kind, 'BooleanSchema');

  assertEqual(BooleanSchema.parse(data), data);
  assertEqual(BooleanSchema.parse(false), false);
  assertEqual(await BooleanSchema.parseAsync(data), data);

  assertThrows(() => BooleanSchema.parse('true'));
  assertThrows(() => BooleanSchema.parse(1));
  assertThrows(() => BooleanSchema.parse(null));
  assertThrows(() => BooleanSchema.parse(undefined));
});
