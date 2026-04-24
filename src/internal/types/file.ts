import { SchemaDef } from './schema.ts';

export interface FileDef extends SchemaDef<File> {
  type: 'file';
}
