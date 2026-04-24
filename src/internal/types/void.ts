import { SchemaDef } from './schema.ts';

export interface VoidDef extends SchemaDef<void> {
  type: 'void';
}
