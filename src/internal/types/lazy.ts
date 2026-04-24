import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface LazyDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  type: 'lazy';
  getter: () => T;
}

export type InternalLazyDef<T extends SomeSchema> =
  & LazyDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
