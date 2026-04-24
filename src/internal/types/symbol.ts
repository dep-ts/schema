import { SchemaDef } from './schema.ts';

export interface SymbolDef extends SchemaDef<symbol> {
  type: 'symbol';
}
