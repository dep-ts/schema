import { assertEqual } from '@dep/assert';
import { jwt } from './jwt.ts';

Deno.test('JWTSchema', async () => {
  const data =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const JWTSchema = jwt();

  assertEqual(JWTSchema.kind, 'JWTSchema');
  assertEqual(JWTSchema.type, 'string');

  assertEqual(JWTSchema.parse(data), data);
  assertEqual(await JWTSchema.parseAsync(data), data);

  const hs256Token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.t-9_vW_09';
  const schema = jwt('HS256');
  assertEqual(schema.parse(hs256Token), hs256Token);
});
