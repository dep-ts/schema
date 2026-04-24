import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface PipeDef<
  A extends SomeSchema,
  B extends SomeSchema<A[Ref<'OUTPUT'>]>,
> extends SchemaDef<A[Ref<'OUTPUT'>]> {
  type: 'pipe';
  in: A;
  out: B;
}

export type InternalPipeDef<
  A extends SomeSchema,
  B extends SomeSchema<A[Ref<'OUTPUT'>]>,
> = PipeDef<A, B> & InternalSchemaDef<A[Ref<'OUTPUT'>]>;
