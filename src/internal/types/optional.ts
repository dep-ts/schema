import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Ref } from '@internal/types/utils.ts';

export interface OptionalDef<T extends SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>] | undefined
  > {
  type: 'optional';
  innerType: T;
}

export type InternalOptionalDef<T extends SomeSchema> =
  & OptionalDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>] | undefined>;
