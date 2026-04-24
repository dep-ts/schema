import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export type RecordKey<K extends SomeSchema = SomeSchema> =
  K[Ref<'OUTPUT'>] extends PropertyKey ? K : never;

export type InfertRecordOutput<
  K extends SomeSchema,
  V extends SomeSchema,
> = K[Ref<'OUTPUT'>] extends PropertyKey
  ? { [P in K[Ref<'OUTPUT'>]]: V[Ref<'OUTPUT'>] }
  : never;

export type InfertRecordInput<
  K extends SomeSchema,
  V extends SomeSchema,
> = K[Ref<'OUTPUT'>] extends PropertyKey
  ? { [P in K[Ref<'INPUT'>]]: V[Ref<'INPUT'>] }
  : never;

export interface RecordDef<
  K extends SomeSchema,
  V extends SomeSchema,
> extends SchemaDef<InfertRecordOutput<K, V>> {
  type: 'record';
  keyType: RecordKey<K>;
  valueType: V;
}

export type InternalRecordDef<
  K extends SomeSchema,
  V extends SomeSchema,
> = RecordDef<K, V> & InternalSchemaDef<InfertRecordOutput<K, V>>;
