import { assertEqual, assertThrows } from '@dep/assert';
import { instanceof as instanceof_ } from './instance.ts';

Deno.test('InstanceofSchema', () => {
  class User {
    constructor(public name: string) {}
  }

  class Admin extends User {}
  class NotAUser {}

  const UserSchema = instanceof_(User);

  assertEqual(UserSchema.kind, 'CustomSchema');

  // 1. Validates direct instances
  const bob = new User('Bob');
  assertEqual(UserSchema.parse(bob), bob);

  // 2. Validates inherited instances (subclasses)
  const alice = new Admin('Alice');
  assertEqual(UserSchema.parse(alice), alice);

  // 3. Should throw on unrelated classes
  assertThrows(() => UserSchema.parse(new NotAUser()));

  // 4. Should throw on primitives/objects that aren't instances
  assertThrows(() => UserSchema.parse({ name: 'Bob' }));
  assertThrows(() => UserSchema.parse(null));
  assertThrows(() => UserSchema.parse(undefined));

  // 5. Validation with custom message
  const CustomMsgSchema = instanceof_(User, 'Must be a User instance');
  const result = CustomMsgSchema.parse(bob);
  assertEqual(result, bob);

  assertThrows(() => CustomMsgSchema.parse({}));

  // 6. Test with built-in classes
  const DateSchema = instanceof_(Date);
  const now = new Date();
  assertEqual(DateSchema.parse(now), now);
  assertThrows(() => DateSchema.parse('2024-01-01'));
});
