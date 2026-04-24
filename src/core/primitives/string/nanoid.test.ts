import { assertEqual } from '@dep/assert';
import { nanoid } from './nanoid.ts';

Deno.test('NanoIDSchema', async () => {
  const data = 'V1StGXR8_Z5jdHi6B-myT';
  const NanoIDSchema = nanoid();

  assertEqual(NanoIDSchema.kind, 'NanoIDSchema');
  assertEqual(NanoIDSchema.type, 'string');

  assertEqual(NanoIDSchema.parse(data), data);
  assertEqual(await NanoIDSchema.parseAsync(data), data);

  assertEqual(
    NanoIDSchema.parse('4f39n98s9-9as8d7f6g5h'),
    '4f39n98s9-9as8d7f6g5h',
  );
  assertEqual(
    NanoIDSchema.parse('__-a1B2c3D4e5F6g7H8i9'),
    '__-a1B2c3D4e5F6g7H8i9',
  );
});
