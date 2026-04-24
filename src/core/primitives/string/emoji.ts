import type { EmojiDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating Emoji strings. */
export class EmojiSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'EmojiSchema';

  constructor(def: EmojiDef) {
    const regex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;

    super({
      ...def,
      pattern: def.pattern ?? new RegExp(regex, 'u'),
    });
  }
}

/**
 * Creates an Emoji string schema.
 *
 * @param message - Optional error message.
 * @returns Emoji schema.
 * @example
 * const schema = s.emoji();
 */
export function emoji(): EmojiSchema;
export function emoji(message?: string): EmojiSchema;
export function emoji(message?: string): EmojiSchema {
  return new EmojiSchema({
    type: 'string',
    format: 'emoji',
    message,
  });
}
