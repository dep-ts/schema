import { assertEqual } from '@dep/assert';
import { cuid } from './cuid.ts';

Deno.test('CUIDSchema', async () => {
  const data = 'cjld2cyuq0000t3t8yx3lz66f';
  const CUIDSchema = cuid();

  assertEqual(CUIDSchema.kind, 'CUIDSchema');
  assertEqual(CUIDSchema.type, 'string');

  assertEqual(CUIDSchema.parse(data), data);
  assertEqual(await CUIDSchema.parseAsync(data), data);

  assertEqual(
    CUIDSchema.parse('ch72gsb320000udocl363eofy'),
    'ch72gsb320000udocl363eofy',
  );
  assertEqual(
    CUIDSchema.parse('Cjld2cyuq0000t3t8yx3lz66f'),
    'Cjld2cyuq0000t3t8yx3lz66f',
  );
  assertEqual(
    CUIDSchema.parse('ck0pql3lh000001me88476nd6'),
    'ck0pql3lh000001me88476nd6',
  );
});
