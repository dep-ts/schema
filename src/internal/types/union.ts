import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface UnionDef<T extends readonly SomeSchema[]> extends
  SchemaDef<
    T[number][Ref<'OUTPUT'>]
  > {
  type: 'union';
  options: T;
}

export type InternalUnionDef<T extends readonly SomeSchema[]> =
  & UnionDef<T>
  & InternalSchemaDef<T[number][Ref<'OUTPUT'>]>;
