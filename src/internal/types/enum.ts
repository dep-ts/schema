import { InternalSchemaDef, SchemaDef } from './schema.ts';
import { Flatten } from './utils.ts';

export type EnumValue = string | number;

export type EnumLike = Readonly<Record<string, EnumValue>>;

export type ToEnum<T extends EnumValue> = Flatten<
  {
    [k in T]: k;
  }
>;

export interface EnumDef<T extends EnumLike = EnumLike> extends
  SchemaDef<
    T[keyof T]
  > {
  type: 'enum';
  enumValues: T;
}

export type InternalEnumDef<T extends EnumLike = EnumLike> =
  & EnumDef<T>
  & InternalSchemaDef<T[keyof T]>;
