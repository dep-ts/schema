import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { MaybeAsync } from '@internal/types/utils.ts';

export type DefaultFn<T> = () => MaybeAsync<T>;

export interface DefaultDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  type: 'default';
  innerType: T;
  defaultData: DefaultFn<T>;
}

export type InternalDefaultDef<T extends SomeSchema> =
  & DefaultDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
