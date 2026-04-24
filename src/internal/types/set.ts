import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface SetDef<Value extends SomeSchema> extends
  SchemaDef<
    Set<Value[Ref<'OUTPUT'>]>
  > {
  valueType: Value;
  type: 'set';
}

export type InternalSetDef<Value extends SomeSchema> =
  & SetDef<Value>
  & InternalSchemaDef<Set<Value[Ref<'OUTPUT'>]>>;
