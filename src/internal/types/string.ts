// deno-lint-ignore-file ban-types
import { InternalSchemaDef, SchemaDef } from './schema.ts';

export type StringFormats =
  | 'email'
  | 'url'
  | 'emoji'
  | 'uuid'
  | 'base64'
  | 'base64url'
  | 'guid'
  | 'nanoid'
  | 'cuid'
  | 'tel'
  | 'cuid2'
  | 'ulid'
  | 'xid'
  | 'ksuid'
  | 'datetime'
  | 'date'
  | 'time'
  | 'duration'
  | 'ipv4'
  | 'ipv6'
  | 'cidrv4'
  | 'cidrv6'
  | 'base64'
  | 'base64url'
  | 'json_string'
  | 'e164'
  | 'lowercase'
  | 'uppercase'
  | 'regex'
  | 'jwt'
  | 'starts_with'
  | 'ends_with'
  | 'includes';

export interface StringFormatDef extends SchemaDef<string> {
  type: 'string';
  format: StringFormats;
  pattern?: RegExp;
}

export interface StringDef extends SchemaDef<string> {
  type: 'string';
  coerce?: boolean;
}

export type InternalStringDef =
  & StringDef
  & InternalSchemaDef<string>
  & {
    pattern: RegExp;
    patterns: Set<RegExp>;
    minimum?: number;
    maximum?: number;
    format: StringFormats;
  };

export interface UrlDef extends StringDef {
  type: 'string';
  format: 'url';
  normalize?: boolean;
  hostname?: RegExp;
  protocol?: RegExp;
}

export interface ISODateDef extends StringDef {
  type: 'string';
  format: 'date';
  pattern?: RegExp;
}

export interface ISODateTimeDef extends StringDef {
  type: 'string';
  format: 'datetime';
  precision: number | null;
  offset: boolean;
  local: boolean;
  pattern?: RegExp;
}

export interface ISODurationDef extends StringDef {
  type: 'string';
  format: 'duration';
  pattern?: RegExp;
}

export interface ISOTimeDef extends StringDef {
  type: 'string';
  format: 'time';
  precision?: number | null;
  pattern?: RegExp;
}

export interface TelDef extends StringDef {
  type: 'string';
  format: 'tel';
  pattern?: RegExp;
}

export interface EmojiDef extends StringDef {
  type: 'string';
  format: 'emoji';
  pattern?: RegExp;
}

export interface Base64Def extends StringDef {
  type: 'string';
  format: 'base64';
  pattern?: RegExp;
}

export interface Base64URLDef extends StringDef {
  type: 'string';
  format: 'base64url';
  pattern?: RegExp;
}

export interface EmailDef extends StringDef {
  type: 'string';
  format: 'email';
  pattern?: RegExp;
}

export interface UUIDDef extends StringDef {
  type: 'string';
  format: 'uuid';
  version?: 'v1' | 'v2' | 'v3' | 'v4' | 'v5' | 'v6' | 'v7' | 'v8';
  pattern?: RegExp;
}

export interface GUIDDef extends StringDef {
  type: 'string';
  format: 'guid';
  pattern?: RegExp;
}

export interface NanoIDDef extends StringDef {
  type: 'string';
  format: 'nanoid';
  pattern?: RegExp;
}

export interface CUIDDef extends StringDef {
  type: 'string';
  format: 'cuid';
  pattern?: RegExp;
}

export interface CUID2Def extends StringDef {
  type: 'string';
  format: 'cuid2';
  pattern?: RegExp;
}

export interface XIDDef extends StringDef {
  type: 'string';
  format: 'xid';
  pattern?: RegExp;
}

export interface KSUIDDef extends StringDef {
  type: 'string';
  format: 'ksuid';
  pattern?: RegExp;
}

export interface ULIDDef extends StringDef {
  type: 'string';
  format: 'ulid';
  pattern?: RegExp;
}

export interface IPv4Def extends StringDef {
  type: 'string';
  format: 'ipv4';
  pattern?: RegExp;
}

export interface IPv6Def extends StringDef {
  type: 'string';
  format: 'ipv6';
  pattern?: RegExp;
}

export interface CIDRv4Def extends StringDef {
  type: 'string';
  format: 'cidrv4';
  pattern?: RegExp;
}

export interface CIDRv6Def extends StringDef {
  type: 'string';
  format: 'cidrv6';
  pattern?: RegExp;
}

export interface E164Def extends StringDef {
  type: 'string';
  format: 'e164';
  pattern?: RegExp;
}

export interface JWTDef extends StringDef {
  type: 'string';
  format: 'jwt';
  alg?:
    | 'HS256'
    | 'HS384'
    | 'HS512'
    | 'RS256'
    | 'RS384'
    | 'RS512'
    | 'ES256'
    | 'ES384'
    | 'ES512'
    | 'PS256'
    | 'PS384'
    | 'PS512'
    | 'EdDSA'
    | (string & {});
  pattern?: RegExp;
}
