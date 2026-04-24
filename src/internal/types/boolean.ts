import { InternalSchemaDef, SchemaDef } from './schema.ts';

export interface BooleanDef extends SchemaDef<boolean> {
  type: 'boolean';
  coerce?: boolean;
}

export type InternalBooleanDef = BooleanDef & InternalSchemaDef<boolean>;
