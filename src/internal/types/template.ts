import { Ref } from './utils.ts';
import { Literal } from './literal.ts';
import { InternalSchemaDef, SchemaDef, SomeSchema } from './schema.ts';
import { DistributeSchema } from '@internal/types/utils.ts';

export type TemplateLiteralPart = Literal | DistributeSchema<Literal>;

export interface TemplateDef<
  Template extends string = string,
> extends SchemaDef<Template> {
  type: 'template_literal';
  parts: TemplateLiteralPart[];
  format?: string | undefined;
}

export type InternalTemplateDef<Template extends string = string> =
  & TemplateDef<Template>
  & InternalSchemaDef<Template>;

type UndefinedToEmptyString<T> = T extends undefined ? '' : T;

type AppendToTemplateLiteral<
  Template extends string,
  Suffix extends Literal | SomeSchema,
> = Suffix extends Literal ? `${Template}${UndefinedToEmptyString<Suffix>}`
  : Suffix extends SomeSchema
    ? `${Template}${Suffix[Ref<'OUTPUT'>] extends infer T extends Literal
      ? UndefinedToEmptyString<T>
      : never}`
  : never;

export type PartsToTemplateLiteral<Parts extends TemplateLiteralPart[]> =
  [] extends Parts ? ``
    : Parts extends [...infer Rest, infer Last extends TemplateLiteralPart]
      ? Rest extends TemplateLiteralPart[]
        ? AppendToTemplateLiteral<PartsToTemplateLiteral<Rest>, Last>
      : never
    : never;
