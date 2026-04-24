// deno-lint-ignore-file ban-types
import { SomeSchema } from '@internal/types/schema.ts';
import { DEF_TYPE, INPUT_TYPE, OUTPUT_TYPE } from '@internal/utils/symbols.ts';

export type MaybeAsync<T> = T | Promise<T>;

export type Identity<T> = T;

export type Flatten<T> = Identity<
  {
    [k in keyof T]: T[k];
  }
>;

export type InexactPartial<T> = {
  [P in keyof T]?: T[P] | undefined;
};

export type MakePartial<T, K extends keyof T> =
  & Omit<T, K>
  & InexactPartial<Pick<T, K>>;

export type MakeRequired<T, K extends keyof T> =
  & Omit<T, K>
  & Required<Pick<T, K>>;

export type Exactly<T, X> = T & Record<Exclude<keyof X, keyof T>, never>;

export type NoUndefined<T> = T extends undefined ? never : T;

export type DistributeSchema<T> = T extends unknown ? SomeSchema<T, T> : never;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type Prettify<T> =
  & {
    [K in keyof T]: T[K];
  }
  & {};

export type Writeable<T> =
  & {
    -readonly [P in keyof T]: T[P];
  }
  & {};

export type Ref<T extends 'OUTPUT' | 'INPUT' | 'DEF'> = {
  OUTPUT: typeof OUTPUT_TYPE;
  INPUT: typeof INPUT_TYPE;
  DEF: typeof DEF_TYPE;
}[T];
