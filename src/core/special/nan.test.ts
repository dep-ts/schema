import { assertEqual, assertThrows } from '@dep/assert';
import { nan } from './nan.ts';

Deno.test('NaNSchema', async () => {
  const data = NaN;
  const NaNSchema = nan();

  assertEqual(NaNSchema.kind, 'NaNSchema');
  assertEqual(NaNSchema.type, 'nan');

  const result = NaNSchema.parse(data);
  assertEqual(Number.isNaN(result), true);

  const asyncResult = await NaNSchema.parseAsync(data);
  assertEqual(Number.isNaN(asyncResult), true);

  assertThrows(() => NaNSchema.parse(123));
  assertThrows(() => NaNSchema.parse(0));
  assertThrows(() => NaNSchema.parse('NaN'));
  assertThrows(() => NaNSchema.parse(null));
  assertThrows(() => NaNSchema.parse(undefined));
});
