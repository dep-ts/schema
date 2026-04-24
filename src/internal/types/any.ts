// deno-lint-ignore-file no-explicit-any
import { SchemaDef } from './schema.ts';

export interface AnyDef extends SchemaDef<any> {
  type: 'any';
}
