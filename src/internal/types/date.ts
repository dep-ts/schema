import { InternalSchemaDef, SchemaDef } from './schema.ts';

export interface DateDef extends SchemaDef<Date> {
  type: 'date';
  coerce?: boolean;
}

export type InternalDateDef<> =
  & DateDef
  & InternalSchemaDef<Date>;
