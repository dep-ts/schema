// deno-lint-ignore-file no-explicit-any
import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Flatten } from './utils.ts';

export type ObjectShape = Record<string, SomeSchema>;

export type InfertObjectOutput<S extends Partial<ObjectShape>> = {
  [K in keyof S]-?: S[K] extends SomeSchema ? S[K][Ref<'OUTPUT'>] : never;
};

export type InfertObjectInput<S extends Partial<ObjectShape>> = {
  [K in keyof S]-?: S[K] extends SomeSchema ? S[K][Ref<'INPUT'>] : never;
};

export interface ObjectDef<T extends Partial<ObjectShape>> extends
  SchemaDef<
    InfertObjectOutput<T>
  > {
  type: 'object';
  shape?: T;
  catchall?: SomeSchema;
}

export type InternalObjectDef<T extends Partial<ObjectShape>> =
  & ObjectDef<T>
  & InternalSchemaDef<InfertObjectOutput<T>>;

export type SomeObject = Record<PropertyKey, any>;

export type Extend<A extends SomeObject, B extends SomeObject> = Flatten<
  keyof A & keyof B extends never ? A & B
    :
      & {
        [K in keyof A as K extends keyof B ? never : K]: A[K];
      }
      & {
        [K in keyof B]: B[K];
      }
>;

export type Mask<Keys extends PropertyKey> = {
  [K in Keys]?: true;
};
