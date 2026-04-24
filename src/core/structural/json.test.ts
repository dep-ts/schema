import { assertDeepEqual, assertEqual, assertThrows } from '@dep/assert';
import { json } from './json.ts';

Deno.test('JSONSchema', async () => {
  const JSONSchema = json();

  // 1. Validate Primitives
  assertEqual(JSONSchema.parse('hello'), 'hello');
  assertEqual(JSONSchema.parse(123), 123);
  assertEqual(JSONSchema.parse(true), true);
  assertEqual(JSONSchema.parse(null), null);

  // 2. Validate Arrays (including nested)
  const validArray = [1, 'string', [true, null]];
  assertDeepEqual(JSONSchema.parse(validArray), validArray);

  // 3. Validate Objects (Record)
  const validObject = {
    key: 'value',
    nested: {
      num: 1,
      bool: false,
    },
  };
  assertDeepEqual(JSONSchema.parse(validObject), validObject);

  // 4. Validate Complex Nested Structure
  const complex = {
    a: [1, 2, { b: 'c' }],
    d: null,
    e: {
      f: [true],
    },
  };
  assertDeepEqual(JSONSchema.parse(complex), complex);
  assertDeepEqual(await JSONSchema.parseAsync(complex), complex);

  // 5. Should throw on Non-JSON values
  assertThrows(() => JSONSchema.parse(undefined));
  assertThrows(() => JSONSchema.parse(Symbol('foo')));
  assertThrows(() => JSONSchema.parse(() => {}));
  assertThrows(() => JSONSchema.parse({ oops: undefined }));
  assertThrows(() => JSONSchema.parse([Symbol('bar')]));
});
