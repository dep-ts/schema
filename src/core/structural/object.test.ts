import { assertDeepEqual, assertEqual, assertThrows } from '@dep/assert';
import { object } from './object.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';

Deno.test('ObjectSchema', async () => {
  const shape = {
    name: string(),
    age: number(),
  };
  const UserSchema = object(shape);

  assertEqual(UserSchema.kind, 'ObjectSchema');
  assertEqual(UserSchema.type, 'object');

  // 1. Basic validation
  const validData = { name: 'Alice', age: 30 };
  assertDeepEqual(UserSchema.parse(validData), validData);
  assertDeepEqual(await UserSchema.parseAsync(validData), validData);

  // 2. Throws on missing required keys
  assertThrows(() => UserSchema.parse({ name: 'Alice' }));

  // 3. Throws on invalid property types
  assertThrows(() => UserSchema.parse({ name: 'Alice', age: '30' }));

  // 4. Strip mode (default) - removes unknown keys
  const dataWithExtra = { name: 'Bob', age: 25, extra: 'discard me' };
  const stripped = UserSchema.parse(dataWithExtra);
  assertEqual('extra' in stripped, false);
  assertEqual(stripped.name, 'Bob');

  // 5. Strict mode - throws on unknown keys
  const StrictSchema = UserSchema.strict();
  assertThrows(() => StrictSchema.parse(dataWithExtra));

  // 6. Loose mode / Catchall
  const LooseSchema = UserSchema.loose();
  const loosed = LooseSchema.parse(dataWithExtra) as typeof dataWithExtra;

  assertEqual(loosed.extra, 'discard me');

  const CatchallSchema = UserSchema.catchall(string());
  assertEqual(
    // deno-lint-ignore ban-ts-comment
    //@ts-ignore
    CatchallSchema.parse({ ...validData, note: 'hello' }).note,
    'hello',
  );
  assertThrows(() => CatchallSchema.parse({ ...validData, note: 123 }));

  // 7. Pick and Omit
  const PickedSchema = UserSchema.pick({ name: true });
  assertDeepEqual(PickedSchema.parse({ name: 'Charlie' }), { name: 'Charlie' });
  assertThrows(() => PickedSchema.parse({ age: 20 }));

  const OmittedSchema = UserSchema.omit({ age: true });
  assertDeepEqual(OmittedSchema.parse({ name: 'Dave' }), { name: 'Dave' });

  // 8. Partial
  const PartialSchema = UserSchema.partial();

  assertDeepEqual(PartialSchema.parse({ name: 'Eve' }), {
    name: 'Eve',
    age: undefined,
  });
  assertDeepEqual(PartialSchema.parse({}), { age: undefined, name: undefined });

  // 9. Extend
  const ExtendedSchema = UserSchema.extend({
    email: string(),
  });
  const extendedData = { name: 'Frank', age: 40, email: 'f@test.com' };
  assertDeepEqual(ExtendedSchema.parse(extendedData), extendedData);

  // 10. Keyof
  const keys = UserSchema.keyof();
  assertEqual(keys.parse('name'), 'name');
  assertEqual(keys.parse('age'), 'age');
  assertThrows(() => keys.parse('email'));

  // 11. Non-object types should throw
  assertThrows(() => UserSchema.parse(null));
  assertThrows(() => UserSchema.parse([]));
  assertThrows(() => UserSchema.parse('string'));
});
