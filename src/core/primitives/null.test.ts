import { assertEqual, assertThrows } from '@dep/assert';
import { null as null_ } from './null.ts';

Deno.test('NullSchema', async () => {
  const data = null;
  const NullSchema = null_();

  assertEqual(NullSchema.kind, 'NullSchema');

  assertEqual(NullSchema.parse(data), data);
  assertEqual(await NullSchema.parseAsync(data), data);

  assertThrows(() => NullSchema.parse(undefined));
  assertThrows(() => NullSchema.parse(false));
  assertThrows(() => NullSchema.parse(0));
  assertThrows(() => NullSchema.parse('null'));
  assertThrows(() => NullSchema.parse({}));
});
