import { Ref } from './utils.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';

export interface MapDef<
  K extends SomeSchema,
  V extends SomeSchema,
> extends SchemaDef<Map<K[Ref<'OUTPUT'>], V[Ref<'OUTPUT'>]>> {
  type: 'map';
  keyType: K;
  valueType: V;
}

export type InternalMapDef<K extends SomeSchema, V extends SomeSchema> =
  & MapDef<
    K,
    V
  >
  & InternalSchemaDef<Map<K[Ref<'OUTPUT'>], V[Ref<'OUTPUT'>]>>;
