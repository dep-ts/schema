import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { MaybeAsync } from '@internal/types/utils.ts';

export type PrefaultFn<T> = () => MaybeAsync<T>;

export interface PrefaultDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  type: 'prefault';
  innerType: T;
  defaultData: PrefaultFn<T>;
}

export type InternalPrefaultDef<T extends SomeSchema> =
  & PrefaultDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
