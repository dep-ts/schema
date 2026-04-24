import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface ReadonlyDef<T extends SomeSchema> extends
  SchemaDef<
    Readonly<T[Ref<'OUTPUT'>]>
  > {
  type: 'readonly';
  innerType: T;
}

export type InternalReadonlyDef<T extends SomeSchema> =
  & ReadonlyDef<T>
  & InternalSchemaDef<Readonly<T[Ref<'OUTPUT'>]>>;
