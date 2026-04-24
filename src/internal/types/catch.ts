import {
  InternalSchemaDef,
  MaybeAsync,
  SchemaDef,
  SchemaIssue,
  SomeSchema,
} from '@internal/types';
import { Ref } from './utils.ts';

export type CatchFn<T> = (ctx: CatchCtx) => MaybeAsync<T>;

export interface CatchCtx {
  issues: Array<SchemaIssue>;
  data: unknown;
}

export interface CatchDef<T extends SomeSchema = SomeSchema> extends
  SchemaDef<
    T[Ref<'OUTPUT'>]
  > {
  type: 'catch';
  innerType: T;
  catchValue: CatchFn<T>;
}

export type InternalCatchDef<T extends SomeSchema> =
  & CatchDef<T>
  & InternalSchemaDef<T[Ref<'OUTPUT'>]>;
