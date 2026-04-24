import { SchemaDef } from './schema.ts';

export interface UndefinedDef extends SchemaDef<undefined> {
  type: 'undefined';
}
