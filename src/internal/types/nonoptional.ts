import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface NonOptionalDef<T extends SomeSchema> extends
  SchemaDef<
    Exclude<T[Ref<'OUTPUT'>], undefined>
  > {
  type: 'nonoptional';
  innerType: T;
}

export type InternalNonOptionalDef<T extends SomeSchema> =
  & NonOptionalDef<T>
  & InternalSchemaDef<Exclude<T[Ref<'OUTPUT'>], undefined>>;
