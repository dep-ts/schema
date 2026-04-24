import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface IntersectionDef<
  T extends SomeSchema,
  U extends SomeSchema,
> extends SchemaDef<T[Ref<'OUTPUT'>] & U[Ref<'OUTPUT'>]> {
  type: 'intersection';
  left: T;
  right: U;
}

export type InternalIntersectionDef<
  T extends SomeSchema,
  I extends SomeSchema,
> =
  & IntersectionDef<T, I>
  & InternalSchemaDef<T[Ref<'OUTPUT'>] & I[Ref<'OUTPUT'>]>;
