import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface NullableDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>] | null
  > {
  type: 'nullable';
  innerType: T;
}

export type InternalNullableDef<T extends SomeSchema> =
  & NullableDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>] | null>;
