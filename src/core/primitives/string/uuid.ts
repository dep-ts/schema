import type { SchemaKind, UUIDDef } from '@internal/types';
import { StringFormatSchema } from './string-format.ts';

/** Schema for validating UUID strings with support for specific versions (v1-v8). */
export class UUIDSchema extends StringFormatSchema {
  public override readonly kind: SchemaKind = 'UUIDSchema';

  constructor(def: UUIDDef) {
    super(def);

    if (def.version) {
      const versionMap = {
        v1: 1,
        v2: 2,
        v3: 3,
        v4: 4,
        v5: 5,
        v6: 6,
        v7: 7,
        v8: 8,
      };

      const v = versionMap[def.version];
      if (v === undefined) {
        throw new Error(`Invalid UUID version: "${def.version}"`);
      }

      def.pattern ?? (def.pattern = this.#uuid(v));
    } else {
      def.pattern ?? (def.pattern = this.#uuid());
    }
  }

  #uuid(version?: number) {
    if (!version) {
      return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    }

    return new RegExp(
      `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
    );
  }
}

/**
 * Creates a UUID string schema.
 *
 * @param version - Optional specific UUID version ('v1' through 'v8').
 * @param message - Optional error message.
 * @returns UUID schema.
 * @example
 * const schema = s.uuid('v4');
 */
export function uuid(): UUIDSchema;
export function uuid(version?: UUIDDef['version']): UUIDSchema;
export function uuid(
  version?: UUIDDef['version'],
  message?: string,
): UUIDSchema;

export function uuid(
  version?: UUIDDef['version'],
  message?: string,
): UUIDSchema {
  return new UUIDSchema({
    type: 'string',
    format: 'uuid',
    message,
    version,
  });
}

/**
 * Creates a UUID v1 string schema.
 * @param message - Optional error message.
 */
export function uuidv1(): UUIDSchema;
export function uuidv1(message?: string): UUIDSchema;
export function uuidv1(message?: string) {
  return uuid('v1', message);
}

/**
 * Creates a UUID v2 string schema.
 * @param message - Optional error message.
 */
export function uuidv2(): UUIDSchema;
export function uuidv2(message?: string): UUIDSchema;
export function uuidv2(message?: string) {
  return uuid('v2', message);
}

/**
 * Creates a UUID v3 string schema.
 * @param message - Optional error message.
 */
export function uuidv3(): UUIDSchema;
export function uuidv3(message?: string): UUIDSchema;
export function uuidv3(message?: string) {
  return uuid('v3', message);
}

/**
 * Creates a UUID v4 string schema.
 * @param message - Optional error message.
 */
export function uuidv4(): UUIDSchema;
export function uuidv4(message?: string): UUIDSchema;
export function uuidv4(message?: string) {
  return uuid('v4', message);
}

/**
 * Creates a UUID v5 string schema.
 * @param message - Optional error message.
 */
export function uuidv5(): UUIDSchema;
export function uuidv5(message?: string): UUIDSchema;
export function uuidv5(message?: string) {
  return uuid('v5', message);
}

/**
 * Creates a UUID v6 string schema.
 * @param message - Optional error message.
 */
export function uuidv6(): UUIDSchema;
export function uuidv6(message?: string): UUIDSchema;
export function uuidv6(message?: string) {
  return uuid('v6', message);
}

/**
 * Creates a UUID v7 string schema.
 * @param message - Optional error message.
 */
export function uuidv7(): UUIDSchema;
export function uuidv7(message?: string): UUIDSchema;
export function uuidv7(message?: string) {
  return uuid('v7', message);
}

/**
 * Creates a UUID v8 string schema.
 * @param message - Optional error message.
 */
export function uuidv8(): UUIDSchema;
export function uuidv8(message?: string): UUIDSchema;
export function uuidv8(message?: string) {
  return uuid('v8', message);
}
