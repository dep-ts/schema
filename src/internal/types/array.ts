import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Ref } from './utils.ts';

export interface ArrayDef<T extends SomeSchema> extends
  SchemaDef<
    Array<T[Ref<'OUTPUT'>]>
  > {
  type: 'array';
  element: T;
}

export type InternalArrayDef<T extends SomeSchema> =
  & ArrayDef<T>
  & InternalSchemaDef<Array<T[Ref<'OUTPUT'>]>>;
