import { assertEqual } from '@dep/assert';
import { guid } from './guid.ts';

Deno.test('GUIDSchema', async () => {
  const data = '123e4567-e89b-12d3-a456-426614174000';
  const GUIDSchema = guid();

  assertEqual(GUIDSchema.kind, 'GUIDSchema');
  assertEqual(GUIDSchema.type, 'string');

  assertEqual(GUIDSchema.parse(data), data);
  assertEqual(await GUIDSchema.parseAsync(data), data);

  assertEqual(
    GUIDSchema.parse('00000000-0000-0000-0000-000000000000'),
    '00000000-0000-0000-0000-000000000000',
  );
  assertEqual(
    GUIDSchema.parse('550e8400-e29b-41d4-a716-446655440000'),
    '550e8400-e29b-41d4-a716-446655440000',
  );
  assertEqual(
    GUIDSchema.parse('A1B2C3D4-E5F6-A7B8-C9D0-E1F2A3B4C5D6'),
    'A1B2C3D4-E5F6-A7B8-C9D0-E1F2A3B4C5D6',
  );
});
