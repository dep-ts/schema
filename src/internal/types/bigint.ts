import { InternalSchemaDef, SchemaDef } from './schema.ts';

export interface BigIntDef extends SchemaDef<bigint> {
  type: 'bigint';
  coerce?: boolean;
}

export type BigIntFormats = 'int64' | 'uint64';

export interface BigIntFormatDef extends SchemaDef<bigint> {
  type: 'bigint';
  format: BigIntFormats;
}

export interface Int64Def extends BigIntFormatDef {
  type: 'bigint';
  format: 'int64';
}

export interface UInt64Def extends BigIntFormatDef {
  type: 'bigint';
  format: 'uint64';
}

export type InternalBigIntDef = BigIntDef & InternalSchemaDef<bigint>;
