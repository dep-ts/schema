import { InternalSchemaDef, SchemaDef } from './schema.ts';

export interface NumberDef extends SchemaDef<number> {
  type: 'number';
  coerce?: boolean;
}

export type InternalNumberDef = NumberDef & InternalSchemaDef<number>;

export type NumberFormats =
  | 'int32'
  | 'uint32'
  | 'float32'
  | 'float64'
  | 'safeint';

export interface NumberFormatDef extends NumberDef {
  format?: NumberFormats;
}

export interface IntDef extends NumberFormatDef {
  format: 'safeint';
}

export interface Int32Def extends NumberFormatDef {
  format: 'int32';
}

export interface UInt32Def extends NumberFormatDef {
  format: 'uint32';
}

export interface Float32Def extends NumberFormatDef {
  format: 'float32';
}

export interface Float64Def extends NumberFormatDef {
  format: 'float64';
}
