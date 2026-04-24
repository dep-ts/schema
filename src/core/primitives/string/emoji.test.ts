import { assertEqual } from '@dep/assert';
import { emoji } from './emoji.ts';

Deno.test('EmojiSchema', async () => {
  const data = '🚀';
  const EmojiSchema = emoji();

  assertEqual(EmojiSchema.kind, 'EmojiSchema');
  assertEqual(EmojiSchema.type, 'string');

  assertEqual(EmojiSchema.parse(data), data);
  assertEqual(await EmojiSchema.parseAsync(data), data);

  assertEqual(EmojiSchema.parse('👻'), '👻');
  assertEqual(EmojiSchema.parse('✨🔥'), '✨🔥');
  assertEqual(EmojiSchema.parse('👨‍💻'), '👨‍💻');
  assertEqual(EmojiSchema.parse('🇺🇳'), '🇺🇳');
});
