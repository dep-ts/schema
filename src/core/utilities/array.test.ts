import {
  assertDeepEqual,
  assertEqual,
  assertRejects,
  assertThrows,
} from '@dep/assert';
import { array } from './schema.ts';
import { string } from '@core/primitives/string/string.ts';
import { number } from '@core/primitives/number/number.ts';
import { object } from '@core/structural/object.ts';
import { SchemaError } from '@core/utilities/error.ts';

Deno.test('array', async () => {
  const StringArray = array(string());

  // 1. Basic validation
  // Validates a standard array of strings
  const basicData = ['a', 'b', 'c'];
  assertDeepEqual(StringArray.parse(basicData), basicData);
  assertEqual(StringArray.kind, 'ArraySchema');

  // 2. Validates element types
  // Should throw when an element fails the inner schema validation
  assertThrows(() => StringArray.parse(['a', 123, 'b']));

  // 3. Handles non-array inputs
  // Should throw when the root data is not an array
  assertThrows(() => StringArray.parse('not an array'));

  // 4. Asynchronous parsing
  // Ensures SCHEMA_PARSE_ASYNC works with Promise.all as implemented
  const asyncData = ['hello', 'world'];
  const asyncResult = await StringArray.parseAsync(asyncData);
  assertDeepEqual(asyncResult, asyncData);

  await assertRejects(async () => await StringArray.parseAsync(['hello', 123]));

  // 5. Nested arrays
  // Verifies recursion works correctly
  const Matrix = array(array(number()));
  const matrixData = [
    [1, 2],
    [3, 4],
  ];
  assertDeepEqual(Matrix.parse(matrixData), matrixData);

  assertThrows(() => Matrix.parse([[1], ['invalid']]));

  // 6. Path indexing and error collection
  // Verifies #handleResults correctly prefixes issues with the element index
  const UserSchema = object({ name: string() });
  const UserList = array(UserSchema);

  try {
    UserList.parse([{ name: 'Alice' }, { name: 123 }]);
  } catch (e) {
    // The error for '123' should be at index 1
    if (e instanceof SchemaError) {
      const issue = e.issues[0];
      assertEqual(issue.path[0], 1);
      assertEqual(issue.path[1], 'name');
    }
  }

  // 7. Empty arrays
  // Should handle empty inputs without issues
  assertDeepEqual(StringArray.parse([]), []);

  // 8. Integration with transformations
  // Ensures the array collects the "output" of the element schemas
  const TrimmedString = string().transform((s) => s.trim());
  const TrimmedArray = array(TrimmedString);
  assertDeepEqual(TrimmedArray.parse(['  a  ', 'b  ']), ['a', 'b']);
});
