import { assertEqual } from '@dep/assert';
import { uuid, uuidv4, uuidv7 } from './uuid.ts';

Deno.test('UUIDSchema (Generic)', async () => {
  const data = '123e4567-e89b-12d3-a456-426614174000';
  const UUIDSchema = uuid();

  assertEqual(UUIDSchema.kind, 'UUIDSchema');
  assertEqual(UUIDSchema.type, 'string');

  assertEqual(UUIDSchema.parse(data), data);
  assertEqual(await UUIDSchema.parseAsync(data), data);

  assertEqual(
    UUIDSchema.parse('00000000-0000-0000-0000-000000000000'),
    '00000000-0000-0000-0000-000000000000',
  );
  assertEqual(
    UUIDSchema.parse('ffffffff-ffff-ffff-ffff-ffffffffffff'),
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
  );
});

Deno.test('UUIDSchema (Version Specific)', () => {
  const v4Data = '93727630-547e-4043-9831-294711319082';
  const v4Schema = uuidv4();
  assertEqual(v4Schema.parse(v4Data), v4Data);

  const v7Data = '0188ef61-554b-7000-8000-000000000000';
  const v7Schema = uuidv7();
  assertEqual(v7Schema.parse(v7Data), v7Data);
});
