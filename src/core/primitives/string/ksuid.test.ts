import { assertEqual } from '@dep/assert';
import { ksuid } from './ksuid.ts';

Deno.test('KSUIDchema', async () => {
  const data = '1sr7q96y9lXm9F4wX9W9F4wX9W9';
  const KSUIDchema = ksuid();

  assertEqual(KSUIDchema.kind, 'KSUIDchema');
  assertEqual(KSUIDchema.type, 'string');

  assertEqual(KSUIDchema.parse(data), data);
  assertEqual(await KSUIDchema.parseAsync(data), data);

  assertEqual(
    KSUIDchema.parse('0ujtsYcgvST9y9UMGUu65G78F9Y'),
    '0ujtsYcgvST9y9UMGUu65G78F9Y',
  );
  assertEqual(
    KSUIDchema.parse('aB1cD2eF3gH4iJ5kL6mN7oP8qR9'),
    'aB1cD2eF3gH4iJ5kL6mN7oP8qR9',
  );
});
