import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export type Transformer<T, U> = (data: T) => U | Promise<U>;

export interface TransformDef<T extends SomeSchema, U> extends SchemaDef<U> {
  type: 'transform';
  innerType: T;
  transformer: Transformer<T[Ref<'OUTPUT'>], U>;
}

export type InternalTransformDef<T extends SomeSchema, U> =
  & TransformDef<T, U>
  & InternalSchemaDef<U>;
