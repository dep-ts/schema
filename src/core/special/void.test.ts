import { assertEqual, assertThrows } from '@dep/assert';
import { void as void_ } from './void.ts';

Deno.test('VoidSchema', async () => {
  const data = undefined;
  const VoidSchema = void_();

  assertEqual(VoidSchema.kind, 'VoidSchema');
  assertEqual(VoidSchema.type, 'void');

  assertEqual(VoidSchema.parse(data), undefined);
  assertEqual(await VoidSchema.parseAsync(data), undefined);

  assertThrows(() => VoidSchema.parse(null));
  assertThrows(() => VoidSchema.parse(0));
  assertThrows(() => VoidSchema.parse(''));
  assertThrows(() => VoidSchema.parse(false));
  assertThrows(() => VoidSchema.parse({}));
});
