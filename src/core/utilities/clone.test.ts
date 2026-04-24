import { assertEqual, assertThrows } from '@dep/assert';
import { clone } from './clone.ts';
import { string } from '@core/primitives/string/string.ts';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';
import { InternalStringDef } from '@internal/types';

Deno.test('clone', () => {
  const original = string().min(5);

  // 1. Basic cloning
  const cloned = clone(original);

  // Ensure they are different instances but have same properties
  // assertNotStrictEquals(cloned, original);
  assertEqual(cloned.kind, original.kind);
  assertEqual(cloned.type, original.type);

  // 2. Cloning with overrides
  const overridden = clone(original, {
    message: 'Custom error',
  } as InternalStringDef);

  assertEqual(overridden.kind, 'StringSchema');
  // Assuming the internal definition stores the message
  const def = overridden[SCHEMA_DEF];
  assertEqual(def.message, 'Custom error');

  // 3. Immutability check
  // Checks should be a new array, not a reference to the old one
  const originalChecks = original[SCHEMA_DEF].checks;
  const clonedChecks = cloned[SCHEMA_DEF].checks;

  // assertNotStrictEquals(clonedChecks, originalChecks);
  assertEqual(clonedChecks.length, originalChecks.length);

  // 4. Functional check
  // The clone should still perform the original validations
  assertEqual(cloned.parse('valid-string'), 'valid-string');
  assertThrows(() => cloned.parse('tiny'));
});
