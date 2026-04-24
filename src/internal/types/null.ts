import { SchemaDef } from './schema.ts';

export interface NullDef extends SchemaDef<null> {
  type: 'null';
}
