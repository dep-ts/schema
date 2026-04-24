import { assertEqual } from '@dep/assert';
import { email } from './email.ts';

Deno.test('EmailSchema', async () => {
  const data = 'user@example.com';
  const EmailSchema = email();

  assertEqual(EmailSchema.kind, 'EmailSchema');
  assertEqual(EmailSchema.type, 'string');

  assertEqual(EmailSchema.parse(data), data);
  assertEqual(await EmailSchema.parseAsync(data), data);

  assertEqual(
    EmailSchema.parse('john.doe@sub.domain.org'),
    'john.doe@sub.domain.org',
  );
  assertEqual(EmailSchema.parse('plus+tag@gmail.com'), 'plus+tag@gmail.com');
  assertEqual(
    EmailSchema.parse('underscore_test@internal.net'),
    'underscore_test@internal.net',
  );
  assertEqual(EmailSchema.parse('123@example.com'), '123@example.com');
});
