import { StringSchema } from './string.ts';
import type { SchemaKind, UrlDef } from '@internal/types';
import { SCHEMA_DEF } from '@internal/utils/symbols.ts';

/** Schema for validating and optionally normalizing URL strings. */
export class URLSchema extends StringSchema {
  public override readonly kind: SchemaKind = 'URLSchema';

  constructor(def: UrlDef) {
    super(def);

    this[SCHEMA_DEF].checks.push((payload) => {
      const input = payload.data;

      try {
        const trimmed = input.trim();
        const url = new URL(trimmed);

        if (def.hostname) {
          if (!def.hostname.test(url.hostname)) {
            payload.issues.push({
              code: 'invalid_format',
              format: 'url',
              message: def.message ?? 'Invalid hostname',
              received: input,
              expected: 'Valid hostname',
            });
          }
        }

        if (def.protocol) {
          if (
            !def.protocol.test(
              url.protocol.endsWith(':')
                ? url.protocol.slice(0, -1)
                : url.protocol,
            )
          ) {
            payload.issues.push({
              code: 'invalid_format',
              format: 'url',
              message: def.message ?? 'Invalid protocol',
              received: input,
              expected: 'Valid protocol',
            });
          }
        }

        if (def.normalize) {
          payload.data = url.href;
        } else {
          payload.data = trimmed;
        }
      } catch {
        payload.issues.push({
          code: 'invalid_format',
          format: 'url',
          message: def.message ?? 'Invalid url',
          received: input,
          expected: 'Valid url',
        });
      }
    });
  }
}

/**
 * Creates a URL string schema with optional constraints.
 *
 * @param params - Configuration for normalization, hostname, and protocol validation.
 * @returns URL schema.
 * @example
 * const schema = s.url({ protocol: /^https$/ });
 */
export function url(): URLSchema;

export function url(params?: {
  normalize?: boolean;
  hostname?: RegExp;
  protocol?: RegExp;
  message?: string;
}): URLSchema;

export function url(
  params: {
    normalize?: boolean;
    hostname?: RegExp;
    protocol?: RegExp;
    message?: string;
  } = {},
): URLSchema {
  return new URLSchema({
    type: 'string',
    format: 'url',
    hostname: params.hostname ??
      /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/,
    protocol: params.protocol ?? /^https?$/,
    ...params,
  });
}

/**
 * Creates a standard HTTP/HTTPS URL schema.
 *
 * @param normalize - Whether to return the normalized URL string.
 * @param message - Optional error message.
 * @returns URL schema.
 * @example
 * const schema = s.httpUrl(true);
 */
export function httpUrl(normalize?: boolean): URLSchema;
export function httpUrl(normalize?: boolean, message?: string): URLSchema;
export function httpUrl(normalize?: boolean, message?: string): URLSchema {
  return new URLSchema({
    type: 'string',
    format: 'url',
    normalize,
    message,
  });
}
