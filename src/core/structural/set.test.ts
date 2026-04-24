import { assertEqual, assertThrows } from '@dep/assert';
import { set } from './set.ts';
import { string } from '@core/primitives/string/string.ts';

Deno.test('SetSchema', async () => {
  const ValueSchema = string();
  const SetSchema = set(ValueSchema);

  assertEqual(SetSchema.kind, 'SetSchema');
  assertEqual(SetSchema.type, 'set');

  // 1. Validates Set objects
  const validSet = new Set(['a', 'b']);
  const result = SetSchema.parse(validSet);
  assertEqual(result.size, 2);
  assertEqual(result.has('a'), true);

  // 2. Validates Set objects asynchronously
  const asyncResult = await SetSchema.parseAsync(validSet);
  assertEqual(asyncResult.size, 2);

  // 3. Throws on invalid item types
  const invalidSet = new Set(['a', 123]);
  assertThrows(() => SetSchema.parse(invalidSet));

  // 4. Size constraints: min
  const MinSchema = set(string()).min(2);
  assertEqual(MinSchema.parse(new Set(['a', 'b'])).size, 2);
  assertThrows(() => MinSchema.parse(new Set(['a'])));

  // 5. Size constraints: max
  const MaxSchema = set(string()).max(1);
  assertEqual(MaxSchema.parse(new Set(['a'])).size, 1);
  assertThrows(() => MaxSchema.parse(new Set(['a', 'b'])));

  // 6. Size constraints: nonempty
  const NonEmptySchema = set(string()).nonempty();
  assertEqual(NonEmptySchema.parse(new Set(['a'])).size, 1);
  assertThrows(() => NonEmptySchema.parse(new Set()));

  // 7. Size constraints: size (exact)
  const ExactSchema = set(string()).size(2);
  assertEqual(ExactSchema.parse(new Set(['a', 'b'])).size, 2);
  assertThrows(() => ExactSchema.parse(new Set(['a'])));
  assertThrows(() => ExactSchema.parse(new Set(['a', 'b', 'c'])));

  // 8. Should throw on non-Set types
  assertThrows(() => SetSchema.parse(['a', 'b'])); // Array is not a Set
  assertThrows(() => SetSchema.parse({ a: 'a' }));
  assertThrows(() => SetSchema.parse(null));
  assertThrows(() => SetSchema.parse(undefined));
});
