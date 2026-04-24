import { OUTPUT_TYPE } from '@internal/utils/symbols.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { Ref } from './utils.ts';

export type FunctionIn = SomeSchema & { [OUTPUT_TYPE]: unknown[] };

export type FunctionOut = SomeSchema;

export type InfertFunctionOutput<
  Args extends FunctionIn = FunctionIn,
  Returns extends FunctionOut = FunctionOut,
> = (
  ...args: Args[Ref<'OUTPUT'>]
) => Returns[Ref<'OUTPUT'>] | Promise<Returns[Ref<'OUTPUT'>]>;

export type InfertFunctionInput<
  Args extends FunctionIn = FunctionIn,
  Returns extends FunctionOut = FunctionOut,
> = (
  ...args: Args[Ref<'INPUT'>]
) => Returns[Ref<'INPUT'>] | Promise<Returns[Ref<'INPUT'>]>;

export interface FunctionDef<
  Args extends FunctionIn = FunctionIn,
  Returns extends FunctionOut = FunctionOut,
> extends SchemaDef<InfertFunctionOutput<Args, Returns>> {
  type: 'function';
  input: Args;
  output: Returns;
}

export type InternalFunctionDef<
  Args extends FunctionIn = FunctionIn,
  Returns extends FunctionOut = FunctionOut,
> =
  & FunctionDef<Args, Returns>
  & InternalSchemaDef<InfertFunctionOutput<Args, Returns>>;
