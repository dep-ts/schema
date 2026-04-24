import type { JWTDef, SchemaKind } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';

/** Schema for validating JSON Web Token (JWT) strings. */
export class JWTSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'JWTSchema';

  constructor(def: JWTDef) {
    super(def);
    this[SCHEMA_DEF].checks.push((payload) => {
      if (this.#isValidJWT(payload.data, def.alg)) return;

      payload.issues.push({
        code: 'invalid_format',
        format: 'jwt',
        message: def.message ?? 'Invalid JWT',
      });
    });
  }

  #isValidJWT(token: string, algorithm: JWTDef['alg'] = undefined) {
    try {
      const tokensParts = token.split('.');
      if (tokensParts.length !== 3) return false;
      const [header] = tokensParts;
      if (!header) return false;

      const parsedHeader = JSON.parse(atob(header));
      if ('typ' in parsedHeader && parsedHeader?.typ !== 'JWT') return false;
      if (!parsedHeader.alg) return false;
      if (
        algorithm &&
        (!('alg' in parsedHeader) || parsedHeader.alg !== algorithm)
      ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Creates a JWT string schema.
 *
 * @param alg - Optional algorithm requirement (e.g., 'HS256').
 * @param message - Optional error message.
 * @returns JWT schema.
 * @example
 * const schema = s.jwt('HS256');
 */
export function jwt(): JWTSchema;
export function jwt(alg?: JWTDef['alg']): JWTSchema;
export function jwt(alg?: JWTDef['alg'], message?: string): JWTSchema;
export function jwt(alg?: JWTDef['alg'], message?: string): JWTSchema {
  return new JWTSchema({
    type: 'string',
    format: 'jwt',
    message,
    alg,
  });
}
