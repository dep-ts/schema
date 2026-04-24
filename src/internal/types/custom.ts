import { InternalSchemaDef, Params, SchemaDef, SchemaType } from './schema.ts';
import { MaybeAsync } from './utils.ts';

export interface CustomDef<T> extends SchemaDef<T> {
  type: SchemaType;
  fn?: (data: unknown) => MaybeAsync<unknown>;
  params?: Params;
}

export type InternalCustomDef<T> = CustomDef<T> & InternalSchemaDef<T>;
