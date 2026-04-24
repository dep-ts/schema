import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export type TupleOutputType<T extends readonly SomeSchema[]> = {
  [K in keyof T]: T[K] extends SomeSchema<infer O> ? O : never;
};

export type InferTupleOutput<
  T extends ReadonlyArray<SomeSchema>,
  Rest extends SomeSchema | null,
> = [
  ...TupleOutputType<T>,
  ...(Rest extends SomeSchema ? Rest[Ref<'OUTPUT'>][] : []),
];

export type InferTupleInput<
  T extends ReadonlyArray<SomeSchema>,
  Rest extends SomeSchema | null,
> = [
  ...TupleOutputType<T>,
  ...(Rest extends SomeSchema ? Rest[Ref<'INPUT'>][] : []),
];

export interface TupleDef<
  T extends ReadonlyArray<SomeSchema> = readonly SomeSchema[],
  R extends SomeSchema | null = SomeSchema | null,
> extends SchemaDef<InferTupleOutput<T, R>> {
  type: 'tuple';
  items: T;
  rest?: SomeSchema | null;
}

export type InternalTupleDef<
  T extends ReadonlyArray<SomeSchema> = readonly SomeSchema[],
  R extends SomeSchema | null = SomeSchema | null,
> = TupleDef<T, R> & InternalSchemaDef<InferTupleOutput<T, R>>;
