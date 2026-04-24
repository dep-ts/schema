import { assertEqual } from '@dep/assert';
import { ulid } from './ulid.ts';

Deno.test('ULIDSchema', async () => {
  const data = '01ARZ3NDEKTSV4RRFFQ6KHNQEY';
  const ULIDSchema = ulid();

  assertEqual(ULIDSchema.kind, 'ULIDSchema');
  assertEqual(ULIDSchema.type, 'string');

  assertEqual(ULIDSchema.parse(data), data);
  assertEqual(await ULIDSchema.parseAsync(data), data);

  assertEqual(
    ULIDSchema.parse('01G7J1EM7P6X1S278M0ER6Y6N2'),
    '01G7J1EM7P6X1S278M0ER6Y6N2',
  );
  assertEqual(
    ULIDSchema.parse('7fffffffffffffffffffffffff'),
    '7fffffffffffffffffffffffff',
  );
  assertEqual(
    ULIDSchema.parse('00000000000000000000000000'),
    '00000000000000000000000000',
  );
});
