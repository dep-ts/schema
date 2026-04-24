import { assertEqual, assertThrows } from '@dep/assert';
import { map } from './map.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';

Deno.test('MapSchema', async () => {
  const KeySchema = string();
  const ValueSchema = number();
  const MapSchema = map(KeySchema, ValueSchema);

  assertEqual(MapSchema.kind, 'MapSchema');
  assertEqual(MapSchema.type, 'map');

  // 1. Validates Map objects
  const validMap = new Map([
    ['a', 1],
    ['b', 2],
  ]);
  const result = MapSchema.parse(validMap);
  assertEqual(result.size, 2);
  assertEqual(result.get('a'), 1);

  // 2. Validates Map objects asynchronously
  const asyncResult = await MapSchema.parseAsync(validMap);
  assertEqual(asyncResult.size, 2);

  // 3. Throws on invalid Key types
  const invalidKeyMap = new Map([[123, 1]]);
  assertThrows(() => MapSchema.parse(invalidKeyMap));

  // 4. Throws on invalid Value types
  const invalidValueMap = new Map([['a', 'not-a-number']]);
  assertThrows(() => MapSchema.parse(invalidValueMap));

  // 5. Size constraints: min
  const MinSchema = map(string(), number()).min(2);
  assertEqual(
    MinSchema.parse(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ).size,
    2,
  );
  assertThrows(() => MinSchema.parse(new Map([['a', 1]])));

  // 6. Size constraints: max
  const MaxSchema = map(string(), number()).max(1);
  assertEqual(MaxSchema.parse(new Map([['a', 1]])).size, 1);
  assertThrows(() =>
    MaxSchema.parse(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    )
  );

  // 7. Size constraints: nonempty
  const NonEmptySchema = map(string(), number()).nonempty();
  assertEqual(NonEmptySchema.parse(new Map([['a', 1]])).size, 1);
  assertThrows(() => NonEmptySchema.parse(new Map()));

  // 8. Size constraints: size (exact)
  const ExactSchema = map(string(), number()).size(2);
  assertEqual(
    ExactSchema.parse(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ).size,
    2,
  );
  assertThrows(() => ExactSchema.parse(new Map([['a', 1]])));
  assertThrows(() =>
    ExactSchema.parse(
      new Map([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]),
    )
  );

  // 9. Should throw on non-Map types
  assertThrows(() => MapSchema.parse({ a: 1 }));
  assertThrows(() => MapSchema.parse([['a', 1]]));
  assertThrows(() => MapSchema.parse(null));
});
