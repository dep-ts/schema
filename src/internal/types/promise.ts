import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Ref } from '@internal/types/utils.ts';

export interface PromiseDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  type: 'promise';
  innerType: T;
}

export type InternalPromiseDef<T extends SomeSchema> =
  & PromiseDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
