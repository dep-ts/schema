import { assertDeepEqual, assertEqual, assertThrows } from '@dep/assert';
import { tuple } from './tuple.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';
import { optional } from '@core/utilities/schema.ts';

Deno.test('TupleSchema', async () => {
  const SimpleTuple = tuple([string(), number()]);

  assertEqual(SimpleTuple.kind, 'TupleSchema');
  assertEqual(SimpleTuple.type, 'tuple');

  // 1. Validates fixed-length tuples
  const validData = ['hello', 42];
  assertDeepEqual(SimpleTuple.parse(validData), validData);
  assertDeepEqual(await SimpleTuple.parseAsync(validData), validData);

  // 2. Throws on incorrect length (too big/small)
  assertThrows(() => SimpleTuple.parse(['hello']));
  assertThrows(() => SimpleTuple.parse(['hello', 42, true]));

  // 3. Throws on invalid item types
  assertThrows(() => SimpleTuple.parse([123, 42]));
  assertThrows(() => SimpleTuple.parse(['hello', 'world']));

  // 4. Handles rest elements
  const TupleWithRest = tuple([string()]).rest(number());
  const restData = ['hello', 1, 2, 3];
  assertDeepEqual(TupleWithRest.parse(restData), restData);
  assertThrows(() => TupleWithRest.parse(['hello', 1, 'wrong']));

  // 5. Handles optional elements
  // Note: Your length logic calculates optStart based on OptionalSchema kind
  const OptionalTuple = tuple([string(), optional(number())]);
  assertDeepEqual(OptionalTuple.parse(['hello', 42]), ['hello', 42]);
  // console.log(console.log(OptionalTuple.parse(['hello'])));
  assertDeepEqual(OptionalTuple.parse(['hello']), ['hello', undefined]);

  // 6. Asynchronous validation with rest
  const AsyncTuple = tuple([number()]).rest(string());
  const asyncData = [1, 'a', 'b'];
  assertDeepEqual(await AsyncTuple.parseAsync(asyncData), asyncData);

  // 7. Should throw on non-array types
  assertThrows(() => SimpleTuple.parse({ 0: 'hello', 1: 42 }));
  assertThrows(() => SimpleTuple.parse(null));
});
