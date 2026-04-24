import { SchemaDef } from './schema.ts';

export interface NeverDef extends SchemaDef<never> {
  type: 'never';
}
