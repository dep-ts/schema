import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface SuccessDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  innerType: T;
  type: 'success';
}

export type InternalSuccessDef<T extends SomeSchema> =
  & SuccessDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
