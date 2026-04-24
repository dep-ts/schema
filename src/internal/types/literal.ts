import { InternalSchemaDef, SchemaDef } from './schema.ts';

export type Literal = string | number | bigint | boolean | null | undefined;

export interface LiteralDef<T extends Literal> extends SchemaDef<T> {
  type: 'literal';
  literaldata: T;
}

export type InternalLiteralDef<T extends Literal> =
  & LiteralDef<T>
  & InternalSchemaDef<T>;
