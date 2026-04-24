// deno-lint-ignore-file no-explicit-any
import { IsAny, Prettify, Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Flatten } from './utils.ts';
import { OptionalSchema } from '@core/utilities/schema.ts';

export type ObjectShape = Record<string, SomeSchema>;

export type InferObject<
  T extends ObjectShape,
  R extends 'OUTPUT' | 'INPUT',
> = string extends keyof T
  ? IsAny<T[keyof T]> extends true ? Record<string, unknown>
  : Record<string, T[keyof T][Ref<R>]>
  : keyof T extends never ? Record<string, never>
  : Prettify<
    & {
      -readonly [
        k in keyof T as T[k] extends OptionalSchema<any> ? never
          : k
      ]: T[k][Ref<R>];
    }
    & {
      -readonly [
        k in keyof T as T[k] extends OptionalSchema<any> ? k
          : never
      ]?: T[k][Ref<R>];
    }
  >;

export type InfertObjectOutput<T extends ObjectShape> = InferObject<
  T,
  'OUTPUT'
>;
export type InfertObjectInput<T extends ObjectShape> = InferObject<T, 'INPUT'>;

export interface ObjectDef<T extends ObjectShape> extends
  SchemaDef<
    InfertObjectOutput<T>
  > {
  type: 'object';
  shape?: T;
  catchall?: SomeSchema;
}

export type InternalObjectDef<T extends ObjectShape> =
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
